import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { API_URL } from "../../config";
import "./styles.css";
function TopBar({
  advancedMode,
  setAdvancedMode,
  loggedInUser,
  setLoggedInUser,
}) {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const viewType = pathParts[1];
  const userId = pathParts[2];
  const [contextText, setContextText] = useState("");
  useEffect(() => {
    if (userId) {
      fetchModel("/user/" + userId)
        .then((user) => {
          if (user) {
            if (viewType === "users") {
              setContextText(user.first_name + " " + user.last_name);
            } else if (viewType === "photos") {
              setContextText(
                "Photos of " + user.first_name + " " + user.last_name
              );
            }
          }
        })
        .catch((err) => console.error("Error fetching user for TopBar:", err));
    } else {
      setContextText("");
    }
  }, [userId, viewType]);
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
      setLoggedInUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit">
          Photo-sharing
        </Typography>
        <div style={{ flexGrow: 1 }}></div>
        <Typography
          variant="h5"
          color="inherit"
          style={{ marginRight: "20px" }}
        >
          {contextText}
        </Typography>
        {loggedInUser ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <Typography variant="h6">Please Login</Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}
export default TopBar;
