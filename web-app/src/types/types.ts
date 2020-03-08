import * as moment from "moment";

export interface Entry {
    habit: string
    date: string
    entry: string
    note: string
};

export interface Habit {
    title: string
    description: string
    category: string
    habit_type: string
}

export interface Category {
    color: string
    title: string
}

export interface Props {
    days: moment.Moment[]
    habitOrder: number[]
    habits: Habit[]
    entries: Entry[]
    user: string
    dayOfSelectedEntry: moment.Moment
    habitOfSelectedEntry: String

    // functions from index.actions
    loadUser: any
    createHabit: any
    updateHabit: any
    updateEntry: any
    updateNote: any
    selectHabitForEdit: any
}
