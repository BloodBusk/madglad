import React, { useState } from "react";
import { redirect, json, createCookie } from "@remix-run/node";
import { useLoaderData, useActionData, Form, Link } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { findAllPosts } from "~/db/dbF";
import style from "~/styles/search.css";

export const links = () => [
    {
      rel: "stylesheet",
      href: style,
    },
  ];

export const loader = async () => {
  const db = await connectDb();
  const posts = await findAllPosts(db);
  return posts;
};

export const action = async () => {
  return null;
};

export default function Search() {
  const posts = useLoaderData();
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
            <Link key={p._id} to={`/posts/${p._id}`} className="searchLinks" >
              <img src={p.postImg} alt="post" className="searchImgs" />
            </Link>
          );
        })}
      </div>
    </>
  );
}
