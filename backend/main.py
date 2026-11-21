# we write code here

from fastapi import FastAPI, HTTPException, Header
import functions

app = FastAPI()

# E2 submits new feedback
@app.post("/feedback", status_code=201)
def submit_feedback(subject=None, message=None, rating: int = None, authorization: str = Header(None)):
    user_id = functions.get_user_id(authorization)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    if not subject or not message or rating is None:
        raise HTTPException(status_code=422, detail="Subject, message and rating are required")
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=422, detail="Rating must be between 1 and 5")
    return functions.add_feedback(user_id, subject, message, rating)