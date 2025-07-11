import mysql.connector
from picamera import PiCamera
import time
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import gridfs
from bson import ObjectId

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
        #conn = mysql.connector.connect(**db_config)
        cursor = db_config.cursor()

        # SQL query using parameterized values
        sql = "INSERT INTO Lot_Images (lot_number, time, image_ID) VALUES (%s, NOW(), %s)"
        values = (lot_number, str(image_id))

        # Execute the query
        cursor.execute(sql, values)

        # Commit the transaction
        db_config.commit()
        print("Data inserted successfully. Inserted ID:", cursor.lastrowid)

    except mysql.connector.Error as err:
        print("Error:", err)

    finally:
        # Close the connection
        if cursor:
            cursor.close()
        if db_config:
            db_config.close()


def save_Image_Mongo(dir):
	uri = "mongodb+srv://MongoDBUser3YPG11:VYlFFpkaWmqnuPZr@cluster0.78m7k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

	# Create a new client and connect to the server
	client = MongoClient(uri, server_api=ServerApi('1'))

	# Reference to a database
	db = client["database01"]

	# Initialize GridFS
	fs = gridfs.GridFS(db, collection="images")


	# Open the image file in binary mode and store it in MongoDB
	with open(dir, "rb") as f:
		file_id = fs.put(f, filename="/home/raspi/Desktop/Camera/Lot01_2025-03-04_17-04-55.jpg.jpg")

	print(f"Image stored with ID: {file_id}")
	
	return file_id
	
def captureImage():
	
	camera = PiCamera()
	camera.resolution = (1024, 768)
	time.sleep(2)

	filename = f"/home/raspi/Desktop/Camera/Lot01_{time.strftime('%Y-%m-%d_%H-%M-%S')}.jpg"
	camera.capture(filename)
	print(f"Image saved as {filename}")
	
	return filename



dir = captureImage()
Id = save_Image_Mongo(dir)
Id2= insert_lot_image(1,Id)



