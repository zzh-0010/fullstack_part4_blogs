const Blog = require("../models/blog");
const User = require("../models/user");

/*const initialBlogs = [
    {
        title: "Hi from Pecking University, Beijing",
        author: "thffffff",
        url: "http://PKUblog.com/thfff",
        likes: 13
    },
    {
        title: "Hi from LA, US",
        author: "Taylor Swift",
        url: "http://TaylorNation.com/imgonnagetyouback",
        likes: 133
    },
    {
        title: "Cruel Summer",
        author: "Taylor Swift",
        url: "http://TaylorNation.com/lover",
        likes: 10000
    }
  ]*/

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((u) => u.toJSON());
};

module.exports = {
  usersInDb,
  blogsInDb,
};
