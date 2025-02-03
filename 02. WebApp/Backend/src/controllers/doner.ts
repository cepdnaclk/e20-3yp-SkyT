import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { azureDB } from "../database/azureDbConfig";

export const createDoner: RequestHandler = async (req, res, next) => {
  let transaction;

  try {
    // Create a new Gallery event with images
    console.log("New Doner: ", req.body);
    const { title, fName, name, nic, gender, address, mobile, today } =
      req.body;

    // Validate that all required fields are present
    if (
      !title ||
      !fName ||
      !name ||
      !nic ||
      !gender ||
      !address ||
      !mobile ||
      !today
    ) {
      console.log("All fields are required");
      throw createHttpError(400, "All fields are required");
    }

    // Connect to the Azure SQL Database
    const pool = await azureDB();

    // Start a new transaction
    transaction = pool.transaction();

    // Begin the transaction explicitly
    await transaction.begin();

    // Check if NIC is unique
    const nicCheckQuery = `SELECT COUNT(*) AS count FROM DONORS WHERE nic = @nic`;
    const nicCheckResult = await transaction
      .request()
      .input("nic", nic)
      .query(nicCheckQuery);

    if (nicCheckResult.recordset[0].count > 0) {
      // NIC is not unique
      await transaction.rollback();
      return res.status(226).send(`NIC ${nic} already exists`);
    }

    // Insert new Doner data and capture the newly added donerID
    const addDonerQuery = `
      INSERT INTO DONORS (title, firstName, fullName, nic, gender, addr, mobile)
      OUTPUT INSERTED.donerId
      VALUES (@title, @fName, @name, @nic, @gender, @address, @mobile);
    `;

    // Add parameters for the insert query
    const result = await transaction
      .request()
      .input("title", title)
      .input("fName", fName)
      .input("name", name)
      .input("nic", nic)
      .input("gender", gender)
      .input("address", address)
      .input("mobile", mobile)
      .query(addDonerQuery);

    // Add donation to the donations table
    const donateQuery = `
              INSERT INTO DONATIONS (donerId, donatedDate)
              VALUES (@id, @today);
            `;

    // Add parameters for the insert query
    const id = result.recordset[0].donerId;

    await transaction
      .request()
      .input("id", id)
      .input("today", today)
      .query(donateQuery);

    // Commit the transaction
    await transaction.commit();

    // Respond with the created doner entry
    res.status(201).json("success");
    console.log("New doner created successfully!");
  } catch (error) {
    // Rollback the transaction in case of error
    if (transaction) {
      await transaction.rollback();
    }

    console.error(error);
    next(error);
  }
};

export const getDoners: RequestHandler = async (req, res, next) => {
  try {
    const data = req.query;
    console.log("Doner Details: ", req.query);

    // Connect to the Azure SQL Database
    const pool = await azureDB();

    let query = "";
    let result;

    // Validate that all required fields are present
    if (data?.id && data?.nic) {
      const { nic, id } = data;
      console.log("Fetching specific donor details for ID and NIC:", id, nic);
      query = ` SELECT 
                  donerId as _id,
                  title,
                  firstName as fName,
                  fullName as name,
                  nic,
                  gender,
                  addr as address,
                  mobile
                FROM DONORS 
                WHERE donerId = @id AND nic = @nic
              `;

      // Add parameters for the insert query
      result = await pool
        .request()
        .input("id", id)
        .input("nic", nic)
        .query(query);

      result = result.recordset[0];
    } else {
      console.log("Requesting nic list");
      query = `SELECT donerId as _id, nic FROM DONORS`;

      // Add parameters for the insert query
      result = await pool.request().query(query);

      result = result.recordset;
    }

    // Send the retrieved data as a response
    console.log("Reply send successfully!");
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const upateDoner: RequestHandler = async (req, res, next) => {
  let transaction;

  try {
    // Destructuring object
    const { _id, ...updateData } = req.body.donerInfo;
    const today = req.body.today;
    console.log(`Update id: ${_id} with data:`, updateData);
    console.log("Date: ", today);

    // Validate required fields
    if (!_id || !today) {
      console.log("ID and date are required");
      throw createHttpError(400, "ID and update data are required");
    }

    // Connect to the Azure SQL Database
    const pool = await azureDB();

    // Start a new transaction
    transaction = await pool.transaction();

    // Begin the transaction explicitly
    await transaction.begin();

    // Mapping frontend fields to database columns in donors table
    const fieldMapping: { [key: string]: string } = {
      _id: "donerId",
      fName: "firstName",
      name: "fullName",
      address: "addr",
    };

    if (Object.keys(updateData).length > 0) {
      // Build the dynamic SET clause for the SQL query
      const setClause = Object.keys(updateData)
        .map((key) => {
          const dbField = fieldMapping[key] || key; // Map field or keep as-is
          return `${dbField} = @${key}`;
        })
        .join(", ");

      // DB Query
      const donerUpdate = `
      UPDATE DONORS
      SET ${setClause}
      WHERE donerId = @_id;
    `;

      // Connect to the Azure SQL Database
      const request = transaction.request();

      // Add parameters for the dynamic fields
      Object.entries(updateData).forEach(([key, value]) =>
        request.input(key, value)
      );
      // Add the _id parameter
      request.input("_id", _id);

      // Execute the SQL query
      const result = await request.query(donerUpdate);

      // Check if any row was updated
      if (result.rowsAffected[0] === 0) {
        throw createHttpError(404, `Doner with ID ${_id} not found`);
      }
      console.log("Doner updated successfully!");
    }

    // Add donation to the donations table
    const donateQuery = `
              INSERT INTO DONATIONS (donerId, donatedDate)
              VALUES (@_id, @today);
            `;

    await transaction
      .request()
      .input("_id", _id)
      .input("today", today)
      .query(donateQuery);

    // Commit the transaction
    await transaction.commit();

    console.log("New donation added successfully!");
    res.status(200).json("success");
  } catch (error) {
    // Rollback the transaction in case of error
    if (transaction) {
      await transaction.rollback();
    }

    next(error);
  }
};
