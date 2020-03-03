const moment = require('moment');

// optimal state:
// -- habits: list of habit objects
// -- entries: 

/** things that need to be looked up:
    1: need to be able to add an entry for a day and a habit
    2: need to find entry for a day/habit
    3 (eventually): find all entries for a certain habit for calendar view
    4 (eventually): be able to easily calculate streak (same habit over days)

    thus, state:

    {
            habitOrder: [ habit uids ],
            habits: {
                map of habit uid to body
            }
            entries: {
                map of habit uid (could be day-retro-10/26/1991 for "null" habit uids) to {
                    day: {
                        entry details
                    }
                }
            }
    }

    reducers needed:
 * CRUD habit
 * CRUD entry
 **/

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
    user: undefined
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
        // case "UPDATE_NOTE": {
        //     habit = action.payload.habit || "daily-retro";
        //     let new_habit_entries = Object.assign({}, state["entries"][habit]);
        //     new_habit_entries[action.payload.date]["note"] = action.payload.note;
        //     state["entries"][habit] = new_habit_entries;
        //     return {
        //         ...state,
        //         entries: state["entries"]
        //     };
        //     break;
        // }
        default:
            return state;
    }
}
