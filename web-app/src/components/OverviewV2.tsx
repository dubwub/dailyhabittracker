import * as React from 'react';

import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { Button, InputGroup, H3, H4, H5, Tag, Tab, Tabs, Checkbox, TextArea } from "@blueprintjs/core";
import { Props } from "../types/types"; 
import { callbackify } from 'util';
import { getThresholdFromValue, generateQuickAddButtons } from '../utils/habits.utils';
const moment = require('moment');

const EMOTIONS = [
    "enjoyment",
    "happiness",
    "love",
    "relief",
    "contentment",
    "amusement",
    "joy",
    "pride",
    "excitement",
    "peace",
    "satisfaction",
    "compassion",
    "sadness",
    "lonely",
    "heartbroken",
    "gloomy",
    "disappointed",
    "hopeless",
    "grieved",
    "unhappy",
    "lost",
    "troubled",
    "resigned",
    "miserable",
    "fear",
    "worried",
    "doubtful",
    "nervous",
    "anxious",
    "terrified",
    "panicked",
    // "horrified",
    "desperate",
    "confused",
    "stressed",
    "anger",
    "annoyed",
    "frustrated",
    "peeved",
    "contrary",
    "bitter",
    "infuriated",
    "irritated",
    "mad",
    "cheated",
    "vengeful",
    "insulted",
    "disgust",
    "dislike",
    "revulsion",
    "loathing",
    "disapproving",
    "offended",
    "horrified",
    "uncomfortable",
    "nauseated",
    "disturbed",
    "withdrawal",
    "aversion"
].concat([
    "resentful",
    "proud",
    "excited",
    "belittled",
    "intrigued",
    "curious",
    "wonder",
    "inspired",
    "tired",
    "exhausted",
    "bored"
])

const DEFAULT_THRESHOLDS = [
    {
        icon: "",
        color: "#ea9999",
        condition: "eq",
        minValue: 1,
        maxValue: 1
    },
    {
        icon: "",
        color: "#ea9999",
        condition: "eq",
        minValue: 2,
        maxValue: 2
    },
    {
        icon: "",
        color: "#f5b880",
        condition: "eq",
        minValue: 3,
        maxValue: 3
    },
    {
        icon: "",
        color: "#f5b880",
        condition: "eq",
        minValue: 4,
        maxValue: 4
    },
    {
        icon: "",
        color: "#ffd666",
        condition: "eq",
        minValue: 5,
        maxValue: 5
    },
    {
        icon: "",
        color: "#ffd666",
        condition: "eq",
        minValue: 6,
        maxValue: 6
    },
    {
        icon: "",
        color: "#abc978",
        condition: "eq",
        minValue: 7,
        maxValue: 7,
    },
    {
        icon: "",
        color: "#abc978",
        condition: "eq",
        minValue: 8,
        maxValue: 8
    },
    {
        icon: "",
        color: "#57bb8a",
        condition: "eq",
        minValue: 9,
        maxValue: 9
    },
    {
        icon: "",
        color: "#57bb8a",
        condition: "eq",
        minValue: 10,
        maxValue: 10
    },
];

interface State {
    editedTitle: string
    editedFeelingScore: number
    editedNote: string
    editedExperiments: string[]
    editedDreams: string[]
    editedObservations: string[]

    reflectNoteSearch: string
    reflectEmotionSearch: string[]

    editedDreamTitle: string,
    editedExperimentTitle: string,
    observationSearch: string,
}

class OverviewV2 extends React.Component<Props, State>{    
    constructor(props: Props) {
        super(props);
        this.props.loadUserV2();
        this.state = {
            editedTitle: "",
            editedFeelingScore: -1,
            editedNote: "",
            editedExperiments: [],
            editedDreams: [],
            editedObservations: [],
            editedDreamTitle: "",
            editedExperimentTitle: "",
            observationSearch: "",
            reflectEmotionSearch: [],
            reflectNoteSearch: "",
        }
    }

    modifyNoteSearch(search: string) {
        this.setState({
            ...this.state,
            reflectNoteSearch: search,
        })
    }
    addEmotionSearch(emotion: string) {
        this.setState({
            ...this.state,
            reflectEmotionSearch: this.state.reflectEmotionSearch.concat([emotion]),
        })
    }
    removeEmotionSearch(emotion: string) {
        this.setState({
            ...this.state,
            reflectEmotionSearch: this.state.reflectEmotionSearch.filter((shouldIFilter: string) => shouldIFilter !== emotion),
        })
    }

    modifyDreamTitle(title: string) {
        this.setState({
            ...this.state,
            editedDreamTitle: title,
        })
    }

