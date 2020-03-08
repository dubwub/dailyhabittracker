import * as React from 'react';
import Habit from './Habit.js';
import Header from './Header.js';
import EntryEditContainer from './EntryEditContainer.js';
import HabitEditDialog from './HabitEditDialog';
import EventEditDialog from './EventEditDialog';
import CategoryEditDialog from './CategoryEditDialog';

import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { Button } from "@blueprintjs/core";
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
                            {this.props.habitOrder.map((habit) => <Habit key={habit} habit={habit} />)}
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
    return state; 
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);