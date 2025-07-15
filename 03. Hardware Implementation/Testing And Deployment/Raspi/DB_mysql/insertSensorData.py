import mysql.connector

# Database connection details
db_config = {
    "host": "database-1.cwt8ikeayy80.us-east-1.rds.amazonaws.com",
    "user": "admin",
    "password": "RDBAWS1234",
    "database": "awsdatabase_1"
}

# Function to insert data into sensor_Data table
def insert_sensor_data(node_id, temperature, ph_lvl, nitrogen_lvl, posporus_lvl, pottasuim_lvl, humidity):
    try:
        # Connect to the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # SQL query using parameterized values
        sql = """
        INSERT INTO sensor_Data (node_id, temperature, ph_lvl, nitrogen_lvl, posporus_lvl, pottasuim_lvl, humidity)
        VALUES (%s,%s, %s, %s, %s, %s, %s);
        """
        values = (node_id,temperature, ph_lvl, nitrogen_lvl, posporus_lvl, pottasuim_lvl, humidity)

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
insert_sensor_data(1,25.0, 6.5, 45.3, 30.1, 50.5, 78.2)
