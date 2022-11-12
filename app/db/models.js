import { mongoose } from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String,
});

const profileSchema = new Schema({
  username: String,
  isRestaurant: Boolean,
  isVerified: Boolean,
  profileImg: String,
  facebook: String,
  instagram: String,
  twitter: String,
  tiktok: String,
  followers: Array,
  following: Array,
  tags: Array,
  menuImg: String,
  bookingLink: String,
  geolocation: String,
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
  geolocation: String,
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