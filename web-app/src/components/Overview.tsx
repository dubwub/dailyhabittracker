import * as React from 'react';
import Header from './Header';
import HabitHeader from './HabitHeader';
import HabitBody from './HabitBody';
import EntryEditContainer from './EntryEditContainer';
import HabitEditDialog from './HabitEditDialog';
import HabitBreakdownDialog from './HabitBreakdownDialog';
import EventEditDialog from './EventEditDialog';
import CategoryEditDialog from './CategoryEditDialog';

import { connect } from 'react-redux';
import { returnLastXDays } from '../utils/habits.utils';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { Button, Icon } from "@blueprintjs/core";
import { Props } from "../types/types"; 

// below are helper functions used for display

function _generateSortedHabitOrder(habitOrder: any, habits: any) {
    habitOrder.sort((h1: any, h2: any) => {
        if (habits[h1]["order"] !== habits[h2]["order"]) { return habits[h1]["order"] < habits[h2]["order"]; }
        else { return habits[h1]["title"].localeCompare(habits[h2]["title"]); }
    });
    return habitOrder;
}

function _generateSortedCategoryOrder(categoryOrder: any, categories: any) {
    categoryOrder.sort((cat1: any, cat2: any) => {
        if (categories[cat1]["order"] !== categories[cat2]["order"]) { return categories[cat1]["order"] - categories[cat2]["order"]; }
        else { return categories[cat1]["title"].localeCompare(categories[cat2]["title"]); }
    });
    return categoryOrder;
}

class Overview extends React.Component<Props>{    
    constructor(props: Props) {
        super(props);
        this.props.loadUser(returnLastXDays(30));
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
                    <HabitBreakdownDialog />
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
                                                        style={{width: 20, height: 100*(category.habits.length), "backgroundColor": category.color}}
                                                        icon={categoryHeaderIcon} />
                                                </th></tr>

                                                {category.habits.map((habit: any, index: number) => 
                                                    <tr key={index}>
                                                        <td style={{minWidth: 230, maxHeight: 100}}>
                                                            <HabitHeader habit={habit._id} />
                                                        </td>
                                                        {/* needs to be able to handle resizing windows */}
                                                        <td style={{maxWidth: window.innerWidth - 250}}>
                                                            <HabitBody habit={habit._id} />
                                                        </td>
                                                    </tr>)}
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
    const habitOrder: any = _generateSortedHabitOrder(state.habitOrder, state.habits);
    const categoryOrder: any = _generateSortedCategoryOrder(state.categoryOrder, state.categories);
    // TODO: optimize this?
    let enrichedCategories = categoryOrder.map((category: any) => {
        let output = {
            ...state.categories[category],
            habits: [],
        }
        for (let i = 0; i < habitOrder.length; i++) {
            if (state.habits[habitOrder[i]]["category"] === category) {
                output.habits.push(state.habits[habitOrder[i]]);
            }
        }
        return output;
    })
    let uncategorizedHabits = [];
    for (let i = 0; i < habitOrder.length; i++) {
        if (!state.habits[habitOrder[i]]["category"]) {
            uncategorizedHabits.push(state.habits[habitOrder[i]]);
        }
    }
    enrichedCategories = enrichedCategories.concat([{ title: "uncategorized", habits: uncategorizedHabits }]);
    enrichedCategories = enrichedCategories.filter((category: any) => (category.habits.length > 0));
    return {
        ...state,
        enrichedCategories: enrichedCategories
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
