import React, { useState, useEffect } from "react";

import Axios from "axios";

import Card from "../Card";

import "./Projects.css";

function fetchRepositiories(itemsPerPage = 10, cursor) {
  return Axios.get(`/api/projects?first=${itemsPerPage}${cursor ? cursor : ""}`)
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
        <h2>No projects to show yet, please come back later!</h2>
      </div>
    );
  } else {
    return array.map((p) => {
      return (
        <div className="Project Card">
          <h2>{p.name}</h2>
          <span>{p.description}</span>
          <span>{p.homepage}</span>
        </div>
      );
    });
  }
}

function Projects(props) {
  const [projects, setProjects] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  useEffect(() => {
    fetchRepositiories(itemsPerPage).then(setProjects);
  }, []);

  return (
    <Card id="Projects" className="">
      <div className="Container">{renderProjects(projects)}</div>
    </Card>
  );
}

export default Projects;
