import React, { useState, useEffect } from "react";

import Axios from "axios";

import Card from "../Card";
import ProjectCard from "../ProjectCard"
import "./Projects.css";

function fetchRepositiories(itemsPerPage = 10, cursor) {
  return Axios.get(`/api/data?first=${itemsPerPage}${cursor ? cursor : ""}`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      console.error(e);
      return [];
    });
}

function renderProjects(array) {
  if (array.length === 0) {
    return (
      <div className="no-content">
        <h2>No data to show yet, please come back later!</h2>
      </div>
    );
  } else {
    return array.map((p) => {
      return (
        <ProjectCard ></ProjectCard>
      );
    });
  }
}

function Projects(props) {
  const [data, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  useEffect(() => {
    // starts with a loading state, then fetches with a timeout
    Axios.get(`/api/projects?first=${itemsPerPage}`, { timeout: 10000 })
      .then((response) => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setError(e);
        setLoading(false);

      });
  }, []);
  if (loading) {
    return (
      <Card className="Projects">
        <div className="loading">Fetching Projects</div>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="Projects">
        <div className="error">Fetching Failed!</div>
      </Card>
    );
  }
  return (
    <div className="Projects">
      <div className="Section">
      <h2>My Work</h2>
      {Object.entries(data.jtmorrisbytes).map(([key, project]) => {
        console.log(project);
        return (
          <ProjectCard key = {key} sourceUrl={project.url} login={props.user.login} liveUrl={project.homepageUrl} name={project.name} liveUrl={project.homepageUrl}/>
          );
        })}
        </div>
      <div className="Section">
        <h2></h2>
      </div>
    </div> 
  );
}

export default Projects;
