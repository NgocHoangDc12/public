const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const router = express.Router();

router.get("/list", async (request, response) => {
  try {
    const users = await User.find({}).select("_id first_name last_name").lean();
    response.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user list:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (request, response) => {
  const id = request.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ message: "Invalid user id: " + id });
  }

  try {
    const user = await User.findById(id).select(
      "_id first_name last_name location description occupation"
    );

    if (!user) {
      return response.status(400).json({ message: "User not found with id: " + id });
    }

    response.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    response.status(400).json({ message: "Invalid user id: " + id });
  }
});

router.post("/", async (request, response) => {
  try {
    const { login_name, password, first_name, last_name, location, description, occupation } = request.body;

    if (!login_name) return response.status(400).send("login_name is required");
    if (!password) return response.status(400).send("password is required");
    if (!first_name) return response.status(400).send("first_name is required");
    if (!last_name) return response.status(400).send("last_name is required");

    const existingUser = await User.findOne({ login_name: login_name });
    if (existingUser) {
      return response.status(400).send("login_name already exists");
    }

    const newUser = await User.create({
      login_name,
      password,
      first_name,
      last_name,
      location: location || "",
      description: description || "",
      occupation: occupation || ""
    });

    response.status(200).send({
      _id: newUser._id,
      login_name: newUser.login_name,
      first_name: newUser.first_name,
      last_name: newUser.last_name
    });
  } catch (error) {
    console.error("Error creating user:", error);
    response.status(400).send("Error creating user");
  }
});

module.exports = router;
