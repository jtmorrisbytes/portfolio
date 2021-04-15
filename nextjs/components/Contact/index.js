import React, { useState } from "react";
import Card from "../Card";
import "./Contact.css";
import { connect } from "../../lib/userContext";

function u(c, e) {
  console.log(c);
  c(e?.target?.value || "");
}
const messageTemplate = `From: {name}

{message}
`;

const Contact = (props) => {
  const [name, sNam] = useState("");
  const [subject, sSub] = useState("");
  const [message, sMes] = useState("");
  return (
    <Card id={"Contact"}>
      {/* <a id="#Contact"></a> */}
      <div id="contact-content-container">
        <h2 id="contact-form-header">Get In Touch</h2>
        <h3>
          Fill out the form below, then Click &quot;Create Email&quot; then
          click &quot;Send&quot; from your email client
        </h3>
        <form
          id="contact-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div id={"name-group"}>
            <label id="contact-label" htmlFor="contact-name">
              Name:
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder="Full Name"
              name="name"
              value={name}
              onChange={u.bind(null, sNam)}
            />
          </div>
          {/* <div id={"email-group"}>
            <label id="email-label" htmlFor="contact-email">
              Email:
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="Email: abc@123.com"
              name="_replyto"
              onChange={u.bind()}
            />
          </div> */}
          <div id={"subject-group"}>
            <label id="subject-label" htmlFor="contact-subject"></label>
            <input
              id="contact-subject"
              type="text"
              placeholder="Subject"
              name="subject"
              value={subject}
              onChange={u.bind(null, sSub)}
            />
          </div>
          <div id={"message-group"}>
            <label htmlFor="contact-message"></label>
            <textarea
              id="contact-message"
              placeholder="Your message: 500 characters or less"
              name="message"
              value={message}
              onChange={u.bind(null, sMes)}
            />
          </div>

          <a
            type="submit"
            href={`mailto:${props.user.email}?subject=${encodeURIComponent(
              subject
            )}&body=${encodeURIComponent(
              messageTemplate
                .replace("{name}", name)
                .replace("{message}", message)
            )}`}
          >
            Create Email
          </a>
        </form>
      </div>
    </Card>
  );
};

export default connect(Contact);
