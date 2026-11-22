import {useState} from "react";

function LoginPage({login, loginError, setPage}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState("");

  function handleLogin() {
    if (email === "" || password === "") {
      setFieldError("Email and password are required");
    } else {
      setFieldError("");
      login(email, password);
    }
  }

  return (
    <>
      <h2>Login</h2>
      <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => handleLogin()}>Login</button>
      {fieldError && <p>{fieldError}</p>}
      {loginError && <p>{loginError}</p>}

      <p>Don't have an account?</p>
      <button onClick={() => setPage("register")}>Register</button>
    </>
  );
}

export default LoginPage;