import React, { useState } from 'react';
import './ColorPicker.scss';
import ColorPickerButton from './ColorPickerButton';

function ColorPicker({labelText, target, localKey, colorBar, setColorBar}) {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const handleClick = () => {
        if (colorBar == 0) {
            {target == 'cardBg' ? setColorBar(1) : setColorBar(2)}
            setDisplayColorPicker(true);
        } else if ((colorBar == 1 && target == 'cardFg') || (colorBar == 2 && target == 'cardBg')) {
            setColorBar(0);
            setDisplayColorPicker(false);
        } else {
            setColorBar(0);
            setDisplayColorPicker(false);
        }
    };

    const handleBtnClick = () => {
        if (target == 1) {

        }
    }

    return (
        <>
          <button onClick={ handleClick }>{ labelText }</button>
        { displayColorPicker &&
            <menu className='colorpicker'>
                {/* red */}
                <ColorPickerButton color='#9f0500' localKey={localKey} target={target} />
                <ColorPickerButton color='#d33115' localKey={localKey} target={target} />
                <ColorPickerButton color='#f44e3b' localKey={localKey} target={target} />
                {/* orange */}
                <ColorPickerButton color='#C45100' localKey={localKey} target={target} />
                <ColorPickerButton color='#E27300' localKey={localKey} target={target} />
                <ColorPickerButton color='#FE9200' localKey={localKey} target={target} />
                {/* yellow */}
                <ColorPickerButton color='#FB9E00' localKey={localKey} target={target} />
                <ColorPickerButton color='#FCC400' localKey={localKey} target={target} />
                <ColorPickerButton color='#FCDC00' localKey={localKey} target={target} />
                {/* green */}
                <ColorPickerButton color='#194D33' localKey={localKey} target={target} />
                <ColorPickerButton color='#68BC00' localKey={localKey} target={target} />
                <ColorPickerButton color='#A4DD00' localKey={localKey} target={target} />
                {/* blue */}
                <ColorPickerButton color='#0062B1' localKey={localKey} target={target} />
                <ColorPickerButton color='#009CE0' localKey={localKey} target={target} />
                <ColorPickerButton color='#73D8FF' localKey={localKey} target={target} />
                {/* black/white/clear */}
                <ColorPickerButton color='#fff' localKey={localKey} target={target} />
                <ColorPickerButton color='#000' localKey={localKey} target={target} />
                <ColorPickerButton color='undefined' localKey={localKey} target={target} />
            </menu>
        }
        </>
      )
}


export default ColorPicker;