    modifyExperimentTitle(title: string) {
        this.setState({
            ...this.state,
            editedExperimentTitle: title,
        })
    }

    modifyTitle(title: string) {
        this.setState({
            ...this.state,
            editedTitle: title,
        })
    }

    modifyFeelingScore(feelingScore: number) {
        this.setState({
            ...this.state,
            editedFeelingScore: feelingScore,
        })
    }

    modifyNote(note: string) {
        this.setState({
            ...this.state,
            editedNote: note
        })
    }

    addExperiment(experiment: string) {
        this.setState({
            ...this.state,
            editedExperiments: this.state.editedExperiments.concat([experiment]),
        })
    }

    removeExperiment(experiment: string) {
        this.setState({
            ...this.state,
            editedExperiments: this.state.editedExperiments.filter((shouldIFilter: string) => shouldIFilter !== experiment),
        })
    }

    addDream(dream: string) {
        this.setState({
            ...this.state,
            editedDreams: this.state.editedDreams.concat([dream]),
        })
    }

    removeDream(dream: string) {
        this.setState({
            ...this.state,
            editedDreams: this.state.editedDreams.filter((shouldIFilter: string) => shouldIFilter !== dream),
        })
    }

    addObservation(observation: string) {
        this.setState({
            ...this.state,
            editedObservations: this.state.editedObservations.concat([observation]),
        })
    }

    removeObservation(index: number) {
        let newObservations = this.state.editedObservations;
        newObservations.splice(index, 1);

        this.setState({
            ...this.state,
            editedObservations: newObservations,
        })
    }

    modifyObservationSearch(search: string) {
        this.setState({
            ...this.state,
            observationSearch: search,
        })
    }

