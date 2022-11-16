export const findUserById = async (db, userId) => {
  const user = db.models.User.findById(userId);
  return user;
};

export const findProfileByUser = async (db, user) => {
  const profile = db.models.Profile.findOne({ userId: user._id});
  return profile;
};

export const findPostsByUser = async (db, user) => {
  const posts = db.models.Post.find({ userId: user._id });
  return posts;
};

export const findPostsCountByUser = async (db, user) => {
  const posts = db.models.Post.find({userId: user._id}).count();
  return posts;
};

export const findAllPosts = async (db) => {
  const posts = db.models.Post.find();
  return posts;
};

export const findPostById = async (db, postId) => {
  const post = db.models.Post.findById(postId);
  return post;
};

export const findProfileById = async (db, profileId) => {
  const profile = db.models.Profile.findById(profileId);
  return profile;
};
