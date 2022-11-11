import React from "react";
import Header from "./components/header.jsx";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { getLoggedUser, requireUserSession } from "~/session.server";
import connectDb from "~/db/connectDb.server";
import { redirect } from "@remix-run/node";
import style from "../styles/admin.css";
import mongoose, { Schema } from "mongoose";
import * as bcrypt from "bcryptjs";

export const links = () => [
  {
    rel: "stylesheet",
    href: style,
  },
];

export const loader = async ({ request }) => {
  const db = await connectDb();

  const user = await db.models.User.find();
  const profile = await db.models.Profile.find();
  const post = await db.models.Post.find();

  const userCount = await db.models.User.find().count();
  const profileCount = await db.models.Profile.find().count();
  const postCount = await db.models.Post.find().count();

  return { user, profile, post, userCount, profileCount, postCount };
};

export const action = async ({ request }) => {
  const userArr = [
    {
      _id: new mongoose.Types.ObjectId(),
      email: "qwe@qwe.com",
      username: "User 1",
      password: await bcrypt.hash("123", 10),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      email: "asd@asd.com",
      username: "User 2",
      password: await bcrypt.hash("123", 10),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      email: "zxc@zxc.com",
      username: "User 3",
      password: await bcrypt.hash("123", 10),
    },
  ];

  const profileArr = [
    {
      isRestaurant: false,
      isVerified: false,
      profileImg: "/uploads/gleek-5vHX_g2DggNe-jP3IUY7Fw (1).png",
      facebook: "https://www.facebook.com/thomas.busk.92",
      instagram: "https://www.instagram.com/",
      twitter: "https://twitter.com/Twisted_Chips/status/1589773764698701827",
      tiktok: "https://www.tiktok.com/foryou?is_copy_url=1&is_from_webapp=v1",
      followers: "",
      following: "",
      tags: [],
      menuImg: "",
      bookingLink: "",
      geolocation: "",
      userId: userArr[0]._id,
    },
    {
      isRestaurant: false,
      isVerified: false,
      profileImg: "",
      facebook: "",
      instagram: "",
      twitter: "",
      tiktok: "",
      followers: "",
      following: "",
      tags: [],
      menuImg: "",
      bookingLink: "",
      geolocation: "",
      userId: userArr[1]._id,
    },
    {
      isRestaurant: false,
      isVerified: false,
      profileImg: "",
      facebook: "",
      instagram: "",
      twitter: "",
      tiktok: "",
      followers: "",
      following: "",
      tags: [],
      menuImg: "",
      bookingLink: "",
      geolocation: "",
      userId: userArr[2]._id,
    },
  ];

  const postArr = [
    {
      title: "title 1",
      postImg: "/uploads/testImg.jpg",
      tags: [],
      restaurantName: "",
      review: "",
      postVideo: "",
      geolocation: "",
      rating: 3,
      likes: 0,
      profileId: userArr[0]._id,
    },
    {
      title: "title 2",
      postImg: "/uploads/testImg.jpg",
      tags: [],
      restaurantName: "",
      review: "",
      postVideo: "",
      geolocation: "",
      rating: 4,
      likes: 0,
      profileId: userArr[1]._id,
    },
    {
      title: "title 3",
      postImg: "/uploads/testImg.jpg",
      tags: [],
      restaurantName: "",
      review: "",
      postVideo: "",
      geolocation: "",
      rating: 2,
      likes: 0,
      profileId: userArr[2]._id,
    },
    {
      title: "title 4",
      postImg: "/uploads/testImg.jpg",
      tags: [],
      restaurantName: "",
      review: "",
      postVideo: "",
      geolocation: "",
      rating: 2,
      likes: 0,
      profileId: userArr[2]._id,
    },
  ];

  const db = await connectDb();
  let formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);

  let uid = formData.get("uid");

  if (_action === "deleteAll") {
    await db.models.User.deleteMany({});
    await db.models.Profile.deleteMany({});
    await db.models.Post.deleteMany({});
    return redirect("/admin");
  }
  if (_action === "deleteOne") {
    await db.models.User.deleteOne({ _id: uid });
    await db.models.Profile.deleteOne({ userId: uid });
    await db.models.Post.deleteMany({ userId: uid });
    return uid;
  }
  if (_action === "repopulate") {
    await db.models.User.insertMany(userArr);
    await db.models.Profile.insertMany(profileArr);
    await db.models.Post.insertMany(postArr);
    return redirect("/services/logout");
  }
};

export default function Admin() {
  const { user, profile, post, userCount, profileCount, postCount } =
    useLoaderData();
  return (
    <div>
      <h1>Admin</h1>
      <p>
        users: {userCount}, profiles: {profileCount}, posts: {postCount}{" "}
      </p>
      <div className="adminUserContainer">
        {user.map((u) => {
          return (
            <div key={u._id}>
              <p>{u.username}</p>
              <Form method="post">
                <input
                  type="text"
                  readOnly={true}
                  name="uid"
                  defaultValue={u._id}
                />
                <button type="submit" name="_action" value="deleteOne">
                  Delete this
                </button>
              </Form>
            </div>
          );
        })}
      </div>
      <div>
        <Form method="post">
          <button type="submit" name="_action" value="deleteAll">
            Delete All
          </button>
          <button type="submit" name="_action" value="repopulate">
            Repopulate
          </button>
        </Form>
      </div>
    </div>
  );
}
