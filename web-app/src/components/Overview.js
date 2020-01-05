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
            new_habit_name: "",
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
                    this.setState({
                        ...this.state,
                        username: res.data.username,
                        entries: res.data.entries,
                        habits: res.data.habits
                    })
                }
            ).catch(err => {
                console.log("Error loading admin user overview")
            })
    }

    onChange = e => {
        this.setState({
            ...this.state,
            new_habit_name: e.target.value
        })
    }

    onSubmit = e => {
        const data = {
            name: this.state.new_habit_name,
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

    mongoDateToMoment(date) {
        console.log(typeof date);
        return moment("" + (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + (1900 + date.getYear()), "MM/DD/YYYY");
    }

    getHabitEntries(habit, entries) {
        return entries.map((entry) => {
            entry["date"] = this.mongoDateToMoment(entry["date"]).format("MM/DD/YYYY");
            return entry;
        }).filter((entry) => {
            return entry["habit"] === habit;
        });
    }

    getDailyRetros(entries) {
        return entries.map((entry) => {
            entry["date"] = this.mongoDateToMoment(entry["date"]).format("MM/DD/YYYY");
            return entry;
        }).filter((entry) => {
            return !entry["habit"]  
        });
    }

    render() {
        console.log(this.getDailyRetros(this.state.entries));
        return (
            <div>
                <Header days={this.returnLast30Days()}/>
                {this.state.habits.map((habit, index) => <Habit user={this.state.user_id} days={this.returnLast30Days()} key={habit._id} habit={habit} entries={this.getHabitEntries(habit._id, this.state.entries)} />)}
                <DailyRetroContainer user={this.state.user_id} days={this.returnLast30Days()} entries={this.getDailyRetros(this.state.entries)} />
                <form noValidate onSubmit={this.onSubmit}>
                    <input type='text' value={this.state.new_habit_name} onChange={this.onChange} />
                    <input type='submit' className='btn'/>
                </form>
             </div>
        );
    }
}

export default Overview;
