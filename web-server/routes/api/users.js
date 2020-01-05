const User = require('../../models/User');
const Entry = require('../../models/Entry');

const express = require('express');
const router = express.Router();

// @route GET /api/users/:id
// @description get user
// @access Public (for now)
router.get('/:id', (req, res) => {
    let output = {};

    // first query user to get list of habits, then query entries to get all entries
    User.findById(req.params.id)
        .then(user => {
            output['username'] = user['username'];
            output['habits'] = user['habits'];
            Entry.find({
                user: req.params.id
            }, function(err, entries) {
                if (err) {
                    res.status(400).json({ error: 'Error loading entries' });
                } else {
                    output['entries'] = entries;
                    res.send(output);
                }
            });
        }).catch(err => res.status(404).json({ nouserfound: 'No User Found' }));
});

// @route POST /api/users
// @description signup
// @access Public
// router.post('/', (req, res) => {
// 	User.create(req.body)
//		.then(user => res.json({ msg: 'User added successfully' }))
//		.catch(err => res.status(400).json({ error: 'Unable to add this user' }));
//});

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

// post habit entry
router.post('/:uid/habit/:hid/entries', (req, res) => {
    Entry.findOneAndUpdate({
        "user": req.params.uid,
        "habit": req.params.hid,
        "date": req.body.date
    }, {
        $set: {
            "entry": req.body.entry,
            "note": req.body.note
        }
    }, {
        new: true,
        upsert: true
    }).then((output) => { res.send(output); }).catch((err) => res.status(400).json({ error: err.errmsg }));
});

// post daily retro
router.post('/:uid/entries', (req, res) => {
    Entry.findOneAndUpdate({
        "user": req.params.uid,
        "habit": null,
        "date": req.body.date
    }, {
        $set: {
            "entry": req.body.entry,
            "note": req.body.note
        }
    }, {
        new: true,
        upsert: true
    }).then((output) => { res.send(output); }).catch((err) => res.status(400).json({ error: err.errmsg }));
});

// ENTRY ENDPOINTS
// upsert entry for user
// upsert entry for user/habit pair
// get all entries for user in date range
// get all entries for user/habit pair in date range

// add delete user
// add update user

module.exports = router;
