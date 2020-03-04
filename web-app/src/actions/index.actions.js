import axios from 'axios';
const moment = require('moment');

// TODO: when signup/login is implemented, remove this hardcoded id
const user_id = "5e6030bf510e06e154f566ce";

function _momentDateFromMongo(day) {
    return moment(day.substring(0, 10), "YYYY-MM-DD");
}

export function loadUser(days) {
    return async function(dispatch) {
        const res = await axios.get('http://localhost:8082/api/users/' + user_id);
        console.log('Loaded user: ' + user_id);
        
        let habitOrder = [];
        let habits = {};
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

        dispatch({
            type: "LOAD_USER",
            payload: {
                user: user_id,
                days: days,
                habits: habits,
                entries: entries,
                habitOrder: habitOrder
            }
        });
    }
}

export function createHabit(title, description, color, thresholds) {
    const data = {
        title: title,
        description: description,
        color: color, 
        order: 1,
        entry_type: "integer",
        entries: [],
        thresholds: thresholds
    }

    return async function(dispatch) {
        let res = await axios.put('http://localhost:8082/api/users/' + user_id, data);
        dispatch({
            type: "CREATE_HABIT",
            payload: res.data
        });
    }
}

export function updateHabit(habit, title, description, color, thresholds) {
    const data = {
        title: title,
        description: description,
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

export function selectHabitForEdit(habit, showDialog) {
    return (dispatch) => dispatch({
        type: "SELECT_NEW_HABIT",
        payload: {
            habit: habit,
            showHabitEditDialog: showDialog
        }
    })
}