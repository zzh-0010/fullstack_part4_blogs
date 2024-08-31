//目前仅重写了post的待验证版本！！

const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");
//const Blog = require('../models/blog')
//const helper = require('./test_helper')
const assert = require("node:assert");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

let token;

/*beforeEach(async () => {
    await Blog.DeleteMany({})
    
    for(let blog of helper.inittialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})*/

test("blogs are return as json:", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

//创建博客的describe块
describe("About creating blogs:", () => {
  beforeEach(async () => {
    //初始化一篇blog
    await Blog.deleteMany({});

    const root = {
      username: "root",
      password: "sekret",
    };

    const rootBlog = new Blog({
      title: "Demo0",
      author: "NULL",
      url: "http://demo.root",
      likes: 0,
    });

    const response = await api.post("/api/login").send(root);

    token = response.body.token;
    console.log("token", response.body.token);

    await rootBlog.save();
  });

  test("Create new blog:", async () => {
    const blogTest = {
      title: "About Tests",
      author: "root",
      url: "http://itsATest.com/mine",
      likes: 1,
    };

    const blogsAtStart = await helper.blogsInDb();

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blogTest)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);
    assert(response.body.title.includes("About Tests"));
  });

  test("If there is no likes when posting, default it zero", async () => {
    const blogTest = {
      title: "No Likes",
      author: "who are you",
      url: "http://madhourse.com/youarenotinvited",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blogTest)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    const postOne = blogsAtEnd.filter((r) => r.title === "No Likes");
    console.log(postOne);

    assert.strictEqual(postOne[0].likes, 0);
  });

  test("No important part like title:", async () => {
    const blogTest = {
      title: "22",
      author: "who are you",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blogTest)
      .expect(400);
  });

  test("post without authorization", async () => {
    const blogTest = {
      title: "No auth",
      author: "root",
      url: "http://itsATest.com/mine",
      likes: 1,
    };
    const response = await api.post("/api/blogs").send(blogTest).expect(401);

    assert(response.body.error.includes("You need a token"));
  });
});

//验证是否有重复的id值
test("Each blog has an unique id:", async () => {
  const blogsAtStart = await helper.blogsInDb();

  const ids = blogsAtStart.map((r) => r.id);

  const hasDulplicates = (array) => {
    return array.some((element, index) => array.indexOf(element) !== index);
  };

  assert.strictEqual(hasDulplicates(ids), false);
});

describe("delete a blog", () => {
  test("deleting blog", async () => {
    const id = "66b4705e257b5ef127819998";

    await api.delete(`/api/blogs/${id}`).expect(204);

    const response = await api.get("/api/blogs");

    assert.strictEqual(
      response.body.find((r) => r.id === id),
      undefined,
    );
  });
});

describe("update a blog", () => {
  test("updating blog", async () => {
    const id = "66b2dcb9a7ae11ddbb9bc3a1";
    const newBlog = {
      likes: 1000,
    };

    const updatedBlog = await api.put(`/api/blogs/${id}`).send(newBlog);
    console.log("UPDATEDBLOG", updatedBlog.body);
    assert.strictEqual(updatedBlog.body.likes, 1000);
  });
});

after(async () => {
  await mongoose.connection.close();
});
