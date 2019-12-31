// app.js

const bodyParser = require('body-parser');
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');

// routes
const user_routes = require('./routes/api/users');
// const entry_routes = require('./routes/api/entries');

const app = express();
app.use(morgan('combined')); // log all requests
app.use(bodyParser.json()); // parse application/json

// connect to mongo database
connectDB();

// seed an admin-user
const User = require('./models/User.js');

User.find({ username: "admin" }).count({}, function(err, count) {
	if (count === 0) {
		console.log("Admin user not found, seeding new admin user");
		User.create({
			username: "admin",
			password: "password",
			journal_entries: [],
			habits: []
		}, function(e) {
			if (e) {
				throw e;
			}
		});
	}
});

app.use(cors({ origin: true, credentials: true }));

app.get('/', (req, res) => res.send('Hello world!'));
app.use('/api/users', user_routes);
// app.use('/api/entries', entry_routes);

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));
