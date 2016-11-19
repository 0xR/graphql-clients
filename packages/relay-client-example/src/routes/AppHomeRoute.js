import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    posts: () => Relay.QL`
    query getPosts {
      relayAuthors(limit: 1)
    }
    `,
  };

  static routeName = 'AppHomeRoute';
}
