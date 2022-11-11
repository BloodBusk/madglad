import React, { useState } from "react";
import { redirect, json } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { requireUserSession } from "~/session.server.js";
import connectDb from "~/db/connectDb.server.js";
import { validateEmptyField } from "../services/validate.jsx";

export async function action({ request }) {
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  const form = await request.formData();
  const db = await connectDb();
  let { _action, ...values } = Object.fromEntries(form);

  //form  variables
  let title = form.get("title");
  let tags = form.getAll("tags");
  let restaurantName = form.get("restaurantName");
  let review = form.get("review");
  let rating = form.get("rating");

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
        postImg: "",
        tags: tags,
        restaurantName: restaurantName,
        review: review,
        postVideo: "",
        geolocation: "",
        rating: rating,
        likes: 0,
        userId: userId,
      });
      newPost.set("timestamps", true);
      return redirect("/");
    } catch (err) {
      return json({ errorMessage: "error happened" });
    }
  }
}

export default function CreatePost() {
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState([]);

  const saveInput = (e) => {
    setInput(e.target.value);
  };

  const addToArray = () => {
    setTags((prevTags) => [...prevTags, input]);
  };
  return (
    <div>
      <Form method="post">
        <input type="text" name="title" placeholder="title..."></input>
        {/* geolocation */}
        <input
          type="text"
          name="restaurantName"
          placeholder="restaurant name..."
        />
        <input type="text" placeholder="add tags..." onChange={saveInput} />
        <button type="button" onClick={addToArray}>Add Tag</button>
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
      </Form>
    </div>
  );
}
