from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base
from pydantic import BaseModel, field_validator

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="staff")  
    created_at = Column(DateTime, default=datetime.now)


class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String, nullable=False)
    message = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    
# pydantic models for validating requests

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str = "staff"

    @field_validator("username", "password")
    @classmethod
    def check_not_empty(cls, value):
        if value.strip() == "":
            raise ValueError("cannot be empty")
        return value

    @field_validator("role")
    @classmethod
    def check_role(cls, value):
        if value not in ["staff", "user"]:
            raise ValueError("role should be only staff or user")
        return value


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email", "password")
    @classmethod
    def check_not_empty(cls, value):
        if value.strip() == "":
            raise ValueError("cannot be empty")
        return value


class FeedbackCreate(BaseModel):
    subject: str
    message: str
    rating: int

    @field_validator("subject", "message")
    @classmethod
    def check_not_empty(cls, value):
        if value.strip() == "":
            raise ValueError("cannot be empty")
        return value

    @field_validator("rating")
    @classmethod
    def check_rating(cls, value):
        if value < 1 or value > 5:
            raise ValueError("rating must be between 1 and 5")
        return value