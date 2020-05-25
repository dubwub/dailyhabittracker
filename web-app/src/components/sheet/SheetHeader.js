import React, { Component } from 'react';
import { syncScroll } from '../../utils/habits.utils';
import { connect } from 'react-redux';
import { Button, Colors, Icon, Switch, Tag } from '@blueprintjs/core';

import * as mapDispatchToProps from '../../actions/index.actions.js';
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
        let className = "cell";
        if (
            moment().format("MM/DD/YYYY") === this.props.day.format('MM/DD/YYYY')) {
            className += " retro-top-selected";
        }
        return (
            <div className={className} style={{paddingLeft: 20}}>
                { this.props.day.format('ddd') }<br />
                { this.props.day.format('M/D') }    
            </div>
        )
    }
}

class SheetHeader extends Component {
    render() {
        return (
            <div className="sheet-header">
                <div className="row-header sheet-header">
                    <Button icon="edit" onClick={() => this.props.toggleShowCategoryEditDialog(true)}>Update Dreams</Button>
                    <Button icon="add" onClick={() => this.props.selectHabitForEdit(undefined, true)}>Add New Goal</Button>
                </div>
                <div className="row-contents sheet-date-labels" onScroll={syncScroll}>
                    {
                        this.props.days.map((day, index) => (
                                <div key={index}>
                                    <DateLabel dateOfSelectedEntry={this.props.dateOfSelectedEntry} habitOfSelectedEntry={this.props.habitOfSelectedEntry} day={day} />
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
        habitOfSelectedEntry: state.habitOfSelectedEntry,
        hideArchived: state.hideArchived,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SheetHeader);
