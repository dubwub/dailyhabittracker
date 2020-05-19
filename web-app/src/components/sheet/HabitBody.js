import React, { Component } from 'react';
import { syncScroll, getThresholdFromValue } from '../../utils/habits.utils';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../../actions/index.actions.js'; 
import { Button, Icon, Popover, TextArea } from "@blueprintjs/core";
import _ from 'lodash';
import * as moment from "moment";

class HabitBody extends Component {

    constructor(props) {
        super(props);
        this.state = {
            entries: this.props.entries,
            debounce: _.debounce((habit, day, note) => this.props.updateEntry(habit, day, null, note, null, null), 1000)
        }
    }

    toggleEditMode() {
        this.props.selectHabitForEdit(this.props.habit, true);
    }

    handleValueChange(day, value) {
        let entries = this.state.entries;
        entries[day.format("MM/DD/YYYY")]["value"] = value;
        this.setState({
            ...this.state,
            entries: entries,
        })
        this.props.updateEntry(this.props.habit, day, value, null, null, null);
    }

    handleTextAreaChange(habit, day, note) {
        let entries = this.state.entries;
        entries[day.format("MM/DD/YYYY")]["note"] = note;
        this.setState({
            ...this.state,
            entries: entries,
        })
        this.state.debounce(habit, day, note);
    }

    createTransaction(habit, day, value, note, transactions) {
        if (_.isNil(transactions)) {
            transactions = [];
        }
        transactions = transactions.concat([{
            time: Date.now(),
            value: value,
            note: note,
        }]);

        let entries = this.state.entries;
        entries[day.format("MM/DD/YYYY")]["transactions"] = transactions;
        this.setState({
            ...this.state,
            entries: entries,
        })
        this.props.updateEntry(habit, day, undefined, undefined, transactions, undefined)
    }

    deleteTransaction(habit, day, transactions, index) {
        transactions.splice(index, 1);
        let entries = this.state.entries;
        entries[day.format("MM/DD/YYYY")]["transactions"] = transactions;
        this.setState({
            ...this.state,
            entries: entries,
        })
        this.props.updateEntry(habit, day, undefined, undefined, transactions, undefined)
    }

    render() {
        return (
            <div className={"row-contents hide-scrollbar habit"} onScroll={syncScroll}>
                { 
                    this.props.days.map((day) => {
                        if (_.isNil(this.props.startDate) || day >= this.props.startDate) {
                            const day_fmt = day.format("MM/DD/YYYY");
                            let value = this.state.entries[day_fmt]["value"];

                            let helperIcons = (!_.isNil(this.state.entries[day_fmt]["note"]) && this.state.entries[day_fmt]["note"].length > 0) ?
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

                            let transactionTags = [];
                            if (!_.isNil(this.state.entries[day_fmt]["transactions"])) {
                                const transactions = this.state.entries[day_fmt]["transactions"];
                                for (let i = 0; i < transactions.length; i++) {
                                    transactionTags.push((
                                        <div key={i} style={{width: 200}}>
                                            <Button icon={"cross"}
                                                    onClick={() => this.deleteTransaction(this.props.habit, day, this.state.entries[day_fmt]["transactions"], i)} />
                                            Time: {moment(transactions[i].time).calendar()}, Value: {transactions[i].value}, Note: {transactions[i].note}
                                        </div>
                                    ))
                                }
                            }

                            return (
                                <div className={"cell"} key={day_fmt}>
                                    <Popover content={(
                                        <div style={{width: 250, height: 250, overflowY: "auto", overflowX: "hidden"}}>
                                            How do I feel about my progress today?<br/>
                                            <Button style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, 1).color, width: 40, height: 30}} onClick={() => this.handleValueChange(day, 1)}>1</Button>
                                            <Button style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, 2).color, width: 40, height: 30}} onClick={() => this.handleValueChange(day, 2)}>2</Button>
                                            <Button style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, 3).color, width: 40, height: 30}} onClick={() => this.handleValueChange(day, 3)}>3</Button>
                                            <Button style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, 4).color, width: 40, height: 30}} onClick={() => this.handleValueChange(day, 4)}>4</Button>
                                            <Button style={{"backgroundColor": getThresholdFromValue(this.props.thresholds, 5).color, width: 40, height: 30}} onClick={() => this.handleValueChange(day, 5)}>5</Button><br />
                                            <TextArea style={{"width":200, "height":100}} autoFocus={true}
                                                value={this.state.entries[day_fmt]["note"]}
                                                onChange={(e) => this.handleTextAreaChange(this.props.habit, day, e.target.value)}
                                                />
                                            <Button icon="camera" onClick={() => this.createTransaction(this.props.habit, day, this.state.entries[day_fmt]["value"], this.state.entries[day_fmt]["note"], this.state.entries[day_fmt]["transactions"])}>Capture snapshot</Button>
                                            { transactionTags }
                                        </div>
                                    )} modifiers={{preventOverflow: {enabled: true, boundariesElement: "window"}}} hoverOpenDelay={0} minimal={true} transitionDuration={0} position={"right"}>
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
                        } else {
                            return (
                                <div className={"cell"} key={day.format("MM/DD/YYYY")} />
                            )
                        }
                        
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
        startDate: state["habits"][ownProps.habit]["startDate"],
        tags: tags,
        entries: state["entries"][ownProps.habit],
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HabitBody);
