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
import { findProfileByUser, findAllRestaurants, findUserById } from "~/db/dbF";
import { validateEmptyField } from "../services/validate.jsx";
import { MAPS_API_KEY } from "~/db/connectMaps.server";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

//imgs
import star from "~/imgs/star.svg";

//components
import Header from "~/routes/components/header.jsx";
import FooterNav from "~/routes/components/footerNav.jsx";

import style from "~/styles/createPost.css";

export const links = () => [
  {
    rel: "stylesheet",
    href: style,
  },
];

export async function loader({ request }) {
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  const db = await connectDb();
  const loggedProfile = await findProfileByUser(db, userId);
  const user = await findUserById(db, userId);
  const restaurants = await findAllRestaurants(db);
  const profile = await findProfileByUser(db, userId);
  return { restaurants, profile, loggedProfile, user, MAPS_API_KEY };
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
  let geolocation = form.get("geolocation");

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
  const upload = formData.get("upload");

  //form error handling
  const formErrors = {
    title: validateEmptyField(title, "title"),
    restaurantName: validateEmptyField(restaurantName, "restaurantName"),
  };
  if (Object.values(formErrors).some(Boolean)) {
    return { formErrors };
  }

  let pathString = "";
  //file path variables need to be handled if filepath is null
  if (upload == null) {
    pathString = "";
  } else {
    const pathName = upload.filepath;
    const pathSearch = pathName.search("uploads");
    pathString = pathName.slice(pathSearch - 1);
  }

  if (_action === "createPost") {
    try {
      const newPost = await db.models.Post.create({
        title: title,
        postImg: pathString,
        tags: tags,
        restaurantName: restaurantName,
        review: review,
        geolocation: geolocation,
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
  const { restaurants, profile, loggedProfile, user, MAPS_API_KEY } =
    useLoaderData();
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState([]);
  const [inputText, setInputText] = useState("");
  const [rating, setRating] = useState(1);
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

  const removeTagItem = (t) => {
    setTags(tags.filter((item, index) => item !== t));
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  //maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: MAPS_API_KEY,
    libraries: ["places"],
  });
  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <Header profile={loggedProfile} />
      <div className="createPostContainer">
        <Form
          method="post"
          encType="multipart/form-data"
          className="createPostForm"
        >
          <input type="text" name="title" placeholder="title..."></input>
          <p className="errorMessages">{actionData?.formErrors?.title}</p>
          <input
            type="text"
            name="restaurantName"
            placeholder="restaurant name..."
            list="restaurantList"
            onChange={inputHandler}
          />
          <p className="errorMessages">
            {actionData?.formErrors?.restaurantName}
          </p>
          <datalist id="restaurantList">
            {filteredData?.map((fd, i) => {
              return <option key={i}>{fd.username}</option>;
            })}
          </datalist>

          {/* todo geolocation */}
          <Autocomplete >
            <input
              type="text"
              name="geolocation"
              placeholder="restaurant address"
              className="geoAutocomplete"
            />
          </Autocomplete>

          <input type="file" name="upload" />
          <p className="errorMessages">{actionData?.formErrors?.upload}</p>
          <div className="createPostTag">
            <input
              type="text"
              placeholder="add tags..."
              list="tagList"
              onChange={saveInput}
            />
            <datalist id="tagList">
              <option value="3 Course Meal" />
              <option value="Brunch" />
              <option value="Breakfast" />
              <option value="Lunch" />
              <option value="Dinner" />
              <option value="Italian" />
              <option value="Danish" />
            </datalist>
            <button type="button" onClick={addToArray}>
              Add Tag
            </button>
          </div>
          <div className="addedTags">
            {tags?.map((t) => {
              return (
                <div key={t} className="tagsContainer">
                  <input type="text" name="tags" defaultValue={t} disabled />
                  <p onClick={() => removeTagItem(t)} className="tagsDelete">
                    x
                  </p>
                </div>
              );
            })}
          </div>
          <textarea type="text" name="review" placeholder="review..." />
          <label>Rate din oplevelse med maden</label>
          <select
            name="rating"
            onChange={handleRatingChange}
            className="createPostRating"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <div className="ratingStarContainer">
            {Array.from({ length: rating }, (_, i) => (
              <img key={i} src={star} alt="star" className="ratingStar" />
            ))}
          </div>
          <button
            type="submit"
            name="_action"
            value="createPost"
            className="createPostButton"
          >
            Create Post
          </button>
          <p className="errorMessages">{actionData?.errorMessage}</p>
          <p className="errorMessages">{actionData?.pathNameErrorMessage}</p>
        </Form>
      </div>
      <FooterNav user={user._id} />
    </>
  );
}
