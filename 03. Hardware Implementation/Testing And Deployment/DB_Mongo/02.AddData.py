
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://MongoDBUser3YPG11:VYlFFpkaWmqnuPZr@cluster0.78m7k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Reference a new database
db = client["database01"]

# Print the database name
print("Database selected:", db.name)


# Reference a collection (like a table)
collection = db["collection01"]

# Insert a sample document
document = {"name": "Thomas", "age": 28, "city": "Kandy"}
insert_result = collection.insert_one(document)

# Print the inserted document's ID
print("Inserted document ID:", insert_result.inserted_id)


# List all databases in the cluster
databases = client.list_database_names()
print("Databases:", databases)


# List all collections in the database
collections = db.list_collection_names()
print("Collections:", collections)

