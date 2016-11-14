/* eslint-disable react/prop-types,react/jsx-filename-extension */
import React, { Component } from 'react';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { createActions, handleActions } from 'redux-actions';
import ApolloClient from 'apollo-client';
import { ApolloProvider, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import gql from 'graphql-tag';

import logo from './logo.svg';
import './App.css';

const client = new ApolloClient();

const actions = createActions('UPDATE_PAGE', 'POSTS', 'POST_ERRORS');

const currentPageNumberReducer = handleActions({
  [actions.updatePage]: (state, { payload }) => Math.max(state + payload, 1),
}, 1);

const rootReducer = combineReducers({
  currentPageNumber: currentPageNumberReducer,
  apollo: client.reducer(),
});

const Posts = ({
  data: {
    authors: [{ posts }] = [{}],
    loading,
    error: { graphQLErrors, networkError } = {},
  },
  pageNumber,
  onIncrement,
  onDecrement,
}) => (
  <div>
    <h1>{pageNumber}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
    <p>{loading ? 'loading...' : null}</p>
    {networkError && <pre>{networkError.message}</pre>}
    {graphQLErrors && graphQLErrors.map(({ message }) => <pre key={message} >{message}</pre>)}
    {posts && posts.map(({ title, id }) => <p key={id} >{title}</p>)}
  </div>
);

const mapStateToProps = state => ({
  pageNumber: state.currentPageNumber,
});

const pageSize = 5;

const mapDispatchToProps = dispatch => ({
  onIncrement() {
    dispatch(actions.updatePage(1));
  },
  onDecrement() {
    dispatch(actions.updatePage(-1));
  },
});


const postQuery = gql`query getPosts($offset: Int, $limit: Int){
  authors(limit:1){
    firstName
    lastName,
    posts(offset: $offset, limit: $limit){
      id
      title
      text
    }
  }
}`;

const PostsContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(
    postQuery, {
      options: ({ pageNumber }) => ({
        variables: {
          offset: (pageNumber - 1) * pageSize,
          limit: pageSize,
        },
      }),
    }),
)(Posts);


const debugStoreEnhancer = (
  typeof window === 'object' && window.devToolsExtension
) ? window.devToolsExtension() : f => f;

const enhancers = compose(
  applyMiddleware(thunk),
  debugStoreEnhancer,
);

const store = createStore(rootReducer, enhancers);

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <PostsContainer />
      </div>
    );
  }
}

export default () => (
  <ApolloProvider store={store} client={client}>
    <App />
  </ApolloProvider>
);
