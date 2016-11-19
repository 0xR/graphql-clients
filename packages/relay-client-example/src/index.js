import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import Relay from 'react-relay';
import AppHomeRoute from './routes/AppHomeRoute';

ReactDOM.render(
  <Relay.Renderer
    environment={Relay.Store}
    Container={App}
    queryConfig={new AppHomeRoute()}
  />,
  document.getElementById('root')
);
