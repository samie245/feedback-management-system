import { useState } from "react";

function Register({ registerUser, setPage }) {
  const [username, setUsername] = useState("");
  const [email, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");

  // R1: send the details to App, which calls the backend
  function handleRegister() {
    registerUser(username, email, password, role);
  }

  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <br />
      <input placeholder="Email" value={email} onChange={(e) => setUserEmail(e.target.value)} />
      <br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="staff">Staff</option>
      </select>
      <br />

      <button onClick={handleRegister}>Register</button>
      <button onClick={() => setPage("login")}>Back to login</button>
    </div>
  );
}

export default Register;
