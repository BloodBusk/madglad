import { mongoose } from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
});

const profileSchema = new Schema({
  isRestaurant: Boolean,
  isVerified: Boolean,
  profileImg: String,
  socialMedia: Array,
  followers: Array,
  following: Array,
  tags: Array,
  menuImg: String,
  bookingLink: String,
  Geolocation: String,
  userId: {type:Schema.Types.ObjectId, ref:"User"}
},{
  timestamps: true,
});

const postSchema = new Schema({
  title: String,
  postImg: String,
  tags: Array,
  restaurantName: String,
  review: String,
  postVideo: String,
  Geolocation: String,
  rating: String,
  likes: Number,
  profileId: {type:Schema.Types.ObjectId, ref:"Profile"}
},{
  timestamps: true,
});

export const models = [
  {
    name: "User",
    schema: userSchema,
    collection: "user",
  },
  {
    name: "Profile",
    schema: profileSchema,
    collection: "profile",
  },
  {
    name: "Post",
    schema: postSchema,
    collection: "post",
  }
];