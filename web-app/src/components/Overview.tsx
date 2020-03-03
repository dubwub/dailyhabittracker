import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Habit from './Habit.js';
import Header from './Header.js';
import EntryEditContainer from './EntryEditContainer.js';

import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { Button } from "@blueprintjs/core";
import * as moment from "moment";
import { Props } from "../types/types"; 

class Overview extends React.Component<Props>{
    private inputHabitName = React.createRef<HTMLInputElement>();
    private inputHabitDescription = React.createRef<HTMLInputElement>();
    private inputHabitColor = React.createRef<HTMLInputElement>();
    
    constructor(props: Props) {
        super(props);
        this.props.loadUser(this.props.days);
    }

    onSubmit = (e: any) => {
        if (this.inputHabitName.current && this.inputHabitDescription.current && this.inputHabitColor.current) {
            this.props.createHabit(
                this.inputHabitName.current.value,
                this.inputHabitDescription.current.value,
                this.inputHabitColor.current.value
            );
        }
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
                    <form noValidate onSubmit={this.onSubmit}>
                        <input type="text" className="bp3-input" ref={this.inputHabitName} placeholder="Name of habit" />
                        <input type="text" className="bp3-input" ref={this.inputHabitDescription} placeholder="Habit description" />
                        <input type="text" ref={this.inputHabitColor} placeholder="Color of habit (red/blue)" />
                        <input type='submit' className='bp3-button bp3-intent-primary' />
                    </form>
                </div>
            ) : (
                <div className={"layout-footer " + footerStatus}>
                    <form noValidate onSubmit={this.onSubmit}>
                        <input type="text" className="bp3-input" ref={this.inputHabitName} placeholder="Name of habit" />
                        <input type="text" className="bp3-input" ref={this.inputHabitDescription} placeholder="Habit description" />
                        <input type="text" ref={this.inputHabitColor} placeholder="Color of habit (red/blue)" />
                        <input type='submit' className='bp3-button bp3-intent-primary' />
                    </form>
                </div>
            )
        

            return (
                <div>
                    <div className="layout-header">
                        <Header />
                    </div>
                    <div className={"layout-body " + footerStatus}>
                        {this.props.habitOrder.map((habit) => <Habit key={habit} habit={habit} />)} 
                    </div>
                    {footerDiv}
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
