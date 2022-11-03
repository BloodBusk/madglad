import { redirect, json, createCookie } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { setSession, setCookieSecret } from "~/session.server.js";
import * as bcrypt from "bcryptjs";
import connectDb from "~/db/connectDb.server.js";
import { validateEmptyField, validateRepeatPassword, validateUserAlreadyExists } from "../services/validate.jsx";

// export const links = () => [
//   {
//     rel: "stylesheet",
//     href: style,
//   },
// ];

export const loader = async ({ request }) => {
  return setCookieSecret(request); //return session userId
};

export const action = async ({ request }) => {
  const db = await connectDb();
  //form variables
  const form = await request.formData();
  const username = form.get("username");
  const email = form.get("email");
  const password = form.get("password");
  const repeatPwd = form.get("repeatPwd");
  const hashPassword = await bcrypt.hash(password, 10);

  //user variable
  const users = await db.models.User.findOne({ email: email });

  //form error handling
  const formErrors = {
    username: validateEmptyField(username, "Username"),
    email: validateEmptyField(email, "Email"),
    password: validateEmptyField(password, "Password"),
    repeatPwd: validateRepeatPassword(password, repeatPwd),
    userAlreadyExists: validateUserAlreadyExists(email, users.email),
  };
  if (Object.values(formErrors).some(Boolean)) {
    return { formErrors };
  }

  //creates user
  const newUser = await db.models.User.create({
    username: username,
    email: email,
    password: hashPassword,
  });
  newUser.set("timestamps", true);

  

  if (users) {
    return setSession(request, users._id);
  } else {
    return json({ findUserErrorMessage: "user not found" });
  }
};

export default function Signup() {
  const actionData = useActionData();
  return (
    <>
      <div>
        <Form method="post">
          <h1>Signup</h1>
          <label>Username</label>
          <input type="text" name="username" />
          <p>{actionData?.formErrors?.username}</p>
          <label>Email</label>
          <input type="email" name="email" />
          <p>{actionData?.formErrors?.email}</p>
          <label>Password</label>
          <input type="password" name="password" />
          <p>{actionData?.formErrors?.password}</p>
          <label>Repeat Password</label>
          <input type="password" name="repeatPwd" />
          <p>{actionData?.formErrors?.repeatPwd}</p>
          <button type="submit" name="signup">
            Signup
          </button>
          <p>{actionData?.formErrors?.userAlreadyExists}</p>
        </Form>
      </div>
    </>
  );
}
