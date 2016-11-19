import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Relay from 'react-relay';

class App extends Component {
  render() {
    const {
      posts: { authors: [{ posts }] },
    } = this.props;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
        </p>
        {posts && posts.map(({ title, id }) => <p key={id} >{title}</p>)}
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
    offset: 0,
    limit: 10,
  },
  fragments: {
    posts: () => Relay.QL`
    fragment Posts on AuthorResult {
      authors {
        firstName
        lastName,
        posts(offset: $offset, limit: $limit){
          id
          title
          text
        }
      }
    }
    `,
  },
});
