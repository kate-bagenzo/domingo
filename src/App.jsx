import { useEffect, useState } from 'react';
import { DeckContext, getCardPosByMouse, getCardDefaultText } from './DeckContext';
import Board from './components/Board';
import SpawnMenu from './components/SpawnMenu';

import domingo from './domingo';
import localforage from 'localforage';
import './App.scss';

function App() {
  const [deck, setDeck] = useState([{
    key: 'domingo guide:' + 0,
    indexKey: 0,
    cardPosX: 0,
    cardPosY: 0,
    cardWidth: 500,
    cardHeight: 300,
    cardStyle: 'card-root',
    rootName: 'domingo guide',
    rootAuthor: 'anonymous'
  }]);
  const [boardMoveDisabled, setBoardMoveDisabled] = useState(false);
  const [boardList, setBoardList] = useState([]);

  //load and save
  //load default board & retrieve stored board list on startup
  useEffect(() => {
    setDeck(JSON.parse(domingo));
    localforage.keys().then((keys) => setBoardList(keys));
  }, []);

  //save board (unless it's the default board)
  useEffect(() => {
    if (deck[0].rootName != 'domingo guide') {
      localforage.setItem(deck[0].rootName, JSON.stringify(deck));
    }

  }, [deck]);

  //add card to deck
  const addCard = (e) => {
    const cardPos = getCardPosByMouse(e);
    const cardStyle = e.target.name ? (e.target.name) : ('card-text');
    const cardText = getCardDefaultText(cardStyle);

    setDeck(deck.concat({
      key: (deck[0].rootName + ':' + deck.length),
      indexKey: deck.length,
      cardPosX: cardPos.x,
      cardPosY: cardPos.y,
      cardWidth: 200,
      cardHeight: 200,
      cardStyle: cardStyle,
      cardText: cardText,
      cardImage: "test.png"
    }));
  }
  return (
    <>
      <DeckContext.Provider value={{ deck, setDeck, addCard, getCardPosByMouse, boardMoveDisabled, setBoardMoveDisabled, boardList, setBoardList }}>
        <aside onDoubleClick={addCard}>
          <Board></Board>
        </aside>
        <SpawnMenu ></SpawnMenu>
      </DeckContext.Provider >
    </>
  )
}

export default App
