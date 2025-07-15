
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import gridfs


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


