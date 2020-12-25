import * as React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../../actions/index.actions.js'; 
import { Button, Tag } from "@blueprintjs/core";
import { getThresholdFromValue } from '../../utils/habits.utils';

const projectHeight: number = 40;

const DEFAULT_THRESHOLDS = [
    {
        icon: "heart-broken",
        color: "#ea9999",
        condition: "le",
        minValue: undefined,
        maxValue: 1
    },
    {
        icon: "cross",
        color: "#f5b880",
        condition: "eq",
        minValue: 2,
        maxValue: 2
    },
    {
        icon: "",
        color: "#ffd666",
        condition: "eq",
        minValue: 3,
        maxValue: 3
    },
    {
        icon: "tick",
        color: "#abc978",
        condition: "eq",
        minValue: 4,
        maxValue: 4
    },
    {
        icon: "clean",
        color: "#57bb8a",
        condition: "ge",
        minValue: 5,
        maxValue: undefined
    }
];

// below are helper functions used for display

function _generateSortedHabitOrder(habitOrder: any, habits: any) {
    habitOrder.sort((h1: any, h2: any) => {
        if (habits[h1]["order"] !== habits[h2]["order"]) { return habits[h1]["order"] - habits[h2]["order"]; }
        else { return habits[h1]["title"].localeCompare(habits[h2]["title"]); }
    });
    return habitOrder;
}

function _generateSortedCategoryOrder(categoryOrder: any, categories: any) {
    categoryOrder.sort((cat1: any, cat2: any) => {
        return categories[cat1]["order"] - categories[cat2]["order"];
    });
    return categoryOrder;
}

interface Props {
    enrichedCategories: any
    entries: any
}

interface State {
    selectedGoal: string,
    selectedDream: number,
    showDailyRetro: boolean,
}

