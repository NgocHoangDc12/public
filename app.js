import "./App.css";

import React, { useState } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";

import LoginRegister from "./components/LoginRegister";

const App = (props) => {
  const [advancedMode, setAdvancedMode] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar
              advancedMode={advancedMode}
              setAdvancedMode={setAdvancedMode}
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
            />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              {loggedInUser ? <UserList /> : null}
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                {loggedInUser ? (
                  <>
                    <Route path="/users/:userId" element={<UserDetail />} />
                    <Route
                      path="/photos/:userId"
                      element={
                        <UserPhotos
                          advancedMode={advancedMode}
                          loggedInUser={loggedInUser}
                        />
                      }
                    />
                    <Route
                      path="/comments/:userId"
                      element={<UserComments />}
                    />
                    <Route path="/users" element={<UserList />} />
                    <Route
                      path="*"
                      element={
                        <Typography variant="body1">
                          Welcome to your photos app. Select a user on the left.
                        </Typography>
                      }
                    />
                  </>
                ) : (
                  <Route
                    path="*"
                    element={
                      <LoginRegister setLoggedInUser={setLoggedInUser} />
                    }
                  />
                )}
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
