import React from "react";
import "./Banner.css";
import Card from "../Card";
// import GithubLogo from "../../assets/img/GitHub_Logo.png"
import GithubMark from "../../assets/img/GitHub-Mark/PNG/GitHub-Mark-120px-plus.png";
import LinkedInLogo from "../../assets/img/LinkedIn-Logos/In/Digital/Blue/1x/In-Blue-128.png";

import { connect } from "../../lib/userContext";

const Banner = (props) => {
  return (
    <>
      <a id="to-about"></a>
      <Card id="Banner">
        <img className="avatar" src={props.user.avatarUrl} />
        <div className="info">
          <h1 className="name">{props.user.name}</h1>
          {/* add padding after the name */}
          {/* <div className="subheading"> */}

          <h2 className="job-title">Full Stack Web Developer</h2>
          <a
            className="email"
            target="_blank"
            href={`mailto:${props.user.email}?subject=portfolio`}
          >
            {props.user.email}
          </a>
          <br />
          <a className="phone" href={`tel:4697764432`}>
            4697764432
          </a>
          <div className="links">
            {/* </div> */}
            <a
              className="github-link"
              href={props.user.html_url}
              target="_blank"
            >
              {/* attempt to use a image set */}
              <img id="github-logo" src={GithubMark} alt="github-logo" />
            </a>
            <a
              className="linkedin-link"
              href={`https://www.linkedin.com/in/${props.user.login}/`}
              target="_blank"
            >
              <img id="linkedin-logo" src={LinkedInLogo} alt="Linked In" />
            </a>
          </div>
        </div>
        {props.bio ? <p className="bio">{props.bio}</p> : null}
      </Card>
    </>
  );
};
export default connect(Banner);
