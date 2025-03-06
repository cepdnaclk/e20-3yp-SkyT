import mysql.connector

# Database connection details
db_config = mysql.connector.connect(
    host="database-1.cwt8ikeayy80.us-east-1.rds.amazonaws.com",
    user="admin",
    password="RDBAWS1234",
    database="awsdatabase_1"
)

# Function to insert data into Lot_Images table
def insert_lot_image(lot_number, image_id):
    try:
        # Connect to the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # SQL query using parameterized values
        sql = "INSERT INTO Lot_Images (lot_number, time, image_ID) VALUES (%s, NOW(), %s)"
        values = (lot_number, image_id)

        # Execute the query
        cursor.execute(sql, values)

        # Commit the transaction
        conn.commit()
        print("Data inserted successfully. Inserted ID:", cursor.lastrowid)

    except mysql.connector.Error as err:
        print("Error:", err)

    finally:
        # Close the connection
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Example usage
insert_lot_image(123, 'image_001.jpg')
