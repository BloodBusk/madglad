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
  const fileUploadHandler = unstable_createFileUploadHandler({
    avoidFileConflicts: true,
    maxPartSize: 5_000_000,
    directory: "./public/uploads",
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

export default function UploadImg() {
  return (
    <>
      <Form method="post" encType="multipart/form-data">
        <input type="file" name="upload" />
        <button type="submit">upload</button>
      </Form>
    </>
  );
}
