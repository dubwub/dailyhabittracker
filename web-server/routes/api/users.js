// TODO: split into separate files
const User = require('../../models/User');
const Entry = require('../../models/Entry');
const Event = require('../../models/Event');
const Retrospective = require('../../models/Retrospective');

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
    cleanedRequest["_id"] = req.params.cid; // just making sure we don't overwrite old _id

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
            new: true
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
    cleanedRequest["_id"] = req.params.eid; // just making sure we don't overwrite old _id
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
        if (req.body[field]) {
            cleanedRequest[field] = req.body[field];
        }
    });
    cleanedRequest["_id"] = req.params.eid; // just making sure we don't overwrite old _id
    Retrospective.findOneAndUpdate({
            _id: req.params.rid,
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

// @route DELETE /api/users/:uid/retros/:rid
// @description delete retro <rid>
// @access PUBLIC (to make into only user)
router.delete('/:uid/retros/:rid', (req, res) => {
	Retrospective.findByIdAndDelete(req.params.rid).then( _ => res.json({ msg: 'Event removed successfully' }))
		.catch(err => res.status(400).json({ error: err }));
});

////////// ENTRY ROUTES //////////

// post habit entry
router.post('/:uid/habit/:hid/entries', (req, res) => {
    let set_params = {};
    if (typeof req.body.value !== "undefined") set_params["value"] = req.body.value;
    if (typeof req.body.note !== "undefined") set_params["note"] = req.body.note;
    if (typeof req.body.transactions !== "undefined") set_params["transactions"] = req.body.transactions;
    if (typeof req.body.tags !== "undefined") { set_params["tags"] = req.body.tags; }
    
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
    if (typeof req.body.value !== "undefined") { set_params["value"] = req.body.value; }
    if (typeof req.body.note !== "undefined") { set_params["note"] = req.body.note; }
    if (typeof req.body.transactions !== "undefined") { set_params["transactions"] = req.body.transactions; }
    
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

module.exports = router;
