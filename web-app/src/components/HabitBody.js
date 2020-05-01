import React, { Component } from 'react';
import { syncScroll, getThresholdFromValue } from '../utils/habits.utils';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { Button, Icon, Popover } from "@blueprintjs/core";
import _ from 'lodash';

class HabitBody extends Component {
    toggleEditMode() {
        this.props.selectHabitForEdit(this.props.habit, true);
    }

    render() {
        const color = this.props.color || "";

        return (
            <div className={"row-contents habit"} onScroll={syncScroll}>
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
                        
                        let tagIcons = [];
                        if (!_.isNil(this.props.entries[day_fmt]["tags"])) {
                            const tags = this.props.entries[day_fmt]["tags"];
                            for (let i = 0; i < tags.length; i++) {
                                tagIcons.push((
                                    <Icon key={i}
                                          icon={this.props.tags[tags[i]].icon}
                                          style={{
                                                    backgroundColor: this.props.tags[tags[i]].color,
                                                    position: "absolute",
                                                    bottom: 5, left: i * 20,
                                                 }} />
                                ))
                            }
                        }

                        return (
                            <div className={"cell"} key={day_fmt}>
                                <Popover content={(
                                    <div>
                                        <Button style={{width: 40, height: 30}} onClick={() => this.props.updateEntry(this.props.habit, day, 1, undefined, undefined)}>1</Button><br />
                                        <Button style={{width: 40, height: 30}} onClick={() => this.props.updateEntry(this.props.habit, day, 2, undefined, undefined)}>2</Button><br />
                                        <Button style={{width: 40, height: 30}} onClick={() => this.props.updateEntry(this.props.habit, day, 3, undefined, undefined)}>3</Button><br />
                                        <Button style={{width: 40, height: 30}} onClick={() => this.props.updateEntry(this.props.habit, day, 4, undefined, undefined)}>4</Button><br />
                                        <Button style={{width: 40, height: 30}} onClick={() => this.props.updateEntry(this.props.habit, day, 5, undefined, undefined)}>5</Button><br />
                                    </div>
                                )} hoverOpenDelay={0} minimal={true} transitionDuration={0}>
                                    <Button    
                                        className={"bp3-minimal bp3-outlined cell"}
                                        icon={getThresholdFromValue(this.props.thresholds, value).icon}
                                        style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, value).color, position: "relative"}}
                                        onClick={() => this.props.selectEntry(day, this.props.habit)}>
                                        { helperIcons }
                                        { tagIcons }
                                    </Button>
                                </Popover>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

};

function mapStateToProps(state, ownProps) {
    let tags = {};
    const rawTags = state["habits"][ownProps.habit]["tags"];
    for (let i = 0; i < rawTags.length; i++) {
        tags[rawTags[i]._id] = rawTags[i];
    }

    return {
        days: state["days"],
        category: state["habits"][ownProps.habit]["category"] ? state["categories"][state["habits"][ownProps.habit]["category"]] : undefined,
        thresholds: state["habits"][ownProps.habit]["thresholds"],
        tags: tags,
        entries: state["entries"][ownProps.habit],
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HabitBody);
