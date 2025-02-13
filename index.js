const express = require("express");
const postRouter = require("./routes/postsRoute");
const { signIn, signUp, logOut } = require("./controllers/authControlller");
const authMiddleware = require("./middlewares/auth");

const app = express();

const port = process.env.PORT || 4000;

app.post("/login", signIn);
app.post("/signup", signUp);
app.post("/logout", authMiddleware, logOut);

app.use("/posts", postRouter);

app.all("*", (_, res) => {
  return res.status(404).json({
    message: "Route not found",
  });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
