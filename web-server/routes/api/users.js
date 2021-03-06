// TODO: split into separate files
const User = require('../../models/User');
const EntryV2 = require('../../models/EntryV2');

// v1 (DEPRECATED)
const Entry = require('../../models/Entry');
const Event = require('../../models/Event');
const Retrospective = require('../../models/Retrospective');
const _ = require('lodash');

const express = require('express');
const router = express.Router();

// @route GET V3 /api/users/v3/:id
// [V3 USERS]
router.get('/v3/:id', (req, res) => {
    let output = {};

    // first query user to get list of habits, then query entries to get all entries
    User.findById(req.params.id)
        .then(user => {
            output['username'] = user['username'];
            output['tags'] = user['tags'];
            output['selfMessage'] = user['selfMessage'];
            EntryV2.find({
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

// [SELF MESSAGE]
router.put('/v3/:id/selfmessage', async (req, res) => {
    const user = await User.findById(req.params.id);
    user.selfMessage = req.body.selfMessage;
    const updatedUser = await user.save();

    if (updatedUser) { res.send(req.body.selfMessage); }
    else { res.status(400).json({ error: err }); }
});


// @route GET V2 /api/users/v2/:id
// [V2 USERS]
router.get('/v2/:id', (req, res) => {
    let output = {};

    // first query user to get list of habits, then query entries to get all entries
    User.findById(req.params.id)
        .then(user => {
            output['username'] = user['username'];
            output['dreams'] = user['dreams'];
            output['experiments'] = user['experiments'];
            EntryV2.find({
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

// [DREAMS]
router.put('/:id/dreams', async (req, res) => {
    const user = await User.findById(req.params.id);
    const newDream = user.dreams.create(req.body);
    user.dreams.push(newDream);
    const updatedUser = await user.save();

    if (updatedUser) { res.send(newDream); }
    else { res.status(400).json({ error: err }); }
});
// router.delete('/:uid/dreams/:did', (req, res) => {
// 	User.findByIdAndUpdate(req.params.uid, {
// 		$pull: {
// 			dreams: {
// 				_id: req.params.did
// 			}
// 		}
// 	}).then( _ => {
//         User.findOneAndUpdate({
//                 _id: req.params.uid,
//                 habits: { 
//                     "$elemMatch": {
//                         category: req.params.cid 
//                     }
//                 }
//             },
//             {
//                 $set: {
//                     "habits.$.category": undefined
//                 }
//             },
//             {
//                 new: true
//             },
//             function(err, user) {
//                 if (err) { res.status(500).json({error: err}); }
//                 res.json({ msg: "Category removed successfully" });
//             }
//         );
//     }).catch(err => res.status(400).json({ error: err }));
// });

// [EXPERIMENTS]
router.put('/:id/experiments', async (req, res) => {
    const user = await User.findById(req.params.id);
    const newExperiment = user.experiments.create(req.body);
    user.experiments.push(newExperiment);
    const updatedUser = await user.save();

    if (updatedUser) { res.send(newExperiment); }
    else { res.status(400).json({ error: err }); }
});

// [ENTRIES]
router.put('/:id/entries', async (req, res) => {
    const params = {
        ...req.body,
        user: req.params.id,
    };
    let newEntry = new EntryV2(params);
    newEntry.save(function(err, entry) {
        if (err) { res.status(400).json({error: err}) }
        else { res.send(entry); }
    });
});



///////// DEPRECATED


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
            output['categories'] = user['categories'];
            Entry.find({
                user: req.params.id
            }, function(err, entries) {
                if (err) {
                    res.status(400).json({ error: 'Error loading entries' });
                } else {
                    output['entries'] = entries;

                    // TODO: can I do this without nesting? probably with async, right?
                    // Event.find({
                    //     user: req.params.id
                    // }, function(err, events) {
                    //     if (err) {
                    //         res.status(400).json({ error: 'Error loading events' });
                    //     } else {
                    //         output['events'] = events;
                    //         res.send(output);
                    //     }
                    // })
                    Retrospective.find({
                        user: req.params.id
                    }, function(err, retros) {
                        if (err) {
                            res.status(400).json({ error: 'Error loading retros' });
                        } else {
                            output['retros'] = retros;
                            res.send(output);
                        }
                    })
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

////////// CATEGORY ROUTES //////////

// @route PUT /api/users/:id/category
// @description add a category to user
// @access Public (to make user)
router.put('/:id/category', async (req, res) => {
    const user = await User.findById(req.params.id);
    const newCategory = user.categories.create(req.body);
    user.categories.push(newCategory);
    const updatedUser = await user.save();

    if (updatedUser) { res.send(newCategory); }
    else { res.status(400).json({ error: err }); }
});

// @route POST /api/users/:uid/category/:cid
// @description modify user category with clean fields
router.post('/:uid/category/:cid', (req, res) => {
    let cleanedRequest = {}; // clean request so ppl can't change private fields like _id
    const validFields = ["title", "icon", "order", "color"];
    validFields.forEach((field) => {
        if (req.body[field]) {
            cleanedRequest[field] = req.body[field];
        }
    });
    cleanedRequest._id = req.params.cid;
    User.findOneAndUpdate({
            _id: req.params.uid,
            categories  : { 
                "$elemMatch": {
                    _id: req.params.cid 
                }
            }
        },
        {
            $set: {
                "categories.$": cleanedRequest
            }
        },
        {
            new: true,
        },
        function(err, user) {
            if (err) { res.status(500).json({error: err}); }
            user["categories"].forEach((category) => {
                if (category._id.toString() === req.params.cid) {
                    res.send(category);
                }
            });  
        }
    )
});

// @route DELETE /api/users/:uid/category/:cid
// @description delete category <cid>
// @access PUBLIC (to make into only user)
router.delete('/:uid/category/:cid', (req, res) => {
	User.findByIdAndUpdate(req.params.uid, {
		$pull: {
			categories: {
				_id: req.params.cid
			}
		}
	}).then( _ => {
        User.findOneAndUpdate({
                _id: req.params.uid,
                habits: { 
                    "$elemMatch": {
                        category: req.params.cid 
                    }
                }
            },
            {
                $set: {
                    "habits.$.category": undefined
                }
            },
            {
                new: true
            },
            function(err, user) {
                if (err) { res.status(500).json({error: err}); }
                res.json({ msg: "Category removed successfully" });
            }
        );
    }).catch(err => res.status(400).json({ error: err }));
});


////////// HABIT ROUTES //////////

// get habit overview

// @route PUT /api/users/:id/habit
// @description add a habit to user
// @access Public (to make user)
router.put('/:id/habit', async (req, res) => {
    const user = await User.findById(req.params.id);
    const newHabit = user.habits.create(req.body);
    user.habits.push(newHabit);
    const updatedUser = await user.save();

    if (updatedUser) { res.send(newHabit); }
    else { res.status(400).json({ error: err }); }
});

// @route POST /api/users/:uid/habit/:hid
// @description modify user habit with clean fields
router.post('/:uid/habit/:hid', (req, res) => {
    let cleanedRequest = {}; // clean request so ppl can't change private fields like _id
    const validFields = ["title", "description", "category", "order", "thresholds", "entryType", "color", "tags", "startDate", "endDate", "archived"];
    validFields.forEach((field) => {
        if (!_.isNil(req.body[field])) {
            cleanedRequest[field] = req.body[field];
        }
    });
    cleanedRequest._id = req.params.hid;
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

// @route POST /api/users/:uid/habit/:hid/archive
// @description modify user habit with clean fields
router.post('/:uid/habit/:hid/archive', (req, res) => {
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
            "habits.$.archived": true
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
	}).then( _ => {
        Entry.deleteMany({
            user: req.params.uid,
            habit: req.params.hid,
        }, function(err, result) {
            if (err) { res.status(400).json({ error: err}) }
            else {
                res.json({ msg: 'Habit removed successfully' })
            }
        })
    }).catch(err => res.status(400).json({ error: err }));
});

////////// EVENT ROUTES //////////

// @route PUT /api/users/:id/events
// @description add an event to user
// @access Public (to make user)
router.put('/:id/events', async (req, res) => {
    const params = {
        ...req.body,
        user: req.params.id,
    };
    let newEvent = new Event(params);
    newEvent.save(function(err, event) {
        if (err) { res.status(400).json({error: err}) }
        else { res.send(event); }
    });
});

// @route POST /api/users/:uid/events/:eid
// @description modify event with clean fields
router.post('/:uid/events/:eid', (req, res) => {
    req.body["user"] = req.params.id;
    let cleanedRequest = {}; // clean request so ppl can't change private fields like _id
    const validFields = ["title", "color", "startDate", "endDate"];
    validFields.forEach((field) => {
        if (req.body[field]) {
            cleanedRequest[field] = req.body[field];
        }
    });
    cleanedRequest._id = req.params.eid;
    Event.findOneAndUpdate({
            _id: req.params.eid,
            user: req.params.uid,
        },
        {
            $set: cleanedRequest
        },
        {
            new: true
        },
        function(err, event) {
            if (err) { res.status(500).json({error: err}); }
            res.send(event);  
        }
    )
});

// @route DELETE /api/users/:uid/event/:eid
// @description delete event <eid>
// @access PUBLIC (to make into only user)
router.delete('/:uid/events/:eid', (req, res) => {
	Event.findByIdAndDelete(req.params.eid).then( _ => res.json({ msg: 'Event removed successfully' }))
		.catch(err => res.status(400).json({ error: err }));
});

////////// RETRO ROUTES //////////

// @route PUT /api/users/:id/retros
// @description add a retro to user
// @access Public (to make user)
router.put('/:id/retros', async (req, res) => {
    const params = {
        ...req.body,
        user: req.params.id,
    };
    let newRetro = new Retrospective(params);
    newRetro.save(function(err, retro) {
        if (err) { res.status(400).json({error: err}) }
        else { res.send(retro); }
    });
});

// @route POST /api/users/:uid/events/:eid
// @description modify event with clean fields
router.post('/:uid/retros/:rid', (req, res) => {
    req.body["user"] = req.params.id;
    let cleanedRequest = {}; // clean request so ppl can't change private fields like _id
    const validFields = ["title", "startDate", "endDate", "value", "note", "goal"];
    validFields.forEach((field) => {
        if (!_.isNil(req.body[field])) {
            cleanedRequest[field] = req.body[field];
        }
    });
    cleanedRequest._id = req.params.rid;
    Retrospective.findOneAndUpdate({
            _id: req.params.rid,
            user: req.params.uid,
        },
        {
            $set: cleanedRequest
        },
        {
            new: true,
            overwrite: true
        },
        function(err, event) {
            if (err) { res.status(500).json({error: err}); }
            res.send(event);  
        }
    )
});

// @route DELETE /api/users/:uid/retros/:rid
// @description delete retro <rid>
// @access PUBLIC (to make into only user)
router.delete('/:uid/retros/:rid', (req, res) => {
	Retrospective.findByIdAndDelete(req.params.rid).then( _ => res.json({ msg: 'Event removed successfully' }))
		.catch(err => res.status(400).json({ error: err }));
});

////////// ENTRY ROUTES //////////

// post habit entry value
router.post('/:uid/habit/:hid/entries/value', (req, res) => {
    Entry.findOneAndUpdate({
        "user": req.params.uid,
        "habit": req.params.hid,
        "date": req.body.date
    }, {
        $set: {
            value: req.body.value,
        }
    }, {
        new: true,
        upsert: true
    }).then((output) => { res.send(output); }).catch((err) => res.status(400).json({ error: err.errmsg }));
});

// post habit entry note
router.post('/:uid/habit/:hid/entries/note', (req, res) => {
    Entry.findOneAndUpdate({
        "user": req.params.uid,
        "habit": req.params.hid,
        "date": req.body.date
    }, {
        $set: {
            note: req.body.note,
        }
    }, {
        new: true,
        upsert: true
    }).then((output) => { res.send(output); }).catch((err) => res.status(400).json({ error: err.errmsg }));
});

// post habit entry txns
router.post('/:uid/habit/:hid/entries/transactions', (req, res) => {
    Entry.findOneAndUpdate({
        "user": req.params.uid,
        "habit": req.params.hid,
        "date": req.body.date
    }, {
        $set: {
            transactions: req.body.transactions,
        }
    }, {
        new: true,
        upsert: true
    }).then((output) => { res.send(output); }).catch((err) => res.status(400).json({ error: err.errmsg }));
});

// post daily retro value
router.post('/:uid/entries/value', (req, res) => {
    Entry.findOneAndUpdate({
        "user": req.params.uid,
        "habit": null,
        "date": req.body.date
    }, {
        $set: {
            value: req.body.value,
        }
    }, {
        new: true,
        upsert: true
    }).then((output) => { res.send(output); }).catch((err) => res.status(400).json({ error: err.errmsg }));
});

// post daily retro note
router.post('/:uid/entries/note', (req, res) => {
    Entry.findOneAndUpdate({
        "user": req.params.uid,
        "habit": null,
        "date": req.body.date
    }, {
        $set: {
            note: req.body.note,
        }
    }, {
        new: true,
        upsert: true
    }).then((output) => { res.send(output); }).catch((err) => res.status(400).json({ error: err.errmsg }));
});


// post daily retro transactions
router.post('/:uid/entries/transactions', (req, res) => {
    Entry.findOneAndUpdate({
        "user": req.params.uid,
        "habit": null,
        "date": req.body.date
    }, {
        $set: {
            transactions: req.body.transactions,
        }
    }, {
        new: true,
        upsert: true
    }).then((output) => { res.send(output); }).catch((err) => res.status(400).json({ error: err.errmsg }));
});


module.exports = router;
