from fastapi import APIRouter, HTTPException
from db.database import attendance_collection, employee_collection
from schemas import Attendance
from datetime import datetime, time

router = APIRouter()
@router.post("/attendance")
def mark_attendance(payload: Attendance):

    
    data = payload.model_dump()
    employee = employee_collection.find_one(
        {"employee_id": payload.employee_id}
    )
    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee does not exist"
        )

    data["date"] = datetime.combine(data["date"], time.min)

    attendance_collection.insert_one(data)

    return {"message": "Attendance marked successfully"}

@router.get("/attendance/{employee_id}")
def get_attendance(employee_id: str):
    employee = employee_collection.find_one(
        {"employee_id": employee_id}
    )
    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee does not exist"
        )

    records = list(attendance_collection.find(
        {"employee_id": employee_id},
        {"_id": 0}
    ))
    return records
