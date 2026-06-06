import React, { useState } from "react";
import { Typography, TextField, Button, Grid, Paper, Box } from "@mui/material";
import { API_URL } from "../../config";

const LoginRegister = ({ setLoggedInUser }) => {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [regLoginName, setRegLoginName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regLocation, setRegLocation] = useState("");
  const [regDescription, setRegDescription] = useState("");
  const [regOccupation, setRegOccupation] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login_name: loginName, password }),
        credentials: "include",
      });

      if (response.ok) {
        const user = await response.json();
        setLoggedInUser(user);
      } else {
        const errText = await response.text();
        setLoginError(errText || "Login failed");
      }
    } catch (err) {
      setLoginError("Network error. Is the server running?");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    if (regPassword !== regPasswordConfirm) {
      setRegError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_name: regLoginName,
          password: regPassword,
          first_name: regFirstName,
          last_name: regLastName,
          location: regLocation,
          description: regDescription,
          occupation: regOccupation,
        }),
      });

      if (response.ok) {
        setRegSuccess("Registration successful! You can now login.");
        setRegLoginName("");
        setRegPassword("");
        setRegPasswordConfirm("");
        setRegFirstName("");
        setRegLastName("");
        setRegLocation("");
        setRegDescription("");
        setRegOccupation("");
      } else {
        const errText = await response.text();
        setRegError(errText || "Registration failed");
      }
    } catch (err) {
      setRegError("Network error. Is the server running?");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Login Name"
                variant="outlined"
                margin="normal"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {loginError && (
                <Typography color="error">{loginError}</Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Register
            </Typography>
            <form onSubmit={handleRegister}>
              <TextField
                fullWidth
                label="Login Name"
                variant="outlined"
                margin="normal"
                value={regLoginName}
                onChange={(e) => setRegLoginName(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                margin="normal"
                value={regFirstName}
                onChange={(e) => setRegFirstName(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                margin="normal"
                value={regLastName}
                onChange={(e) => setRegLastName(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={regPasswordConfirm}
                onChange={(e) => setRegPasswordConfirm(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Location"
                variant="outlined"
                margin="normal"
                value={regLocation}
                onChange={(e) => setRegLocation(e.target.value)}
              />
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                margin="normal"
                value={regDescription}
                onChange={(e) => setRegDescription(e.target.value)}
              />
              <TextField
                fullWidth
                label="Occupation"
                variant="outlined"
                margin="normal"
                value={regOccupation}
                onChange={(e) => setRegOccupation(e.target.value)}
              />

              {regError && <Typography color="error">{regError}</Typography>}
              {regSuccess && (
                <Typography color="success.main">{regSuccess}</Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                sx={{ mt: 2 }}
              >
                Register Me
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginRegister;
