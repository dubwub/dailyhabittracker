import * as React from 'react';
import * as mapDispatchToProps from '../actions/index.actions.js';
import { Button } from "@blueprintjs/core";
import { connect } from 'react-redux';
import { callbackify } from 'util';

const prompts: string[] = [
    "Take a moment to close your eyes and breathe. What do you feel right now?",
    "Are you happy with how today is going? What were the things you wanted to get done today?",
    "What are you resisting?",
    "What are you doing in this very moment? What do you hear, what do you feel, what do you see?",
    "When was the last time you stood up and took a walk?",
    "Do you feel burdened by the expectations you've been placing on yourself?"
];


export interface State {
    currentPrompt: number
}

class PromptBar extends React.Component<{}, State>{    
    constructor(props: object) {
        super(props);
        this.state = {
            currentPrompt: Math.floor(Math.random() * prompts.length),
        }
    }

    goToNextPrompt() {
        let nextIndex = this.state.currentPrompt + 1;
        if (nextIndex >= prompts.length) {
            nextIndex = 0;
        }
        this.setState({
            ...this.state,
            currentPrompt: nextIndex,
        })
    }

    goToPrevPrompt() {
        let nextIndex = this.state.currentPrompt - 1;
        if (nextIndex < 0) {
            nextIndex = prompts.length - 1;
        }
        this.setState({
            ...this.state,
            currentPrompt: nextIndex,
        });
    }

    render() {
        return (
            <div style={{height: 80, backgroundColor: "#9179F2", color: "#F5F8FA", textAlign: "center", marginTop: 5, marginBottom: 5, paddingTop: 20, fontSize: 30}}>
                <Button large={true} icon="caret-left" onClick={() => this.goToPrevPrompt()}/>
                {prompts[this.state.currentPrompt]}
                <Button large={true} icon="caret-right" onClick={() => this.goToNextPrompt()}/>
            </div>
        )   
    }
}

function mapStateToProps(state: any) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(PromptBar);
