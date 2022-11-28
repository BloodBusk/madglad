import React, { useState } from "react";
import {
  redirect,
  json,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { requireUserSession } from "~/session.server.js";
import connectDb from "~/db/connectDb.server.js";
import { findProfileByUser, findAllRestaurants } from "~/db/dbF";

export async function loader({ request }) {
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  const db = await connectDb();
  const restaurants = await findAllRestaurants(db);
  const profile = await findProfileByUser(db, userId);
  return { restaurants, profile };
}

export async function action({ request }) {
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  const clonedData = request.clone();
  const form = await clonedData.formData();
  const db = await connectDb();
  const profile = await findProfileByUser(db, userId);

  let { _action, ...values } = Object.fromEntries(form);

  //form  variables
  let title = form.get("title");
  let tags = form.getAll("tags");
  let restaurantName = form.get("restaurantName");
  let review = form.get("review");
  let rating = form.get("rating");

  const restaurantProfile = await db.models.Profile.findOne({
    username: restaurantName,
  });

  //file handling variables
  const fileUploadHandler = unstable_createFileUploadHandler({
    avoidFileConflicts: true,
    maxPartSize: 5_000_000,
    directory: "./public/uploads/postPics",
    file: ({ filename }) => filename,
  });
  const formData = await unstable_parseMultipartFormData(
    request,
    fileUploadHandler
  );
  const pathName = formData.get("upload").filepath;
  const pathSearch = pathName.search("uploads");
  const pathString = pathName.slice(pathSearch - 1);

  //error handling
  //   const formErrors = {
  //     fullName: validateEmptyField(),
  //     bio: validateEmptyField(),
  //     tags: validateEmptyField(),
  //   };
  //   if (Object.values(formErrors).some(Boolean)) {
  //     return { formErrors };
  //   }

  if (_action === "createPost") {
    try {
      const newPost = await db.models.Post.create({
        title: title,
        postImg: pathString,
        tags: tags,
        restaurantName: restaurantName,
        review: review,
        geolocation: "",
        rating: rating,
        likes: [],
        comments: [],
        restaurantId: restaurantProfile?._id,
        profileId: profile?._id,
      });
      newPost.set("timestamps", true);
      return redirect("/");
    } catch (err) {
      return json({ errorMessage: "error happened" });
    }                     
  }
}

export default function CreatePost() {
  const { restaurants, profile } = useLoaderData();
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState([]);
  const [inputText, setInputText] = useState("");
  const actionData = useActionData();
       //search handler for restaurant
  let inputHandler = (e) => {
    let lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  //filtering data to see a match for restaurants
  const filteredData = restaurants?.filter((rest) => {
    if (inputText === "") {
      return rest;
    } else {
      return rest.username.toLowerCase().includes(inputText);
    }
  });

  const saveInput = (e) => {
    setInput(e.target.value);
  };

  const addToArray = () => {
    setTags((prevTags) => [...prevTags, input]);
  };
  return (
    <div>
      <Form method="post" encType="multipart/form-data">
        <input type="text" name="title" placeholder="title..."></input>
        {/* todo geolocation */}
        <input
          type="text"
          name="restaurantName"
          placeholder="restaurant name..."
          list="restaurantList"
          onChange={inputHandler}
        />
        <datalist id="restaurantList">
          {filteredData?.map((fd, i) => {
            return <option key={i}>{fd.username}</option>;
          })}
        </datalist>

        <input type="file" name="upload" />

        <input type="text" placeholder="add tags..." onChange={saveInput} />
        <button type="button" onClick={addToArray}>
          Add Tag
        </button>
        {tags?.map((t, i) => {
          return <input key={i} type="text" name="tags" defaultValue={t} />;
        })}
        <textarea type="text" name="review" placeholder="review..." />
        <select name="rating">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button type="submit" name="_action" value="createPost">
          Create Post
        </button>
        {actionData?.errorMessage}
      </Form>
    </div>
  );
}
