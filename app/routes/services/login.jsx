import { setSession, setCookieSecret } from "~/session.server.js";
import * as bcrypt from "bcryptjs";
import {  json } from "@remix-run/node";
import { useActionData, Form, Link } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import {
  validateEmptyField
} from "../services/validate.jsx";

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
  const email = form.get("email");
  const password = form.get("password");

  //form error handling
  const formErrors = {
    email: validateEmptyField(email, "Email"),
    password: validateEmptyField(password, "Password"),
  };
  if (Object.values(formErrors).some(Boolean)) {
    return { formErrors };
  }

  //logs user in
  const users = await db.models.User.findOne({ email: email });
  if (users) {
    const isCorrectPassword = await bcrypt.compare(password, users.password);
    if (isCorrectPassword) {
      return setSession(request, users._id);
    } else {
      return json({ passwordErrorMessage: "Incorrect Password" });
    }
  } else {
    return json({ userErrorMessage: "User Not Found" });
  }




};

export default function Login() {
  const actionData = useActionData();
  return (
    <>
      <div className="logUserContainer">
        <Form method="post">
          <h1>Login</h1>
          <label>Email</label>
          <input type="email" name="email" />
          <p>{actionData?.formErrors?.email}</p>
          <label>Password</label>
          <input type="password" name="password" />
          <p>{actionData?.formErrors?.password}</p>
          <button type="submit" name="login">
            Login
          </button>
          <Link to="/services/signup">Signup</Link>
          <p>{actionData?.passwordErrorMessage}</p>
          <p>{actionData?.userErrorMessage}</p>
        </Form>
      </div>
    </>
  );
}
