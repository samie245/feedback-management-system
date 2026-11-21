# we write code here

from fastapi import FastAPI, HTTPException, Header, Body
import functions
ROLE= ["staff", "user"]

app = FastAPI()

def authorize(token,allowed_role):
    
    payload = functions.verify_token(token=token, token_type="access")
    if not payload:
        raise HTTPException(status_code=401, detail = "Invalid or Expired token")
    if payload["role"] not in allowed_role:
        raise HTTPException(status_code=403, detail="You do not have the permission to do this")
    
    
    
# E2 submits new feedback
def submit_feedback(subject=None, message=None, rating: int = None, authorization: str = Header(None)):
    authorize(authorization, ["user"])
    user_id = functions.get_user_id(authorization)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    if not subject or not message or rating is None:
        raise HTTPException(status_code=422, detail="Subject, message and rating are required")
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=422, detail="Rating must be between 1 and 5")
    return functions.add_feedback(user_id, subject, message, rating)

#E1
@app.post("/register")
def register_user(username = Body() , password= Body(), role = Body("staff"), email =Body()):
    if role not in ROLE:
        raise HTTPException(status_code=403, detail="role should be only staff or admin")
    if functions.register_user(username=username, password=password, role=role, email = email):
        return{"message" : "user registered successfully"}
    raise HTTPException(status_code=400, detail="user already exists")

#E2
@app.post("/login")
def Login( password= Body(), email =Body()):
    token = functions.verify_login(password=password,email=email)
    if not token:
        raise HTTPException(status_code=401, detail= "Invalid Credential")
    return token

#E3
@app.post("/refresh")
def refresh(refresh_token = Header(None)):
    payload = functions.verify_token(token=refresh_token, token_type="refresh")
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or Expired refresh_token")
    
    access_token = functions.create_token(token_type="access", user_id= payload["user_id"] , role = payload["role"], email = payload["email"])
    return {"access_token" :access_token}