from fastapi import APIRouter, HTTPException
from db.database import attendance_collection, employee_collection
from schemas import Attendance
from datetime import datetime, time

router = APIRouter()

@router.post("/attendance")
def mark_attendance(payload: Attendance):
    # Check if employee exists
    employee = employee_collection.find_one({"employee_id": payload.employee_id})
    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee does not exist"
        )

    # Prepare date (set time to 00:00)
    attendance_date = datetime.combine(payload.date, time.min)

    # Upsert attendance
    result = attendance_collection.update_one(
        {"employee_id": payload.employee_id, "date": attendance_date},
        {"$set": {"status": payload.status}},
        upsert=True
    )

    if result.matched_count:
        message = "Attendance updated successfully"
    else:
        message = "Attendance marked successfully"

    return {"message": message}


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
