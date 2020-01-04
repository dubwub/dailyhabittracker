import React, { Component } from 'react';
import { syncScroll } from '../utils/habits.utils';

const moment = require('moment');

class DailyRetroContainer extends Component {i
    processEntries(entries) {
        let map = {};

        for (let i = 0; i < entries.length; i++) {
            map[entries[i]["date"]] = entries[i]["entry"];
        }
        return map;
    }

    getSelectedEntry() {
        if (this.state.selected_day in this.state.entries) {
            return this.state.entries[this.state.selected_day];
        } else {
            return "";
        }
    }

    constructor(props) {
        super(props);
        const selected_day = moment().format('MM/DD/YYYY');
        const entries = this.processEntries(props.entries);

        this.state = {
            selected_day: selected_day,
            entries: entries,
            selected_entry: entries[selected_day]
        };
    }

    updateDaySelection(day) {
        console.log("changing selected day to: " + day.format('MM/DD/YYYY'));
        this.setState({
            ...this.state,
            selected_day: day.format('MM/DD/YYYY'),
            selected_entry: this.state.entries[day.format('MM/DD/YYYY')]
        });
    }

    isSelectedDay(day) {
        return day.format('MM/DD/YYYY') === this.state.selected_day;
    }

    updateRetroForSelectedDay(e) {
        console.log('changed retro entry: ' + e.target);
    }

    render() {
        return (
            <div className="ctr retro">
                <div className="retro-top">
                    <div className="ctr-header retro-top" />
                    <div className="ctr-contents retro-top" onScroll={syncScroll}>
                        { this.props.days.map((date, index) => <div className={"ctr-entry retro-top" + (this.isSelectedDay(date) ? " retro-top-selected" : "")} onClick={() => this.updateDaySelection(date)} date={date} key={index}>{date.format('MM/DD/YY')}</div>) }
                    </div>
                </div>
                <div className="retro-bottom">
                    <textarea style={{"width":"100%", "height":"100%"}} ref="retro-textbox" value={this.getSelectedEntry()} onChange={() => this.updateRetroForSelectedDay}/>
                </div>
            </div>
        )
    }
}

export default DailyRetroContainer;
