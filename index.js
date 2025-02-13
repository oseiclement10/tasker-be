const express = require("express");
const postRouter = require("./routes/postsRoute");
const app = express();

const port = process.env.PORT || 4000;

app.use("/posts", postRouter);


app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
