from sqlalchemy import create_engine
from datetime import timedelta, datetime, timezone
from sqlalchemy.orm import Session
from model import Base, Feedback , User
import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()

engine = create_engine("sqlite:///feedback.db")
Base.metadata.create_all(engine)

ACCESS_TOKEN_EXPIRY = 15
REFRESH_TOKEN_EXPIRY = 7 * 24 * 60
SECRET_KEY = "SECRET123"
ALGORITHM = "HS256"

# E1 gets all feedback of the user that has logged in
def get_user_feedback(user_id):
    session = Session(engine)
    rows = session.query(Feedback).filter(Feedback.user_id == user_id).all()
    result = []
    for row in rows:
        result.append({
            "id": row.id,
            "subject": row.subject,
            "message": row.message,
            "rating": row.rating,
            "created_at": row.created_at
        })
    session.close()
    return result


# E2 submits new feedback for the user that has logged in
def add_feedback(user_id, subject, message, rating):
    session = Session(engine)
    feedback = Feedback(
        user_id=user_id,
        subject=subject,
        message=message,
        rating=rating
    )
    session.add(feedback)
    session.commit()
    data = {
        "id": feedback.id,
        "subject": feedback.subject,
        "message": feedback.message,
        "rating": feedback.rating,
        "created_at": feedback.created_at
    }
    session.close()
    return data


def verify_login(password,email):
    session = Session(engine)
    user = session.query(User).filter_by( email=email).first()
    if user is None:
        session.close()
        return False
    
    try:
        ph.verify(user.password, password)
    except VerifyMismatchError :
        session.close()
        return False
    
    access_token = create_token ( token_type= "access", user_id=user.id , email= email, role=user.role)
    refresh_token = create_token ( token_type= "refresh", user_id=user.id ,email= email, role=user.role)
    session.close()
    return {"access_token" : access_token , "refresh_token": refresh_token}
    
    
    
def create_token( token_type, user_id, role,email):
    time = ACCESS_TOKEN_EXPIRY
    if token_type == "refresh" :
        time = REFRESH_TOKEN_EXPIRY
        
    payload = {
        "email" : email,
        "user_id" : user_id,
        "role": role,
        "token_type": token_type,
        "exp" : datetime.now(timezone.utc)+timedelta(minutes=time)
    }
    
    token = jwt.encode(payload = payload , key = SECRET_KEY , algorithm=ALGORITHM)
    return token


def verify_token(token, token_type):
    try:
        payload = jwt.decode(jwt = token , key=SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        return False
    if payload["token_type"] == token_type:
        return payload
    return False


def register_user(username, password, role,email):
    session = Session(engine)
    user_exist = session.query(User).filter_by(email =email).first()
    if user_exist is not None:
        session.close()
        return False
    
    try:
        hashed_password = ph.hash(password)
    except Exception:
        session.close()
        return False
    
    session.add(User(username= username,email= email, password= hashed_password, role= role))
    session.commit()
    session.close()
    return True