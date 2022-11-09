export const findUserById = async (db, userId) => {
  const user = db.models.User.findById(userId);
  return user;
};

export const findProfileByUser = async (db, user) => {
  const profile = db.models.Profile.findOne({ userId: user._id });
  return profile;
};
