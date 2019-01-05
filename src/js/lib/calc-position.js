import { getOffset, getWindowArea } from './dom-utils';
import { isString, isUndefined } from './type';

const bestPositions = [
    ['left', 'bottom'],
    ['left', 'top'],
    ['right', 'bottom'],
    ['right', 'top'],
    ['center', 'bottom'],
    ['center', 'top']
];

function getIntersection(d1, d2, d3, d4) {
    if (d2 <= d3 || d1 >= d4) {
        return 0;
    }

    return Math.min(d2, d4) - Math.max(d1, d3);
}

function calcVisibleSquare(coords, popup) {
    const
        conArea = {
            x1: coords.left,
            y1: coords.top,
            x2: coords.left + popup.offsetWidth,
            y2: coords.top + popup.offsetHeight
        },
        windowArea = getWindowArea(),
        width = getIntersection(conArea.x1, conArea.x2, windowArea.x1, windowArea.x2),
        height = getIntersection(conArea.y1, conArea.y2, windowArea.y1, windowArea.y2);

    return width * height;
}

export function isAuto(prop) {
    return prop === 'auto' || isUndefined(prop);
}

export function calcPosition(coords, popup, switcher) {
    const switcherOffset = getOffset(switcher);

    let left = switcherOffset.left,
        top = switcherOffset.top;

    if (isString(coords.left)) {
        switch (coords.left) {
            case 'center':
                left += (switcher.offsetWidth - popup.offsetWidth) / 2;
                break;
            case 'right':
                left += switcher.offsetWidth - popup.offsetWidth;
                break;
        }
    }

    if (isString(coords.top)) {
        switch (coords.top) {
            case 'top':
                top -= popup.offsetHeight;
                break;
            case 'center':
                top -= (popup.offsetHeight - switcher.offsetHeight) / 2;
                break;
            case 'bottom':
                top += switcher.offsetHeight;
                break;
        }
    }

    return {
        left,
        top
    };
}

export function calcBestPosition(coords, popup, switcher) {
    const
        isLeftAuto = isAuto(coords.left),
        isTopAuto = isAuto(coords.top);

    let
        maxArea = -1,
        index = 0;

    bestPositions.forEach((item, i) => {
        const coordsItem = {
            left: item[0],
            top: item[1]
        };

        if ((isLeftAuto && isTopAuto) ||
            (isLeftAuto && coordsItem.top === coords.top) ||
            (isTopAuto && coordsItem.left === coords.left)) {

            const
                offset = calcPosition(coords, popup, switcher),
                area = calcVisibleSquare(offset, popup);

            if (area > maxArea) {
                maxArea = area;
                index = i;
            }
        }
    });

    const [left, top] = bestPositions[index];

    return { left, top };
}

