// TODO: split into separate files
import _ from 'lodash';
import axios from 'axios';
import { hardcoded_server_url } from '../config/constants'; 

// TODO: when signup/login is implemented, remove this hardcoded id
const user_id = "5e804a079f8c170c7f812eeb";

const moment = require('moment');

// V3

export function loadUserV3() {
    return async function(dispatch) {
        const res = await axios.get(hardcoded_server_url + '/api/users/v2/' + user_id);
        console.log('Loaded user: ' + user_id);
        
        let tagOrder = [];
        let tags = {};
        let entries = {};
        let entryOrder = [];

        // setup habits/habit-orders to get ready for loading entries
        // const raw_experiments = res.data.experiments;
        // raw_experiments.forEach((experiment) => {
        //     experimentOrder.push(experiment._id);
        //     if (experiment.startDate) {
        //         experiment.startDate = _momentDateFromMongo(experiment.startDate);
        //     }
        //     if (experiment.endDate) {
        //         experiment.endDate = _momentDateFromMongo(experiment.endDate);
        //     }
        //     experiments[experiment._id] = experiment;
        // });

        // const raw_dreams = res.data.dreams;
        // raw_dreams.forEach((dream) => {
        //     dreamOrder.push(dream._id);
        //     dreams[dream._id] = dream;
        // });

        // preprocess incoming entries
        const raw_entries = res.data.entries;
        entryOrder = raw_entries.map((entry) => {
            entries[entry._id] = entry;
            return entry._id;
        })

        dispatch({
            type: "LOAD_USER_V3",
            payload: {
                user: user_id,
                tagOrder: tagOrder,
                tags: tags,
                entriesV3Order: entryOrder,
                entriesV3: entries,
            }
        });
    }
}

export function createEntryV3(type, title, note, tags, transactions) {
    return async function(dispatch) {
        let data = {
            time: Date.now(), 
            entryType: type,
            title: title,
            note: note,
            tags: tags.map((tag) => {return { tag: tag.tag, entryType: tag.type }}),
            transactions: transactions,
        };
        const URL = hardcoded_server_url + '/api/users/' + user_id + '/entries';
        let res = await axios.put(URL, data);
        res.data["time"] = _momentDateFromMongo(res.data["time"]).format("MM/DD/YYYY");
        dispatch({
            type: "CREATE_ENTRY_V3",
            payload: res.data
        });
    }
}


// V2

export function selectTabV2(tab) {
    return (dispatch) => dispatch({
        type: "SELECT_TAB_V2",
        payload: tab,
    })
}


export function loadUserV2(days) {
    return async function(dispatch) {
        const res = await axios.get(hardcoded_server_url + '/api/users/v2/' + user_id);
        console.log('Loaded user: ' + user_id);
        
        let dreamOrder = [];
        let dreams = {};
        let experimentOrder = [];
        let experiments = {};
        let entries = [];

        // setup habits/habit-orders to get ready for loading entries
        const raw_experiments = res.data.experiments;
        raw_experiments.forEach((experiment) => {
            experimentOrder.push(experiment._id);
            if (experiment.startDate) {
                experiment.startDate = _momentDateFromMongo(experiment.startDate);
            }
            if (experiment.endDate) {
                experiment.endDate = _momentDateFromMongo(experiment.endDate);
            }
            experiments[experiment._id] = experiment;
        });

        const raw_dreams = res.data.dreams;
        raw_dreams.forEach((dream) => {
            dreamOrder.push(dream._id);
            dreams[dream._id] = dream;
        });

        // preprocess incoming entries
        const raw_entries = res.data.entries;

        dispatch({
            type: "LOAD_USER_V2",
            payload: {
                user: user_id,
                days: days,
                experiments: experiments,
                experimentOrder: experimentOrder,
                dreams: dreams,
                dreamOrder: dreamOrder,
                entries: raw_entries,
            }
        });
    }
}

export function createExperiment(title, startDate, endDate) {
    const data = {
        title: title,
        startDate: startDate,
        endDate: endDate
    }

    return async function(dispatch) {
        let res = await axios.put(hardcoded_server_url + '/api/users/' + user_id + '/experiments', data);

        const payload = {
            ...res.data,
            startDate: _.isNil(res.data.startDate) ? undefined: _momentDateFromMongo(res.data.startDate),
            endDate: _.isNil(res.data.endDate) ? undefined : _momentDateFromMongo(res.data.endDate),
        }

        dispatch({
            type: "CREATE_EXPERIMENT",
            payload: payload,
        });
    }
}

