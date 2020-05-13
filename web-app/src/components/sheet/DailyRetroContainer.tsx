
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../../actions/index.actions.js'; 
import { Button, Colors, Icon, Popover, TextArea } from "@blueprintjs/core";
import { syncScroll, getThresholdFromValue, generateQuickAddButtons } from '../../utils/habits.utils';
import _ from 'lodash';
import * as moment from "moment";

const DEFAULT_THRESHOLDS = [
    {
        icon: "heart-broken",
        color: "#ea9999",
        condition: "le",
        minValue: undefined,
        maxValue: 2
    },
    {
        icon: "cross",
        color: "#f5b880",
        condition: "le",
        minValue: 3,
        maxValue: 4
    },
    {
        icon: "",
        color: "#ffd666",
        condition: "le",
        minValue: 5,
        maxValue: 6
    },
    {
        icon: "tick",
        color: "#abc978",
        condition: "le",
        minValue: 7,
        maxValue: 8
    },
    {
        icon: "clean",
        color: "#57bb8a",
        condition: "ge",
        minValue: 9,
        maxValue: 10
    }
];

export interface Props {
    days: moment.Moment[]
    entries: any // Entry[]

    // functions from index.actions
    loadUser: any
    createHabit: any
    updateHabit: any
    updateEntry: any
    selectHabitForEdit: any
}

export interface State {
    entries: any
    debounce: any
}

class DailyRetroContainer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            entries: this.props.entries,
            debounce: _.debounce((day: moment.Moment, value: number) => this.props.updateEntry("daily-retro", day, undefined, value, undefined), 1000)
        }
    }

    handleTextAreaChange(day: moment.Moment, note: string) {
        let entries = this.state.entries;
        entries[day.format("MM/DD/YYYY")]["note"] = note;
        this.setState({
            ...this.state,
            entries: entries,
        })
        this.state.debounce(day, note);
    }

    handleValueChange(day: moment.Moment, value: number) {
        let entries = this.state.entries;
        entries[day.format("MM/DD/YYYY")]["value"] = value;
        this.setState({
            ...this.state,
            entries: entries,
        })
        this.props.updateEntry("daily-retro", day, value, undefined, undefined);
    }

    createTransaction(day: moment.Moment, value: number, note: string, transactions: any) {
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
        this.props.updateEntry("daily-retro", day, undefined, undefined, transactions, undefined)
    }

    deleteTransaction(day: moment.Moment, transactions: any, index: number) {
        transactions.splice(index, 1);
        let entries = this.state.entries;
        entries[day.format("MM/DD/YYYY")]["transactions"] = transactions;
        this.setState({
            ...this.state,
            entries: entries,
        })
        this.props.updateEntry("daily-retro", day, undefined, undefined, transactions, undefined)
    }

    render() {
        return (
            <div style={{position: "relative"}}>
                <div className={"row-header habit"} style={{position: "relative", maxWidth: 500, paddingRight: 0}}>
                    <div className="habit-title">
                        <h5 style={{margin: 0}}>Daily Retrospectives</h5>
                    </div>
                </div>
                <div className={"row-contents hide-scrollbar habit"} onScroll={syncScroll}>
                    { 
                        this.props.days.map((day: moment.Moment) => {
                            const day_fmt: string = day.format("MM/DD/YYYY");
                            let value: number = this.props.entries[day_fmt]["value"];

                            let helperIcons: any = this.props.entries[day_fmt]["note"] && this.props.entries[day_fmt]["note"].length > 0 ?
                                (
                                    <Icon icon="annotation" 
                                        style={{position: "absolute", width: 10, height: 10, bottom: 0, right: 10, color: "black"}}
                                    />
                                ) : (
                                    <span />    
                                )
                            
                            // let tagIcons: any = [];
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
                                                    onClick={() => this.deleteTransaction(day, this.state.entries[day_fmt]["transactions"], i)} />
                                            Time: {moment.default(transactions[i].time).calendar()}, Value: {transactions[i].value}, Note: {transactions[i].note}
                                        </div>
                                    ))
                                }
                            }

                            return (
                                <div className={"cell"} key={day_fmt}>
                                    <Popover content={(
                                        <div>
                                            How do I feel about my progress today?<br/>
                                            { generateQuickAddButtons(DEFAULT_THRESHOLDS, 1, 10, (i: number) => this.handleValueChange(day, i)) } <br />
                                            <TextArea style={{"width":200, "height":100}} autoFocus={true}
                                                value={this.state.entries[day_fmt]["note"]}
                                                onChange={(e: any) => this.handleTextAreaChange(day, e.target.value)}
                                                />
                                            <Button icon="camera" onClick={() => this.createTransaction(day, this.state.entries[day_fmt]["value"], this.state.entries[day_fmt]["note"], this.state.entries[day_fmt]["transactions"])}>Capture snapshot</Button>
                                            { transactionTags }
                                        </div>
                                    )} hoverOpenDelay={0} modifiers={{preventOverflow: {boundariesElement: "window"}}} minimal={true} transitionDuration={0} position={"left"}>
                                        <Button    
                                            className={"bp3-minimal bp3-outlined cell"}
                                            style={{"backgroundColor": getThresholdFromValue(DEFAULT_THRESHOLDS, value).color, position: "relative"}}>
                                            <Icon icon={getThresholdFromValue(DEFAULT_THRESHOLDS, value).icon}
                                                style={{
                                                    color: "black",
                                                    display: "inline-block",
                                                    flex: "0 0 auto"
                                                }} />
                                            { helperIcons }
                                        </Button>
                                    </Popover>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        days: state.days,
        entries: state.entries["daily-retro"],
        events: state.events,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyRetroContainer);