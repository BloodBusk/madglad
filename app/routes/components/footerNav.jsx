import { Link } from "@remix-run/react";

//imgs
import add from "~/imgs/add.svg";
import search from "~/imgs/search.svg";
import profile from "~/imgs/profile.svg";
import defaultProfile from "~/imgs/user.png";
import home from "~/imgs/home.svg";

export default function footerNav({ user, userProfile }) {
  return (
    <div className="footer">
      <Link to={`/userProfile/${user}`}>
        <img
          src={
            userProfile.profileImg != ""
              ? userProfile.profileImg
              : defaultProfile
          }
          alt=""
          className="headerProfileImg"
        />
      </Link>
      <Link to={`/userProfile/${user}/createPost`}>
        <img src={add} alt="" className="footerImg" />
      </Link>
      <Link to="/">
        <img src={home} alt="" className="footerImg" />{" "}
      </Link>
      <Link to="/services/search">
        <img src={search} alt="" className="footerImg" />
      </Link>
    </div>
  );
}
