import { useState } from "react";
import Dashboard from "./components/Dashboard";

const API_URL = "http://127.0.0.1:8001";

function App() {
  // shared states: the Registration and Login code uses these too
  const [page, setPage] = useState("login");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [message, setMessage] = useState("");

  // registration code

  // login code

  // dashboard code
  const [feedbackList, setFeedbackList] = useState([]);

  // logout: forget the tokens and the feedback, then goes back to the login page
  function logout() {
    setAccessToken("");
    setRefreshToken("");
    setFeedbackList([]);
    setPage("login");
  }

  // E1: gets all the feedback of the logged in user
  function getFeedback(token, tryRefresh) {
    fetch(API_URL + "/feedback", { headers: { Authorization: "Bearer " + token } })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          if (tryRefresh) {
            refreshAndReload();
          } else {
            setMessage(data.detail);
          }
        } else {
          setMessage("");
          setFeedbackList(data);
        }
      });
  }

  // A3: the access token expires
  function refreshAndReload() {
    fetch(API_URL + "/refresh", { method: "POST", headers: { "refresh-token": refreshToken } })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          logout();
          setMessage("Session expired, please log in again");
        } else {
          setAccessToken(data.access_token);
          getFeedback(data.access_token, false);
        }
      });
  }

  return (
    <>
      <h1>Feedback Management System</h1>
      {message && <p>{message}</p>}

      {/* registration page goes here (teammate) */}

      {page === "login" && <p>Login page goes here (teammate)</p>}

      {page === "dashboard" && (
        <Dashboard
          accessToken={accessToken}
          feedbackList={feedbackList}
          getFeedback={getFeedback}
          logout={logout}
        />
      )}
    </>
  );
}

export default App;