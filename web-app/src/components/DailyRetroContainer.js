import axios from 'axios';
import React, { Component } from 'react';
import { syncScroll } from '../utils/habits.utils';

const moment = require('moment');

class DailyRetroContainer extends Component {i
    processEntries(entries) {
        let map = {};
        for (let i = 0; i < entries.length; i++) {
            map[entries[i]["date"]] = {
                "entry": entries[i]["entry"],
                "note": entries[i]["note"]
            };
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

    dayHasEntry(day) {
        day = day.format('MM/DD/YYYY');
        if (this.state.entries) {
            return (typeof this.state.entries[day] !== "undefined") && (this.state.entries[day].note !== "");
        }
        return false;
    }

    updateEntryForSelectedDay(user, field, e) {
        let data = {
            date: this.state.selected_day
        };
        if (this.state.selected_day in this.state.entries) { // set payload to default from state
            data["entry"] = this.state.entries[this.state.selected_day].entries || "-";
            data["note"] = this.state.entries[this.state.selected_day].note || "";
        }
        data[field] = e.target.value; // field is entry (1-10) or note (string)

        console.log("Posting daily retro for " + data.date + ", entry: " + data.entry + ", note: " + data.note);
        axios.post('http://localhost:8082/api/users/' + user + '/entries', data)
            .then(res => {
                let entries = this.state.entries;
                if (!entries[this.state.selected_day]) {
                    entries[this.state.selected_day] = {};
                }
                entries[this.state.selected_day][field] = data[field];

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

    getEntryForDay(day) {
        day = day.format('MM/DD/YYYY');
        if (this.state.entries && this.state.entries[day]) {
            return this.state.entries[day].entry;
        }
        return "-";
    }

    render() {
        let selected_note = "";
        if (this.state.entries && this.state.selected_day in this.state.entries && this.state.entries[this.state.selected_day].note) {
            selected_note = this.state.entries[this.state.selected_day].note;
        }

        return (
            <div className="ctr retro">
                <div className="retro-top">
                    <div className="ctr-header retro-top" />
                    <div className="ctr-contents retro-top" onScroll={syncScroll}>
                        { this.props.days.map((date, index) => <div className={"ctr-entry retro-top" + (this.isSelectedDay(date) ? " retro-top-selected" : "") + (this.dayHasEntry(date) ? " retro-top-has-entry":"")} onClick={() => this.updateDaySelection(date)} date={date} key={index}>{date.format('MM/DD/YY')}
                            <select value={this.getEntryForDay(date)} onChange={(e) => this.updateEntryForSelectedDay(this.props.user, "entry", e)}>
                                <option value="-">-</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="10">10</option>
                            </select>
                        </div>) }
                    </div>
                </div>
                <div className="retro-bottom">
                    <textarea style={{"width":"100%", "height":"100%"}} ref="retro-textbox" value={selected_note} onChange={(e) => this.updateEntryForSelectedDay(this.props.user, "note", e)}/>
                </div>
            </div>
        )
    }
}

export default DailyRetroContainer;
