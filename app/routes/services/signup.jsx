import { redirect, json, createCookie } from "@remix-run/node";
import { useLoaderData, useActionData, Form, Link } from "@remix-run/react";
import { setSession, setCookieSecret } from "~/session.server.js";
import * as bcrypt from "bcryptjs";
import connectDb from "~/db/connectDb.server.js";
import {
  validateEmptyField,
  validateRepeatPassword,
} from "../services/validate.jsx";
import { useState } from "react";

//components
import Header from "~/routes/components/header.jsx";

//css
import style from "~/styles/login_signup.css";

export const links = () => [
  {
    rel: "stylesheet",
    href: style,
  },
];

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
  const isRestaurant = form.get("isRestaurant");

  //user variable
  const users = await db.models.User.findOne({ email: email });

  //form error handling
  const formErrors = {
    email: validateEmptyField(email, "Email"),
    password: validateEmptyField(password, "Password"),
    repeatPwd: validateRepeatPassword(password, repeatPwd),
  };

  try {
    if (Object.values(formErrors).some(Boolean)) {
      return { formErrors };
    }
    //creates user
    const newUser = await db.models.User.create({
      email: email,
      password: hashPassword,
    });
    newUser.set("timestamps", true);

    // creates user profile
    await db.models.Profile.create({
      username: username,
      isRestaurant: isRestaurant,
      isVerified: false,
      profileImg: "",
      facebook: "",
      instagram: "",
      twitter: "",
      tiktok: "",
      followers: [],
      following: [],
      tags: [],
      menuImg: "",
      bookingLink: "",
      geolocation: "",
      userId: newUser._id,
    });
  } catch (err) {
    return json({ userAlreadyExists: "User Already Exists " });
  }

  if (users) {
    return setSession(request, users._id);
  } else {
    return redirect("/services/login");
  }
};

export default function Signup() {
  const actionData = useActionData();
  const [userType, setUserType] = useState("");

  const handleUserType = (e) => {
    setUserType(e.target.value);
  };
  return (
    <>
    <Header />
      <div className="logUserContainer">
        <div className="circleBackground">
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
        {userType !== "" ? (
          <Form method="post" className="logUserForm">
            <h1>Signup</h1>
            <h2>{userType}</h2>
            <label>{userType} Name</label>
            <input type="username" name="username" />
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
            <h4>Already Have An Account?</h4>
            <Link to="/services/login">Login</Link>
            <p>{actionData?.userAlreadyExists}</p>
            <p>{actionData?.userNotFound}</p>
            {/* hidden variable to keep track of is restaurant or not, tracked in a usestate */}
            <input
              type="hidden"
              name="isRestaurant"
              defaultValue={userType == "User" ? false : true}
            ></input>
          </Form>
        ) : (
          <div className="userTypeContainer">
            <button type="button" onClick={handleUserType} value="User">
              User
            </button>
            <button type="button" onClick={handleUserType} value="Restaurant">
              Restaurant
            </button>
          </div>
        )}
      </div>
    </>
  );
}
