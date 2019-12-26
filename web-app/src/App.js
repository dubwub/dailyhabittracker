import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import Overview from './components/Overview';

class App extends Component {
	render() {
		return (
			<Router>
				<div>
					<Route exact path='/' component={Overview} />
				</div>
			</Router>
		);
	}
}

export default App;
