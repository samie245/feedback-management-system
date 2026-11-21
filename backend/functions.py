from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from model import Base, Feedback , User
# moshi i've imported user already so check it out in models before you write code

engine = create_engine("sqlite:///feedback.db")
Base.metadata.create_all(engine)

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