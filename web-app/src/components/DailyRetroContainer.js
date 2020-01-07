import axios from 'axios';
import React, { Component } from 'react';
import { syncScroll } from '../utils/habits.utils';

const moment = require('moment');

class DailyRetroContainer extends Component {i
    processEntries(entries) {
        let map = {};
        for (let i = 0; i < entries.length; i++) {
            map[entries[i]["date"]] = entries[i]["note"];
        }
        return map;
    }

    constructor(props) {
        super(props);
        this.state = {
            selected_day: moment().format('MM/DD/YYYY')
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            ...this.state,
            entries: this.processEntries(props.entries)
        });
    }

    updateDaySelection(day) {
        let selected_day = day.format('MM/DD/YYYY');
        console.log("changing selected day to: " + selected_day);
                     
        this.setState({
            ...this.state,
            selected_day: selected_day
        });
    }

    isSelectedDay(day) {
        return day.format('MM/DD/YYYY') === this.state.selected_day;
    }

    updateRetroForSelectedDay(user, e) {
        const entry = 10;
        const data = {
            entry: entry,
            date: this.state.selected_day,
            note: e.target.value
        };

        console.log("Posting daily retro for " + data.date + ", entry: " + data.entry + ", note: " + data.note);
        axios.post('http://localhost:8082/api/users/' + user + '/entries', data)
            .then(res => {
                let entries = this.state.entries;
                entries[this.state.selected_day] = data.note;

                this.setState({
                    ...this.state,
                    entries: entries
                });
                console.log("Update posted successfully");
                console.log(res);   
            }).catch(err => {
                console.log("Update had an error");
                console.log(err);
            })
    }

    render() {
        let selected_entry = ((this.state.entries && this.state.selected_day in this.state.entries) ? this.state.entries[this.state.selected_day] : "");
 
        return (
            <div className="ctr retro">
                <div className="retro-top">
                    <div className="ctr-header retro-top" />
                    <div className="ctr-contents retro-top" onScroll={syncScroll}>
                        { this.props.days.map((date, index) => <div className={"ctr-entry retro-top" + (this.isSelectedDay(date) ? " retro-top-selected" : "")} onClick={() => this.updateDaySelection(date)} date={date} key={index}>{date.format('MM/DD/YY')}</div>) }
                    </div>
                </div>
                <div className="retro-bottom">
                    <textarea style={{"width":"100%", "height":"100%"}} ref="retro-textbox" value={selected_entry} onChange={(e) => this.updateRetroForSelectedDay(this.props.user, e)}/>
                </div>
            </div>
        )
    }
}

export default DailyRetroContainer;
