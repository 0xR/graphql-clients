import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

global.gql = (literals, ...substitutions) => {
    let result = "";

    // run the loop only for the substitution count
    for (let i = 0; i < substitutions.length; i++) {
        result += literals[i];
        result += substitutions[i];
    }

    // add the last literal
    result += literals[literals.length - 1];

    return result;
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
