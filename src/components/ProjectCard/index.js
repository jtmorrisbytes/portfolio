import React from "react";
import Card from "../Card";
import "./ProjectCard.css"
import PropTypes from "prop-types"
import request from "superagent"
// IDEA: Embed a live view of the project directly into the card
// 


const Button = (props) => {
    return (!props.url && !props.default) ? (<a type='button' rel="noopener noreferer"
        target={"_blank"} href={props.url || props.default }>{props.children}</a>)
    : <></>;
    
}

const ProjectCard = (props) => {
    const defaultProjectName = "Test Project";
    const defaultProjectPhotoUrl = "https://via.placeholder.com/800x450"
    const defaultProjectPhotoAltText = "A Default project placeholder photo"
    // const defualtProjectDescription = "Please check that this card initialized properly"




    const defaultLiveUrl = "#";
    const defaultSourceUrl = "https://www.github.com/jtmorrisbytes/";
    return <Card className="project-card">
        <h2 className="project-name">{props.displayName || props.name || defaultProjectName}</h2>
        <img className="project-photo"
             src={`https://github.com/${props.login}/${props.name}/blob/master/preview.gif?raw=true` || defaultProjectPhotoUrl}
             alt={props.photoAlt || defaultProjectPhotoAltText} />
        <p>{props.description}</p>
        <div className="source-links">
            <Button url={props.liveUrl}>Live View</Button>
            <Button url={`https://www.github.com/${props.login}/${props.name}`}>View Source</Button>
        </div>
    </Card>
}
ProjectCard.propTypes = {
    name: PropTypes.string.isRequired,
    photoUrl: PropTypes.string.isRequired,
    liveUrl:PropTypes.string.isRequired,
    sourceUrl:PropTypes.string.isRequired
    // cardType: PropTypes.oneOf(["codepen", "github"])
}
export default ProjectCard;