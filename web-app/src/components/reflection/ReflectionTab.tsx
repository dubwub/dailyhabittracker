import * as React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../../actions/index.actions.js'; 
import { Button } from "@blueprintjs/core";

const projectHeight: number = 40;

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
    days: any
}

interface State {
    expandedHabits: any
}

class ReflectionTab extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            expandedHabits: {}
        };
    }

    toggleExpandCollapse(id: string) {
        if (_.isNil(this.state.expandedHabits[id]) || (!_.isNil(this.state.expandedHabits[id]) && this.state.expandedHabits[id] === false)) {
            let newState: any = {};
            Object.assign(newState, this.state);
            newState.expandedHabits[id] = true;
            this.setState(newState);
        } else {
            let newState: any = {};
            Object.assign(newState, this.state);
            newState.expandedHabits[id] = false;
            this.setState(newState);
        }
    }

    render() {
        return (
            <div style={{border: "2px solid gray", width: "100%", height: "100%", position: "relative", overflowY: "auto", overflowX: "hidden"}}>
                            {
                                this.props.enrichedCategories.map((category: any, index: number) => {
                                    return (
                                        <div key={category._id} style={{
                                                width: "100%",
                                                minHeight: 100,
                                                height: projectHeight*(category.habits.length) + 30,
                                                position: "absolute",
                                                left: 0,
                                                top: category.top,
                                                }}>
                                            <div style={{
                                                width: "100%",
                                                height: "100%",
                                                backgroundColor: category.color,
                                                opacity: 0.4,
                                                position: "absolute",
                                                left: 0,
                                                top: 0
                                            }}></div>
                                            <div style={{paddingLeft: 10}}><b>{category.title}</b></div>
                                            { category.habits.map((habit: any, index: number) => 
                                                    {
                                                        // const habit: any = this.props.habits[habitIndex];
                                                        return (<div key={habit._id} style={{width: "100%", height: projectHeight, position: "absolute", left: 0, top: 25 + index * projectHeight}}>
                                                            <b>{ habit.title }</b>
                                                            &nbsp;Archived: {!_.isNil(habit.archived) ? habit.archived.toString() : "false"} 
                                                            &nbsp;Start Date: {!_.isNil(habit.startDate) ? habit.startDate.format("MM/DD/YYYY") : undefined}
                                                            &nbsp;End Date: {!_.isNil(habit.endDate) ? habit.endDate.format("MM/DD/YYYY") : undefined}
                                                            <Button onClick={() => this.toggleExpandCollapse(habit._id)}>Expand/Collapse</Button>

                                                            <div style={{
                                                                display: !_.isNil(this.state.expandedHabits[habit._id]) && this.state.expandedHabits[habit._id] ? "block" : "none",
                                                                height: 300,
                                                                overflowY: "auto"
                                                            }}>
                                                                {
                                                                    this.props.days.map((day: any) => {
                                                                        if (!_.isNull(this.props.entries[habit._id][day.format("MM/DD/YYYY")])) {
                                                                            return (
                                                                                <div style={{height: 50}}>{this.props.entries[habit._id][day.format("MM/DD/YYYY")].entry}: {this.props.entries[habit._id][day.format("MM/DD/YYYY")].note}</div>
                                                                            )
                                                                        }
                                                                    })
                                                                }
                                                            </div>
                                                        </div>);
                                                    })}
                                        </div>
                                    )
                                })
                            }
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
        entries: state.entries,
        days: state.days,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReflectionTab);
