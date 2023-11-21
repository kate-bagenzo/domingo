import { useState } from 'react';
import { DeckContext } from './DeckContext';
import Card from './components/Card';
import Board from './components/Board';
import SpawnMenu from './components/SpawnMenu';
import './App.scss';


const transform = document.getElementsByClassName('react-transform-component');
const reX = /te[(](-*\d+)/
const reY = /\s(-*\d+)/

function App() {
  const [deck, setDeck] = useState([]);
  const [boardMoveDisabled, setBoardMoveDisabled] = useState(false);

  const getCardPos = (e) => {
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

  const getCardDefaultText = (cardStyle) => {
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
      case 'card-image':
        defaultText = 'image missing';
        break;
    }
    return defaultText;
  }

  const addCard = (e) => {
    const cardPos = getCardPos(e);
    const cardStyle = e.target.name ? (e.target.name) : ('card-text');
    setDeck(deck.concat(
      <Card
        key={deck.length}
        moveOff={() => setBoardMoveDisabled(true)}
        moveOn={() => setBoardMoveDisabled(false)}
        indexKey={deck.length}
        cardPosX={cardPos.x}
        cardPosY={cardPos.y}
        cardStyle={cardStyle}
        cardText={getCardDefaultText(cardStyle)}
      >
      </Card >));
  }

  return (
    <>
      <DeckContext.Provider value={{ deck, setDeck, addCard, getCardPos }}>
        <aside
          onDoubleClick={addCard}
        >
          <Board
            isBoardStopped={boardMoveDisabled}
            allCards={deck}
          >
          </Board>
        </aside>
        <SpawnMenu ></SpawnMenu>
      </DeckContext.Provider >
    </>
  )
}

export default App
