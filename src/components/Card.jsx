import { useContext, useState } from 'react';
import { produce } from 'immer';
import { DeckContext } from '../DeckContext';
import { Rnd } from 'react-rnd';

import { reX, reY } from '../PositionHelpers';
import './Card.scss';

function Card({ indexKey, cardPosX, cardPosY, cardStyle, cardWidth, cardHeight, cardText, cardImage }) {
    const { setDeck, setBoardMoveDisabled } = useContext(DeckContext);
    const [edit, setEdit] = useState(false);

    const handleEdit = (e) => {
        e.stopPropagation();
        setEdit(!edit);
    }

    const updateCardText = (e) => {
        handleEdit(e);
        setDeck(produce(draft => {
            draft[indexKey].cardText = e.target.value;
        }))
    }

    const updateCardPos = () => {
        let card = document.getElementsByClassName(`card-#${indexKey}`);
        const posX = Number(card[0].style.transform.match(reX)[1]);
        const posY = Number(card[0].style.transform.match(reY) ? (card[0].style.transform.match(reY)[1]) : (0));
        setDeck(produce(draft => {
            draft[indexKey].cardPosX = posX;
            draft[indexKey].cardPosY = posY;
        }));
    }

    const updateCardSize = () => {
        let card = document.getElementsByClassName(`card-#${indexKey}`);
        const width = parseInt(card[0].style.width);
        const height = parseInt(card[0].style.height);
        setDeck(produce(draft => {
            draft[indexKey].cardWidth = width;
            draft[indexKey].cardHeight = height;
        }));
    }

    const updateCardImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            setDeck(produce(draft => {
                draft[indexKey].cardImage = result;
            }));
        }
        reader.readAsDataURL(file);
    }


    return (
        <>
            <Rnd
                default={{
                    x: cardPosX,
                    y: cardPosY,
                    width: cardWidth,
                    height: cardHeight,
                }}
                className={`card-#${indexKey}`}
                disableDragging={edit}
                minWidth={40}
                minHeight={40}
                resizeGrid={[20, 20]}
                dragGrid={[20, 20]}
                onMouseDown={() => setBoardMoveDisabled(true)}
                onClick={() => setBoardMoveDisabled(false)}
                onDragStop={updateCardPos}
                onResizeStop={updateCardSize}
            >
                {edit ? (
                    <div className={`card ${cardStyle}`}
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}
                    >
                        {cardStyle == 'card-image' ? (
                            <div onDoubleClick={handleEdit}>
                                <input type='file' onChange={(e) => updateCardImage(e)}></input>
                            </div>
                        ) : (
                            <textarea
                                autoFocus={true}
                                defaultValue={cardText}
                                onBlur={(e) => { updateCardText(e) }}
                            >
                            </textarea>)}

                    </div>
                ) : (
                    <div onDoubleClick={handleEdit} className={`card ${cardStyle}`}>
                        {cardStyle == 'card-image' ? (<img src={cardImage}></img>) : <>{cardText}</>}
                    </div>
                )}
            </Rnd >
        </>
    );
}

export default Card