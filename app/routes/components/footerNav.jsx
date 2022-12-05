import { Link } from "@remix-run/react";

//imgs
import add from "~/imgs/add.svg";
import search from "~/imgs/search.svg";
import profile from "~/imgs/profile.svg";

export default function footerNav({user}) {
  return (
    <div className="footer">
      <Link to={`/userProfile/${user}`}><img src={profile} alt="" className="footerImg" /></Link>
      <Link to={`/userProfile/${user}/createPost`}><img src={add} alt="" className="footerImg2" /></Link>
      <Link to="/services/search"><img src={search} alt="" className="footerImg" /></Link>
    </div>
  );
}