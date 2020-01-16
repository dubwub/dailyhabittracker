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
    entries: {}
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case "LOAD_USER":
            return {
                ...state,
                habitOrder: action.payload.habitOrder,
                habits: action.payload.habits,
                entries: action.payload.entries
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
        case "UPDATE_HABIT":
            state["habits"][action.payload._id] = action.payload;
            return {
                ...state,
                habits: state["habits"]
            };
            break;
        case "DELETE_HABIT":
            delete state["habits"][action.payload._id];
            return {
                ...state,
                habitOrder: state["habitOrder"].filter((entry) => entry !== action.payload._id),
                habits: state["habits"]
            };
            break;
        case "UPDATE_ENTRY":
            if (!state["entries"][action.payload.habit][action.payload.date]) {
                state["entries"][action.payload.habit][action.payload.date] = {};
            }
            state["entries"][action.payload.habit][action.payload.date]["entry"] = action.payload.entry;
            return {
                ...state,
                entries: state["entries"]
            };
            break;
        case "UPDATE_NOTE":
            if (!state["entries"][action.payload.habit][action.payload.date]) {
                state["entries"][action.payload.habit][action.payload.date] = {};
            }
            state["entries"][action.payload.habit][action.payload.date]["note"] = action.payload.note;
            return {
                ...state,
                entries: state["entries"]
            };
            break;
        default:
            return state;
    }
}
