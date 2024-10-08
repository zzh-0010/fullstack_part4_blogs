const testingRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require('../models/comment')

testingRouter.post("/reset", async (request, response) => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  await Comment.deleteMany({})

  response.status(204).end();
});

module.exports = testingRouter;
