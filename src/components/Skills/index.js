import axios from "axios";
import React, { useEffect, useState } from "react";
import "./index.css"
export default function Skills(props) {
  const [skills, setSkills] = useState(null);
  useEffect(() => {
    axios.get("/api/skills", { timeout: 10000 }).then((response) => {
      if (Array.isArray(response.data)) {
        setSkills(response.data);
      } else {

        setSkills(false);
      }
    }).catch((e)=>{
        console.error(e)
    });
  }, []);
  if (skills) {
    return (
      <div className="Skills">
        {skills.map((skill) => {
          return <span>{skill}</span>;
        })}
      </div>
    );
  }
  return null;
}
