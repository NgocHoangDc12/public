import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, CardMedia, Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { API_URL } from "../../config";
import "./styles.css";

function UserComments() {
  const { userId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchModel("/comments/" + userId)
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.error("Lỗi khi tải comments:", err);
      });
  }, [userId]);

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

  if (!data) {
    return <Typography variant="h6">Đang tải bình luận...</Typography>;
  }

  return (
    <div className="user-comments">
      {data.comments.map((item) => (
        <Card
          key={item._id}
          sx={{ mb: 2, cursor: "pointer", "&:hover": { boxShadow: 4 } }}
          component={Link}
          to={`/photos/${item.photo.user_id}`}
          style={{ textDecoration: "none" }}
        >
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <CardMedia
              component="img"
              sx={{ width: 120, height: 120, objectFit: "cover" }}
              image={`${API_URL}/images/${item.photo.file_name}`}
              alt={item.photo.file_name}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                color="textSecondary"
                display="block"
              >
                {formatDate(item.date_time)}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {item.comment}
              </Typography>
            </CardContent>
          </Box>
        </Card>
      ))}
    </div>
  );
}

export default UserComments;
