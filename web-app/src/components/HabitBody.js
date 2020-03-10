import React, { Component } from 'react';
import { syncScroll } from '../utils/habits.utils';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { Button, Icon } from "@blueprintjs/core";

class HabitBody extends Component {
    toggleEditMode() {
        this.props.selectHabitForEdit(this.props.habit, true);
    }

    habitEntryStyle(value) {
        if (!value) {
            return {
                color: "",
                icon: ""
            };
        }
        for (let i = 0; i < this.props.thresholds.length; i++) {
            switch (this.props.thresholds[i].condition) {
                case 'lt':
                    if (value < this.props.thresholds[i].maxValue) {
                        return {
                            color: this.props.thresholds[i].color,
                            icon: this.props.thresholds[i].icon
                        }
                    }
                    break;
                case 'le':
                    if (value <= this.props.thresholds[i].maxValue) {
                        return {
                            color: this.props.thresholds[i].color,
                            icon: this.props.thresholds[i].icon
                        }
                    }
                    break;
                case 'eq':
                    if (value === this.props.thresholds[i].maxValue) {
                        return {
                            color: this.props.thresholds[i].color,
                            icon: this.props.thresholds[i].icon
                        }
                    }
                    break;
                case 'ge':
                    if (value >= this.props.thresholds[i].minValue) {
                        return {
                            color: this.props.thresholds[i].color,
                            icon: this.props.thresholds[i].icon
                        }
                    }
                    break;
                case 'gt':
                    if (value > this.props.thresholds[i].minValue) {
                        return {
                            color: this.props.thresholds[i].color,
                            icon: this.props.thresholds[i].icon
                        }
                    }
                    break;
                case 'between':
                    if (this.props.thresholds[i].minValue <= value <= this.props.thresholds[i].maxValue) {
                        return {
                            color: this.props.thresholds[i].color,
                            icon: this.props.thresholds[i].icon
                        }
                    }
                    break;
            } 
        }
        return {
            color: "",
            icon: ""
        }
    }

    render() {
        const color = this.props.color || "";

        return (
            <div className={"ctr-contents habit"} onScroll={syncScroll}>
                { 
                    this.props.days.map((day) => {
                        const day_fmt = day.format("MM/DD/YYYY");
                        let value = this.props.entries[day_fmt]["value"];

                        let helperIcons = this.props.entries[day_fmt]["note"] && this.props.entries[day_fmt]["note"].length > 0 ?
                            (
                                <Icon icon="annotation" 
                                      style={{position: "absolute", bottom: 10, right: 10}}
                                />
                            ) : (
                                <span />    
                            )

                        return (
                            <div className={"ctr-entry habit"} key={day_fmt}>
                                <Button    
                                    className={"bp3-minimal bp3-outlined habit-entry"}
                                    icon={this.habitEntryStyle(value).icon}
                                    style={{"backgroundColor": this.habitEntryStyle(value).color, position: "relative"}}
                                    onClick={() => this.props.selectEntry(day, this.props.habit)}>
                                    { helperIcons }
                                </Button>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

};

function mapStateToProps(state, ownProps) {
    return {
        days: state["days"],
        category: state["habits"][ownProps.habit]["category"] ? state["categories"][state["habits"][ownProps.habit]["category"]] : undefined,
        thresholds: state["habits"][ownProps.habit]["thresholds"],
        entries: state["entries"][ownProps.habit]
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HabitBody);
