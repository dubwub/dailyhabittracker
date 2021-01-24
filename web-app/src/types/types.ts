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
    enrichedCategories: any

    // V3
    tags: any
    tagOrder: string[]
    entriesV3: any
    entriesV3Order: string[]
    loadUserV3: any
    createEntryV3: any

    // V2
    dreamOrder: string[]
    dreams: any
    experimentOrder: string[]
    experiments: any
    entriesV2: any[]
    selectTabV2: any
    loadUserV2: any
    currentTabV2: string
    editedTitle: string
    editedFeelingScore: number
    editedNote: string
    editedExperiments: [string]
    editedDreams: [string]
    editedObservations: [string]
    createExperiment: any
    createDream: any
    createEntryV2: any



    // functions from index.actions
    loadUser: any
    createHabit: any
    updateHabit: any
    updateEntryValue: any
    updateEntryNote: any
    updateEntryTransactions: any
    updateNote: any
    selectHabitForEdit: any
    toggleShowCategoryEditDialog: any
    selectTab: any
    currentTab: string
}

