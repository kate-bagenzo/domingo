import { useCallback, useContext, useRef, useState } from 'react';
import { produce } from 'immer';
import { DeckContext } from '../DeckContext';
import { Rnd } from 'react-rnd';

import { reX, reY } from '../PositionHelpers';
import localforage from 'localforage';
import './Card.scss';

//the most basic type of card, includes all editable text/image cards
function Card({ indexKey, cardPosX, cardPosY, cardStyle, cardWidth, cardHeight, cardText, cardImage, rootName, rootAuthor }) {
    const { deck, setDeck, setBoardMoveDisabled, boardList, setBoardList } = useContext(DeckContext);
    const [edit, setEdit] = useState(false);
    const cardRef = useRef(null);

    //update all board data
    const handleBoardEdit = (e) => {
        e.preventDefault();
        const oldDeckName = deck[0].rootName;
        if (e.target.rootName.value == 'domingo guide') {
            alert('You can\'t overwrite the default board!');
            setEdit(false);
            setBoardMoveDisabled(false);
            return;
        }
        setDeck(produce(draft => {
            draft[0].key = e.target.rootName.value + ':' + 0;
            draft[0].rootName = e.target.rootName.value;
            draft[0].rootAuthor = e.target.rootAuthor.value;

        }))
        if (oldDeckName != e.target.rootName.value) {
            localforage.removeItem(oldDeckName);
        }
        setEdit(false);
        setBoardMoveDisabled(false);
        localforage.keys().then((keys) => setBoardList(keys));
    }

    //switch between boards
    const handleBoardSwitch = (e) => {
        let newDeck = [{
            key: 'new board:' + 0,
            indexKey: 0,
            cardPosX: 0,
            cardPosY: 0,
            cardWidth: 500,
            cardHeight: 300,
            cardStyle: 'card-root',
            rootName: 'new board',
            rootAuthor: 'anonymous'
        }];

        if (e.target.value == 'new board') {
            setDeck(newDeck);
        } else {
            localforage.getItem(e.target.value).then((deck) => setDeck(JSON.parse(deck)));
        }
        setEdit(false);
        setBoardMoveDisabled(false);
    }

    // stop click from spawning more cards & change edit state of card
    const handleEdit = (e) => {
        e.stopPropagation();
        setEdit(!edit);
    }

    // create new deck w/different card text
    const updateCardText = (e) => {
        handleEdit(e);
        setDeck(produce(draft => {
            draft[indexKey].cardText = e.target.value;
        }))
    }

    // create new deck w/different card image
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

    // create new deck w/different card position
    const updateCardPos = () => {
        let card = cardRef.current.parentElement;
        const posX = Number(card.style.transform.match(reX)[1]);
        const posY = Number(card.style.transform.match(reY) ? (card.style.transform.match(reY)[1]) : (0));
        setDeck(produce(draft => {
            draft[indexKey].cardPosX = posX;
            draft[indexKey].cardPosY = posY;
        }));
    }

    // create new deck w/different card size
    const updateCardSize = () => {
        let card = cardRef.current.parentElement;
        const width = parseInt(card.style.width);
        const height = parseInt(card.style.height);
        setDeck(produce(draft => {
            draft[indexKey].cardWidth = width;
            draft[indexKey].cardHeight = height;
        }));
    }

    if (cardStyle == 'card-root') {
        return (
            <>
                <Rnd
                    default={{
                        x: cardPosX,
                        y: cardPosY,
                        width: cardWidth,
                        height: cardHeight,
                    }}
                    disableDragging={edit}
                    minWidth={500}
                    minHeight={300}
                    resizeGrid={[20, 20]}
                    dragGrid={[20, 20]}
                    onMouseDown={() => setBoardMoveDisabled(true)}
                    onClick={() => setBoardMoveDisabled(false)}
                    onDragStop={updateCardPos}
                    enableResizing={false}
                >
                    {edit ? (
                        <div className={`card ${cardStyle}`}
                            onClick={(e) => e.stopPropagation()}
                            onDoubleClick={(e) => e.stopPropagation()}
                            ref={cardRef}
                        >
                            {rootName == 'domingo guide' ? (<></>) : (
                                <div className='controlpanel'>
                                    <form onSubmit={handleBoardEdit}>
                                        <label htmlFor='rootName'>board name:</label>
                                        <input type='text' id='rootName' defaultValue={rootName}></input>

                                        <label htmlFor='rootAuthor'>author:</label>
                                        <input type='text' id='rootAuthor' defaultValue={rootAuthor}></input>

                                        <input type='submit' value='save board'></input>
                                    </form>

                                </div >)
                            }
                            {rootName == 'new board' ? (<></>) : (
                                <div className='controlpanel'>
                                    <label htmlFor='switchBoard'>switch board:</label>
                                    <select id='switchBoard' onChange={handleBoardSwitch}>
                                        <option value=''>select...</option>
                                        {boardList ? (boardList.map(i => <option key={i} value={i}>{i}</option>)) : (<></>)}
                                        <option value='new board'>new...</option>
                                    </select>
                                </div>)}
                        </div >
                    ) : (
                        <div onDoubleClick={handleEdit} className={`card ${cardStyle}`} ref={cardRef}>
                            <div className='rootdisplay'>
                                <h1>{rootName}</h1>
                                <h2>by {rootAuthor}</h2>
                                <h3>double click: open control panel</h3>
                            </div>
                        </div>
                    )
                    }
                </Rnd >
            </>
        )
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
                        ref={cardRef}
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
                    <div onDoubleClick={handleEdit} className={`card ${cardStyle}`} ref={cardRef}>
                        {cardStyle == 'card-image' ? (<img src={cardImage}></img>) : <>{cardText}</>}
                    </div>
                )}
            </Rnd >
        </>
    );
}

export default Card