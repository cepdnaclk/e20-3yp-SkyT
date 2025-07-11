import gridfs
import mysql.connector
from pymongo import MongoClient
from bson import ObjectId

# MongoDB connection details
MONGO_URI = "mongodb+srv://MongoDBUser3YPG11:VYlFFpkaWmqnuPZr@cluster0.78m7k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "database01"

# MySQL connection details
MYSQL_CONFIG = {
    "host": "database-1.cwt8ikeayy80.us-east-1.rds.amazonaws.com",
    "user": "admin",
    "password": "RDBAWS1234",
    "database": "awsdatabase_1",
}

# Connect to MongoDB
try:
    mongo_client = MongoClient(MONGO_URI)
    mongo_db = mongo_client[DB_NAME]
    fs = gridfs.GridFS(mongo_db, collection="images")  # Use the same collection used for storing images
    print("Connected to MongoDB successfully.")
except Exception as e:
    print("Error connecting to MongoDB:", e)

# Function to retrieve the image from GridFS
def retrieve_image(image_id, save_path="retrieved_image.jpg"):
    try:
        # Convert image_id to ObjectId
        object_id = ObjectId(image_id)

        # Check if the image exists
        if not fs.exists(object_id):
            print(f"Error: No file found with ID {image_id}")
            return False

        # Retrieve the image
        grid_out = fs.get(object_id)

        # Save the image locally
        with open(save_path, "wb") as file:
            file.write(grid_out.read())

        print(f"Image retrieved and saved as {save_path}")
        return True

    except Exception as err:
        print("Error retrieving image:", err)
        return False

# Function to fetch the image_id from MySQL
def get_image_id_from_mysql(lot_number):
    try:
        # Connect to MySQL
        mysql_conn = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = mysql_conn.cursor()

        # Fetch image_ID from MySQL based on lot_number
        cursor.execute("SELECT image_ID FROM Lot_Images WHERE lot_number = %s", (lot_number,))
        result = cursor.fetchone()

        # Close MySQL connection
        cursor.close()
        mysql_conn.close()

        if result:
            return result[0]  # Return the image_id from MySQL
        else:
            print(f"Error: No image found for lot_number {lot_number}")
            return None

    except mysql.connector.Error as err:
        print("MySQL Error:", err)
        return None

# Main function to retrieve and save the image
def retrieve_and_save_image(lot_number, save_path="retrieved_image.jpg"):
    # Fetch image_id from MySQL
    image_id = get_image_id_from_mysql(lot_number)

    if image_id:
        # Retrieve the image from MongoDB
        success = retrieve_image(image_id, save_path)
        if success:
            print("Image retrieval completed successfully.")
        else:
            print("Image retrieval failed.")
    else:
        print("Could not retrieve image ID from MySQL.")

# Example usage: Replace `1` with the actual lot_number you want to retrieve
retrieve_and_save_image(1, "retrieved_image.jpg")
