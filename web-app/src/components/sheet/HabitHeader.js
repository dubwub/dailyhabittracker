import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../../actions/index.actions.js'; 
import { Button, Tag } from "@blueprintjs/core";

class HabitHeader extends Component {
    toggleEditMode() {
        this.props.selectHabitForEdit(this.props.habit, true);
    }

    render() {
        const color = this.props.color || "";
        const dateDisplay = this.props.endDate ? (
            <Tag icon={"time"} minimal={true}>
                End is { this.props.endDate.fromNow(true) } from now
            </Tag>
        ) : (<div />)

        return (
            <div className={"habit"} style={{position: "relative", maxWidth: 300, paddingRight: 0}}>
                <div className="habit-title" style={{"color": color}}>
                    <h5 style={{margin: 0}}>{ this.props.title }</h5>
                </div>
                {dateDisplay}
                <Button 
                    style={{position: "absolute", top: 0, right: 0}}
                    onClick={() => this.props.selectHabitForEdit(this.props.habit, true)}
                    icon={"edit"} />
                {/* <Button
                    style={{position: "absolute", top: 40, right: 0}}
                    onClick={() => this.props.selectHabitForBreakdown(this.props.habit, true)}
                    icon={"timeline-events"} />
                <Button
                    style={{position: "absolute", bottom: 0, right: 0}}
                    onClick={() => this.props.deleteHabit(this.props.habit)}
                    icon={"delete"} /> */}
            </div>
        )
    }

};

function mapStateToProps(state, ownProps) {
    return {
        title: state["habits"][ownProps.habit]["title"],
        description: state["habits"][ownProps.habit]["description"],
        color: state["habits"][ownProps.habit]["color"],
        endDate: state["habits"][ownProps.habit]["endDate"],
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HabitHeader);
