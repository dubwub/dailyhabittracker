import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Habit from './Habit.js';
import Header from './Header.js';
import DailyRetroContainer from './DailyRetroContainer.js';

const moment = require('moment');

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            habits: [],
            entries: [],
            user_id: "5e0a82dd179d3c3599e6fd8f"
        }
    }

    returnLast30Days() {
        let days = []; 
        
        for (let i = 0; i < 30; i++) {
            let newDate = moment().subtract(i, 'days');
            days.push(newDate);
        }

        return days;
    }

    componentDidMount() {
        axios
            .get('http://localhost:8082/api/users/' + this.state.user_id)
            .then(
                res => {
                    let entries = res.data.entries.map((entry) => {
                        // TODO: super hacky with lots of assumptions that could easily break :(
                        // why is this reading as string? could i read as a date format from mongoose?
                        entry["date"] = moment(entry["date"].substring(0, 10)).format('MM/DD/YYYY');
                        return entry;
                    });
                    
                    this.setState({
                        ...this.state,
                        username: res.data.username,
                        entries: entries,
                        habits: res.data.habits
                    })
                }
            ).catch(err => {
                console.log("Error loading admin user overview")
            })
    }

    onSubmit = e => {
        const data = {
            name: this.refs['habit-name'].value,
            description: this.refs['habit-description'].value,
            color: this.refs['habit-color'].value,
            order: 1,
            entry_type: "default",
            entries: []
        }

        axios
            .put('http://localhost:8082/api/users/' + this.state.user_id, data)
            .then(res => {
                console.log(res);
            }).catch(err => {console.log("error when adding habit")});
    }

    deleteHabit(habitid, pageindex) {
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
    }

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
        return (
            <div>
                <Header days={this.returnLast30Days()}/>
                {this.state.habits.map((habit, index) => <Habit user={this.state.user_id} days={this.returnLast30Days()} key={habit._id} habit={habit} entries={this.getHabitEntries(habit._id, this.state.entries)} />)}
                <DailyRetroContainer user={this.state.user_id} days={this.returnLast30Days()} entries={this.getDailyRetros(this.state.entries)} />
                <form noValidate onSubmit={this.onSubmit}>
                    <input type="text" ref="habit-name" placeholder="Name of habit" />
                    <input type="text" ref="habit-description" placeholder="Habit description" />
                    <input type="text" ref="habit-color" placeholder="Color of habit (red/blue)" />
                    <input type='submit' className='btn' />
                </form>
             </div>
        );
    }
}

export default Overview;
