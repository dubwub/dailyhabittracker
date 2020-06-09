import { returnLastXDays } from "../utils/habits.utils";
import _ from 'lodash';

let INITIAL_STATE = {
    days: returnLastXDays(7), // ordered list of all days (in moment fmt) that we should be loading on the page
    habitOrder: [],
    habits: {},
    categoryOrder: [],
    categories: {},
    entries: {},
    retros: [],
    user: undefined,
    currentTab: "execution",

    // date/habit for entryeditcontainer
    dateOfSelectedEntry: undefined,
    habitOfSelectedEntry: undefined,
    
    // HabitEditDialog
    showHabitEditDialog: false,
    selectedHabitForEdit: undefined,

    // EventEditDialog
    showEventEditDialog: false,
    selectedEventForEdit: undefined,

    // RetroEditDialog
    showRetroEditDialog: false,
    selectedRetroForEdit: undefined,

    // CategoryEditDialog
    showCategoryEditDialog: false,

    // HabitBreakdownDialog
    showHabitBreakdownDialog: false,
    selectedHabitForBreakdown: undefined,

    // GoalActionDialog
    showGoalActionDialog: false,
    selectedGoalForAction: undefined,
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case "SELECT_TAB": {
            return {
                ...state,
                currentTab: action.payload,
            }
        }
        case "SELECT_NEW_ENTRY": {
            return {
                ...state,
                dateOfSelectedEntry: action.payload.dateOfSelectedEntry,
                habitOfSelectedEntry: action.payload.habitOfSelectedEntry
            };
        }
        case "SELECT_HABIT_FOR_EDIT": {
            return {
                ...state,
                selectedHabitForEdit: action.payload.habit,
                showHabitEditDialog: action.payload.showHabitEditDialog,
            };
        }
        case "SELECT_HABIT_FOR_BREAKDOWN": {
            return {
                ...state,
                selectedHabitForBreakdown: action.payload.habit,
                showHabitBreakdownDialog: action.payload.showHabitBreakdownDialog,
            }
        }
        case "SELECT_GOAL_FOR_ACTION": {
            return {
                ...state,
                selectedGoalForAction: action.payload.goal,
                showGoalActionDialog: action.payload.showGoalActionDialog,
            }
        }
        case "SELECT_NEW_EVENT": {
            return {
                ...state,
                selectedEventForEdit: action.payload.event,
                showEventEditDialog: action.payload.showEventEditDialog,
            }
        }
        case "SELECT_NEW_RETRO": {
            return {
                ...state,
                selectedRetroForEdit: action.payload.retro,
                showRetroEditDialog: action.payload.showRetroEditDialog,
            }
        }
        case "LOAD_USER": {
            return {
                ...state,
                habitOrder: action.payload.habitOrder,
                habits: action.payload.habits,
                categoryOrder: action.payload.categoryOrder,
                categories: action.payload.categories,
                entries: action.payload.entries,
                user: action.payload.user,
                retros: action.payload.retros,
            };
        }
        case "CREATE_HABIT": {
            state["habits"][action.payload._id] = action.payload;
            let newEntries = Object.assign({}, state["entries"]);
            newEntries[action.payload._id] = {};

            // pre-load all days for new habit
            state["days"].forEach((day) => {
                const day_fmt = day.format('MM/DD/YYYY');
                newEntries[action.payload._id][day_fmt] = {
                    value: undefined,
                    note: undefined
                };
            });            

            return {
                ...state,
                habitOrder: state.habitOrder.concat([action.payload._id]),
                habits: state["habits"],
                entries: newEntries 
            };
        }
        case "CREATE_CATEGORY": {
            let newCategories = Object.assign({}, state["categories"]);
            newCategories[action.payload._id] = action.payload;            
            return {
                ...state,
                categoryOrder: state.categoryOrder.concat([action.payload._id]),
                categories: newCategories,
            };
        }
        case "CREATE_EVENT": {
            return {
                ...state,
                events: state.events.concat([action.payload]),
            };
        }
        case "CREATE_RETRO": {
            return {
                ...state,
                retros: state.retros.concat([action.payload]),
            };
        }
        case "UPDATE_HABIT": {
            state["habits"][action.payload._id] = action.payload;
            return {
                ...state,
                habits: state["habits"]
            };
        }
        case "ARCHIVE_HABIT": {
            state["habits"][action.payload._id]['archived'] = true;
            return {
                ...state,
                habits: state["habits"]
            };
        }
        case "UPDATE_CATEGORY": {
            state["categories"][action.payload._id] = action.payload;
            return {
                ...state,
                categories: state["categories"]
            };
        }
        case "UPDATE_EVENT": {
            let events = [...state.events];
            for (let i = 0; i < state.events.length; i++) {
                if (action.payload._id === state.events[i]._id) {
                    events[i] = action.payload;
                }
            }
            return {
                ...state,
                events: events,
            };
        }
        case "UPDATE_RETRO": {
            let retros = [...state.retros];
            for (let i = 0; i < state.retros.length; i++) {
                if (action.payload._id === state.retros[i]._id) {
                    retros[i] = action.payload;
                }
            }
            return {
                ...state,
                retros: retros,
            };
        }
        case "DELETE_EVENT": {
            return {
                ...state,
                events: state.events.filter((event) => (event._id !== action.payload))
            };
        }
        case "DELETE_RETRO": {
            return {
                ...state,
                retros: state.retros.filter((retro) => (retro._id !== action.payload))
            };
        }
        case "DELETE_HABIT": {
            delete state["habits"][action.payload];

            let newHabitOfSelectedEntry = state.habitOfSelectedEntry;
            let newDateOfSelectedEntry = state.dateOfSelectedEntry;
            if (state.habitOfSelectedEntry === action.payload) {
                newHabitOfSelectedEntry = undefined;
                newDateOfSelectedEntry = undefined;
            }
            return {
                ...state,
                habitOrder: state["habitOrder"].filter((entry) => entry !== action.payload),
                habits: state["habits"],
                habitOfSelectedEntry: newHabitOfSelectedEntry,
                dateOfSelectedEntry: newDateOfSelectedEntry,
            };
        }
        case "DELETE_CATEGORY": {
            delete state["categories"][action.payload];

            for (let i = 0; i < state["habitOrder"].length; i++) {
                if (state["habits"][state["habitOrder"][i]].category === action.payload) {
                    state["habits"][state["habitOrder"][i]].category = undefined;
                }
            }

            return {
                ...state,
                categoryOrder: state["categoryOrder"].filter((category) => category !== action.payload),
                habits: state["habits"]
            };
        }
        case "UPDATE_ENTRY": {
            let habit = _.isNil(action.payload.habit) ? "daily-retro" : action.payload.habit;
            let new_habit_entries = Object.assign({}, state["entries"][habit]);
            new_habit_entries[action.payload.date] = action.payload;
            state["entries"][habit][action.payload.date] = {
                value: action.payload.value,
                note: action.payload.note,
                transactions: action.payload.transactions,
            };
            return {
                ...state,
                entries: state["entries"]
            };
        }
        case "TOGGLE_SHOW_CATEGORY_EDIT_DIALOG": {
            return {
                ...state,
                showCategoryEditDialog: action.payload,
            }
        }
        default:
            return state;
    }
}
