const moment = require('moment');

function returnLast30Days() {
    let days = []; 

    for (let i = 0; i < 30; i++) {
        let newDate = moment().subtract(i, 'days');
        days.push(newDate);
    }

    return days;
}


let INITIAL_STATE = {
    days: returnLast30Days(), // ordered list of all days (in moment fmt) that we should be loading on the page
    habitOrder: [],
    habits: {},
    entries: {},
    selectedEntry: {}, // date and habit (daily-retro or uid)
    user: undefined,

    // HabitEditDialog
    showHabitEditDialog: false, // true 
    selectedHabitForEdit: undefined, // if defined, this is habit ID and dialog is open 
};

export default function(state = INITIAL_STATE, action) {
    let habit; // used below for update_note/entry
    
    switch (action.type) {
        case "SELECT_NEW_ENTRY":
            return {
                ...state,
                dateOfSelectedEntry: action.payload.dateOfSelectedEntry,
                habitOfSelectedEntry: action.payload.habitOfSelectedEntry
            };
            break;
        case "SELECT_NEW_HABIT":
            return {
                ...state,
                selectedHabitForEdit: action.payload.habit,
                showHabitEditDialog: action.payload.showHabitEditDialog,
            };
            break;
        case "LOAD_USER":
            return {
                ...state,
                habitOrder: action.payload.habitOrder,
                habits: action.payload.habits,
                entries: action.payload.entries,
                user: action.payload.user 
            };
            break;
        case "CREATE_HABIT":
            state["habits"][action.payload._id] = action.payload;
            state["entries"][action.payload._id] = {};

            // pre-load all days for new habit
            state["days"].forEach((day) => {
                const day_fmt = day.format('MM/DD/YYYY');
                state["entries"][action.payload._id][day_fmt] = {
                    value: undefined,
                    note: undefined
                };
            });            

            return {
                ...state,
                habitOrder: state.habitOrder.concat([action.payload._id]),
                habits: state["habits"],
                entries: state["entries"]
            };
            break;
        case "UPDATE_HABIT": {
            state["habits"][action.payload._id] = action.payload;
            return {
                ...state,
                habits: state["habits"]
            };
            break;
        }
        case "DELETE_HABIT":
            delete state["habits"][action.payload._id];
            return {
                ...state,
                habitOrder: state["habitOrder"].filter((entry) => entry !== action.payload._id),
                habits: state["habits"]
            };
            break;
        case "UPDATE_ENTRY": {
            habit = action.payload.habit || "daily-retro";
            let new_habit_entries = Object.assign({}, state["entries"][habit]);
            new_habit_entries[action.payload.date] = action.payload;
            state["entries"][habit] = new_habit_entries;
            return {
                ...state,
                entries: state["entries"]
            };
            break;
        }
        default:
            return state;
    }
}
