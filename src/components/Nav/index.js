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
          <a id="about" href="#to-about">
            About
          </a>

          <a id="contact" href="#to-contact">
            Contact
          </a>
          <a
            id="resume"
            href="https://docs.google.com/document/d/1YUacd7AiDdvg1hP2_EvLmSacvXsVHmDc1Wi0NN9CPfE/edit?usp=sharing"
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
