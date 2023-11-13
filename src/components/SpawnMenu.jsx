import { useEffect, useState } from 'react';
import './SpawnMenu.scss';

function Item({ itemText, addCard, cardStyle }) {
    const newCardFromMenu = () => {
        addCard;
    }
    return (
        <>
            <li>
                <button
                    onClick={addCard}
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
                <Item itemText={'new card'} addCard={addCard} cardStyle={'card-text'}></Item>
                <Item itemText={'new header'} addCard={addCard} cardStyle={'card-header'}></Item>
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