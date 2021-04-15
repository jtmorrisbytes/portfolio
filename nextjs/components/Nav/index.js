/*
    Nav.js

    The main navigation for the webpage


*/
import React from "react";
import "./Nav.css";

class Nav extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <nav id="main-navigation">
        <div className="navigation-container">
          {/* <div id="nav-links"> */}
          <a id="projects" href="#to-projects">
            Projects
          </a>
          <a
            id="resume"
            href="https://docs.google.com/document/d/1tftm9gdhzvTsu1TWo0zCRIA-dBtdRJUKJEono18IXPc/edit?usp=sharing"
            rel="noopener noreferer"
            target="_blank"
          >
            Resume
          </a>
          {/* </div> */}
        </div>
      </nav>
    );
  }
}
export default Nav;