export function createDream(title, description, color, order) {
    const data = {
        title: title,
        description: description,
        color: color,
        order: order
    }

    return async function(dispatch) {
        let res = await axios.put(hardcoded_server_url + '/api/users/' + user_id + '/dreams', data);
        dispatch({
            type: "CREATE_DREAM",
            payload: res.data
        });
    }
}

export function editDream(dream, title, description, color, order) {
    let data = {};
    if (!_.isNil(title)) { data["title"] = title; }
    if (!_.isNil(description)) { data["icon"] = description; }
    if (!_.isNil(color)) { data["order"] = color; }
    if (!_.isNil(order)) { data["color"] = order; }

    return async function(dispatch) {
        let res = await axios.post(hardcoded_server_url + '/api/users/' + user_id + '/dreams/' + dream, data);
        dispatch({
            type: "UPDATE_DREAM",
            payload: res.data
        });
    }
}

export function editExperiment(experiment, title, description, color, startDate, endDate, dream, order) {
    let data = {};
    if (!_.isNil(title)) { data["title"] = title; }
    if (!_.isNil(description)) { data["description"] = description; }
    if (!_.isNil(color)) { data["color"] = color; }
    if (!_.isNil(startDate)) { data["startDate"] = startDate; }
    if (!_.isNil(endDate)) { data["endDate"] = endDate; }
    if (!_.isNil(dream)) { data["dream"] = dream; }
    if (!_.isNil(order)) { data["order"] = order; }

    return async function(dispatch) {
        let res = await axios.post(hardcoded_server_url + '/api/users/' + user_id + '/experiments/' + experiment, data);
        dispatch({
            type: "UPDATE_EXPERIMENT",
            payload: res.data
        });
    }
}

export function createEntryV2(title, dreams, experiments, feelingScore, note, observations, highlights, subnotes) {
    return async function(dispatch) {
        let data = {
            lastUpdatedAt: Date.now(), 
            title: title,
            dreams: dreams,
            experiments: experiments,
            feelingScore: feelingScore,
            note: note,
            observations: observations,
            highlights: highlights,
            subnotes: subnotes,
        };
        const URL = hardcoded_server_url + '/api/users/' + user_id + '/entries';
        let res = await axios.put(URL, data);
        res.data["lastUpdatedAt"] = _momentDateFromMongo(res.data["lastUpdatedAt"]).format("MM/DD/YYYY");
        dispatch({
            type: "CREATE_ENTRY_V2",
            payload: res.data
        });
    }
}




























// V1

// TODO: is there a better way of storing dates with mongo? can i just store a moment object?
function _momentDateFromMongo(day) {
    if (typeof day === "undefined") {
        return undefined;
    }
    return moment(day.substring(0, 10), "YYYY-MM-DD");
}

export function loadUser(days) {
    return async function(dispatch) {
        const res = await axios.get(hardcoded_server_url + '/api/users/' + user_id);
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
                note: undefined,
                tags: [],
            };
        });

        // setup habits/habit-orders to get ready for loading entries
        const raw_habits = res.data.habits;
        raw_habits.forEach((habit) => {
            habitOrder.push(habit._id);
            if (habit.startDate) {
                habit.startDate = _momentDateFromMongo(habit.startDate);
            }
            if (habit.endDate) {
                habit.endDate = _momentDateFromMongo(habit.endDate);
            }
            habits[habit._id] = habit;
            entries[habit._id] = {};

            days.forEach((day) => {
                const day_fmt = day.format('MM/DD/YYYY');
                entries[habit._id][day_fmt] = {
                    value: undefined,
                    note: undefined,
                    tags: [],
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

            if (!_.isNil(entries[habit_id])) {
                entries[habit_id][entry["date"]] = { // we should delete entries tied to deleted habits
                    value: entry["value"],
                    note: entry["note"],
                    transactions: entry["transactions"],
                    tags: entry["tags"],
                };
            }
        });

        // preprocess incoming events
        const retros = res.data.retros.map((retro) => {
            retro["startDate"] = _momentDateFromMongo(retro["startDate"]);
            retro["endDate"] = _momentDateFromMongo(retro["endDate"]);
            return retro;
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
                retros: retros,
            }
        });
    }
}

/////////// META ACTIONS ///////////

export function selectTab(tab) {
    return (dispatch) => dispatch({
        type: "SELECT_TAB",
        payload: tab,
    })
}

/////////// CATEGORY ACTIONS ///////////

