import axios from 'axios';
const moment = require('moment');

// TODO: when signup/login is implemented, remove this hardcoded id
const user_id = "5e0a82dd179d3c3599e6fd8f";

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
                entry: undefined,
                note: undefined
            };
        });

        // setup habits/habit-orders to get ready for loading entries
        const raw_habits = res.data.habits;
        raw_habits.forEach((habit) => {
            console.log("adding: " + habit._id);
            habitOrder.push(habit._id);
            habits[habit._id] = habit;
            entries[habit._id] = {};

            days.forEach((day) => {
                const day_fmt = day.format('MM/DD/YYYY');
                entries[habit._id][day_fmt] = {
                    entry: undefined,
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
                entry: entry["entry"],
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

export function createHabit(name, description, color) {
    const data = {
        name: name,
        description: description,
        color: color, 
        order: 1,
        entry_type: "default",
        entries: []
    }

    return async function(dispatch) {
        let res = await axios.put('http://localhost:8082/api/users/' + user_id, data);
        dispatch({
            type: "CREATE_HABIT",
            payload: res.data
        });
    }
}

export function updateHabit(habit, name, description, color) {
    const data = {
        name: name,
        description: description,
        color: color
    };

    return async function(dispatch) {
        let res = await axios.post('http://localhost:8082/api/users/' + user_id + '/habit/' + habit, data);
        console.log(res.data);
        dispatch({
            type: "UPDATE_HABIT",
            payload: res.data
        });
    }
}

export function updateEntry(habit, day, entry) {
    return async function(dispatch) {
        const data = {
            entry: entry,
            date: day.format('MM/DD/YYYY')
        };

        const URL = habit ? 
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

export function updateNote(habit, day, note) {
    return async function(dispatch) {
        const data = {
            note: note,
            date: day.format('MM/DD/YYYY')
        };
        
        const URL = habit ? 
            'http://localhost:8082/api/users/' + user_id + '/habit/' + habit + '/entries' :
            'http://localhost:8082/api/users/' + user_id + '/entries';

        let res = await axios.post(URL, data);
        res.data["date"] = _momentDateFromMongo(res.data["date"]).format("MM/DD/YYYY");
        dispatch({
            type: "UPDATE_NOTE",
            payload: res.data
        });
    }
}
