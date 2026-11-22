import { useState } from "react";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";

const API_URL = "http://127.0.0.1:8001";

function App() {
  // shared states: the Registration and Login code uses these too
  const [page, setPage] = useState("login");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [message, setMessage] = useState("");

  // registration code

  // login code
   const [loginError, setLoginError] = useState("");

   // A2: logs the user in and stores both tokens
  function login(email, password) {
    fetch(API_URL + "/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email: email, password: password})
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setLoginError(data.detail);
        } else {
          setLoginError("");
          setMessage("");
          setAccessToken(data.access_token);
          setRefreshToken(data.refresh_token);
          setPage("dashboard");
        }
      });
  }

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
      fetch(API_URL + "/feedback", {headers: {token: token}})
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

      {page === "login" && (
        <LoginPage login={login} loginError={loginError} setPage={setPage} />
      )}

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