export function createCategory(title, icon, order, color) {
    const data = {
        title: title,
        icon: icon,
        color: color,
        order: order,
    }

    return async function(dispatch) {
        let res = await axios.put(hardcoded_server_url + '/api/users/' + user_id + '/category', data);
        dispatch({
            type: "CREATE_CATEGORY",
            payload: res.data
        });
    }
}

export function updateCategory(category, title, icon, order, color) {
    let data = {};
    if (!_.isNil(title)) { data["title"] = title; }
    if (!_.isNil(icon)) { data["icon"] = icon; }
    if (!_.isNil(order)) { data["order"] = order; }
    if (!_.isNil(color)) { data["color"] = color; }

    return async function(dispatch) {
        let res = await axios.post(hardcoded_server_url + '/api/users/' + user_id + '/category/' + category, data);
        dispatch({
            type: "UPDATE_CATEGORY",
            payload: res.data
        });
    }
}

export function deleteCategory(category) {
    return async function(dispatch) {
        let res = await axios.delete(hardcoded_server_url + '/api/users/' + user_id + '/category/' + category);
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
        type: "SELECT_HABIT_FOR_EDIT",
        payload: {
            habit: habit,
            showHabitEditDialog: showDialog
        }
    })
}

export function selectHabitForBreakdown(habit, showDialog) {
    return (dispatch) => dispatch({
        type: "SELECT_HABIT_FOR_BREAKDOWN",
        payload: {
            habit: habit,
            showHabitBreakdownDialog: showDialog
        }
    })
}

export function createHabit(title, description, category, order, color, thresholds, tags, startDate, endDate) {
    const data = {
        title: title,
        description: description,
        category: category,
        color: color, 
        order: order,
        entry_type: "integer",
        entries: [],
        thresholds: thresholds,
        tags: tags,
        startDate: startDate,
        endDate: endDate,
        archived: false, // you would never create an archived habit
    }

    return async function(dispatch) {
        let res = await axios.put(hardcoded_server_url + '/api/users/' + user_id + '/habit', data);

        const payload = {
            ...res.data,
            startDate: _.isNil(res.data.startDate) ? undefined: _momentDateFromMongo(res.data.startDate),
            endDate: _.isNil(res.data.endDate) ? undefined : _momentDateFromMongo(res.data.endDate),
        }

        dispatch({
            type: "CREATE_HABIT",
            payload: payload,
        });
    }
}

export function updateHabit(habit, title, description, category, order, color, thresholds, tags, startDate, endDate, archived) {
    const data = {
        title: title,
        description: description,
        category: category,
        order: order,
        color: color,
        thresholds: thresholds,
        tags: tags,
        startDate: startDate,
        endDate: endDate,
        archived: archived,
    };

    return async function(dispatch) {
        let res = await axios.post(hardcoded_server_url + '/api/users/' + user_id + '/habit/' + habit, data);

        const payload = {
            ...res.data,
            startDate: _momentDateFromMongo(res.data.startDate),
            endDate: _momentDateFromMongo(res.data.endDate),
        }

        dispatch({
            type: "UPDATE_HABIT",
            payload: payload
        });
    }
}

export function archiveHabit(habit) {
    const data = {
        archived: true
    }

    return async function(dispatch) {
        let res = await axios.post(hardcoded_server_url + '/api/users/' + user_id + '/habit/' + habit + '/archive', data);

        const payload = {
            ...res.data
        }

        dispatch({
            type: "ARCHIVE_HABIT",
            payload: payload
        });
    }
}

export function deleteHabit(habit) {
    return async function(dispatch) {
        let res = await axios.delete(hardcoded_server_url + '/api/users/' + user_id + '/habit/' + habit);
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
        let res = await axios.put(hardcoded_server_url + '/api/users/' + user_id + '/events', data);
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
        let res = await axios.post(hardcoded_server_url + '/api/users/' + user_id + '/events/' + event, data);
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
        let res = await axios.delete(hardcoded_server_url + '/api/users/' + user_id + '/events/' + event);
        if (res.status === 200) {
            dispatch({
                type: "DELETE_EVENT",
                payload: event,
            })
        }
    }
}

/////////// RETRO ACTIONS ///////////

export function createRetro(title, startDate, endDate, value, note, goal) {
    const data = {
        title: title,
        startDate: startDate,
        endDate: endDate,
        value: value,
        note: note,
        goal: goal,
    };

    return async function(dispatch) {
        let res = await axios.put(hardcoded_server_url + '/api/users/' + user_id + '/retros', data);
        const payload = {
            ...res.data,
            startDate: _momentDateFromMongo(res.data.startDate),
            endDate: _momentDateFromMongo(res.data.endDate),
        }

        dispatch({
            type: "CREATE_RETRO",
            payload: payload
        });
    }
}

