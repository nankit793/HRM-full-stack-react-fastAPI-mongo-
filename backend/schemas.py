from pydantic import BaseModel, EmailStr, field_validator
from datetime import date
from typing import Literal

class Employee(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr 
    department: str
    


class Attendance(BaseModel):
    employee_id: str
    date: date
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        v = v.strip().capitalize()
        if v not in {"Present", "Absent"}:
            raise ValueError("Status must be Present or Absent")
        return v
