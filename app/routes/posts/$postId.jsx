import { useLoaderData, Link, useActionData, Form } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import React, { useState } from "react";
import connectDb from "~/db/connectDb.server";
import { findPostById } from "~/db/dbF";

export async function loader({ params }) {
  const db = await connectDb();
  const post = await findPostById(db, params.postId);
  const postxProfile = await db.models.Post.findOne({
    _id: params.postId,
  })
    .populate("profileId")
    .populate("restaurantId");
  return postxProfile;
}

export async function action({ request, params }) {
  const db = await connectDb();
  const form = await request.formData();
  const comment = form.get("comment");

  try {
    await db.models.Post.updateOne(
      { _id: params.postId },
      {
        $push: {
          comments: comment,
        },
      }
    );
    return redirect(`/posts/${params.postId}`);
  } catch (err) {
    return json(
      { errormessage: err + "something went wrong" },
      { status: 400 }
    );
  }
}

export default function PostId() {
  const postxProfile = useLoaderData();
  const actionData = useActionData();
  const [commentSize, setCommentSize] = useState(3);

  const handleShowMore = () => {
    setCommentSize(commentSize + 3);
  };

  const handleShowLess = () => {
    setCommentSize(3);
  };

  return (
    <>
      <div>
        <img
          src={postxProfile.profileId?.profileImg}
          alt="profile img"
          className="profileImgHeader"
        />
        <h4>{postxProfile.profileId?.username}</h4>
      </div>
      <div>
        <Link
          to={
            postxProfile.restaurantId
              ? `/profiles/${postxProfile.restaurantId._id}`
              : ""
          }
        >
          {postxProfile?.restaurantName}{" "}
        </Link>
      </div>
      <div>
        <h2>{postxProfile?.title}</h2>
      </div>
      <div>
        <img src={postxProfile.postImg} alt="post pic" />
      </div>
      <div>
        <div>
          {postxProfile.tags?.map((tags, i) => {
            return <p key={i}>{tags}</p>;
          })}
          <p>{postxProfile?.review}</p>
        </div>
        <p>{/* geolocation todo */}</p>
      </div>
      <div>
        {postxProfile.restaurantId ? (
          <Link to={postxProfile.restaurantId.bookingLink}>Book Her</Link>
        ) : (
          ""
        )}
      </div>
      <div>
        {postxProfile.comments?.slice(0, commentSize).map((com, i) => {
          return <p key={i}>{com}</p>;
        })}
        <p onClick={handleShowMore}>show more comments</p>
        <p onClick={handleShowLess}>collapse comments</p>
      </div>
      <div>
        <Form method="post">
          <input type="text" name="comment" placeholder="kommentar..." />
          <button type="submit">kommentar</button>
        </Form>
      </div>
      {actionData?.errormessage}
    </>
  );
}
