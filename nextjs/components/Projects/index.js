import React from "react";
import Card from "../Card";
import "./Projects.css";
import ProjectCard from "../ProjectCard";
// import axios from "axios"
import apiClient from "../../lib/apiClient";

const PaginationControls = (props) => {
  const noOp = () => {
    console.log("this element does nothing");
  };
  let style = {
    button: {
      enabled: {
        cursor: "pointer",
        fontSize: "1.25em",
        width: "1.25em",
      },
      disabled: {
        cursor: "not-allowed",
        visibility: "hidden",
      },
    },
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "1.25em",
      }}
      id="pagination-controls"
    >
      <button
        style={
          props.hasPreviousPage && !props.loading
            ? style.button.enabled
            : style.button.disabled
        }
        type="button"
        onMouseUp={props.previousPageAction || noOp}
      >
        {" "}
        &lt;{" "}
      </button>
      <div style={{ display: "inline-flex" }} id="items-per-page-controls">
        <button
          style={
            props.decreaseItemsPerPageAction && props.canDecreaseItemsPerPage
              ? style.button.enabled
              : style.button.disabled
          }
          type="button"
          onMouseUp={props.decreaseItemsPerPageAction || noOp}
        >
          <label>-</label>
        </button>
        <label
          style={{
            fontSize: "1rem",
            display: "inline",
            marginLeft: "0.25em",
            marginRight: "0.25em",
            textAlign: "center",
            paddingTop: "0.25em",
          }}
          id="num-items-per-page"
        >
          Items Per Page : {props.itemsPerPage || "?"}
        </label>
        <button
          style={
            props.increaseItemsPerPageAction && props.canIncreaseItemsPerPage
              ? style.button.enabled
              : style.button.disabled
          }
          type="button"
          onMouseUp={props.increaseItemsPerPageAction || noOp}
        >
          <label>+</label>
        </button>
      </div>
      <button
        style={
          props.hasNextPage && !props.loading
            ? style.button.enabled
            : style.button.disabled
        }
        type="button"
        onMouseUp={props.nextPageAction || noOp}
      >
        {" "}
        &gt;
      </button>
    </div>
  );
};

class Projects extends React.Component {
  minItemsPerPage = 2;
  maxItemsPerPage = 8;

