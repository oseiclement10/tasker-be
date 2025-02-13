const Joi = require("joi");
const DB = require("../database/database");

const getAllPosts = async (req, res) => {
  const [rows] = await DB.query("SELECT * FROM posts");
  return res.json({ data: rows });
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await handleFindById(id, res);
  return res.json(post);
};

const createPost = async (req, res) => {
  const { title, content } = req.body;

  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    content: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: error.details.map((err) => err.message),
    });
  }

  try {
    const result = await DB.query(
      "INSERT INTO posts(title,content,authorId)  values(?,?,?)",
      [title, content, req.user_id]
    );
    return res.status(201).json({
      message: "Created Succesfully",
      data: {
        id: result.insertId,
        ...req.body,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Database Error",
      errors: err?.message,
    });
  }
};

const updatePost = async (req, res) => {
  const { id, title, content } = req.body;

  await handleFindById(id, res);

  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    content: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: error.details.map((elem) => elem.message),
    });
  }

  try {
    await DB.query("UPDATE posts set title = ? , content = ? where id = ?", [
      title,
      content,
      id,
    ]);
    return res.status(200).json({
      message: "Updated Successfully",
      data: req.body,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Database Error",
      errors: err.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await handleFindById(req.params.id, res);
    await DB.query("DELETE FROM posts WHERE id = ?", [req.params.id]);
    return res.json({
      message: "Deleted Successfully",
      id: post.id,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Database Error",
      error: err.message,
    });
  }
};

// UTILS
const handleFindById = async (postId, res) => {
  const [rows] = await DB.query("SELECT * from posts where id = ?", [postId]);
  if (!rows[0]["id"]) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  return rows[0];
};

module.exports = {
  getAllPosts,
  getPostById,
  deletePost,
  createPost,
  updatePost,
};
