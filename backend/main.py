from fastapi import FastAPI, HTTPException, Header
import functions
from fastapi.middleware.cors import CORSMiddleware
from model import RegisterRequest, LoginRequest, FeedbackCreate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"]
)

ROLE= ["staff", "user"]

def authorize(token,allowed_role):
    
    payload = functions.verify_token(token=token, token_type="access")
    if not payload:
        raise HTTPException(status_code=401, detail = "Invalid or Expired token")
    if payload["role"] not in allowed_role:
        raise HTTPException(status_code=403, detail="You do not have the permission to do this")
    return payload
    
# E1 gets all feedback of the user that has logged in
@app.get("/feedback")
def get_feedback(token = Header(None)):
    user = functions.verify_token(token=token, token_type="access")
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if user["role"] not in ROLE:
        raise HTTPException(status_code=403, detail="You're not allowed to do this")
    return functions.get_user_feedback(user_id=user["user_id"])
    
# E2 submits new feedback
@app.post("/feedback")
def submit_feedback(creds: FeedbackCreate, authorization: str = Header(None)):
    authorize(authorization, ["user"])
    user_id = functions.get_user_id(authorization)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    if not creds.subject or not creds.message or creds.rating is None:
        raise HTTPException(status_code=422, detail="Subject, message and rating are required")
    if creds.rating < 1 or creds.rating > 5:
        raise HTTPException(status_code=422, detail="Rating must be between 1 and 5")
    return functions.add_feedback(user_id, creds.subject, creds.message, creds.rating)

#E1
@app.post("/register")
def register_user(creds: RegisterRequest):
    if functions.register_user(username=creds.username, password=creds.password, role=creds.role, email=creds.email):
        return {"message": "user registered successfully"}
    raise HTTPException(status_code=409, detail="user already exists")

#E2
@app.post("/login")
def Login(creds: LoginRequest):
    token = functions.verify_login(password=creds.password, email=creds.email)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid Credential")
    return token

#E3
@app.post("/refresh")
def refresh(refresh_token = Header(None)):
    payload = functions.verify_token(token=refresh_token, token_type="refresh")
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or Expired refresh_token")
    
    access_token = functions.create_token(token_type="access", user_id= payload["user_id"] , role = payload["role"], email = payload["email"])
    return {"access_token" :access_token}