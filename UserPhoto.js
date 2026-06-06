import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
} from "@mui/material";
import { Link, useParams, useSearchParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { API_URL } from "../../config";
import "./styles.css";
function UserPhotos({ advancedMode, loggedInUser }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [newComments, setNewComments] = useState({});

  const currentIndex = parseInt(searchParams.get("step") || "0", 10);
  const setCurrentIndex = (newIndex) => {
    setSearchParams({ step: newIndex.toString() });
  };
  const fetchPhotos = () => {
    fetchModel("/photosOfUser/" + userId)
      .then((data) => {
        setPhotos(data);
        if (!searchParams.has("step")) {
          setSearchParams({ step: "0" });
        }
      })
      .catch((err) => {
        console.error("Lỗi khi kéo Photos:", err);
      });
  };
  useEffect(() => {
    fetchPhotos();
    const handlePhotoUploaded = () => {
      fetchPhotos();
    };
    window.addEventListener("photoUploaded", handlePhotoUploaded);
    return () => {
      window.removeEventListener("photoUploaded", handlePhotoUploaded);
    };
  }, [userId]);
  const handleAddComment = async (photoId) => {
    const commentText = newComments[photoId];
    if (!commentText || commentText.trim() === "") return;
    try {
      const response = await fetch(`${API_URL}/commentsOfPhoto/${photoId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: commentText }),
        credentials: "include",
      });
      if (response.ok) {
        setNewComments({ ...newComments, [photoId]: "" });
        fetchPhotos();
      } else {
        alert("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };
  const handleCommentChange = (photoId, text) => {
    setNewComments({ ...newComments, [photoId]: text });
  };
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  if (!photos) {
    return <Typography variant="h6">Đang tải ảnh...</Typography>;
  }
  if (photos.length === 0) {
    return (
      <Typography variant="h6">Không tìm thấy ảnh của người này.</Typography>
    );
  }
  const photosToRender = advancedMode ? [photos[currentIndex]] : photos;
  return (
    <div className="user-photos">
      {photosToRender.map((photo) => (
        <Card key={photo._id} style={{ marginBottom: "24px" }}>
          <CardMedia
            component="img"
            image={`${API_URL}/images/${photo.file_name}`}
            alt={photo.file_name}
          />
          <CardContent>
            <Typography
              variant="caption"
              color="textSecondary"
              display="block"
              gutterBottom
            >
              Date uploaded: {formatDate(photo.date_time)}
            </Typography>
            <Typography variant="subtitle1" style={{ marginTop: "16px" }}>
              Comments
            </Typography>
            <Divider />
            <List>
              {(!photo.comments || photo.comments.length === 0) && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ marginTop: "8px" }}
                >
                  No comments yet.
                </Typography>
              )}
              {photo.comments &&
                photo.comments.map((comment) => (
                  <ListItem
                    key={comment._id}
                    alignItems="flex-start"
                    disableGutters
                  >
                    <ListItemText
                      primary={
                        <Link
                          to={`/users/${comment.user._id}`}
                          style={{ textDecoration: "none", fontWeight: "bold" }}
                        >
                          {comment.user.first_name} {comment.user.last_name}
                        </Link>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                            gutterBottom
                          >
                            {formatDate(comment.date_time)}
                          </Typography>
                          <Typography variant="body2" color="textPrimary">
                            {comment.comment}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
            </List>
            {loggedInUser && (
              <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Add a comment..."
                  value={newComments[photo._id] || ""}
                  onChange={(e) =>
                    handleCommentChange(photo._id, e.target.value)
                  }
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddComment(photo._id)}
                >
                  Post
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
export default UserPhotos;
