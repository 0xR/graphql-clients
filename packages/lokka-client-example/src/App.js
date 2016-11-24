import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import Lokka from 'lokka';
import Transport from 'lokka-transport-http';
import thunk from 'redux-thunk';
import { createActions, handleActions } from 'redux-actions';

const client = new Lokka({
  transport: new Transport('/graphql'),
});

const actions = createActions('UPDATE_PAGE', 'POSTS', 'POST_ERRORS');

const loadingReducer = handleActions({
  [actions.updatePage]: state => state + 1,
  [actions.posts]: state => state - 1,
  [actions.postErrors]: state => state - 1,
}, 0);


const currentPageNumberReducer = handleActions({
  [actions.updatePage]: (state, { payload }) => Math.max(state + payload, 1),
}, 1);

const postsByPageReducer = handleActions({
  [actions.posts]: (
    state,
    { payload: { page, response } }
  ) => ({
    ...state,
    [page]: response,
  }),
}, {});

const errorsReducer = handleActions({
  [actions.postErrors]: (state, { payload }) => payload,
  [actions.posts]: () => [],
}, []);


const rootReducer = combineReducers({
  currentPageNumber: currentPageNumberReducer,
  postsByPage: postsByPageReducer,
  errors: errorsReducer,
  loading: loadingReducer,
});

const Posts = ({
  value,
  errors,
  posts,
  onIncrement,
  onDecrement,
  loading,
}) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
    <p>{loading ? 'loading...' : null}</p>
    {errors.map(error => <pre key={error} >{error}</pre>)}
    {posts.map(({ title, id }) => <p key={id} >{title}</p>)}
  </div>
);

Posts.fragments = {
  posts: client.createFragment(`
    fragment on Post {
      id
      title
      text
    }
  `)
}
const mapStateToProps = state => ({
  value: state.currentPageNumber,
  errors: state.errors,
  posts: state.postsByPage[state.currentPageNumber] || [],
  loading: state.loading !== 0,
});

const pageSize = 5;

function fetchPosts(pageOffset) {
  return (dispatch, getState) => {
    dispatch(actions.updatePage(pageOffset));

    const { currentPageNumber, postsByPage } = getState();

    const posts = postsByPage[currentPageNumber];

    if (!posts) {
      const offset = (currentPageNumber - 1) * pageSize;

      client.query(`query getPosts($offset: Int, $limit: Int){
        authors(limit:1){
          firstName
          lastName,
          posts(offset: $offset, limit: $limit){
            ...${Posts.fragments.posts}
          }
        }
      }`, { offset, limit: pageSize }).then(
        ({ authors: [{ posts: response }] }) => dispatch(actions.posts({ page: currentPageNumber, response })),
        (error) => {
          const { rawError } = error;
          if (rawError) {
            dispatch(actions.postErrors(rawError.map(({ message }) => message)));
          } else {
            dispatch(actions.postErrors([error.message]));
          }
        },
      );
    }
  };
}

const mapDispatchToProps = dispatch => ({
  onIncrement() {
    dispatch(fetchPosts(1));
  },
  onDecrement() {
    dispatch(fetchPosts(-1));
  },
});

const PostsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Posts);

const debugStoreEnhancer = (
  typeof window === 'object' && window.devToolsExtension
) ? window.devToolsExtension() : f => f;

const enhancers = compose(
  applyMiddleware(thunk),
  debugStoreEnhancer,
);

const store = createStore(rootReducer, enhancers);

store.dispatch(fetchPosts(0));

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>lokka + redux </h2>
        </div>
        <PostsContainer store={store} />
      </div>
    );
  }
}

export default App;
