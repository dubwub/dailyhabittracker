// TODO: split into separate files

import axios from 'axios';
const moment = require('moment');

// TODO: when signup/login is implemented, remove this hardcoded id
const user_id = "5e655ef5b15885349dec3c6e";

// TODO: is there a better way of storing dates with mongo? can i just store a moment object?
function _momentDateFromMongo(day) {
    return moment(day.substring(0, 10), "YYYY-MM-DD");
}

export function loadUser(days) {
    return async function(dispatch) {
        const res = await axios.get('http://localhost:8082/api/users/' + user_id);
        console.log('Loaded user: ' + user_id);
        
        let habitOrder = [];
        let habits = {};
        let categoryOrder = [];
        let categories = {};
        let entries = {
            "daily-retro": {}
        };
        days.forEach((day) => { // TODO: merge with raw_habits
            const day_fmt = day.format('MM/DD/YYYY');
            entries["daily-retro"][day_fmt] = {
                value: undefined,
                note: undefined
            };
        });

        // setup habits/habit-orders to get ready for loading entries
        const raw_habits = res.data.habits;
        raw_habits.forEach((habit) => {
            habitOrder.push(habit._id);
            habits[habit._id] = habit;
            entries[habit._id] = {};

            days.forEach((day) => {
                const day_fmt = day.format('MM/DD/YYYY');
                entries[habit._id][day_fmt] = {
                    value: undefined,
                    note: undefined
                };
            });
        });

        const raw_categories = res.data.categories;
        raw_categories.forEach((category) => {
            categoryOrder.push(category._id);
            categories[category._id] = category;
        });

        // preprocess incoming entries
        const raw_entries = res.data.entries.map((entry) => {
            // TODO: super hacky with lots of assumptions that could easily break :(
            // why is this reading as string? could i read as a date format from mongoose?
            entry["date"] = _momentDateFromMongo(entry["date"]).format('MM/DD/YYYY');
            return entry;
        });

        // process into a map format we can easily consume
        raw_entries.forEach((entry) => {
            // if habit_id is null, it's a daily retro
            const habit_id = entry["habit"] ? entry["habit"] : "daily-retro";

            entries[habit_id][entry["date"]] = {
                value: entry["value"],
                note: entry["note"]
            };
        });

        // preprocess incoming events
        const events = res.data.events.map((event) => {
            event["startDate"] = _momentDateFromMongo(event["startDate"]);
            event["endDate"] = _momentDateFromMongo(event["endDate"]);
            return event;
        });

        dispatch({
            type: "LOAD_USER",
            payload: {
                user: user_id,
                days: days,
                categoryOrder: categoryOrder,
                categories: categories,
                habitOrder: habitOrder,
                habits: habits,
                entries: entries,
                events: events,
            }
        });
    }
}

/////////// CATEGORY ACTIONS ///////////

export function createCategory(title, icon, order, color) {
    const data = {
        title: title,
        icon: icon,
        color: color,
        order: 1
    }

    return async function(dispatch) {
        let res = await axios.put('http://localhost:8082/api/users/' + user_id + '/category', data);
        dispatch({
            type: "CREATE_CATEGORY",
            payload: res.data
        });
    }
}

export function updateCategory(category, title, icon, order, color) {
    let data = {};
    if (title) { data["title"] = title; }
    if (icon) { data["icon"] = icon; }
    if (order) { data["order"] = order; }
    if (color) { data["color"] = color; }

    return async function(dispatch) {
        let res = await axios.post('http://localhost:8082/api/users/' + user_id + '/category/' + category, data);
        dispatch({
            type: "UPDATE_CATEGORY",
            payload: res.data
        });
    }
}

export function deleteCategory(category) {
    return async function(dispatch) {
        let res = await axios.delete('http://localhost:8082/api/users/' + user_id + '/category/' + category);
        if (res.status === 200) {
            dispatch({
                type: "DELETE_CATEGORY",
                payload: category,
            })
        }
    }
}

export function toggleShowCategoryEditDialog(showCategoryEditDialog) {
    return (dispatch) => dispatch({
        type: "TOGGLE_SHOW_CATEGORY_EDIT_DIALOG",
        payload: showCategoryEditDialog,
    })
}

