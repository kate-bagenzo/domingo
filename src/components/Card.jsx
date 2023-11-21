import { useContext, useState } from 'react';
import { produce } from 'immer';
import { DeckContext } from '../DeckContext';
import { Rnd } from 'react-rnd';
import './Card.scss';

function Card({ indexKey, moveOff, moveOn, cardPosX, cardPosY, cardStyle, cardText }) {
    const { setDeck, getCardPos } = useContext(DeckContext);
    const [edit, setEdit] = useState(false);

    const handleEdit = (e) => {
        e.stopPropagation();
        setEdit(!edit);
    }

    const updateCardText = (e) => {
        handleEdit(e);
        setDeck(produce(draft => {
            draft[indexKey].props.cardText = e.target.value;
        }))
    }

    const updateCardPos = (e) => {
        const cardPos = getCardPos(e);
        setDeck(produce(draft => {
            draft[indexKey].props.cardPosX = cardPos.x;
            draft[indexKey].props.cardPosY = cardPos.y;
        }))
    }

    const changeImage = (e) => {
        const file = e.target.files[0];
        setImage(URL.createObjectURL(file));
    }


    return (
        <>
            <Rnd
                default={{
                    x: cardPosX,
                    y: cardPosY,
                    width: 200,
                    height: 200,
                }}
                minWidth={40}
                minHeight={40}
                resizeGrid={[20, 20]}
                dragGrid={[20, 20]}
                onMouseDown={moveOff}
                onClick={moveOn}
                disableDragging={edit}
            >
                {edit ? (
                    <div className={`card ${cardStyle}`}>
                        <textarea
                            autoFocus={true}
                            defaultValue={cardText}
                            onBlur={(e) => { updateCardText(e) }}
                            onClick={(e) => e.stopPropagation()}
                            onDoubleClick={(e) => e.stopPropagation()}
                        >
                        </textarea>
                    </div>
                ) : (
                    <div onDoubleClick={handleEdit} className={`card ${cardStyle}`}
                        onMouseUp={(e) => { updateCardPos(e) }}>
                        {cardText}
                    </div>
                )}
            </Rnd >
        </>
    );
}

export default Card