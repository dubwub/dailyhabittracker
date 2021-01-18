import * as React from 'react';

import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { Button, InputGroup, H3, H4, H5, Tag, Tab, Tabs, Checkbox, TextArea } from "@blueprintjs/core";
import { Props } from "../types/types"; 
import { callbackify } from 'util';
import { getThresholdFromValue, generateQuickAddButtons } from '../utils/habits.utils';
import { stop_words, emotions } from '../utils/safe-constants'; 
const moment = require('moment-timezone');

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

    editedHighlights: string[]
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
            editedHighlights: [],
        }
    }

    clear(){
        this.setState({
            ...this.state,
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
            editedHighlights: [],
        })
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
                let cleanedNote = (this.state.editedTitle + " " + this.state.editedNote).toLowerCase().split(/\W/);
                let cleanedTags: any = {};
                let numTags = this.props.dreamOrder.length + this.props.experimentOrder.length;
                for (let i of this.props.dreamOrder) {
                    let dream = this.props.dreams[i];
                    let cleanedTitle = dream.title.toLowerCase().split(/\W/);
                    for (let word of cleanedTitle) {
                        if (cleanedTags[word]) {
                            cleanedTags[word].push(dream.title);
                        } else {
                            cleanedTags[word] = [dream.title];
                        }
                    }
                }
                for (let i of this.props.experimentOrder) {
                    let experiment = this.props.experiments[i];
                    let cleanedTitle = experiment.title.toLowerCase().split(/\W/);
                    for (let word of cleanedTitle) {
                        if (cleanedTags[word]) {
                            cleanedTags[word].push(experiment.title);
                        } else {
                            cleanedTags[word] = [experiment.title];
                        }
                    }
                }

                let relevantTagTitles: string[] = [];
                for (let i = 0; i < cleanedNote.length; i++) {
                    if (cleanedTags[cleanedNote[i]] && cleanedTags[cleanedNote[i]].length <= numTags / 2) {
                        for (let addTag of cleanedTags[cleanedNote[i]]) {
                            if (relevantTagTitles.indexOf(addTag) === -1) {
                                relevantTagTitles.push(addTag);
                            }
                        }
                    }
                }

                pageContents = (
                    <div className={"mainpage"}>
                        <div style={{
                            position: "absolute",
                            top: 50,
                        }}>
                            {
                                this.props.dreamOrder.filter((dream: any) => relevantTagTitles.indexOf(this.props.dreams[dream].title) !== -1).map((dream: any) => {
                                    return <Checkbox 
                                        checked={this.state.editedDreams.includes(dream)}
                                        onChange={(e: any) => e.target.checked ? this.addDream(dream) : this.removeDream(dream)}
                                    >{this.props.dreams[dream].title}</Checkbox>
                                })
                            }
                            {
                                this.props.experimentOrder.filter((experiment: any) => relevantTagTitles.indexOf(this.props.experiments[experiment].title) !== -1).map((experiment: any) => (
                                    <Checkbox 
                                        checked={this.state.editedExperiments.includes(experiment)}
                                        onChange={(e: any) => e.target.checked ? this.addExperiment(experiment) : this.removeExperiment(experiment)}
                                    >{this.props.experiments[experiment].title}</Checkbox>
                                ))
                            }
                        </div>


                        <InputGroup id="edit-title" type="text" className="bp3-input" placeholder="Title (OPTIONAL)" 
                                    value={this.state.editedTitle}
                                    onChange={(e: any) => this.modifyTitle(e.target.value)}
                                    style={{
                                        width: "40%",
                                        marginLeft: "30%",
                                        position: "absolute",
                                        top: 20,
                                    }}
                                    />

                        {
                            <div style={{marginLeft: "30%", position: "absolute", top: 60}}>
                                { generateQuickAddButtons(DEFAULT_THRESHOLDS, 1, 10, onClick, this.state.editedFeelingScore) }
                            </div>
                        }
                        <br/><TextArea
                            id="edit-note"
                            growVertically={false}
                            large={true}
                            placeholder="Write whatever you want!"
                            value={this.state.editedNote}
                            onSelect={(e) => { e.persist(); console.log(e)}}
                            onChange={(e) => { this.modifyNote(e.target.value)}}
                            style={{
                                width: "40%",
                                height: 400,
                                position: "absolute",
                                marginLeft: "30%",
                                top: 100,
                            }}
                            />
                        
                        <div style={{
                            width: "30%",
                            position: "absolute",
                            left: "70%"
                        }}>
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
                                emotions.filter((emotion: string) => this.state.editedObservations.indexOf(emotion) === -1 && (this.state.editedNote.includes(emotion) || (emotion.includes(this.state.observationSearch) && this.state.observationSearch.length > 0))).map((emotion: string) => <Button onClick={() => this.addObservation(emotion)}>{emotion}</Button>)
                            }
                        </div>

                        <br/>
                        <div style={{position: "absolute", top: 550, marginLeft: "30%"}}>
                            <Button icon="floppy-disk" intent={"success"} onClick={() => 
                                this.props.createEntryV2(this.state.editedTitle, this.state.editedDreams, this.state.editedExperiments, this.state.editedFeelingScore, this.state.editedNote, this.state.editedObservations, this.state.editedHighlights)}>Save new entry</Button>
                            <div style={{display:"inline-block",    width: 100}}></div><Button intent={"danger"} onClick={() => this.clear()}>Clear</Button>
                        </div>
                    </div>
                )
                break;
            case "reflect":
                let prevDay: any = moment().tz('America/New_York').add(1, 'days');

                let flatEmotions: string[] = [];
                for (let entry of this.props.entriesV2) {
                    for (let emotion of entry.observations) {
                        if (flatEmotions.indexOf(entry) === -1) {
                            flatEmotions.push(emotion);
                        }
                    }
                }

                pageContents = (
                    <div className={"mainpage"}>
                        <InputGroup type="text" className="bp3-input" placeholder="Note Search" 
                                value={this.state.reflectNoteSearch}
                                onChange={(e: any) => this.modifyNoteSearch(e.target.value)}
                                />
                        {
                            flatEmotions.map((emotion: string) => <Button onClick={() => {
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
                                let entryDate = moment.utc(entry.lastUpdatedAt).subtract(5, 'hours'); // hardcoded for EST
                                let dayIsSame = entryDate.isSame(prevDay, "day");
                                prevDay = entryDate;
                                return (
                                    <div>
                                        { dayIsSame ? <span></span> : <H3>{entryDate.format("MM/DD/YYYY")}</H3>}
                                        <div style={{whiteSpace: "pre-line", padding: 10, margin: 5, marginTop: dayIsSame ? 0 : 10, backgroundColor: getThresholdFromValue(DEFAULT_THRESHOLDS, entry.feelingScore).color}}>
                                            <H5>[{entry.feelingScore}]</H5>
                                            {entryDate.format()}
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