  state = {
    repositories: null,
    loading: null,
    error: null,
    itemsPerPage: this.props.itemsPerPage || 4,
    previousCursor: [],
    cursor: null,
    nextCursor: null,
    shouldFetchRepositories: true,
  };
  _fetchInfoForRepository(repository) {}
  _startLoading() {
    this.setState({ ...this.state, loading: true });
  }
  _endLoading() {
    this.setState({ ...this.state, loading: false });
  }
  _increaseItemsPerPage() {
    if (
      this.state.itemsPerPage > this.maxItemsPerPage ||
      this.state.itemsPerPage > Number.MAX_SAFE_INTEGER - 1
    ) {
      console.error("NumItemsPerPage too high, resetting");
      this.setState(
        {
          ...this.state,
          cursor: null,
          itemsPerPage:
            this.maxItemsPerPage < Number.MAX_SAFE_INTEGER - 1
              ? this.maxItemsPerPage
              : Number.MAX_SAFE_INTEGER - 1,
        },
        this._fetchRepositories
      );
      return;
    } else if (
      this.state.itemsPerPage < this.maxItemsPerPage &&
      this.state.itemsPerPage < Number.MAX_SAFE_INTEGER
    ) {
      this.setState(
        {
          ...this.state,
          cursor: null,
          itemsPerPage: this.state.itemsPerPage * 2,
        },
        this._fetchRepositories.bind(this)
      );
    }
  }
  _decreaseItemsPerPage() {
    if (this.state.itemsPerPage < this.minItemsPerPage) {
      this.setState(
        { ...this.state, cursor: null, itemsPerPage: this.minItemsPerPage },
        this._fetchRepositories.bind(this)
      );
      return;
    } else if (
      this.state.itemsPerPage > 0 &&
      this.state.itemsPerPage >= this.minItemsPerPage
    ) {
      this.setState(
        {
          ...this.state,
          cursor: null,
          itemsPerPage: this.state.itemsPerPage / 2,
        },
        this._fetchRepositories.bind(this)
      );
    }
  }
  _nextPage() {
    // this.state.endCursor && ((this.state.previousCursor.length * this.state.itemsPerPage) < this.state.repositories.totalCount )
    if (this.state.endCursor && this.state.hasNextPage) {
      this.state.previousCursor.push(this.state.repositories.edges[0].cursor);
      this.setState(
        {
          ...this.state,
          previousCursor: this.state.previousCursor,
          cursor: this.state.endCursor,
          loading: true,
        },
        this._fetchRepositories.bind(this)
      );

      // this._fetchRepositories()
    } else {
      console.log("There is no next page");
      return false;
    }
  }
  _previousPage() {
    if (this.state.previousCursor.length > 0 && this.state.hasPreviousPage) {
      let newStack = this.state.previousCursor;
      let newCursor = this.state.previousCursor.pop();
      if (newStack.length === 0) {
        newCursor = null;
      }
      this.setState(
        {
          ...this.state,
          previousCursor: newStack,
          cursor: newCursor,
          loading: true,
        },
        this._fetchRepositories.bind(this)
      );
      // this._fetchRepositories()
    } else {
      console.log("There is no previous page");
    }
  }
  _fetchRepositories(cursor = "") {
    //Set the loading state to let users know that an operation is in progress
    this.setState({ ...this.setState, loading: true });
    //build the query from a querystring
    let query = `{"query": "query { user(login: $login ){ repositories(first:$itemsPerPage, $cursor privacy:PUBLIC) { pageInfo{ startCursor,endCursor,hasNextPage,hasPreviousPage}, totalCount, edges{ cursor, node {  name, description, url, homepageUrl } } } } }"}`;
    query = query.replace(
      "$login",
      `\\"${this.props.login}\\"` || '\\"jtmorrisbytes\\"'
    );
    query = query.replace("$itemsPerPage", String(this.state.itemsPerPage));
    if (this.state.cursor || (cursor.length > 0 && cursor !== "undefined")) {
      query = query.replace(
        "$cursor",
        'after:\\"' + this.state.cursor + '\\",'
      );
    } else {
      query = query.replace("$cursor", "");
    }

    // NOTE FROM FUTURE JORDAN:
    // this is being turned into a server-side process

    // return superagent
    //   .post(this.props.apiUrl)
    //   .set("authorization", `Bearer ${this.props.accessToken}`)
    //   .set("content-type", "application/json")
    //   .set("accept", "application/json")
    //   .send(query)
    //   .then(
    //     (response) => {
    //       // console.log("data: ", response.body )
    //       let repositories = (
    //         (((response || {}).body || {}).data || {}).user || {}
    //       ).repositories;
    //       if (repositories) {
    //         this.setState({
    //           repositories: repositories,
    //           hasNextPage: repositories.pageInfo.hasNextPage,
    //           hasPreviousPage:
    //             (repositories.pageInfo.hasPreviousPage &&
    //               repositories.totalCount > this.state.itemsPerPage) ||
    //             false,
    //           // cursor: repositories.edges[0].cursor,
    //           startCursor: repositories.pageInfo.startCursor,
    //           endCursor: repositories.pageInfo.endCursor,

    //           loading: false,
    //         });
    //         return true;
    //       } else {
    //         console.error("the project data was unavailable");
    //         this.setState({ loading: false, error: true });
    //       }
    //       if (!response.body.errors) {
    //         return response.body.data.user.repositories.edges;
    //       } else return response.body.data;
    //     },
    //     (error) => {
    //       console.error("PROMISE REJECTION", error);
    //     }
    //   )
    //   .catch(console.error);
    this.setState({ ...this.state, repositories: [], loading: false });
  }
  componentDidMount() {
    // set event listeners to ensure that you are online

    // initialize repository data
    window.Projects = this;
    this.setState({ ...this.state, loading: true }, this._fetchRepositories);
  }
  componentDidUpdate() {
    // if (this.state.shouldFetchRepositories) {
    //     this._fetchRepositories()
    //     this.setState({...this.state, shouldFetchRepositories:false})
    // }
  }

  render() {
    // if (this.state.repositories) console.log(this.state.repositories.edges) ;
    if (this.state.loading) {
      return <h2>Loading Projects... Please wait</h2>;
    }
    // console.log(projects)
    return (
      <Card id="Projects">
        <h2 id="header">My Projects</h2>
        <PaginationControls
          hasNextPage={this.state.hasNextPage}
          hasPreviousPage={this.state.hasPreviousPage}
          itemsPerPage={this.state.itemsPerPage}
          previousPageAction={this._previousPage.bind(this)}
          nextPageAction={this._nextPage.bind(this)}
          increaseItemsPerPageAction={this._increaseItemsPerPage.bind(this)}
          canIncreaseItemsPerPage={
            this.state.itemsPerPage < this.maxItemsPerPage
          }
          decreaseItemsPerPageAction={this._decreaseItemsPerPage.bind(this)}
          canDecreaseItemsPerPage={
            this.state.itemsPerPage > this.minItemsPerPage
          }
          setState={this.setState.bind(this)}
          loading={this.state.loading}
        />
        <div id="projects-grid">
          {/* <CodePenEmbedded hash={"qvQqwb"} user={"jtmorrisbytes"} /> */}
          {/* I am placing a few default project cards here until layout is finalized*/}
          {(this.state.repositories || {}).edges
            ? this.state.repositories.edges.map((repository) => {
                // console.log("REPOSITORY",repository)
                return (
                  <ProjectCard
                    displayName={repository.node.name.replace(/-/g, " ")}
                    name={repository.node.name}
                    login={this.props.login}
                    sourceUrl={repository.node.url}
                    key={repository.node.name}
                    liveUrl={repository.node.homepageUrl}
                    description={repository.node.description}
                    token={this.props.accessToken}
                  />
                );
              })
            : []}
        </div>
        <PaginationControls
          hasNextPage={this.state.hasNextPage}
          hasPreviousPage={this.state.hasPreviousPage}
          itemsPerPage={this.state.itemsPerPage}
          previousPageAction={this._previousPage.bind(this)}
          nextPageAction={this._nextPage.bind(this)}
          setState={this.setState.bind(this)}
          loading={this.state.loading}
        />
      </Card>
    );
  }
}

export default Projects;
