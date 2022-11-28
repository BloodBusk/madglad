import React, { useState } from "react";
import { redirect, json, createCookie } from "@remix-run/node";
import { useLoaderData, useActionData, Form, Link } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { getLoggedUser, requireUserSession } from "~/session.server";
import { findAllPosts, findUserById, findProfileByUser } from "~/db/dbF";
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

export const loader = async ({request}) => {
  await requireUserSession(request);
  const userId = await getLoggedUser(request);
  const db = await connectDb();
  const user = await findUserById(db, userId);
  const profile = await findProfileByUser(db, user);
  const posts = await findAllPosts(db);
  return {posts, profile, user};
};

export default function Search() {
  const {posts, profile, user} = useLoaderData();
  const [inputText, setInputText] = useState("");

  let inputHandler = (e) => {
    let lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  const filteredData = posts.filter((p) => {
    if (inputText === "") {
      return p;
    } else {
      return p.title.toLowerCase().includes(inputText);
    }
  });

  return (
    <>
      <Header profile={profile} />

      <div className="searchField">
        <input
          label="Search"
          placeholder="Search posts..."
          onChange={inputHandler}
        />
      </div>
      <div className="searchImgContainer">
        {filteredData.map((p) => {
          return (
            <Link key={p._id} to={`/posts/${p._id}`} className="searchLinks">
              <img src={p.postImg} alt="post" className="searchImgs" />
            </Link>
          );
        })}
      </div>
      <FooterNav user={user._id} />
    </>
  );
}
