from fastapi import APIRouter, HTTPException
from pymongo.errors import DuplicateKeyError
from db.database import employee_collection
from schemas import Employee

router = APIRouter()


@router.post("/employees")
def add_employee(employee: Employee):
    try:
        employee_collection.insert_one(employee.dict())
        return {"message": "Employee added successfully"}
    except DuplicateKeyError as e: 
        if "employee_id" in str(e):
            raise HTTPException(status_code=400, detail="Employee ID already exists")
        if "email" in str(e):
            raise HTTPException(status_code=400, detail="Email already exists")
        raise HTTPException(status_code=400, detail="Duplicate key error")    

@router.get("/employees")
def get_employees():
    employees = list(employee_collection.find({}, {"_id": 0}))
    return employees

@router.delete("/employees/{employee_id}")
def delete_employee(employee_id: str):
    employee_collection.delete_one({"employee_id": employee_id})
    return {"message": "Employee deleted"}
