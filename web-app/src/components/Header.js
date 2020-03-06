import React, { Component } from 'react';
import { syncScroll } from '../utils/habits.utils';
import { connect } from 'react-redux';
import { Button, Tag } from '@blueprintjs/core';
import { DateRangeInput } from "@blueprintjs/datetime";

import * as mapDispatchToProps from '../actions/index.actions.js';
import * as moment from "moment";

class NewEntryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: undefined,
            endDate: undefined,
        }
    }

    handleRangeChange(e) {
        let startDate = e[0];
        let endDate = e[1]; 
        this.setState({
            ...this.state,
            startDate: startDate,
            endDate: endDate,
        })
    }

    render() {
        return (
            <div style={{"width": "100%", "height": "100%"}}>
                <DateRangeInput
                    formatDate={date => date.toLocaleString()}
                    onChange={(e) => this.handleRangeChange(e)}
                    parseDate={str => new Date(str)}
                    value={[this.state.startDate, this.state.endDate]}
                    shortcuts={false}
                    enableTimePicker={false}
                    allowSingleDayRange={true}
                    timePrecision={undefined}
                />


                <Button icon="add">New Event</Button>
            </div>
        )
    }
}

class DateLabel extends Component {
    render() {
        let className = "ctr-entry header-date-label";
        if (
            this.props.dateOfSelectedEntry &&
            this.props.dateOfSelectedEntry.format('MM/DD/YYYY') === this.props.day.format('MM/DD/YYYY') && this.props.habitOfSelectedEntry === "daily-retro") {
            className += " retro-top-selected";
        }
        return (
            <div className={className}>
                { this.props.day.format('ddd M/D') }    
            </div>
        )
    }
}

class DailyRetro extends Component {
    render() {
        return (
            <div className="ctr-entry header-retro">
                { this.props.value }
            </div>
        )
    }
}

class Events extends Component {
    fakeData = [
        {
            startDate: moment("20200303", "YYYYMMDD"),
            endDate: moment("20200309", "YYYYMMDD"),
            title: "day entry",
            color: "red"
        },
        {
            startDate: moment("20200225", "YYYYMMDD"),
            endDate: moment("20200306", "YYYYMMDD"),
            title: "week entry",
            color: "green"
        },
        {
            startDate: moment("20200202", "YYYYMMDD"),
            endDate: moment("20200306", "YYYYMMDD"),
            title: "overlapping entry",
            color: "purple"
        }
    ]

    renderEvent(index, event) {
        // for display purposes, don't display parts of events out of range
        let truncStartDate = moment.max(event.startDate, this.props.startDate);
        let truncEndDate = moment.min(event.endDate, this.props.endDate);

        let timeBeforeToday = this.props.endDate.diff(truncEndDate, "days");
        let durationOfEvent = truncEndDate.diff(truncStartDate, "days");
        let timeAfterEnding = truncStartDate.diff(this.props.startDate, "days");
        
        return (
            <div key={index} style={{"width": "100%", "height": "20px"}}>
                <div style={{"display": "inline-block", "width": timeBeforeToday*100, "height": 20}}>
                </div>
                <Tag style={{
                    "display": "inline-block",
                    "width": (durationOfEvent+1)*100,
                    "height": 20,
                    "backgroundColor": event.color,
                }}>
                    {event.title}
                </Tag>
                <div style={{"display": "inline-block", "width": timeAfterEnding*100, "height": 20}}>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="header-event" style={{"width": 3000}}>
                {
                    this.fakeData.map((event, index) => this.renderEvent(index, event))
                }
            </div>            
        )
    }
}

class Header extends Component {
    render() {
        return (
            <div className="ctr header">
                <div className="ctr-header header">
                    <NewEntryForm />
                </div>
                <div className="ctr-contents header-top" onScroll={syncScroll}>
                    {
                        this.props.days.map((day, index) => (
                                <div onClick={() => this.props.selectEntry(day, "daily-retro")} key={index}>
                                    <DateLabel dateOfSelectedEntry={this.props.dateOfSelectedEntry} habitOfSelectedEntry={this.props.habitOfSelectedEntry} day={day} />
                                    <DailyRetro dateOfSelectedEntry={this.props.dateOfSelectedEntry} habitOfSelectedEntry={this.props.habitOfSelectedEntry} value={this.props.entries[day.format("MM/DD/YYYY")]["value"] || -1} />
                                </div>    
                            )
                        )
                    }
                </div>
                <div className="ctr-contents header-event" onScroll={syncScroll}>
                    <Events endDate={this.props.days[0]} startDate={this.props.days[this.props.days.length - 1]} />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        days: state.days,
        entries: state.entries["daily-retro"],
        dateOfSelectedEntry: state.dateOfSelectedEntry,
        habitOfSelectedEntry: state.habitOfSelectedEntry
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
