import { Divider, List, ListItem, ListItemText, ListItemButton} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CommentIcon from "@mui/icons-material/Comment";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";
function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchModel("/user/listWithCounts")
      .then((data) => {
        setUsers(data);
      })
      .catch(() => {
        fetchModel("/user/list").then((data) => {
          setUsers(data);
        });
      });
  }, []);
  return (
    <div>
      <List component="nav">
        {users.map((item) => (
          <React.Fragment key={item._id}>
            <ListItem disablePadding>
              <ListItemButton component={Link} to={`/users/${item._id}`}>
                <ListItemText
                  primary={`${item.first_name} ${item.last_name}`}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}
export default UserList;
