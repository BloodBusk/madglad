import { Link } from "@remix-run/react";


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
        <Link to="/services/logout">Logout</Link>
        <img
          src={profile ? profile.profileImg : ""}
          alt="profile img"
          className="headerProfileImg"
        />
      </div>
    </>
  );
}
