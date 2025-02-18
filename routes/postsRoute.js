const router = require("express").Router();
const {
  getAllPosts,
  createPost,
  deletePost,
  getPostById,
  updatePost,
  getUserPosts,
} = require("../controllers/postsController");

const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.get("/", getUserPosts);
router.get("/all", getAllPosts);
router.get("/:id", getPostById);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