export function updateRetro(retro, title, startDate, endDate, value, note) {
    const data = {
        title: title,
        startDate: startDate,
        endDate: endDate,
        value: value,
        note: note
    };

    return async function(dispatch) {
        let res = await axios.post(hardcoded_server_url + '/api/users/' + user_id + '/retros/' + retro, data);
        const payload = {
            ...res.data,
            startDate: _momentDateFromMongo(res.data.startDate),
            endDate: _momentDateFromMongo(res.data.endDate),
        }
        dispatch({
            type: "UPDATE_RETRO",
            payload: payload
        });
    }
}

export function deleteRetro(retro) {
    return async function(dispatch) {
        let res = await axios.delete(hardcoded_server_url + '/api/users/' + user_id + '/retros/' + retro);
        if (res.status === 200) {
            dispatch({
                type: "DELETE_RETRO",
                payload: retro,
            })
        }
    }
}

/////////// ENTRY ACTIONS ///////////

// export function updateEntry(habit, day, value, note, transactions, tags) {
//     return async function(dispatch) {
//         let data = {
//             date: day.format('MM/DD/YYYY')
//         };
//         if (!_.isNil(value)) { data["value"] = value; }
//         if (!_.isNil(note)) { data["note"] = note; }
//         if (!_.isNil(transactions)) { data["transactions"] = transactions; }
//         if (!_.isNil(tags)) { data["tags"] = tags; }

//         const URL = (!_.isNil(habit) && habit !== "daily-retro") ? 
//             hardcoded_server_url + '/api/users/' + user_id + '/habit/' + habit + '/entries' :
//             hardcoded_server_url + '/api/users/' + user_id + '/entries';

//         let res = await axios.post(URL, data);
//         res.data["date"] = _momentDateFromMongo(res.data["date"]).format("MM/DD/YYYY");
//         dispatch({
//             type: "UPDATE_ENTRY",
//             payload: res.data
//         });
//     }
// }

export function updateEntryValue(habit, day, value) {
    return async function(dispatch) {
        let data = {
            date: day.format('MM/DD/YYYY'),
            value: value,
        };
        const URL = (!_.isNil(habit) && habit !== "daily-retro") ? 
            hardcoded_server_url + '/api/users/' + user_id + '/habit/' + habit + '/entries/value' :
            hardcoded_server_url + '/api/users/' + user_id + '/entries/value';
        let res = await axios.post(URL, data);
        res.data["date"] = _momentDateFromMongo(res.data["date"]).format("MM/DD/YYYY");
        dispatch({
            type: "UPDATE_ENTRY",
            payload: res.data
        });
    }
}

export function updateEntryNote(habit, day, note) {
    return async function(dispatch) {
        let data = {
            date: day.format('MM/DD/YYYY'),
            note: note,
        };
        const URL = (!_.isNil(habit) && habit !== "daily-retro") ? 
            hardcoded_server_url + '/api/users/' + user_id + '/habit/' + habit + '/entries/note' :
            hardcoded_server_url + '/api/users/' + user_id + '/entries/note';
        let res = await axios.post(URL, data);
        res.data["date"] = _momentDateFromMongo(res.data["date"]).format("MM/DD/YYYY");
        dispatch({
            type: "UPDATE_ENTRY",
            payload: res.data
        });
    }
}

export function updateEntryTransactions(habit, day, transactions) {
    return async function(dispatch) {
        let data = {
            date: day.format('MM/DD/YYYY'),
            transactions: transactions,
        };
        const URL = (!_.isNil(habit) && habit !== "daily-retro") ? 
            hardcoded_server_url + '/api/users/' + user_id + '/habit/' + habit + '/entries/transactions' :
            hardcoded_server_url + '/api/users/' + user_id + '/entries/transactions';
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

export function selectRetroForEdit(retro, showDialog) {
    return (dispatch) => dispatch({
        type: "SELECT_NEW_RETRO",
        payload: {
            retro: retro,
            showRetroEditDialog: showDialog
        }
    })
}

export function selectGoalForAction(goal, showDialog) {
    return (dispatch) => dispatch({
        type: "SELECT_GOAL_FOR_ACTION",
        payload: {
            goal: goal,
            showGoalActionDialog: showDialog
        }
    })
}