/////////// HABIT ACTIONS ///////////

export function selectHabitForEdit(habit, showDialog) {
    return (dispatch) => dispatch({
        type: "SELECT_NEW_HABIT",
        payload: {
            habit: habit,
            showHabitEditDialog: showDialog
        }
    })
}

export function createHabit(title, description, category, color, thresholds) {
    const data = {
        title: title,
        description: description,
        category: category,
        color: color, 
        order: 1,
        entry_type: "integer",
        entries: [],
        thresholds: thresholds
    }

    return async function(dispatch) {
        let res = await axios.put('http://localhost:8082/api/users/' + user_id + '/habit', data);
        dispatch({
            type: "CREATE_HABIT",
            payload: res.data
        });
    }
}

export function updateHabit(habit, title, description, category, color, thresholds) {
    const data = {
        title: title,
        description: description,
        category: category,
        color: color,
        entry_type: "integer",
        thresholds: thresholds
    };
    
    return async function(dispatch) {
        let res = await axios.post('http://localhost:8082/api/users/' + user_id + '/habit/' + habit, data);
        dispatch({
            type: "UPDATE_HABIT",
            payload: res.data
        });
    }
}

export function deleteHabit(habit) {
    return async function(dispatch) {
        let res = await axios.delete('http://localhost:8082/api/users/' + user_id + '/habit/' + habit);
        if (res.status === 200) {
            dispatch({
                type: "DELETE_HABIT",
                payload: habit,
            })
        }
    }
}

/////////// EVENT ACTIONS ///////////

export function createEvent(title, color, startDate, endDate) {
    const data = {
        title: title,
        color: color,
        startDate: startDate,
        endDate: endDate,
    };

    return async function(dispatch) {
        let res = await axios.put('http://localhost:8082/api/users/' + user_id + '/events', data);
        console.log(res.data.startDate);
        const payload = {
            ...res.data,
            startDate: _momentDateFromMongo(res.data.startDate),
            endDate: _momentDateFromMongo(res.data.endDate),
        }

        dispatch({
            type: "CREATE_EVENT",
            payload: payload
        });
    }
}

export function updateEvent(event, title, color, startDate, endDate) {
    const data = {
        title: title,
        color: color,
        startDate: startDate,
        endDate: endDate,
    };

    return async function(dispatch) {
        let res = await axios.post('http://localhost:8082/api/users/' + user_id + '/events/' + event, data);
        const payload = {
            ...res.data,
            startDate: _momentDateFromMongo(res.data.startDate),
            endDate: _momentDateFromMongo(res.data.endDate),
        }
        dispatch({
            type: "UPDATE_EVENT",
            payload: payload
        });
    }
}

export function deleteEvent(event) {
    return async function(dispatch) {
        let res = await axios.delete('http://localhost:8082/api/users/' + user_id + '/events/' + event);
        if (res.status === 200) {
            dispatch({
                type: "DELETE_EVENT",
                payload: event,
            })
        }
    }
}

/////////// ENTRY ACTIONS ///////////

export function updateEntry(habit, day, value, note) {
    return async function(dispatch) {
        let data = {
            date: day.format('MM/DD/YYYY')
        };
        if (value) { data["value"] = value; }
        if (note) { data["note"] = note; }

        const URL = (habit && habit !== "daily-retro") ? 
            'http://localhost:8082/api/users/' + user_id + '/habit/' + habit + '/entries' :
            'http://localhost:8082/api/users/' + user_id + '/entries';

        let res = await axios.post(URL, data);
        res.data["date"] = _momentDateFromMongo(res.data["date"]).format("MM/DD/YYYY");
        dispatch({
            type: "UPDATE_ENTRY",
            payload: res.data
        });
    }
}

export function selectEntry(date, habit) {
    return (dispatch) => dispatch({
        type: "SELECT_NEW_ENTRY",
        payload: {
            dateOfSelectedEntry: date,
            habitOfSelectedEntry: habit
        }
    });
}

export function selectEventForEdit(event, showDialog) {
    return (dispatch) => dispatch({
        type: "SELECT_NEW_EVENT",
        payload: {
            event: event,
            showEventEditDialog: showDialog
        }
    })
}