export const findUserById = async (db, userId) => {
  const user = db.models.User.findById(userId);
  return user;
};

export const findProfileByUser = async (db, user) => {
  const profile = db.models.Profile.findOne({ userId: user});
  return profile;
};

export const findPostsByProfile = async (db, profile) => {
  const posts = db.models.Post.find({ profileId: profile._id });
  return posts;
};

export const findPostsCountByProfile = async (db, profile) => {
  const posts = db.models.Post.find({profileId: profile._id}).count();
  return posts;
};


export const findAllPosts = async (db) => {
  const posts = db.models.Post.find();
  return posts;
};

export const findAllProfiles = async (db) => {
  const profile = db.models.Profile.find();
  return profile;
};

export const findAllRestaurants = async (db) => {
  const restaurants = db.models.Profile.find({isRestaurant: true});
  return restaurants;
}

export const findPostById = async (db, postId) => {
  const post = db.models.Post.findById(postId);
  return post;
};

export const findProfileById = async (db, profileId) => {
  const profile = db.models.Profile.findById(profileId);
  return profile;
};
