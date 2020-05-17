import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';

import Overview from './components/Overview';

// initial state with days and such is set in the reducers
import reducers from './reducers/index.reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
const store = createStore(reducers, composeWithDevTools(applyMiddleware(reduxThunk)));

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Router>
                <div>
                    <Route exact path='/' component={Overview} />
                </div>
            </Router>
        </Provider>
    );
}

export default App;
