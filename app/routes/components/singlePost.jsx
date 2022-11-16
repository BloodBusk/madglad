import React, { useState } from "react";
import { Link, Links } from "@remix-run/react";
import LikeRegular from "~/imgs/like-regular.svg";
import LikeSolid from "~/imgs/like-solid.svg";
import Comment from "~/imgs/comment.svg";

export default function SinglePost({ post }) {
  const [countComments, setCountComments] = useState(post.comments.length);

  return (
    <div className="singlePostContainer">
      <div className="singlePostHeader">
        <Link
          to={`/profiles/${post.profileId._id}`}
          className="singlePostHeaderLink"
        >
          <img
            src={post.profileId.profileImg}
            alt="profile img"
            className="profileImgHeader"
          />
          <h4>{post.profileId.username}</h4>
        </Link>
        <h5>{post.restaurantName}</h5>
      </div>
      <h3> {post.title} </h3>
      <Link to={`/posts/${post._id}`}>
        <img className="postImg" src={post.postImg} alt="posts img" />
      </Link>
      <div className="singlePostIconContainer">
        <img src={LikeRegular} alt="like icon" className="postIcons" />
        <p>{post.likes}</p>
        <img src={Comment} alt="comment icon" className="postIcons" />
        <p>{countComments}</p>
      </div>
      <p>{post.review}</p>
      <div className="postDivider"></div>
    </div>
  );
}
