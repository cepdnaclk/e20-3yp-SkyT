import mysql.connector

db = mysql.connector.connect(
    host="database-1.cwt8ikeayy80.us-east-1.rds.amazonaws.com",
    user="admin",
    password="RDBAWS1234",
    database="awsdatabase_1"
)

cursor = db.cursor()
#query = "Create Table if not exist Persons (PersonID int,LastName varchar(255),FirstName varchar(255),Address varchar(255),City varchar(255));"
query = "CREATE TABLE IF NOT EXISTS Persons (PersonID INT,LastName VARCHAR(255),FirstName VARCHAR(255),Address VARCHAR(255),City VARCHAR(255));"

#values = ("sensor_123", 26.5, 45)

cursor.execute(query)
db.commit()
cursor.close()
db.close()
