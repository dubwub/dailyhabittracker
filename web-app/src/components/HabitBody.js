import React, { Component } from 'react';
import { syncScroll, getThresholdFromValue } from '../utils/habits.utils';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { Button, Icon, Popover, TextArea } from "@blueprintjs/core";
import _ from 'lodash';

class HabitBody extends Component {

    constructor(props) {
        super(props);
        this.state = {
            entries: this.props.entries,
            debounce: _.debounce((habit, day, value) => this.props.updateEntry(habit, day, undefined, value, undefined), 1000)
        }
    }

    toggleEditMode() {
        this.props.selectHabitForEdit(this.props.habit, true);
    }

    handleTextAreaChange(habit, day, value) {
        let entries = this.state.entries;
        entries[day.format("MM/DD/YYYY")]["note"] = value;
        this.setState({
            ...this.state,
            entries: entries,
        })
        this.state.debounce(habit, day, value);
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
                                      style={{position: "absolute", width: 10, height: 10, bottom: 0, right: 10, color: "black"}}
                                />
                            ) : (
                                <span />    
                            )
                        
                        let tagIcons = [];
                        {/* if (!_.isNil(this.props.entries[day_fmt]["tags"])) {
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
                        } */}

                        return (
                            <div className={"cell"} key={day_fmt}>
                                <Popover content={(
                                    <div>
                                        How do I feel about my progress today?<br/>
                                        <Button style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, 1).color, width: 40, height: 30}} onClick={() => this.props.updateEntry(this.props.habit, day, 1, undefined, undefined)}>1</Button>
                                        <Button style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, 2).color, width: 40, height: 30}} onClick={() => this.props.updateEntry(this.props.habit, day, 2, undefined, undefined)}>2</Button>
                                        <Button style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, 3).color, width: 40, height: 30}} onClick={() => this.props.updateEntry(this.props.habit, day, 3, undefined, undefined)}>3</Button>
                                        <Button style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, 4).color, width: 40, height: 30}} onClick={() => this.props.updateEntry(this.props.habit, day, 4, undefined, undefined)}>4</Button>
                                        <Button style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, 5).color, width: 40, height: 30}} onClick={() => this.props.updateEntry(this.props.habit, day, 5, undefined, undefined)}>5</Button><br />
                                        <TextArea style={{"width":200, "height":100}} autoFocus={true}
                                            value={this.state.entries[day_fmt]["note"]}
                                            onChange={(e) => this.handleTextAreaChange(this.props.habit, day, e.target.value)}
                                            />
                                    </div>
                                )} hoverOpenDelay={0} minimal={true} transitionDuration={0} position={"right"}>
                                    <Button    
                                        className={"bp3-minimal bp3-outlined cell"}
                                        style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, value).color, position: "relative"}}>
                                        <Icon icon={getThresholdFromValue(this.props.thresholds, value).icon}
                                              style={{
                                                  color: "black",
                                                  display: "inline-block",
                                                  flex: "0 0 auto"
                                              }} />
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
