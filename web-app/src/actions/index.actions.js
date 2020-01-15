import axios from 'axios';

// TODO: when signup/login is implemented, remove this hardcoded id
const user_id = "5e0a82dd179d3c3599e6fd8f";

export function loadUser() {
    return async function(dispatch) {
        const res = await axios.get('http://localhost:8082/api/users/' + user_id);
        console.log('Loaded user: ' + user_id);

        // first, preprocess incoming entries
        const raw_entries = res.data.entries.map((entry) => {
            // TODO: super hacky with lots of assumptions that could easily break :(
            // why is this reading as string? could i read as a date format from mongoose?
            entry["date"] = moment(entry["date"].substring(0, 10)).format('MM/DD/YYYY');
            return entry;
        });

        // then, process into a map format we can easily consume
        let entries = {};
        raw_entries.forEach((entry) => {
            // if habit_id is null, it's a daily retro
            const habit_id = entry["habit"] ? entry["habit"] : "daily-retro";

            entries[habit_id][entry["date"]] = {
                entry: entry["entry"],
                note: entry["note"]
            };
        });

        const raw_habits = res.data.habits;
        let habitOrder = [];
        let habits = {};
        raw_habits.map((habit) => {
            habitOrder.push(habit._id);
            habits[habit._id] = habit;
        });

        dispatch({
            type: "LOAD_USER",
            payload: {
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
        await res = axios.put('http://localhost:8082/api/users/' + user_id, data);
        dispatch({
            type: "CREATE_HABIT",
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

        await res = axios.post(URL, data);
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

        await res = axios.post(URL, data);
        dispatch({
            type: "UPDATE_NOTE",
            payload: res.data
        });
    }
}
