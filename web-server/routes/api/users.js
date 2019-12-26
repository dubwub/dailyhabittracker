const User = require('../../models/User');
const express = require('express');
const router = express.Router();

// @route GET /api/users/test
// @description test users route
// @access Public
router.get('/test', (req, res) => res.send('user route testing'));

// @route GET /api/users/:id
// @description get user
// @access Public (for now)
router.get('/:id', (req, res) => {
	User.findById(req.params.id)
		.then(user => res.json(user)) // probably need to figure out if this will be really heavy
		.catch(err => res.status(404).json({ nouserfound: 'No User found' }));
});

// @route POST /api/users
// @description signup
// @access Public
router.post('/', (req, res) => {
	User.create(req.body)
		.then(user => res.json({ msg: 'User added successfully' }))
		.catch(err => res.status(400).json({ error: 'Unable to add this user' }));
});

// @route PUT /api/users/:id
// @description add a habit to user
// @access Public (to make user)
router.put('/:id', (req, res) => {
	console.log(req.body);
	User.findByIdAndUpdate(req.params.id, {
			$push: {
				habits: req.body
			}
	}).then( test => {
		console.log("console log when pushing new habit");
		console.log(test);
		res.json({ msg: 'Habit added successfully' });
	}).catch(err => res.status(400).json({ error: err }));
});

// @route DELETE /api/users/:uid/habit/:hid
// @description delete habit <hid>
// @access PUBLIC (to make into only user)
router.delete('/:uid/habit/:hid', (req, res) => {
	User.findByIdAndUpdate(req.params.uid, {
		$pull: {
			habits: {
				_id: req.params.hid
			}
		}
	}).then( _ => res.json({ msg: 'Habit removed successfully' }))
		.catch(err => res.status(400).json({ error: err }));
});

// @route POST /api/users/:uid/habit/:hid
// @description add

// add delete user
// add update user

module.exports = router;
