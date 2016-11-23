import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Relay from 'react-relay';

const pageSize = 5;

class Posts extends Component {
  constructor(props) {
    super();

    this.onIncrement = () => this.props.relay.setVariables({
      offset: this.props.relay.variables.offset + pageSize
    });

    this.onDecrement = () => this.props.relay.setVariables({
      offset: this.props.relay.variables.offset - pageSize
    });
  }

  render() {
    const {
      posts,
    } = this.props.postsOnAuthor;

    return (
      <div>
        <h1>todo page</h1>
        <button onClick={this.onIncrement}>+</button>
        <button onClick={this.onDecrement}>-</button>
        {posts.map(({ title, id }) => <p key={id} >{title}</p>)}
      </div>
    );
  }
}

const PostsContainer = Relay.createContainer(Posts, {
  initialVariables: {
    offset: 0,
    limit: pageSize,
  },
  fragments: {
    postsOnAuthor: () => Relay.QL`
    fragment Posts on Author {
      posts(offset: $offset, limit: $limit){
        title
        text
      }
    }
    `
  }
});

class App extends Component {
  render() {
    const { posts: { authors } } = this.props;
    console.log(this.props, authors);
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <PostsContainer {...{ postsOnAuthor: authors[0]}}/>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    posts: () => Relay.QL`
    fragment Posts on AuthorResult {
      authors {
        ${PostsContainer.getFragment('postsOnAuthor')}
      }
    }
    `,
  }
});
