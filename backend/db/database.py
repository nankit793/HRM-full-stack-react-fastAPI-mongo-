import os
from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
MONGODB_DB = os.getenv("MONGODB_DB")

client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
db = client[MONGODB_DB]

employee_collection = db.employees
attendance_collection = db.attendance

employee_collection.create_index(
    [("employee_id", ASCENDING)],
    unique=True
)