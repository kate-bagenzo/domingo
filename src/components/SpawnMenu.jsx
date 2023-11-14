import { useEffect, useState } from 'react';
import './SpawnMenu.scss';

function Item({ itemText, addCard, cardType }) {
    const spawnCard = (e) => {
        console.log(e);
        addCard(e);
    }
    return (
        <>
            <li>
                <button
                    onClick={spawnCard}
                    name={cardType}
                >
                    {itemText}
                </button>
            </li>
        </>
    )
}

function Menu({ style, addCard }) {
    return (
        <>
            <menu
                style={style}
            >
                <Item itemText={'new card'} addCard={addCard} cardType={'card-text'}></Item>
                <Item itemText={'new header'} addCard={addCard} cardType={'card-header'}></Item>
            </menu>
        </>
    )
}

function SpawnMenu({ addCard }) {
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
                addCard={addCard}
            ></Menu>) : null}
        </>
    )
}

export default SpawnMenu