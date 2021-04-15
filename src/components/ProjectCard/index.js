import React from "react";
import Card from "../Card";
import "./ProjectCard.css";
import PropTypes from "prop-types";
// import request from "superagent"
// IDEA: Embed a live view of the project directly into the card
//

const Button = (props) => {
  return !props.url && !props.default ? (
    <a
      type="button"
      rel="noopener noreferer"
      target={"_blank"}
      href={props.url || props.default}
    >
      {props.children}
    </a>
  ) : (
    <></>
  );
};

const ProjectCard = (props) => {
  const defaultProjectName = "Test Project";
  const defaultProjectPhotoUrl = "https://via.placeholder.com/800X600.png";
  const defaultProjectPhotoAltText = "Preview images coming soon!";
  // const defualtProjectDescription = "Please check that this card initialized properly"

  const defaultLiveUrl = "#";
  const defaultSourceUrl = "https://www.github.com/jtmorrisbytes/";
  return (
    <Card className="project-card">
      <h3 className="project-name">
        {props.displayName || props.name || defaultProjectName}
      </h3>
      {props.homepageUrl ? (
        <img
          className="project-photo"
          src={`${props.liveUrl}preview/preview-1200x630.png`}
          alt={props.photoAlt || defaultProjectPhotoAltText}
        />
      ) : (
        <img src={`https://via.placeholder.com/400x225.png?text=Placeholder}`} />
      )}

      <p>{props.description}</p>
      <div className="source-links">
        <Button url={props.homepageUrl}>Live View</Button>
        <Button url={props.url}>
          View Source
        </Button>
      </div>
    </Card>
  );
};
ProjectCard.propTypes = {
  name: PropTypes.string.isRequired,
  photoUrl: PropTypes.string.isRequired,
  homepageUrl: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  // cardType: PropTypes.oneOf(["codepen", "github"])
};
export default ProjectCard;
