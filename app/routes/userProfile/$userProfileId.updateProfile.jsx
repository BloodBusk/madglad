import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
  redirect,
  json,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getLoggedUser, requireUserSession } from "~/session.server";
import connectDb from "~/db/connectDb.server";
import { findUserById, findProfileByUser } from "~/db/dbF";

//img imports
import facebook from "~/imgs/facebook-f.svg";
import instagram from "~/imgs/instagram.svg";
import twitter from "~/imgs/twitter.svg";
import tiktok from "~/imgs/tiktok.svg";

//components
import Header from "~/routes/components/header.jsx";
import FooterNav from "~/routes/components/footerNav.jsx";

//style
import style from "~/styles/updateProfile.css";

export const links = () => [
  {
    rel: "stylesheet",
    href: style,
  },
];

export async function loader({ request }) {
  await requireUserSession(request);
  const userId = await getLoggedUser(request);
  const db = await connectDb();
  const user = await findUserById(db, userId);
  const profile = await findProfileByUser(db, user);
  return { profile, user };
}

export async function action({ request }) {
  const db = await connectDb();
  const session = await requireUserSession(request);
  const userId = session.get("userId");

  //img update
  const fileUploadHandler = unstable_createFileUploadHandler({
    avoidFileConflicts: true,
    maxPartSize: 5_000_000,
    directory: "./public/uploads/profilePics",
    file: ({ filename }) => filename,
  });
  const formData = await unstable_parseMultipartFormData(
    request,
    fileUploadHandler
  );
  const pathName = formData.get("upload").filepath;
  const pathSearch = pathName.search("uploads");
  const pathString = pathName.slice(pathSearch - 1);

  try {
    await db.models.Profile.updateOne(
      { userId: userId },
      {
        $set: {
          profileImg: pathString,
        },
      }
    );

    return redirect(`/userProfile/${userId}`);
  } catch (err) {
    return json(err.errors, { status: 400 });
  }
}

export default function UpdateProfile() {
  const { profile, user } = useLoaderData();
  return (
    <>
      <Header profile={profile} />
      <Form method="post" encType="multipart/form-data" className="updateProfileForm">
        <input type="file" name="upload" />
        <img src={facebook} alt="facebook img" className="updateProfileIcon" />
        <input
          type="text"
          name="facebook"
          placeholder="place your facebook link here..."
        />
        <img src={instagram} alt="facebook img" className="updateProfileIcon" />
        <input
          type="text"
          name="instagram"
          placeholder="place your instagram link here..."
        />
        <img src={twitter} alt="facebook img" className="updateProfileIcon" />
        <input
          type="text"
          name="twitter"
          placeholder="place your twitter link here..."
        />
        <img src={tiktok} alt="facebook img" className="updateProfileIcon" />
        <input
          type="text"
          name="tiktok"
          placeholder="place your tiktok link here..."
        />
        <button type="submit">Update</button>
      </Form>
      <FooterNav user={user._id} />
    </>
  );
}
