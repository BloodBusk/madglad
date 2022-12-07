import React, { useState } from "react";
import { redirect, json, createCookie } from "@remix-run/node";
import { useLoaderData, useActionData, Form, Link } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { getLoggedUser, requireUserSession } from "~/session.server";
import { findAllPosts, findUserById, findProfileByUser, findAllProfiles } from "~/db/dbF";
import style from "~/styles/search.css";

//components
import Header from "~/routes/components/header.jsx";
import FooterNav from "~/routes/components/footerNav.jsx";

export const links = () => [
  {
    rel: "stylesheet",
    href: style,
  },
];

export const loader = async ({ request }) => {
  await requireUserSession(request);
  const userId = await getLoggedUser(request);
  const db = await connectDb();
  const user = await findUserById(db, userId);
  const profile = await findProfileByUser(db, user);
  const posts = await findAllPosts(db);
  const allProfiles = await findAllProfiles(db);
  return { posts, profile, user, allProfiles };
};

export default function Search() {
  const { posts, profile, user, allProfiles } = useLoaderData();
  const [inputText, setInputText] = useState("");

  let inputHandler = (e) => {
    let lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  const filteredPostData = posts.filter((p) => {
    if (inputText === "") {
      return p;
    } else {
      return p.title.toLowerCase().includes(inputText);
    }
  });

  const filteredProfileData = allProfiles.filter((p) => {
    if (inputText === "") {
      return p;
    } else {
      return p.username.toLowerCase().includes(inputText);
    }
  });

  return (
    <>
      <Header profile={profile} />
      <div className="searchContainer">
        <div className="searchField">
          <input
            label="Search"
            placeholder="Søg efter post navn, bruger navn, restaurant navn..."
            onChange={inputHandler}
          />
        </div>
        <div className="searchImgContainer">
          {filteredPostData.map((p) => {
            return (
              <Link key={p._id} to={`/posts/${p._id}`} className="searchLinks">
                <img src={p.postImg} alt="post" className="searchImgs" />
                <h4>{p.title}</h4>
              </Link>
            );
          })}
        </div>
        <div className="searchImgContainer">
          {filteredProfileData.map((p) => {
            return (
              <Link key={p._id} to={`/profiles/${p._id}`} className="searchLinks">
                <img src={p.profileImg} alt="profile" className="searchImgs" />
                <h4>{p.username}</h4>
              </Link>
            );
          })}
        </div>
      </div>
      <FooterNav user={user._id} />
    </>
  );
}
