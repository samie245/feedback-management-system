import { useEffect } from "react";

function Dashboard({ accessToken, feedbackList, getFeedback, logout }) {
  useEffect(() => {
    getFeedback(accessToken, true);
  }, []);

  return (
    <>
      <h2>Feedback dashboard</h2>
      <button onClick={() => logout()}>Logout</button>

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