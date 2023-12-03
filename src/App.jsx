import { useEffect, useState } from 'react';
import { DeckContext, getCardPosByMouse, getCardDefaultText } from './DeckContext';
import Board from './components/Board';
import SpawnMenu from './components/SpawnMenu';

import domingo from './domingo';
import localforage from 'localforage';
import './App.scss';

function App() {
  //state
  const [deck, setDeck] = useState([{
    key: `domingo guide:${0}`,
    localKey: 0,
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
  const [globalKey, setGlobalKey] = useState(0);

  //load and save
  //load default board & retrieve stored board list on startup
  useEffect(() => {
    setDeck(JSON.parse(domingo));
    localforage.keys().then((keys) => setBoardList(keys));
    localforage.getItem('globalKey').then((globalKey) => setGlobalKey(JSON.parse(globalKey)));
  }, []);

  //save board (unless it's the default board)
  useEffect(() => {
    if (deck[0].rootName != 'domingo guide') {
      localforage.setItem(deck[0].rootName, JSON.stringify(deck));
      localforage.setItem(globalKey, JSON.stringify(globalKey));
    }

  }, [deck]);

  //add card to deck
  const addCard = (e) => {
    const cardPos = getCardPosByMouse(e);
    const cardStyle = e.target.name ? (e.target.name) : ('card-text');
    const cardText = getCardDefaultText(cardStyle);

    setDeck(deck.concat({
      key: (`${deck[0].rootName}:${globalKey}`),
      localKey: `${deck[0].rootName}:${globalKey}`,
      cardPosX: cardPos.x,
      cardPosY: cardPos.y,
      cardWidth: 200,
      cardHeight: 200,
      cardStyle: cardStyle,
      cardText: cardText,
      cardImage: "test.png"
    }));
    setGlobalKey(globalKey + 1);
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
