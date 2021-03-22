import * as React from 'react';

import _ from 'lodash';
import { connect } from 'react-redux';
import * as mapDispatchToProps from '../actions/index.actions.js'; 
import { Button, InputGroup, H3, H4, H5, H6, Tag, Tab, Tabs, Checkbox, TextArea } from "@blueprintjs/core";
import { Props } from "../types/types"; 
import { callbackify } from 'util';
import { base_emotions, color_map, feelings_wheel, flat_emotions } from '../utils/safe-constants'; 
import { urlify } from '../utils/habits.utils';
const moment = require('moment-timezone');

interface State {
    editedTitle: string
    editedNote: string
    editedType: string
    editedTags: {
        type: string,
        tag: string,
        background: string,
        textColor: string,
    }[]
    editedParents: string[]
    editedNeighbors: string[]
    editedTag: string

    searchString: string
    tagSearch: string[]

    password: string

    editedEntriesV3Order: string[]

    editedSelfMessage: string
    editedEntryTypeSearch: string

    writeTabShowEmotions: boolean
}

class OverviewV3 extends React.Component<Props, State>{    
    constructor(props: Props) {
        super(props);
        this.state = {
            editedTitle: "",
            editedNote: "",
            editedType: "journal",
            editedTags: [],
            editedTag: "",
            tagSearch: [],
            searchString: "",
            editedParents: [],
            editedNeighbors: [],
            password: "",
            editedEntriesV3Order: [],
            editedSelfMessage: this.props.selfMessage,
            editedEntryTypeSearch: "",
            writeTabShowEmotions: false,
        }
    }

    clear(){
        this.setState({
            ...this.state,
            editedTitle: "",
            editedNote: "",
            editedType: "journal",
            editedTags: [],
            editedTag: "",
            tagSearch: [],
            searchString: "",
            editedParents: [],
            editedNeighbors: [],
            password: "",
            editedEntryTypeSearch: "",
            writeTabShowEmotions: false,
        })
    }

    toggleShowEmotions() {
        this.setState({
            writeTabShowEmotions: !this.state.writeTabShowEmotions,
        })
    }

    modifyEditedTypeSearch(type: string) {
        if (this.state.editedEntryTypeSearch === type) {
            this.setState({
                ...this.state,
                editedEntryTypeSearch: ""
            })
        } else {
            this.setState({
                ...this.state,
                editedEntryTypeSearch: type
            })
        }
    }

    modifySelfMessage(message: string) {
        this.setState({
            ...this.state,
            editedSelfMessage: message
        })
    }

    modifyTitle(title: string) {
        this.setState({
            ...this.state,
            editedTitle: title,
        })
    }
    modifyType(type: string) {
        this.setState({
            ...this.state,
            editedType: type,
        })
    }
    modifyTag(tag: string) {
        this.setState({
            ...this.state,
            editedTag: tag,
        })
    }
    addTag(tag: any) {
        this.setState({
            ...this.state,
            editedTags: this.state.editedTags.concat([tag]),
            editedTag: "",
        })
    }
    removeTag(tag: string) {
        this.setState({
            ...this.state,
            editedTags: this.state.editedTags.filter((e: any) => e.tag !== tag)
        })
    }

    addTagSearch(tag: string) {
        this.setState({
            ...this.state,
            tagSearch: this.state.tagSearch.concat([tag])
        })
    }
    removeTagSearch(tag: string) {
        this.setState({
            ...this.state,
            tagSearch: this.state.tagSearch.filter((e: string) => e !== tag)
        })
    }

    modifyNote(note: string) {
        this.setState({
            ...this.state,
            editedNote: note
        })
    }

    modifySearchString(searchString: string) {
        this.setState({
            ...this.state,
            searchString: searchString
        })
    }

    modifyPassword(password: string) {
        this.setState({
            ...this.state,
            password: password
        })

        if (password === "darwinisthebest") {
            this.props.loadUserV3();
        }
    }

    loadEntryAsState(entry: any) {
        this.setState({
            ...this.state,
            editedTitle: entry.title,
            editedNote: entry.note,
            editedType: entry.entryType,
            editedTags: entry.tags,
            editedParents: [entry._id],
            editedNeighbors: [],
        })
    }

