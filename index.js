import {
  createPost,
  createProfile,
  _deleteAll,
  getFriends,
  likePost,
  mkFriends,
  postFeed,
} from "./examples.js";

async function main() {
  const userId1 = await createProfile("Bob", "bob@gmail.com")
    .then((user) => user.id)
    .catch((err) => console.error("unable to create user #1: ", err.message));
  const userId2 = await createProfile("James", "james@gmail.com")
    .then((user) => user.id)
    .catch((err) => console.error("unable to create user #2: ", err.message));
  const userId3 = await createProfile("George", "george@gmail.com")
    .then((user) => user.id)
    .catch((err) => console.error("unable to create user #3: ", err.message));

  const post1Id = await createPost({
    userId: userId3,
    title: "New Post #1",
    description: "Some description",
  })
    .then((p) => p.id)
    .catch((err) => console.error("unable to create post #1: ", err.message));

  await createPost({
    userId: userId2,
    title: "New Post #2",
    description: "Some description",
  })
    .then((p) => p.id)
    .catch((err) => console.error("unable to create post #2: ", err.message));

  await createPost({
    userId: userId2,
    title: "New Post #3",
    description: "Some description",
  })
    .then((p) => p.id)
    .catch((err) => console.error("unable to create post #2: ", err.message));
  await createPost({
    userId: userId2,
    title: "New Post #4",
    description: "Some description",
  })
    .then((p) => p.id)
    .catch((err) => console.error("unable to create post #2: ", err.message));
  await createPost({
    userId: userId2,
    title: "New Post #5",
    description: "Some description",
  })
    .then((p) => p.id)
    .catch((err) => console.error("unable to create post #2: ", err.message));
  await createPost({
    userId: userId2,
    title: "New Post #6",
    description: "Some description",
  })
    .then((p) => p.id)
    .catch((err) => console.error("unable to create post #2: ", err.message));
  await createPost({
    userId: userId2,
    title: "New Post #7",
    description: "Some description",
  })
    .then((p) => p.id)
    .catch((err) => console.error("unable to create post #2: ", err.message));

  await mkFriends(userId1, userId2);
  await mkFriends(userId1, userId3);

  await likePost(post1Id);
  await likePost(post1Id);
  await likePost(post1Id);
  await likePost(post1Id);
  await likePost(post1Id);
  await likePost(post1Id);

  const friends = await getFriends(userId1).catch(console.error);
  console.log(friends);

  await postFeed(userId1, 2)
    .then(console.log)
    .catch((err) =>
      console.error("unable to get posts of friends: ", err.message)
    );
}

_deleteAll().then(() =>
  main().then(async () => {
    await _deleteAll().catch((err) =>
      console.error("unable to wipe db: ", err.message)
    );
  })
);
