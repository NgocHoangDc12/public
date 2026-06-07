import { Typography, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchModel("/user/" + userId)
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error("Lỗi khi kéo User:", err);
      });
  }, [userId]);
  if (!user) {
    return <Typography variant="h6">Đang tải dữ liệu người dùng...</Typography>;
  }
  return (
    <div className="user-detail">
      <Typography variant="h4" gutterBottom>
        {user.first_name} {user.last_name}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Location:</strong> {user.location}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Occupation:</strong> {user.occupation}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Description:</strong> {user.description}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={`/photos/${user._id}`}
        style={{ marginTop: "16px" }}
      >
        View Photos
      </Button>
    </div>
  );
}
export default UserDetail;
