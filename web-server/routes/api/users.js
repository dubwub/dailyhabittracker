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
	}).then( output => {
	    res.send(output);
    }).catch(err => res.status(400).json({ error: err }));
});

// @route POST /api/users/:uid/habit/:hid
// @description modify user habit with clean fields
router.post('/:uid/habit/:hid', (req, res) => {
    let cleanedRequest = {}; // clean request so ppl can't change private fields like _id
    const validFields = ["name", "description", "entry_type", "color"];
    validFields.forEach((field) => {
        if (req.body[field]) {
            cleanedRequest[field] = req.body[field];
        }
    });
    cleanedRequest["_id"] = req.params.hid; // just making sure we don't overwrite old _id

    User.findOneAndUpdate({
        _id: req.params.uid,
        habits: { 
            "$elemMatch": {
                _id: req.params.hid 
            }
        }
    },
    {
        $set: {
            "habits.$": cleanedRequest
        }
    },
    {
        new: true
    },
    function(err, user) {
        if (err) { res.status(500).json({error: err}); }
        user["habits"].forEach((habit) => {
            if (habit._id.toString() === req.params.hid) {
                res.send(habit);
            }
        });  
    })
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
    let set_params = {};
    if (typeof req.body.value !== "undefined") set_params["value"] = req.body.value;
    if (typeof req.body.note !== "undefined") set_params["note"] = req.body.note;
    
    Entry.findOneAndUpdate({
        "user": req.params.uid,
        "habit": req.params.hid,
        "date": req.body.date
    }, {
        $set: set_params
    }, {
        new: true,
        upsert: true
    }).then((output) => { res.send(output); }).catch((err) => res.status(400).json({ error: err.errmsg }));
});

// post daily retro
router.post('/:uid/entries', (req, res) => {
    let set_params = {};
    if (typeof req.body.value !== "undefined") set_params["value"] = req.body.value;
    if (typeof req.body.note !== "undefined") set_params["note"] = req.body.note;
    
    Entry.findOneAndUpdate({
        "user": req.params.uid,
        "habit": null,
        "date": req.body.date
    }, {
        $set: set_params
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
