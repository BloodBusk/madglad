import SinglePost from "~/routes/components/singlePost.jsx";
import { redirect, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getLoggedUser, requireUserSession } from "~/session.server";
import connectDb from "~/db/connectDb.server";
import { findUserById, findProfileByUser, findAllPosts } from "~/db/dbF";

//css
import style from "~/styles/home.css";

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
  const postXProfile = await db.models.Post.find().sort({createdAt: -1})
    .populate("profileId")
    .populate("restaurantId");
  return { profile, user, postXProfile };
};

export const action = async ({ request }) => {
  const db = await connectDb();
  const form = await request.formData();
  const userId = await getLoggedUser(request);

  //increment likes for post
  const postId = form.get("hiddenPostId");
  try {
    await db.models.Post.updateOne(
      {
        _id: postId,
      },
      {
        $addToSet: {
          likes: userId,
        },
      }
    );
    return null;
  } catch (err) {
    return json(err.errors, { status: 400 });
  }
};

export default function Index() {
  const { profile, user, postXProfile } = useLoaderData();

  return (
    <>
    {<Header />}
      <div className="home">
        {postXProfile?.map((post) => {
          return (
            <div key={post._id}>
              <SinglePost post={post} />
            </div>
          );
        })}
      </div>
      <FooterNav user={user._id} userProfile={profile} />
    </>
  );
}
