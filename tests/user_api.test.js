//HEI我们正在进行P4的最终自动化测试，写完了的话就在下面标注一下吧！
//已经完成！

const { test, describe, after, beforeEach } = require("node:test");
const supertest = require("supertest");
const mongoose = require("mongoose");
const assert = require("node:assert");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

describe("Create users tests: ", () => {
  //首先初始化一个root用户
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });
  test("Creation succeeds with fresh username", async () => {
    const userAtStart = await helper.usersInDb();
    const userTest = {
      username: "QiQi",
      name: "Maiqi Jiao",
      password: "swimtohome",
    };

    await api
      .post("/api/users")
      .send(userTest)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const userAtEnd = await helper.usersInDb();
    assert.strictEqual(userAtEnd.length, userAtStart.length + 1);

    const usernames = userAtEnd.map((u) => u.username);
    assert(usernames.includes(userTest.username));
  });

  test("too short username", async () => {
    const userAtStart = await helper.usersInDb();

    const userTest = {
      username: "a",
      name: "aa",
      password: "wildestdreams",
    };

    const response = await api.post("/api/users").send(userTest).expect(400);
    console.log("response: ", response.body);

    const userAtEnd = await helper.usersInDb();

    assert.strictEqual(userAtEnd.length, userAtStart.length);
    assert(response.body.error.includes("malformatted userInfo"));
  });

  test("No username", async () => {
    const userAtStart = await helper.usersInDb();

    const userTest = {
      name: "aa",
      password: "wildestdreams",
    };
    const response = await api.post("/api/users").send(userTest).expect(400);

    const userAtEnd = await helper.usersInDb();

    assert.strictEqual(userAtEnd.length, userAtStart.length);
    assert(response.body.error.includes("malformatted userInfo"));
  });

  test("too short password", async () => {
    const userAtStart = await helper.usersInDb();
    const userTest = {
      usernmae: "taytay",
      name: "aa",
      password: "ME",
    };
    const response = await api.post("/api/users").send(userTest).expect(400);
    console.log("response: ", response.body);

    const userAtEnd = await helper.usersInDb();

    assert.strictEqual(userAtStart.length, userAtStart.length);
    assert(response.body.error.includes("invalid password"));
  });
});

after(async () => {
  await mongoose.connection.close();
  console.log("closed mongoose connection");
});
