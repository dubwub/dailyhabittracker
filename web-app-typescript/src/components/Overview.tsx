import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Habit from './Habit.js';
import Header from './Header.js';
import DailyRetroContainer from './DailyRetroContainer.js';

import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 

import * as moment from "moment";
import { Props } from "../types/types"; 

class Overview extends React.Component<Props>{
    constructor(props: Props) {
        super(props);
        this.props.loadUser(this.props.days);
    }

    onSubmit = (e: any) => {
        this.props.createHabit(
            this.refs["habit-name"].value,
            this.refs["habit-description"].value,
            this.refs["habit-color"].value
        );
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

    getHabitEntries(habit, entries) {
        return entries.filter((entry) => {
            return entry["habit"] === habit;
        });
    }

    getDailyRetros(entries) {
        return entries.filter((entry) => {
            return !entry["habit"]  
        });
    }

    render() {
        if (this.props.user) { // because of async, this render happens twice, once on page load and once when we hear back from mongo
            return (
                <div>
                <Header />
                {this.props.habitOrder.map((habit) => <Habit key={habit} habit={habit} />)}
                <DailyRetroContainer />
                <form noValidate onSubmit={this.onSubmit}>
                    <input type="text" ref="habit-name" placeholder="Name of habit" />
                    <input type="text" ref="habit-description" placeholder="Habit description" />
                    <input type="text" ref="habit-color" placeholder="Color of habit (red/blue)" />
                    <input type='submit' className='btn' />
                </form>
                </div>
            );
        } else { // wait, cuz we're loading
            return (<div>loading</div>);
        }
    }
}

function mapStateToProps(state) {
    return state; 
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
