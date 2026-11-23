import { useState, useEffect } from "react";

function Dashboard({ accessToken, feedbackList, getFeedback, addFeedback, logout }) {
  const [subject, setSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [rating, setRating] = useState("");

  // empties the form after a successful submit
  function clearForm() {
    setSubject("");
    setFeedbackMessage("");
    setRating("");
  }

  // runs once when the dashboard opens: loads the user's feedback (E1)
  useEffect(() => {
    getFeedback(accessToken, true);
  }, []);

  return (
    <>
      <h2>Feedback dashboard</h2>
      <button onClick={() => logout()}>Logout</button>

      <h3>Submit feedback</h3>
      <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <input placeholder="Message" value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} />
      <input type="number" placeholder="Rating (1 to 5)" value={rating} onChange={(e) => setRating(e.target.value)} />
      <button onClick={() => addFeedback(subject, feedbackMessage, rating, clearForm)}>Submit</button>

      <h3>My feedback</h3>
      {feedbackList.length === 0 && <p>You have not submitted any feedback yet.</p>}

      {feedbackList.map((item) => (
        <div key={item.id}>
          <hr />
          <h3>{item.subject}</h3>
          <p>{item.message}</p>
          <p>Rating: {item.rating}/5</p>
          <p>Submitted on: {item.created_at.slice(0, 10)}</p>
        </div>
      ))}
    </>
  );
}

export default Dashboard;