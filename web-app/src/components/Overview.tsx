import * as React from 'react';
import Habit from './Habit.js';
import Header from './Header.js';
import EntryEditContainer from './EntryEditContainer.js';
import HabitEditDialog from './HabitEditDialog';
import EventEditDialog from './EventEditDialog';
import CategoryEditDialog from './CategoryEditDialog';

import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { Button, Icon } from "@blueprintjs/core";
import { Props } from "../types/types"; 

class Overview extends React.Component<Props>{    
    constructor(props: Props) {
        super(props);
        this.props.loadUser(this.props.days);
    }

    /* deleteHabit(habit, pageindex) {
        this.props.deleteHabit(habit);
        
        axios.delete('http://localhost:8082/api/users/' + this.state.user_id + '/habit/' + habitid)
            .then(res => {
                let new_habits = [...this.state.habits];
                new_habits.splice(pageindex, 1);
                if (res.status === 200) {
                    this.setState({
                        ...this.state,
                        habits: new_habits
                    });
                }
            })
            .catch(err => {console.log("error when deleting habit")});
    } */

    getHabitEntries(habit: string, entries: any) {
        return entries.filter((entry: any) => {
            return entry["habit"] === habit;
        });
    }

    getDailyRetros(entries: any) {
        return entries.filter((entry: any) => {
            return !entry["habit"]  
        });
    }

    render() {
        if (this.props.user) { // because of async, this render happens twice, once on page load and once when we hear back from mongo
            const hasSelectedEntry = (this.props.habitOfSelectedEntry || this.props.dayOfSelectedEntry);
            const footerStatus = hasSelectedEntry ? "footer-visible" : "footer-invisible";
            const footerDiv = hasSelectedEntry ? (
                <div className={"layout-footer " + footerStatus}>
                    <EntryEditContainer />
                </div>
            ) : (
                <div>
                </div>
            )
        

            return (
                <div>
                    <HabitEditDialog />
                    <EventEditDialog />
                    <CategoryEditDialog />
                    <div>
                        <div className="layout-header">
                            <Header />
                        </div>
                        <div className={"layout-body " + footerStatus}>
                            <table>
                                    {
                                        this.props.enrichedCategories.map((category: any, index: number) => {
                                            let categoryHeaderIcon = category.icon ? category.icon : "help";
                                            return (
                                                <tbody key={index}>
                                                    <tr><th rowSpan={category.habits.length + 1} scope={"rowgroup"}>
                                                        <Icon
                                                            style={{"width": 20, "height": 100*(category.habits.length), "backgroundColor": category.color}}
                                                            icon={categoryHeaderIcon} />
                                                    </th></tr>
                                                    {category.habits.map((habit: any, index: number) => <tr key={index}><td><Habit habit={habit._id} /></td></tr>)}
                                                </tbody>
                                            )
                                        })
                                    }
                            </table>
                            <Button icon="add"
                                    onClick={() => this.props.selectHabitForEdit(undefined, true)} > Create new habit </Button>
                        </div>
                        {footerDiv}
                    </div>
                </div>
            );
        } else { // wait, cuz we're loading
            return (<div>Loading...</div>);
        }
    }
}

function mapStateToProps(state: any) {
    // TODO: optimize this?
    let enrichedCategories = state.categoryOrder.map((category: any) => {
        let output = {
            ...state.categories[category],
            habits: [],
        }
        for (let i = 0; i < state.habitOrder.length; i++) {
            if (state.habits[state.habitOrder[i]]["category"] === category) {
                output.habits.push(state.habits[state.habitOrder[i]]);
            }
        }
        return output;
    })
    let uncategorizedHabits = [];
    for (let i = 0; i < state.habitOrder.length; i++) {
        if (!state.habits[state.habitOrder[i]]["category"]) {
            uncategorizedHabits.push(state.habits[state.habitOrder[i]]);
        }
    }
    enrichedCategories = enrichedCategories.concat([{ title: "uncategorized", habits: uncategorizedHabits }]);
    enrichedCategories = enrichedCategories.filter((category: any) => (category.habits.length > 0));
    console.log(enrichedCategories);
    return {
        ...state,
        enrichedCategories: enrichedCategories
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
