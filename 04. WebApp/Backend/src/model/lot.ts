import createHttpError from "http-errors";
import pool from "../database/sqldb";
import { RowDataPacket } from "mysql2";
import { formatTimestamp } from "../util/formatTimestamp";

interface DataProps {
  Temperature: number;
  Humidity: number;
  lowPH: number;
  highPH: number;
  optimalPH: number;
  PH: number;
  Nitrogen: number;
  Phosphorus: number;
  Potassium: number;
}

class LotModel {
  // Gets Lot summary
  static async getLotSummaryByEstate(estateId: number) {
    const query = `
          SELECT 
            L.lotId,
            L.lot,
            L.lat,
            L.lng,
            MAX(R.timestamp) AS lastUpdate,
            AVG(R.temperature) AS temperature,
            AVG(R.humidity) AS humidity,
            AVG(R.ph) AS ph,
            AVG(R.n) AS n,
            AVG(R.p) AS p,
            AVG(R.k) AS k
          FROM LOTS L
          JOIN NODES N ON N.lotId = L.lotId
          JOIN (
            SELECT SR1.*
            FROM SENSOR_READINGS SR1
            INNER JOIN (
              SELECT nodeId, MAX(timestamp) AS latestTime
              FROM SENSOR_READINGS
              GROUP BY nodeId
            ) AS LatestPerNode
            ON SR1.nodeId = LatestPerNode.nodeId AND SR1.timestamp = LatestPerNode.latestTime
          ) R ON R.nodeId = N.nodeId
          WHERE L.estateId = ?
          GROUP BY L.lotId, L.lot, L.lat, L.lng
          `;

    const [rows] = await pool.query<RowDataPacket[]>(query, [estateId]);

    if (rows.length === 0) return null;

    return rows.map((row) => ({
      lotId: row.lotId,
      lot: row.lot,
      location: [parseFloat(row.lat), parseFloat(row.lng)],
      lastUpdate: row.lastUpdate,
      temperature: parseFloat(row.temperature),
      humidity: parseFloat(row.humidity),
      ph: parseFloat(row.ph),
      n: parseFloat(row.n),
      p: parseFloat(row.p),
      k: parseFloat(row.k),
    }));
  }

  static async isLotAccessibleByUser(userId: number, lotId: number) {
    const query = `
          SELECT L.* 
          FROM LOTS L
          JOIN EMPLOYEES E ON E.estateId = L.estateId
          WHERE E.employeeId = ? AND L.lotId = ?
          `;

    const [rows] = await pool.query<RowDataPacket[]>(query, [userId, lotId]);

    return rows.length === 0 ? null : rows[0];
  }

  static async getLotDataById(lotId: number, lowerPH: number, upperPH: number) {
    const query = `
      WITH LatestReadings AS (
        SELECT sr.*
        FROM SENSOR_READINGS sr
        JOIN (
          SELECT nodeId, MAX(timestamp) as latest
          FROM SENSOR_READINGS
          GROUP BY nodeId
        ) latest ON sr.nodeId = latest.nodeId AND sr.timestamp = latest.latest
        JOIN NODES n ON sr.nodeId = n.nodeId
        WHERE n.lotId = ?
      )
      SELECT
        ROUND(AVG(temperature),1) AS Temperature,
        ROUND(AVG(humidity),1) AS Humidity,
        ROUND(AVG(ph), 2) AS PH,
        ROUND(AVG(n), 2) AS Nitrogen,
        ROUND(AVG(p), 2) AS Phosphorus,
        ROUND(AVG(k), 2) AS Potassium,
        COUNT(CASE WHEN ph < ? THEN 1 END) AS lowPH,
        COUNT(CASE WHEN ph BETWEEN ? AND ? THEN 1 END) AS optimalPH,
        COUNT(CASE WHEN ph > ? THEN 1 END) AS highPH
      FROM LatestReadings;
    `;

    const params = [lotId, lowerPH, lowerPH, upperPH, upperPH];
    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    if (rows.length === 0) {
      throw createHttpError(404, "Lot data not found");
    }

    return rows[0] as DataProps;
  }

  static async getLatestLotImage(lotId: number) {
    const query = `
      SELECT I.url, I.uploadedAt
      FROM NODE_IMAGES I
      JOIN NODES N ON I.nodeId = N.nodeId
      WHERE N.lotId = ?
      ORDER BY I.uploadedAt DESC
      LIMIT 1
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query, [lotId]);

    if (rows.length > 0) {
      return {
        url: rows[0].url,
        uploadedAt: formatTimestamp(rows[0].uploadedAt),
      };
    } else {
      return null;
    }
  }
}

export default LotModel;
