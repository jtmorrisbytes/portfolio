import React, { useEffect, useState } from "react";
import Axios from "axios";

const Context = React.createContext({});
function UserContext(props) {
  const [user, setUserView] = useState({});
  const [loading,setLoading] = useState(false);
  useEffect(() => {
    setLoading(true)
    Axios.get("/api/user")
      .then((response) => {
        // console.log("USERCONTEXT", response)
        setUserView(response.data || {});
        setLoading(false)
      })
      .catch((e) => {
        console.error("UserContext.Provider: Error fetching user", e);
      });
  }, []);

  return <Context.Provider value={user}>{props.children}</Context.Provider>;
}

export function connect(Component) {
  return function UserContextConnected(props) {
    return (
      <Context.Consumer>
        {(user) => {
          return <Component {...props} user={user} />;
        }}
      </Context.Consumer>
    );
  };
}

export default UserContext;
