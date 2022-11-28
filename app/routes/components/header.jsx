import { Link } from "@remix-run/react";
import defaultProfile from "~/imgs/user.png";

export default function Header({ profile }) {
  return (
    <>
      <div className="header">
        <h1>
          <Link to="/" className="logo">
            <span className="logoMad">Mad</span>
            <span className="logoGlad">Glad</span>
          </Link>
        </h1>
        <img
          src={profile.profileImg != "" ? profile.profileImg : defaultProfile}
          alt="profile img"
          className="headerProfileImg"
        />
      </div>
    </>
  );
}
