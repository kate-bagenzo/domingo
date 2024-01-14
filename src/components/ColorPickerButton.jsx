import React, { useContext, useState } from 'react';
import './ColorPicker.scss';
import { DeckContext } from '../DeckContext';
import { produce } from 'immer';

function ColorPickerButton ({color, localKey, target}) {
    const {deck, setDeck} = useContext(DeckContext);

    const getColor = () => {
        if (target == 'cardBg') {
            setDeck(produce(draft => {
                draft[deck.findIndex(i => i.localKey === localKey)].cardBg = color;
            }));
        } else {
            setDeck(produce(draft => {
                draft[deck.findIndex(i => i.localKey === localKey)].cardFg = color;
            }));
        }
    }

    const style = {
        backgroundColor: color,
    };

return (
    <li><button className='colorpickerbutton' style={style} onClick={getColor}>{(color == 'undefined') && <strong>X</strong>}</button></li>
)
}

export default ColorPickerButton;