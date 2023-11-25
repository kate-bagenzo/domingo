import { useEffect, useState } from 'react';
import { DeckContext } from './DeckContext';
import Board from './components/Board';
import SpawnMenu from './components/SpawnMenu';

import { reX, reY, transform } from './PositionHelpers';
import './App.scss';

function App() {
  const [deck, setDeck] = useState([]);
  const [boardMoveDisabled, setBoardMoveDisabled] = useState(false);


  useEffect(() => {
    const savedDeck = JSON.parse(localStorage.getItem('domingo-deck'));
    if (savedDeck) {
      setDeck(savedDeck);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('domingo-deck', JSON.stringify(deck));
  }, [deck]);


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
    const cardText = getCardDefaultText(cardStyle);

    setDeck(deck.concat({
      key: deck.length,
      indexKey: deck.length,
      cardPosX: cardPos.x,
      cardPosY: cardPos.y,
      cardWidth: 200,
      cardHeight: 200,
      cardStyle: cardStyle,
      cardText: cardText,
      cardImage: "test.png"
    }));
    console.log(deck);
  }

  return (
    <>
      <DeckContext.Provider value={{ deck, setDeck, addCard, getCardPos, boardMoveDisabled, setBoardMoveDisabled }}>
        <aside onDoubleClick={addCard}>
          <Board></Board>
        </aside>
        <SpawnMenu ></SpawnMenu>
      </DeckContext.Provider >
    </>
  )
}

export default App
