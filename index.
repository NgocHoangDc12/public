const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const CommentRouter = require("./routes/CommentRouter");
const CommentOfPhotoRouter = require("./routes/CommentOfPhotoRouter");

const session = require("express-session");
const AuthRouter = require("./routes/AuthRouter");

const dbLoad = require("./db/dbLoad");
const User = require("./db/userModel");

dbConnect()
  .then(async () => {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log("Database is empty. Seeding database...");
      await dbLoad();
      console.log("Database seeded.");
    } else {
      console.log("Database already contains data. Skipping seed.");
    }
  })
  .catch(console.error);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.set("trust proxy", 1);

app.use(
  session({
    secret: "photo-app-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
    },
  })
);

app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.use("/admin", AuthRouter);

app.use((request, response, next) => {
  if (request.session.user) {
    next();
  } else {
    response.status(401).send("Unauthorized");
  }
});

app.use("/user", UserRouter);
app.use("/photosOfUser", PhotoRouter);
app.use("/comments", CommentRouter);
app.use("/commentsOfPhoto", CommentOfPhotoRouter);

app.listen(8080, () => {
  console.log("server listening on port 8080");
});
