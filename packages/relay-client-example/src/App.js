import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Relay from 'react-relay';

const pageSize = 5;

class Posts extends Component {
  constructor(props) {
    super();


    const onReadyStateChange = ({ done }) => {
      const { loading } = this.state;
      // optimization
      if (loading === done) {
        this.setState({ loading: !done });
      }
    }

    this.onIncrement = () => this.props.relay.setVariables({
      offset: this.props.relay.variables.offset + pageSize
    }, onReadyStateChange);

    this.onDecrement = () => this.props.relay.setVariables({
      offset: this.props.relay.variables.offset - pageSize
    }, onReadyStateChange);

    this.state = { loading: false };
  }

  render() {
    const {
      postsOnAuthor: { posts },
      relay: { variables }
    } = this.props;

    const { loading } = this.state;

    return (
      <div>
        <h1>{variables.offset / pageSize + 1}</h1>
        <button onClick={this.onIncrement}>+</button>
        <button onClick={this.onDecrement}>-</button>
        <p>{loading ? 'loading...' : null}</p>
        {posts.map(({ title, __dataID__: id }) => <p key={id} >{title}</p>)}
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
    return (
      <div className="App">
        <div className="App-header">
          <h2>relay</h2>
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
