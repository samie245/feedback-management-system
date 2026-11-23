import { useState } from "react";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import Register from "./components/RegisterUser";

const API_URL = "http://127.0.0.1:8001";

function App() {
  // shared states: the Registration and Login code uses these too
  const [page, setPage] = useState("login");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [message, setMessage] = useState("");

  // registration code
  // R1: sends the new user's details to the backend
  function registerUser(username, email, password, role) {
    fetch(API_URL + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          if (typeof data.detail === "string") {
            setMessage(data.detail);
          } else {
            setMessage("Please fill in all the fields");
          }
        } else {
          setMessage("Registered successfully, please log in");
          setPage("login");
        }
      })
      .catch(() => setMessage("Could not reach the server"));
  }

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
  fetch(API_URL + "/feedback", { headers: { token: token } })
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

  // E2: submits new feedback
function addFeedback(subject, text, rating, clearForm) {
  fetch(API_URL + "/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json", token: accessToken },
    body: JSON.stringify({ subject: subject, message: text, rating: rating * 1 }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.detail) {
        setMessage(typeof data.detail === "string" ? data.detail : "Fill in the subject and message, and give a rating from 1 to 5");
      } else {
        setMessage("Feedback submitted");
        clearForm();
        getFeedback(accessToken, true);
      }
    });
}

  return (
    <>
      <h1>Feedback Management System</h1>
      {message && <p>{message}</p>}

      {page === "register" && (
        <Register registerUser={registerUser} setPage={setPage} />
      )}
      {page === "login" && (
        <LoginPage login={login} loginError={loginError} setPage={setPage} />
      )}

      {page === "dashboard" && (
       <Dashboard
         accessToken={accessToken}
         feedbackList={feedbackList}
         getFeedback={getFeedback}
         addFeedback={addFeedback}
        logout={logout}
          />
      )}
    </>
  );
}

export default App;