    render() {
        const onClick = (i: number) => {
            this.modifyFeelingScore(i);
        }

        let pageContents = (<div />);
        switch (this.props.currentTabV2) {
            case "write":
                pageContents = (
                    <div className={"mainpage"}>
                        <H4>What dreams/experiments are this entry related to?</H4>
                        {
                            this.props.dreamOrder.map((dream: any) => {
                                return <Checkbox 
                                    checked={this.state.editedDreams.includes(dream)}
                                    onChange={(e: any) => e.target.checked ? this.addDream(dream) : this.removeDream(dream)}
                                >{this.props.dreams[dream].title}</Checkbox>
                            })
                        }
                        {
                            this.props.experimentOrder.map((experiment: any) => (
                                <Checkbox 
                                    checked={this.state.editedExperiments.includes(experiment)}
                                    onChange={(e: any) => e.target.checked ? this.addExperiment(experiment) : this.removeExperiment(experiment)}
                                >{this.props.experiments[experiment].title}</Checkbox>
                            ))
                        }


                        <H4>How did it feel?</H4>
                        { generateQuickAddButtons(DEFAULT_THRESHOLDS, 1, 10, onClick, this.state.editedFeelingScore) }

                        <H4>Write anything you want :)</H4>
                        <TextArea
                            id="edit-desc"
                            growVertically={false}
                            large={true}
                            placeholder="Description"
                            value={this.state.editedNote}
                            onChange={(e) => this.modifyNote(e.target.value)}
                            style={{
                                width: "90%",
                                height: 600,
                            }}
                            />
                        
                        <H4>Add some feelings!</H4>
                        {
                            this.state.editedObservations.map((observation: string, index: number) => (
                                <div>
                                    {observation}
                                    <Button onClick={() => this.removeObservation(index)}>X</Button>
                                </div>
                            ))
                        }


                        <InputGroup type="text" className="bp3-input" placeholder="Observation Search" 
                                value={this.state.observationSearch}
                                onChange={(e: any) => this.modifyObservationSearch(e.target.value)}
                                />
                        {
                            EMOTIONS.filter((emotion: string) => this.state.editedObservations.indexOf(emotion) === -1 && (this.state.editedNote.includes(emotion) || (emotion.includes(this.state.observationSearch) && this.state.observationSearch.length > 0))).map((emotion: string) => <Button onClick={() => this.addObservation(emotion)}>{emotion}</Button>)
                        }

                        <br/>
                        <Button icon="floppy-disk" intent={"success"} onClick={() => 
                            this.props.createEntryV2(this.state.editedDreams, this.state.editedExperiments, this.state.editedFeelingScore, this.state.editedNote, this.state.editedObservations)}>Save new entry</Button>
                    </div>
                )
                break;
            case "reflect":
                // const datesAreOnSameDay = (first: Date, second: Date) =>
                //     first.getFullYear() === second.getFullYear() &&
                //     first.getMonth() === second.getMonth() &&
                //     first.getDate() === second.getDate();
                let prevDay: any = moment();
                pageContents = (
                    <div className={"mainpage"}>
                        <InputGroup type="text" className="bp3-input" placeholder="Note Search" 
                                value={this.state.reflectNoteSearch}
                                onChange={(e: any) => this.modifyNoteSearch(e.target.value)}
                                />
                        {
                            EMOTIONS.map((emotion: string) => <Button onClick={() => {
                                if (this.state.reflectEmotionSearch.indexOf(emotion) === -1) {
                                    this.addEmotionSearch(emotion)
                                } else {
                                    this.removeEmotionSearch(emotion)
                                }
                            }}
                                intent={this.state.reflectEmotionSearch.indexOf(emotion) === -1 ? "none" : "primary"}
                            >{emotion}</Button>)
                        }
                        
                        {
                            this.props.entriesV2.slice().reverse().filter(
                                (entry: any) => {
                                    if (this.state.reflectNoteSearch.length > 0) {
                                        if (!entry.note.toLowerCase().includes(this.state.reflectNoteSearch)) return false;
                                    }
                                    for (let emotion of this.state.reflectEmotionSearch) {
                                        if (entry.observations.indexOf(emotion) === -1) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                            ).map((entry: any) => {
                                let entryDate = moment(entry.lastUpdatedAt.substring(0, 10));
                                let dayIsSame = entryDate.isSame(prevDay, "day");
                                prevDay = entryDate;
                                return (
                                    <div>
                                        { dayIsSame ? <span></span> : <H3>{entryDate.format("MM/DD/YYYY")}</H3>}
                                        <div style={{whiteSpace: "pre-line", padding: 10, margin: 5, marginTop: dayIsSame ? 0 : 10, backgroundColor: getThresholdFromValue(DEFAULT_THRESHOLDS, entry.feelingScore).color}}>
                                            <H5>[{entry.feelingScore}]</H5>
                                            {entry.lastUpdatedAt}
                                            <div>
                                                {
                                                    entry.dreams.map((dream: string) => <Tag>{this.props.dreams[dream].title}</Tag>)
                                                }
                                                {
                                                    entry.experiments.map((experiment: string) => <Tag>{this.props.experiments[experiment].title}</Tag>)
                                                }
                                            </div>
                                            {entry.note}
                                            <div>
                                                {
                                                    entry.observations.map((observation: string) => <Tag>{observation}</Tag>)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
                break;
            case "settings":
                pageContents = (
                    <div className={"mainpage"}>
                        <H4>Dreams</H4>
                        {
                            this.props.dreamOrder.map((dream: string) => (
                                <div>{this.props.dreams[dream].title}</div>
                            ))
                        }
                        <InputGroup type="text" className="bp3-input" placeholder="Dream Title" 
                                value={this.state.editedDreamTitle}
                                onChange={(e: any) => this.modifyDreamTitle(e.target.value)}
                                />
                        <Button onClick={() => this.props.createDream(this.state.editedDreamTitle)}>Save New Dream</Button>

                        <H4>Experiments</H4>
                        {
                            this.props.experimentOrder.map((experiment: string) => (
                                <div>{this.props.experiments[experiment].title}</div>
                            ))
                        }
                        <InputGroup type="text" className="bp3-input" placeholder="Experiment Title" 
                                value={this.state.editedExperimentTitle}
                                onChange={(e: any) => this.modifyExperimentTitle(e.target.value)}
                                />
                        <Button onClick={() => this.props.createExperiment(this.state.editedExperimentTitle)}>Save New Experiment</Button>
                    </div>
                )
                break;
            default:
                pageContents = (
                    <div>
                        wtf is the tab name?
                    </div>
                );
                break;
        }

        if (this.props.user) { // because of async, this render happens twice, once on page load and once when we hear back from mongo
            return (
                <div>
                    <div>
                        <div className="topbar">
                            <Tabs id="headerTabs"
                                large={true}
                                onChange={(e) => this.props.selectTabV2(e)}
                                selectedTabId={this.props.currentTabV2}>
                                <Tab id="write" title="Write" />
                                <Tab id="reflect" title="Reflect" />
                                <Tab id="settings" title="Settings" />
                                
                            </Tabs>
                        </div>
                        { pageContents }
                    </div>
                </div>
            );
        } else { // wait, cuz we're loading
            return (<div>Loading... (if you see this for more than 5 seconds, the server is probably dead, tell Darwin)</div>);
        }
    }
}

function mapStateToProps(state: any) {

    return {
        ...state
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewV2);
