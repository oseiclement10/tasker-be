const router = require("express").Router();
const {
  getAllPosts,
  createPost,
  deletePost,
  getPostById,
  updatePost,
} = require("../controllers/postsController");

const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware, getAllPosts);

module.exports = router;
