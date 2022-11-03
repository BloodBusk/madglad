import { mongoose } from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
});

const profileSchema = new Schema({
  fullName: String,
  bio: String,
  tags: Array,
  image: String,
  loginId: {type:Schema.Types.ObjectId, ref:"Login"}  //if login can have more than 1 profile use this ... [{type: Schema.Types.ObjectId, ref: "Login"}]
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
  }
];