import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';

import Overview from './components/Overview';
import OverviewV2 from './components/OverviewV2';
import OverviewV3 from './components/OverviewV3';

// initial state with days and such is set in the reducers
import reducers from './reducers/index.reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
const store = createStore(reducers, composeWithDevTools(applyMiddleware(reduxThunk)));

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Router>
                <div>
                    {/* <Route exact path='/v1' component={Overview} /> */}
                    {/* <Route exact path='/v2' component={OverviewV2} /> */}
                    <Route exact path='/v3' component={OverviewV3} />
                </div>
            </Router>
        </Provider>
    );
}

export default App;
