import * as React from 'react';
import SheetHeader from './SheetHeader';
import HabitHeader from './HabitHeader';
import HabitBody from './HabitBody';
import HabitEditDialog from './HabitEditDialog';
import HabitBreakdownDialog from './HabitBreakdownDialog';
import EventEditDialog from './EventEditDialog';
import DreamEditDialog from './DreamEditDialog';
import DailyRetroContainer from './DailyRetroContainer';

import { connect } from 'react-redux';
import { returnLastXDays } from '../utils/habits.utils';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { Button, Icon } from "@blueprintjs/core";
import { Props } from "../types/types"; 
import { callbackify } from 'util';

const projectHeight: number = 40;

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
            return (
                <div>
                    <HabitEditDialog />
                    <HabitBreakdownDialog />
                    <EventEditDialog />
                    <DreamEditDialog />
                    <div>
                        <div className="layout-header">
                        </div>
                        <div className="layout-body">
                            <SheetHeader />
                            <div style={{width: "100%", height: "75%", position: "relative"}}>
                                {
                                    this.props.enrichedCategories.map((category: any, index: number) => {
                                        let categoryHeaderIcon = category.icon ? category.icon : "help";
                                        return (
                                            <div style={{width: 100,
                                                    height: projectHeight*(category.habits.length),
                                                    backgroundColor: category.color,
                                                    position: "absolute",
                                                    left: 0,
                                                    top: category.indicesToJump * projectHeight,
                                                    }}>
                                                <Icon
                                                    icon={categoryHeaderIcon} />
                                                {category.title}
                                            </div>
                                        )
                                    })
                                }
                                {
                                    this.props.habitOrder.map((habitIndex: any, index: number) => 
                                                        {
                                                            const habit: any = this.props.habits[habitIndex];
                                                            return (<div style={{width: "100%", height: projectHeight, position: "absolute", left: 100, top: index * projectHeight}}>
                                                                <div style={{width: "300", margin: 0}}>
                                                                    <HabitHeader habit={habit._id} />
                                                                </div>
                                                                {/* needs to be able to handle resizing windows */}
                                                                <div style={{position: "absolute", top: 0,width: "calc(100% - 400px)", left: 300}}>
                                                                    <HabitBody habit={habit._id} />
                                                                </div>
                                                            </div>);
                                                        })
                                }
                            </div>
                            <DailyRetroContainer />
                        </div>
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
    let indicesToJump = 0;
    let enrichedCategories = categoryOrder.map((category: any) => {
        let output = {
            ...state.categories[category],
            habits: [],
            indicesToJump: indicesToJump,
        }
        for (let i = 0; i < habitOrder.length; i++) {
            if (state.habits[habitOrder[i]]["category"] === category) {
                output.habits.push(state.habits[habitOrder[i]]);
            }
        }
        indicesToJump += output['habits'].length;
        return output;
    })
    let uncategorizedHabits = [];
    for (let i = 0; i < habitOrder.length; i++) {
        if (!state.habits[habitOrder[i]]["category"]) {
            uncategorizedHabits.push(state.habits[habitOrder[i]]);
        }
    }
    enrichedCategories = enrichedCategories.concat([{ title: "uncategorized", habits: uncategorizedHabits, indicesToJump: indicesToJump }]);
    enrichedCategories = enrichedCategories.filter((category: any) => (category.habits.length > 0));
    return {
        ...state,
        enrichedCategories: enrichedCategories,
        habitOrder: state.habitOrder,
        habits: state.habits,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