class ReflectionTab extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedGoal: "",
            selectedDream: 0,
            showDailyRetro: true,
        };
    }

    goToNextDream() {
        let nextDream = this.state.selectedDream + 1;
        if (nextDream >= this.props.enrichedCategories.length) {
            nextDream = 0;
        }

        this.setState({
            selectedGoal: "",
            selectedDream: nextDream
        })
    }

    goToPrevDream() {
        let nextDream = this.state.selectedDream - 1;
        if (nextDream < 0) {
            nextDream = this.props.enrichedCategories.length - 1;
        }

        this.setState({
            selectedGoal: "",
            selectedDream: nextDream
        })
    }

    selectNewGoal(id: string) {
        this.setState({
            ...this.state,
            selectedGoal: id,
        })
    }

    toggleShowDailyRetro() {
        this.setState({
            ...this.state,
            showDailyRetro: !this.state.showDailyRetro,
        })
    }

    render() {
        const category = this.props.enrichedCategories[this.state.selectedDream];
        const selectedGoalDivs = [];
        if (this.state.selectedGoal !== "") {
            let sortedKeys = Object.keys(this.props.entries[this.state.selectedGoal]);
            sortedKeys.sort(function (a: string, b: string) {
                if (Date.parse(a) < Date.parse(b)) {
                    return -1;
                } else if (Date.parse(a) > Date.parse(b)) {
                    return 1;
                } else {
                    return 0;
                }
            })

            for (let key of sortedKeys) {
                if (this.props.entries[this.state.selectedGoal][key].value ||
                    this.props.entries[this.state.selectedGoal][key].note ||
                    (this.props.entries[this.state.selectedGoal][key].transactions && this.props.entries[this.state.selectedGoal][key].transactions.length > 0)) {
                    selectedGoalDivs.push((
                        <div style={{
                            backgroundColor: getThresholdFromValue(DEFAULT_THRESHOLDS, this.props.entries[this.state.selectedGoal][key].value).color,
                            color: "black"
                        }}><b>({key}) {this.props.entries[this.state.selectedGoal][key].value}</b>: {this.props.entries[this.state.selectedGoal][key].note}</div>
                    ))
                }
            }
        } else {
            let allEntries: any = [];
            let habits = category.habits;
            if (this.state.showDailyRetro) {
                habits = habits.concat([{_id: "daily-retro", title: "Daily Retro"}]);
            }

            habits.map((goalObject: any) => {
                let goal = goalObject._id;
                let keys = Object.keys(this.props.entries[goal]);
                for (let key of keys) {
                    allEntries.push({
                        ...this.props.entries[goal][key],
                        date: key,
                        goalTitle: goalObject.title,
                    })
                }
            });

            allEntries.sort(function (a: any, b: any) {
                if (Date.parse(a.date) < Date.parse(b.date)) {
                    return 1;
                } else if (Date.parse(a.date) > Date.parse(b.date)) {
                    return -1;
                } else {
                    return 0;
                }
            })

            for (let entry of allEntries) {
                if (entry.value || entry.note || (entry.transactions && entry.transactions.length > 0)) {
                    for (let transaction of entry.transactions) {
                        selectedGoalDivs.push((
                            <div style={{
                                backgroundColor: getThresholdFromValue(DEFAULT_THRESHOLDS, entry.value).color,
                                color: "black"
                            }}><b>({transaction.time}) {entry.goalTitle} {transaction.value}:</b> {transaction.note}</div>
                        ))
                    }
                    selectedGoalDivs.push((
                        <div style={{
                            backgroundColor: getThresholdFromValue(DEFAULT_THRESHOLDS, entry.value).color,
                            color: "black"
                        }}><b>({entry.date}) {entry.goalTitle} {entry.value}:</b> {entry.note}</div>
                    ))
                }
            }
        }

        return (
            <div style={{border: "2px solid gray", width: "100%", height: "100%", position: "relative", overflowY: "auto", overflowX: "hidden", backgroundColor: category.color}}>
                <div style={{width: "50%", height: "100%", position: "absolute", top: 0, left: 0}}>
                    <div style={{paddingLeft: 10}}><b>{category.title}</b></div>
                    <Button onClick={() => this.goToPrevDream()}>Go previous dream</Button>
                    <Button onClick={() => this.goToNextDream()}>Go next dream</Button>
                    <Button onClick={() => this.toggleShowDailyRetro()}>Toggle Daily Retros</Button>
                    { category.habits.map((habit: any, index: number) => 
                        {
                            // const habit: any = this.props.habits[habitIndex];
                            return (<div key={habit._id} style={{width: "100%", height: projectHeight}}>
                                <b>{ habit.title }</b>
                                &nbsp;Archived: {!_.isNil(habit.archived) ? habit.archived.toString() : "false"} 
                                &nbsp;Start Date: {!_.isNil(habit.startDate) ? habit.startDate.format("MM/DD/YYYY") : undefined}
                                &nbsp;End Date: {!_.isNil(habit.endDate) ? habit.endDate.format("MM/DD/YYYY") : undefined}
                                <Button onClick={() => this.selectNewGoal(habit._id)}>Select for drilldown</Button>
                            </div>);
                        })}
                </div>
                <div style={{width: "50%", height: "100%", position: "absolute", top: 0, left: "50%"}}>
                    {
                        selectedGoalDivs
                    }
                </div>
                
            </div>
        )
    }
}

function mapStateToProps(state: any) {
    const habitOrder: any = _generateSortedHabitOrder(state.habitOrder, state.habits);
    const categoryOrder: any = _generateSortedCategoryOrder(state.categoryOrder, state.categories);
    // TODO: optimize this?
    let top = 0;
    let enrichedCategories = categoryOrder.map((category: any) => {
        let output = {
            ...state.categories[category],
            habits: [],
            top: top,
        }
        for (let i = 0; i < habitOrder.length; i++) {
            if (state.habits[habitOrder[i]]["category"] === category) {
                output.habits.push(state.habits[habitOrder[i]]);
            }
        }
        top += Math.max(output['habits'].length * projectHeight + 30, 100);
        return output;
    })
    let uncategorizedHabits = [];
    for (let i = 0; i < habitOrder.length; i++) {
        if (!state.habits[habitOrder[i]]["category"]) {
            uncategorizedHabits.push(state.habits[habitOrder[i]]);
        }
    }
    enrichedCategories = enrichedCategories.concat([{ title: "uncategorized", habits: uncategorizedHabits, top: top }]);
    enrichedCategories = enrichedCategories.filter((category: any) => (category.habits.length > 0));

    let flatHabits: any[] = [];
    for (let i = 0; i < enrichedCategories.length; i++) {
        for (let j = 0; j < enrichedCategories[i]["habits"].length; j++) {
            flatHabits.push(enrichedCategories[i]["habits"][j]);
        }
    }

    return {
        enrichedCategories: enrichedCategories,
        entries: state.entries
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReflectionTab);
