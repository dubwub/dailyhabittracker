const moment = require('moment');

export function returnLastXDays(numDays) {
    const today = moment().startOf('day');
    let days = []; 

    for (let i = 0; i < numDays; i++) {
        let newDate = moment(today);
        newDate.subtract(i, 'days');
        days.push(newDate);
    }

    return days;
}

export function syncScroll(e) {
    const ctr_contents = document.getElementsByClassName("ctr-contents")

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