    render() {
        let pageContents = (<div />);
        let tags: string[] = [];
        let tagCountMap: any = {};
        let hideEntriesMap: any = {};
        let neighborTagMap: any = {};
        for (let id of this.props.entriesV3Order) {
            let entry = this.props.entriesV3[id];
            for (let tag of entry.tags) {
                if (_.isNil(tagCountMap[tag.tag])) {
                    tagCountMap[tag.tag] = 1;
                } else {
                    tagCountMap[tag.tag] += 1;
                }
                
                let newNeighbors = entry.tags.filter((_tag: any) => tag.tag !== _tag);
                if (_.isNil(neighborTagMap[tag.tag])) {
                    neighborTagMap[tag.tag] = newNeighbors.map((_tag: any) => _tag.tag);
                } else {
                    for (let neighbor of newNeighbors) {
                        if (neighborTagMap[tag.tag].indexOf(neighbor.tag) === -1) {
                            neighborTagMap[tag.tag] = neighborTagMap[tag.tag].concat([neighbor.tag]);
                        }
                    }
                }

                if (tags.indexOf(tag.tag) === -1 || (this.props.currentTabV2 !== "reflect" && tag.tag.toLowerCase().replace(/[^a-z]+/g, '').includes(this.state.searchString))) {
                    tags.push(tag.tag)
                }
            }
            for (let parent of entry.parents) {
                hideEntriesMap[parent] = "yes";
            }
        }

        let randomTagsToSurface: string[] = [];
        for (let i = 0; i < 10; i++) {
            let index = Math.floor(Math.random() * tags.length);
            let justInCase = 0;
            while (randomTagsToSurface.indexOf(tags[index]) !== -1 && this.state.tagSearch.indexOf(tags[index]) !== -1 && justInCase < 50) {
                index = Math.floor(Math.random() * tags.length);
                justInCase++;
            }
            randomTagsToSurface.push(tags[index]);
        }
        

        // let paretoBound = .2 * this.props.entriesV3Order.length;
        // tags = tags.sort((a: string, b: string) => {
        //     return Math.abs(tagCountMap[a] - paretoBound) < Math.abs(tagCountMap[b] - paretoBound) ? -1 : 1;
        // })


        let helperMap: any = {
            "journal": "I'm not sure how this will be helpful in the future, but writing will help me process my emotions.",
            "curiosity": "I have a feeling this will be helpful in the future, but it's not a fully fledged idea.",
            "document": "This is a full complete idea that I want to iterate on."
        }

        let emotionsOrder: string[] = base_emotions.map((emotion: any) => emotion.color);

        switch (this.props.currentTabV2) {
            case "write":
                // get first layer of emotional depth
                let selectedEmotions = this.state.editedTags.filter((tag: any) => tag.type === "emotion");
                let suggestedEmotions: any[] = base_emotions;
                for (let i = 0; i < selectedEmotions.length; i++) {
                    if (typeof feelings_wheel[selectedEmotions[i].tag] === "undefined") continue;
                    suggestedEmotions = suggestedEmotions.concat(feelings_wheel[selectedEmotions[i].tag])
                }

                suggestedEmotions = suggestedEmotions.filter((tag: any) => this.state.editedTags.map((_tag: any) => _tag.tag).indexOf(tag.emotion) === -1);

                pageContents = (
                    <div className={"mainpage"}>
                        <div style={{
                            // position: "absolute",
                            width: "80%",
                            overflowY: "auto",
                            paddingLeft: "10%",
                        }}> 
                            <Button icon="floppy-disk" intent={"success"} onClick={() => this.props.createEntryV3(this.state.editedType, this.state.editedTitle, this.state.editedNote, this.state.editedTags, this.state.editedParents, this.state.editedNeighbors)}>Save new entry</Button>
                            <div style={{display:"inline-block", width: 50}}></div><Button intent={"danger"} onClick={() => this.clear()}>Clear</Button>
                            <br/><br/>
                            {/* <Button disabled={this.state.editedType === "curiosity"} onClick={() => this.modifyType("curiosity")}>curiosity</Button>
                            <Button disabled={this.state.editedType === "journal"} onClick={() => this.modifyType("journal")}>journal</Button>
                            <Button disabled={this.state.editedType === "document"} onClick={() => this.modifyType("document")}>document</Button>
                            <span style={{paddingLeft: 40}}>{ helperMap[this.state.editedType] }</span> */}
                            <br/><br/>

                            <InputGroup id="edit-title" type="text" placeholder="Title (OPTIONAL)" 
                                        value={this.state.editedTitle}
                                        onChange={(e: any) => this.modifyTitle(e.target.value)}
                                        />
                            <br/><TextArea
                                id="edit-note"
                                growVertically={false}
                                large={true}
                                placeholder="Write whatever you want!"
                                value={this.state.editedNote}
                                style={{
                                    width: "100%",
                                    minHeight: 200,
                                }}
                                onChange={(e) => { this.modifyNote(e.target.value)}}
                                />
                            
                            <br/>
                            {
                                <div>
                                    {
                                        this.state.editedTags.filter((tag: any) => tag.type === "emotion").map((tag: any) => {
                                            return (
                                                    <Button 
                                                        style={{
                                                            backgroundColor: tag.background,
                                                            color: tag.textColor,
                                                        }}
                                                        icon={"cross"}
                                                        onClick={(e: any) => { this.removeTag(tag.tag) }}>{tag.tag}</Button>
                                            )
                                        })
                                    }
                                </div>
                            }
                            <br/>
                            <Button minimal={true} onClick={() => this.toggleShowEmotions()}>Toggle emotions</Button>
                            {
                                this.state.writeTabShowEmotions ? suggestedEmotions.sort((a: any, b: any) => emotionsOrder.indexOf(a.color) <= emotionsOrder.indexOf(b.color) ? 1:-1).map((tag: any) => {
                                    return (
                                            <Button 
                                                style={{
                                                    backgroundColor: tag.background,
                                                    color: tag.textColor,
                                                }}
                                                minimal={true}
                                                onClick={(e: any) => { this.addTag({type: "emotion", tag: tag.emotion}) }}>{tag.emotion}</Button>
                                    )
                                }) : <span />
                            }

                            <div style={{
                                position: "relative"
                            }}>
                                <InputGroup id="edit-tag" type="text" placeholder="Add a tag" 
                                        value={this.state.editedTag}
                                        onChange={(e: any) => this.modifyTag(e.target.value)}
                                        style={{
                                            width: "70%",
                                            display: "inline-block"
                                        }}
                                        />
                                <Button icon={"floppy-disk"} style={{position: "absolute", top: 0, right: 0}} onClick={() => { this.addTag({ tag: this.state.editedTag, type: "other" }); }}
                                ></Button>
                            </div>
                            {
                                this.state.editedTags.map((tag: any) => (
                                    <Button 
                                        onClick={(e: any) => this.removeTag(tag.tag)}
                                        intent={"primary"}
                                        >{tag.tag}</Button>
                                ))
                            }
                            {
                                tags.filter((tag: string) => this.state.editedTags.map((_tag: any) => _tag.tag).indexOf(tag) === -1 && this.state.editedTag.length > 0 && tag.toLowerCase().replace(/[^a-z]+/g, '').includes(this.state.editedTag.toLowerCase().replace(/[^a-z]+/g, ''))).map((tag: any) => (
                                    <Button 
                                        onClick={(e: any) => this.addTag({tag: tag, type: "other"})}
                                        intent={"none"}
                                        >{tag}</Button>
                                ))
                            }
                            {
                                this.props.tagOrder.filter((tag: any) => 
                                    {
                                        if (_.isNil(this.props.tags[tag])) { return false; }
                                        return this.props.tags[tag].tag.includes(this.state.editedTag);
                                    }
                                ).map((tag: any) => (
                                    <Button 
                                        onClick={(e: any) => this.addTag(this.props.tags[tag])}
                                        >{this.props.tags[tag].tag}</Button>
                                ))
                            }
                        </div>
                    </div>
                )
                break;
            case "reflect":
                let key = "";
                if (this.state.editedEntriesV3Order.length > 0) {
                    key = this.state.editedEntriesV3Order[this.state.editedEntriesV3Order.length - 1];
                }

                let cleanedSearchString = this.state.searchString.toLowerCase().replace(/[^a-z]+/g, '');
                let tagsToSurface: string[] = tags.filter((tag: string) => {
                    return tag.toLowerCase().replace(/[^a-z]+/g, '').includes(cleanedSearchString);
                });
                if (this.state.searchString === "") {
                    if (this.state.tagSearch.length === 0) tagsToSurface = randomTagsToSurface;
                    else {
                        tagsToSurface = [];
                        for (let _tag of this.state.tagSearch) {
                            tagsToSurface = tagsToSurface.concat(neighborTagMap[_tag]);
                        }
                        tagsToSurface = tagsToSurface.filter((_tag: string) => this.state.tagSearch.indexOf(_tag) === -1);
                    }
                }

                pageContents = (
                    <div className={"mainpage"} style={{overflowY: "hidden"}} key={key}>
                        <div style={{width: "20%", padding: 0}}>
                            {
                                ["curiosity", "journal", "document"].map((type: string) => 
                                    <Button
                                        onClick={() => this.modifyEditedTypeSearch(type)}
                                        intent={this.state.editedEntryTypeSearch !== type ? "none" : "primary"}    
                                    >
                                        {type}
                                    </Button>
                                )
                            }
                            <InputGroup type="text" className="bp3-input" placeholder="Note Search" 
                                    value={this.state.searchString}
                                    onChange={(e: any) => this.modifySearchString(e.target.value)}
                                    />
                            {
                                this.state.tagSearch.map((tag: string) => {
                                    return <Button intent={"primary"}
                                        onClick={() => {this.removeTagSearch(tag);}}>{tag + " (" + tagCountMap[tag] + ")"}</Button>
                                })
                            }
                            {
                                tagsToSurface.map((tag: string) => {
                                    return <Button intent={"none"}
                                    onClick={() => {
                                            this.addTagSearch(tag);
                                    }}>{tag + " (" + tagCountMap[tag] + ")"}</Button>
                                })
                            }
                        </div>
                        <div style={{position: "absolute", top: 0, left: "20%", width: "80%", height: "100%", overflowY: "auto"}}>
                            {
                                [0,1,2].map((col: number) => {
                                    return <div style={{display: "inline-block", float: "left", width: 350}}>
                                        {
                                            this.props.entriesV3Order.filter((id: any, index: number) => { 
                                                let entry = this.props.entriesV3[id];

                                                let cleanedEntryForFilter = ((_.isNil(entry.title) ? "" : entry.title) + entry.note).toLowerCase().replace(/[^a-z]+/g, '');
                                                if (!_.isNil(entry.tags)) {
                                                    for (let tag of entry.tags) {
                                                        cleanedEntryForFilter += tag.tag.toLowerCase().replace(/[^a-z]+/g, '')
                                                    }
                                                    for (let tag of this.state.tagSearch) {
                                                        if (entry.tags.map((tag: any) => tag.tag).indexOf(tag) === -1) return false;
                                                    }
                                                } else {
                                                    if (this.state.tagSearch.length > 0) return false;
                                                }
                                                return (this.state.editedEntryTypeSearch === "" || entry.entryType === this.state.editedEntryTypeSearch) && _.isNil(hideEntriesMap[id]) && index%3 === col && entry.latest && !(this.state.searchString.length > 0 && !cleanedEntryForFilter.includes(this.state.searchString))
                                            }).slice().reverse().map((_entry: any) => {
                                                let entry = this.props.entriesV3[_entry];
                                                let entryDate = entry.time;
                                                
                                                let emotionColors = entry.tags.filter((tag: any) => tag.entryType === "emotion" || flat_emotions.indexOf(tag.tag) !== -1).map((tag: any) => {
                                                    let color = color_map[tag.tag];
                                                    return (
                                                        <div key={tag.tag} style={{width: 20, height: 20, margin: 5, display: "inline-block", backgroundColor: color}}></div>
                                                    )
                                                });
            
                                                return (
                                                    <div key={entry._id} style={{height: 400, minWidth: 300, padding: 10, wordWrap: "break-word", border:"1px solid black", overflowY: "auto"}}>
                                                        <div style={{whiteSpace: "pre-line", padding: 10, margin: 5, marginTop:  10}}>
                                                            <H5>{entry.title}</H5>
                                                            <H6>{entryDate.calendar()}</H6>
                                                            <Button icon={"upload"} onClick={() => {
                                                                this.loadEntryAsState(entry);
                                                                this.props.selectTabV2("write");
                                                            }}>Load</Button>
                                                            <div>{emotionColors}</div>
                                                            <div>
                                                                {
                                                                    entry.tags.map((tag: any) => <Tag>{tag.tag}</Tag>)
                                                                }
                                                            </div>
                                                            {<span dangerouslySetInnerHTML={{__html: urlify(entry.note)}}></span>}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                })
                            }
                        </div>
                    </div>
                )
                break;
            case "settings":
                pageContents = (
                    <div className={"mainpage"}>
                        <TextArea
                                    id="edit-self-message"
                                    growVertically={false}
                                    large={true}
                                    placeholder="Edited self message"
                                    value={this.state.editedSelfMessage}
                                    style={{
                                        width: "100%",
                                        minHeight: 400,
                                        paddingTop: 100,
                                    }}
                                    onChange={(e) => { this.modifySelfMessage(e.target.value)}}
                                    />
                        <Button intent="primary" onClick={() => this.props.editSelfMessage(this.state.editedSelfMessage)}>Save</Button>
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
                            {/* <div style={{whiteSpace: "pre-line", backgroundColor: "#AD99FF", width: "100%", height: 100}}>
                                { this.props.selfMessage }
                            </div> */}
                        </div>
                        {/* <div style={{position: "relative", marginTop: 140, width: "100%", height: "100%"}}> */}
                        { pageContents }
                        {/* </div> */}
                    </div>
                </div>
            );
        } else { // wait, cuz we're loading
            return (<InputGroup type="text" placeholder="who are you" 
            value={this.state.password}
            onChange={(e: any) => this.modifyPassword(e.target.value)}
            />);
        }
    }
}

function mapStateToProps(state: any) {
    return {
        ...state
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewV3);
