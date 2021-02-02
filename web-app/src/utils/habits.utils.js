import React from 'react';
import { Button } from "@blueprintjs/core";
const moment = require('moment');

export function returnLastXDays(numDays) {
    const today = moment().startOf('day');
    let days = []; 

    for (let i = 0; i < numDays; i++) {
        let newDate = moment(today);
        newDate.subtract(i, 'days');
        days.unshift(newDate);
    }

    return days;
}

export function syncScroll(e) {
    const ctr_contents = document.getElementsByClassName("row-contents")

    let element = e.target;
    let scroll = element.scrollLeft;
    let scrollIncrement = parseInt(element.scrollLeft / 50);
    
    Array.prototype.forEach.call(ctr_contents, function(element) {
        element.scrollLeft = scroll;
    });
}

export function getThresholdFromValue(thresholds, value) {
    if (!value) {
        return {
            color: "",
            icon: ""
        };
    }
    for (let i = 0; i < thresholds.length; i++) {
        switch (thresholds[i].condition) {
            case 'lt':
                if (value < thresholds[i].maxValue) {
                    return {
                        color: thresholds[i].color,
                        icon: thresholds[i].icon
                    }
                }
                break;
            case 'le':
                if (value <= thresholds[i].maxValue) {
                    return {
                        color: thresholds[i].color,
                        icon: thresholds[i].icon
                    }
                }
                break;
            case 'eq':
                if (value === thresholds[i].maxValue) {
                    return {
                        color: thresholds[i].color,
                        icon: thresholds[i].icon
                    }
                }
                break;
            case 'ge':
                if (value >= thresholds[i].minValue) {
                    return {
                        color: thresholds[i].color,
                        icon: thresholds[i].icon
                    }
                }
                break;
            case 'gt':
                if (value > thresholds[i].minValue) {
                    return {
                        color: thresholds[i].color,
                        icon: thresholds[i].icon
                    }
                }
                break;
            case 'between':
                if (thresholds[i].minValue <= value <= thresholds[i].maxValue) {
                    return {
                        color: thresholds[i].color,
                        icon: thresholds[i].icon
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

export function generateQuickAddButtons(thresholds, fromVal, toVal, onClick, disableValue) {
    let output = [];

    for (let i = fromVal; i <= toVal; i++) {
        output.push(
            (
                <Button key={i} style={{"backgroundColor": getThresholdFromValue(thresholds, i).color, width: 40, height: 30}} disabled={i === disableValue} onClick={() => onClick(i)}>{i}</Button>
            )
        )
    }
    
    return output;
}

export function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return '<a href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
  }