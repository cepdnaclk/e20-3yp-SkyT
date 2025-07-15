import mysql.connector
from bson import ObjectId
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# MySQL database connection details
mysql_config = mysql.connector.connect(
    host="database-1.cwt8ikeayy80.us-east-1.rds.amazonaws.com",
    user="admin",
    password="RDBAWS1234",
    database="awsdatabase_1"
)



uri = "mongodb+srv://MongoDBUser3YPG11:VYlFFpkaWmqnuPZr@cluster0.78m7k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongo_client = MongoClient(uri, server_api=ServerApi('1'))
mongo_db = mongo_client["database01"]
fs = gridfs.GridFS(db, collection="images")

# Function to fetch image ID from MySQL
def get_image_id_from_mysql(lot_number):
    try:
        # Connect to MySQL
        conn = mysql_config
        cursor = conn.cursor()

        # SQL query to fetch the latest image_ID for the given lot_number
        sql = "SELECT image_ID FROM Lot_Images WHERE lot_number = %s ORDER BY time DESC LIMIT 1"
        cursor.execute(sql, (lot_number,))

        result = cursor.fetchone()
        if result:
            return result[0]  # image_ID
        else:
            print("No image found for the given lot number.")
            return None

    except mysql.connector.Error as err:
        print("MySQL Error:", err)
        return None

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Function to retrieve image from MongoDB and save to file
def fetch_image_from_mongo(image_id):
    try:
        object_id = ObjectId(image_id)  # Convert string ID to ObjectId
        image_doc = mongo_collection.find_one({"_id": object_id})

        if image_doc and "image_data" in image_doc:  # Assuming image_data field stores binary data
            with open("/home/raspi/Desktop/AutoMation/Image/retrieved_image.jpg", "wb") as file:
                file.write(image_doc["image_data"])
            print("Image successfully saved as retrieved_image.jpg")
        else:
            print("No image found in MongoDB for the given ID.")

    except Exception as err:
        print("MongoDB Error:", err)

# Main function to fetch and save the image
def main(lot_number):
    image_id = get_image_id_from_mysql(lot_number)
    if image_id:
        print(f"Retrieved Image ID: {image_id}")
        fetch_image_from_mongo(image_id)

# Example usage
main(1)  # Replace 123 with your actual lot number
