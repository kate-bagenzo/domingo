import { useCallback, useContext, useRef, useState } from 'react';
import { produce } from 'immer';
import { DeckContext } from '../DeckContext';
import { Rnd } from 'react-rnd';

import { reX, reY } from '../PositionHelpers';
import localforage, { key } from 'localforage';
import Compressor from 'compressorjs';
import './Card.scss';
import './Card-Toolbar.scss';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import ColorPicker from './ColorPicker';

//the most basic type of card, includes all editable text/image cards
function Card({ localKey, cardPosX, cardPosY, cardStyle, cardWidth, cardHeight, cardText, cardImage, cardDate, cardBg, cardFg, rootName, rootAuthor }) {
    const { deck, setDeck, setBoardMoveDisabled, boardList, setBoardList, globalKey, setGlobalKey } = useContext(DeckContext);
    const [edit, setEdit] = useState(false);
    const [colorBar, setColorBar] = useState(0);
    const cardRef = useRef(null);
    const textRef = useRef(null);

    //update all board data
    const handleBoardEdit = (e) => {
        e.preventDefault();
        const oldDeckName = deck[0].rootName;
        const oldAuthor = deck[0].rootAuthor;
        
        //no board can be named domingo guide
        if (e.target.rootName.value == 'domingo guide') {
            alert('You can\'t overwrite the default board!');
            setEdit(false);
            setBoardMoveDisabled(false);
            return;
        }

        //rename author
        if (oldAuthor != e.target.rootAuthor.value) {
            setDeck(produce(draft => {
                draft[0].rootAuthor = e.target.rootAuthor.value;
    
            }));
        }

        //rename board
        // update name & author
        if (oldDeckName != e.target.rootName.value) {
            setDeck(produce(draft => {
                draft[0].rootName = e.target.rootName.value;
    
            }));
            // remove old name from storage
            localforage.removeItem(oldDeckName);
            // replace old name in board list
            const nextBoard = boardList.map(board => {
                if (board == oldDeckName) {
                    return e.target.rootName.value;
                } else {
                    return board;
                }
            });
            setBoardList(nextBoard);
        }

        setEdit(false);
        setBoardMoveDisabled(false);
    }

    //switch between boards
    const handleBoardSwitch = (e) => {
        if (e.target.value == 'new board') {
            const nextKey = globalKey + 1;
            setGlobalKey(nextKey);
            const newDeck = [{
                key: nextKey,
                localKey: 0,
                cardPosX: 0,
                cardPosY: 0,
                cardWidth: 500,
                cardHeight: 200,
                cardStyle: 'card-root',
                rootName: 'new board',
                rootAuthor: 'anonymous'
            }];
            setDeck(newDeck);
            setEdit(true);
        } else {
            localforage.getItem(e.target.value).then((deck) => setDeck(JSON.parse(deck)));
            setEdit(false);
        }
        setBoardMoveDisabled(false);
    }

    // stop click from spawning more cards & change edit state of card
    const handleEdit = (e) => {
        e.stopPropagation();
        setEdit(!edit);
    }

    // create new deck w/different card text
    const updateCardData = () => {
        if (textRef.current) {
            const cardText = textRef.current.value;
            setDeck(produce(draft => {
                draft[deck.findIndex(i => i.localKey === localKey)].cardText = cardText;
            }));
        }
        setEdit(!edit);
        setColorBar(0);
    }

    // create new deck w/different card image
    const updateCardImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            setDeck(produce(draft => {
                draft[deck.findIndex(i => i.localKey === localKey)].cardImage = result;
            }));
        }
        new Compressor(file,
            {
                quality: 0.6,
                checkOrientation: false,
                mimeType: 'image/jpeg',

                success(result) {
                    reader.readAsDataURL(result);
                },

                error(err) {
                    console.log(err.message);
                },
            });
    }

    // create new deck w/different card position
    const updateCardPos = () => {
        let card = cardRef.current.parentElement;
        const posX = Number(card.style.transform.match(reX)[1]);
        const posY = Number(card.style.transform.match(reY) ? (card.style.transform.match(reY)[1]) : (0));
        setDeck(produce(draft => {
            draft[deck.findIndex(i => i.localKey === localKey)].cardPosX = posX;
            draft[deck.findIndex(i => i.localKey === localKey)].cardPosY = posY;
        }));
    }

    // create new deck w/different card size
    const updateCardSize = () => {
        let card = cardRef.current.parentElement;
        const width = parseInt(card.style.width);
        const height = parseInt(card.style.height);
        setDeck(produce(draft => {
            draft[deck.findIndex(i => i.localKey === localKey)].cardWidth = width;
            draft[deck.findIndex(i => i.localKey === localKey)].cardHeight = height;
        }));
    }

    //remove card from deck
    const deleteCard = () => {
        setDeck(produce(draft => {
            draft.splice(deck.findIndex(i => i.localKey === localKey), 1);
        }));
    }

    // export board data
    const exportBoard = () => {
        const exportedBoard = JSON.stringify(deck);
        const fileName = `${deck[0].rootName}.domingo`
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(exportedBoard));
        element.setAttribute('download', fileName);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
        setBoardMoveDisabled(false);
    }

    const importBoard = () => {
        setBoardMoveDisabled(false);
        let element = document.createElement('input');
        element.setAttribute('type', 'file');
        element.setAttribute('accept', '.domingo');

        element.style.display = 'none';
        document.body.appendChild(element);

        const handleImport = () => {
            if (element.files.length > 0) {
                const board = element.files[0];
                const reader = new FileReader();
                
                const onReaderLoad = (e) => {
                    const regenerate = JSON.parse(e.target.result);
                    let completed = [];
                    let importKey = globalKey;
                    for (let i = 0; i < regenerate.length; i++) {
                        const target = regenerate[i];
                        importKey = importKey + 1;
                        target.key = importKey;
                        target.localKey = importKey;
                        completed = completed.concat(target);
                    }
                    setGlobalKey(importKey);
                    setDeck(completed);
                    setBoardMoveDisabled(false);
                }
                reader.onload = onReaderLoad;
                reader.readAsText(board);
            }
        }
        element.addEventListener('change', handleImport, false);
        element.click();

        document.body.removeChild(element);


    }

    const handleRootBoardEdit = () => {
        if (edit) {
            setBoardMoveDisabled(false);
        } else {
            setBoardMoveDisabled(true);
        }
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
                    minWidth={600}
                    minHeight={200}
                    resizeGrid={[50, 50]}
                    dragGrid={[50, 50]}
                    onMouseDown={() => setBoardMoveDisabled(true)}
                    onClick={() => setBoardMoveDisabled(false)}
                    onDragStop={updateCardPos}
                    enableResizing={false}
                >
                    {edit ? (
                        <div className={`card ${cardStyle}`}
                            onDoubleClick={(e) => e.stopPropagation()}
                            ref={cardRef}
                        >
                            {rootName == 'domingo guide' ? (null) : (
                                <div className='controlpanel'>
                                    <form onSubmit={handleBoardEdit}>
                                        <label htmlFor='rootName'>board name:</label>
                                        <input type='text' id='rootName' onMouseDown={() => setBoardMoveDisabled(true)} onClick={() => setBoardMoveDisabled(false)} maxLength={20} defaultValue={rootName}></input>

                                        <label htmlFor='rootAuthor'>author:</label>
                                        <input type='text' id='rootAuthor' onMouseDown={() => setBoardMoveDisabled(true)} onClick={() => setBoardMoveDisabled(false)} maxLength={20} defaultValue={rootAuthor}></input>

                                        <input type='submit' value='save board'></input>
                                    </form>

                                </div >)
                            }
                            {rootName == 'new board' ? (null) : (
                                <div className='controlpanel'>
                                    <label htmlFor='switchBoard'>switch board:</label>
                                    <select onMouseDown={() => setBoardMoveDisabled(true)} onClick={() => setBoardMoveDisabled(false)} id='switchBoard' onChange={handleBoardSwitch}>
                                        <option value=''>select...</option>
                                        {boardList ? (boardList.map(i => <option key={i} value={i}>{i}</option>)) : (null)}
                                        <option value='new board'>new...</option>
                                    </select>
                                        <label>file control:</label>
                                    <section>
                                        <button onMouseDown={() => setBoardMoveDisabled(true)} onClick={importBoard}>import</button>
                                        <button onMouseDown={() => setBoardMoveDisabled(true)} onClick={exportBoard}>export</button>
                                    </section>
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
                minWidth={200}
                minHeight={200}
                resizeGrid={[50, 50]}
                dragGrid={[50, 50]}
                onMouseDown={() => setBoardMoveDisabled(true)}
                onClick={() => setBoardMoveDisabled(false)}
                onDragStop={updateCardPos}
                onResizeStop={updateCardSize}
            >
                {edit ? (
                    <>
                        <div className={`card ${cardStyle}`}
                            onClick={(e) => e.stopPropagation()}
                            onDoubleClick={(e) => e.stopPropagation()}
                            ref={cardRef}
                            style={{backgroundColor: cardBg, color: cardFg}}
                        >
                            {cardStyle == 'card-image' ? (
                                <div>
                                    <input type='file' onChange={(e) => updateCardImage(e)}></input>
                                </div>
                            ) : (
                                <textarea
                                    autoFocus={true}
                                    defaultValue={cardText}
                                    ref={textRef}
                                >
                                </textarea>)}
                        </div>
                        <div className='card-toolbar' onDoubleClick={(e) => e.stopPropagation()}>
                            <button onClick={updateCardData}>save</button>
                            {colorBar == 0 ||  colorBar == 1 ? <ColorPicker labelText={'bg color'} target={'cardBg'} localKey={localKey} colorBar={colorBar} setColorBar={setColorBar} /> : <button disabled>bg color</button> }
                            {colorBar == 0 || colorBar == 2 ? <ColorPicker labelText={'text color'} target={'cardFg'} localKey={localKey} colorBar={colorBar} setColorBar={setColorBar} /> : <button type='button' disabled>text color</button> }
                            <button onClick={deleteCard}>delete</button>
                        </div>
                    </>
                ) : (
                    <div onDoubleClick={handleEdit} className={`card ${cardStyle}`} ref={cardRef} style={{backgroundColor: cardBg, color: cardFg}}>
                        {cardStyle == 'card-diary' ? (<><h3 className='diaryDate'>{(cardDate).toLocaleString('default', { month: 'long', day: 'numeric' })}</h3>
                            <time>{(cardDate).toLocaleTimeString('default', { hour12: true, timeStyle: 'short' })}</time></>) : (null)}
                        {cardStyle == 'card-image' ? (<img src={cardImage}></img>) : <></>}
                        {cardStyle == 'card-code' ? (<pre><code>{cardText}</code></pre>)
                        : (<Markdown disallowedElements={['img']}>{cardText}</Markdown>)}
                    </div>
                )}
            </Rnd >
        </>
    );
}

export default Card