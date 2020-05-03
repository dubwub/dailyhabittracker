import React, { Component } from 'react';
import { syncScroll } from '../utils/habits.utils';
import { connect } from 'react-redux';
import { Button, Colors, Icon, Tag } from '@blueprintjs/core';

import * as mapDispatchToProps from '../actions/index.actions.js';
import * as moment from "moment";

const styles = [
    {
        "backgroundColor": Colors.RED1,
        "color": Colors.WHITE,
        "position": "relative",
    },
    {
        "backgroundColor": Colors.RED3,
        "color": Colors.WHITE,
        "position": "relative",
    },
    {
        "backgroundColor": Colors.ORANGE3,
        "color": Colors.BLACK,
        "position": "relative",
    },
    {
        "backgroundColor": Colors.GREEN3,
        "color": Colors.BLACK,
        "position": "relative",
    },
    {
        "backgroundColor": Colors.GREEN1,
        "color": Colors.WHITE,
        "position": "relative",
    }
];

class DateLabel extends Component {
    render() {
        let className = "cell sheet-date-label";
        if (
            moment().format("MM/DD/YYYY") === this.props.day.format('MM/DD/YYYY')) {
            className += " retro-top-selected";
        }
        return (
            <div className={className}>
                { this.props.day.format('ddd') }<br />
                { this.props.day.format('M/D') }    
            </div>
        )
    }
}

class Events extends Component {
    onClick(e, eventId) {
        // TODO: this is jank as all hell, there may be a better way to do this
        console.log("Responding to click event with nodeName: " + e.target.nodeName);

        if (["path", "svg"].indexOf(e.target.nodeName) === -1) {
            this.props.selectEventForEdit(eventId, true);
        } 
    }

    renderEvent(index, event) {
        // for display purposes, don't display parts of events out of range
        let truncStartDate = moment.max(event.startDate, this.props.startDate);
        let truncEndDate = moment.min(event.endDate, this.props.endDate);

        let timeBeforeToday = this.props.endDate.diff(truncEndDate, "days");
        let durationOfEvent = truncEndDate.diff(truncStartDate, "days");
        let timeAfterEnding = truncStartDate.diff(this.props.startDate, "days");
        
        return (
            // TODO: deleting an event brings up the dialog
            <div key={index} style={{"width": "100%", "height": "100px", "whiteSpace": "nowrap", "overflowX": "auto"}}>
                <div style={{"display": "inline-block", "width": timeBeforeToday*100, "height": 20}} />
                <Tag 
                    interactive={true}
                    large={true}
                    style={{
                        "width": (durationOfEvent+1)*100,
                        "backgroundColor": event.color,
                        "display": "inline-block",
                    }}
                    onRemove={() => this.props.deleteEvent(event._id)}
                    onClick={(e) => this.onClick(e, event._id)}
                >
                    {event.title}
                </Tag>
                <div style={{"display": "inline-block", "width": timeAfterEnding*100, "height": 20}} />
            </div>
        );
    }

    render() {
        return (
            <div className="header-event" style={{"width": 3000}}>
                {
                    this.props.events.map((event, index) => this.renderEvent(index, event))
                }
            </div>            
        )
    }
}

class SheetHeader extends Component {
    render() {
        return (
            <div className="sheet-header">
                <div className="row-header sheet-header">
                    {/* <Button icon="add" onClick={() => this.props.selectEventForEdit(undefined, true)}>Add New Event</Button> */}
                    <br/> <Button icon="edit" onClick={() => this.props.toggleShowCategoryEditDialog(true)}>Update Dreams</Button>
                </div>
                <div className="row-contents sheet-date-labels" onScroll={syncScroll}>
                    {
                        this.props.days.map((day, index) => (
                                <div onClick={() => this.props.selectEntry(day, "daily-retro")} key={index}>
                                    <DateLabel dateOfSelectedEntry={this.props.dateOfSelectedEntry} habitOfSelectedEntry={this.props.habitOfSelectedEntry} day={day} />
                                    {/* <DailyRetro dateOfSelectedEntry={this.props.dateOfSelectedEntry} habitOfSelectedEntry={this.props.habitOfSelectedEntry} entry={this.props.entries[day.format("MM/DD/YYYY")]} /> */}
                                </div>    
                            )
                        )
                    }
                </div>
                {/* <div className="row-contents sheet-events" onScroll={syncScroll}>
                    <Events events={this.props.events}
                            endDate={this.props.days[0]}
                            startDate={this.props.days[this.props.days.length - 1]}
                            selectEventForEdit={this.props.selectEventForEdit} 
                            deleteEvent={this.props.deleteEvent}
                            />
                </div> */}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        days: state.days,
        entries: state.entries["daily-retro"],
        events: state.events,
        dateOfSelectedEntry: state.dateOfSelectedEntry,
        habitOfSelectedEntry: state.habitOfSelectedEntry
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SheetHeader);
