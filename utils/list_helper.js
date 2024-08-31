const lodash = require("lodash");

const dummy = (blogs) => {
  const test = blogs;
  return 1;
};

const totalLikes = (blogs) => {
  console.log("BLOGS:", blogs);
  const totalLikes = blogs.reduce(
    (accumulator, currentValue) => accumulator + currentValue.likes,
    0,
  );
  return totalLikes;
};

const favouriteBlog = (blogs) => {
  const maxId = blogs.reduce(
    (maxId, currentValue, currentId, arr) =>
      currentValue.likes > arr[maxId].likes ? currentId : maxId,
    0,
  );
  return blogs[maxId];
};

const mostBlogs = (blogs) => {
  const grouped = lodash.groupBy(blogs, "author");
  console.log(grouped);
  const final = lodash.mapValues(grouped, (value) => (value = value.length));
  console.log("FINAL", final);
  const pairs = lodash.toPairs(final);
  console.log("paris: ", pairs);
  const maxPair = lodash.maxBy(pairs, ([key, value]) => value);
  console.log("Maxpair: ", maxPair);
  return { author: maxPair[0], blogs: maxPair[1] };
};

const mostLikes = (blogs) => {
  const grouped = lodash.groupBy(blogs, "author");
  const final = lodash.mapValues(grouped, (value) =>
    lodash.sumBy(value, (value) => value.likes),
  );
  console.log("likes final", final);
  const pairs = lodash.toPairs(final);
  const maxPair = lodash.maxBy(pairs, ([key, value]) => value);
  return { author: maxPair[0], blogs: maxPair[1] };
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
