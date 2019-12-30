import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import axios from 'axios';

import Habit from './Habit.js';
import Header from './Header.js';

const moment = require('moment');

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            journal_entries: [],
            habits: [],
            new_habit_name: ""
        }
    }

    returnLastSevenDays() {
        let days = []; 
        
        for (let i = 0; i < 7; i++) {
            let newDate = moment().subtract(i, 'days');
            days.push(newDate);
        }

        return days;
    }

    componentDidMount() {
        axios
            .get('http://localhost:8082/api/users/5e041c1f66574a2b2cdc02f4')
            .then(
                res => {
                    this.setState({
                        ...this.state,
                        username: res.data.username,
                        journal_entries: res.data.journal_entries,
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
            .put('http://localhost:8082/api/users/5e041c1f66574a2b2cdc02f4', data)
            .then(res => {
                console.log(res);
            }).catch(err => {console.log("error when adding habit")});
    }

    deleteHabit(habitid, pageindex) {
        axios.delete('http://localhost:8082/api/users/5e041c1f66574a2b2cdc02f4/habit/' + habitid)
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

    render() {
        return (
            <div>
                <Header days={this.returnLastSevenDays()}/>
                {this.state.habits.map((habit, index) => <Habit days={this.returnLastSevenDays()} key={habit._id} habit={habit} />)}
                <form noValidate onSubmit={this.onSubmit}>
                    <input type='text' value={this.state.new_habit_name} onChange={this.onChange} />
                    <input type='submit' className='btn'/>
                </form>
             </div>
        );
    }
}

export default Overview;
