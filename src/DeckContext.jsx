import { createContext } from 'react';
import { reX, reY, transform } from './PositionHelpers';
import localforage from 'localforage';

export const DeckContext = createContext([]);

// return the position of a card based on click events
export const getCardPosByMouse = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const offsetX = Number(transform[0].style.transform.match(reX)[1]);
    const offsetY = Number(transform[0].style.transform.match(reY) ? (transform[0].style.transform.match(reY)[1]) : (0));
    const cardPos = {
        x: (Math.round((x - offsetX) / 20) * 20 - 100),
        y: (Math.round((y - offsetY) / 20) * 20 - 100)
    }
    return cardPos;
}

// return the default text of a card based on its style
export const getCardDefaultText = (cardStyle) => {
    let defaultText = 'new card';
    switch (cardStyle) {
        case 'card-header':
            defaultText = 'new header';
            break;
        case 'card-note':
            defaultText = 'new note';
            break;
        case 'card-code':
            defaultText = '//new code';
            break;
        case 'card-diary':
            defaultText = 'new diary entry'
            break;
        case 'card-image':
            defaultText = undefined;
            break;
    }
    return defaultText;
}