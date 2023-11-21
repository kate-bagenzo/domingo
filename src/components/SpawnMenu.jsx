import { useContext, useEffect, useState } from 'react';
import { DeckContext } from '../DeckContext';
import './SpawnMenu.scss';

function Item({ itemText, cardType }) {
    const { addCard } = useContext(DeckContext);
    return (
        <>
            <li>
                <button
                    onClick={addCard}
                    name={cardType}
                >
                    {itemText}
                </button>
            </li>
        </>
    )
}

function Menu({ style }) {
    return (
        <>
            <menu
                style={style}
            >
                <Item itemText={'new header'} cardType={'card-header'}></Item>
                <Item itemText={'new note'} cardType={'card-note'}></Item>
                <Item itemText={'new code'} cardType={'card-code'}></Item>
                <Item itemText={'new image'} cardType={'card-image'}></Item>
            </menu>
        </>
    )
}

function SpawnMenu() {
    const [xPos, setXPos] = useState(0);
    const [yPos, setYPos] = useState(0);
    const [showSpawnMenu, setShowSpawnMenu] = useState(false);

    useEffect(() => {
        document.body.addEventListener('contextmenu', handleClick);
        document.body.addEventListener('click', handleQuit);
        return function cleanup() {
            document.body.removeEventListener('click', handleQuit);
            document.body.removeEventListener('contextmenu', handleClick);
        }
    });
    const handleClick = (e) => {
        e.preventDefault();
        setXPos(e.clientX + 6);
        setYPos(e.clientY + 6);
        setShowSpawnMenu(!showSpawnMenu);
    }

    const handleQuit = (e) => {
        setShowSpawnMenu(false);
    }

    return (
        <>
            {showSpawnMenu ? (<Menu
                style={{
                    left: xPos,
                    top: yPos
                }}
            ></Menu>) : null}
        </>
    )
}

export default SpawnMenu