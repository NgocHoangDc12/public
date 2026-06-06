const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

router.get("/:id", async (request, response) => {
  const id = request.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ message: "Invalid user id: " + id });
  }

  try {

    const user = await User.findById(id);
    if (!user) {
      return response.status(400).json({ message: "User not found with id: " + id });
    }

    const photos = await Photo.find({ user_id: id }).select(
      "_id user_id comments file_name date_time"
    );

    const processedPhotos = await Promise.all(
      photos.map(async (photo) => {
        const photoObj = {
          _id: photo._id,
          user_id: photo.user_id,
          file_name: photo.file_name,
          date_time: photo.date_time,
          comments: [],
        };

        if (photo.comments && photo.comments.length > 0) {
          photoObj.comments = await Promise.all(
            photo.comments.map(async (comment) => {
              const commentUser = await User.findById(comment.user_id).select(
                "_id first_name last_name"
              );

              return {
                _id: comment._id,
                comment: comment.comment,
                date_time: comment.date_time,
                user: commentUser
                  ? {
                      _id: commentUser._id,
                      first_name: commentUser.first_name,
                      last_name: commentUser.last_name,
                    }
                  : null,
              };
            })
          );
        }

        return photoObj;
      })
    );

    response.status(200).json(processedPhotos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    response.status(400).json({ message: "Invalid user id: " + id });
  }
});

module.exports = router;
