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
  const [globalKey, setGlobalKey] = useState(1);
  const [theme, setTheme] = useState('theme-chicago');

  //load and save
  //load default board & retrieve stored board list on startup
  useEffect(() => {
    setDeck(JSON.parse(domingo));
    localforage.keys().then((keys) => setBoardList(keys));
    setGlobalKey(Number(localStorage.getItem('globalKey')));
  }, []);

  //save board (unless it's the default board)
  useEffect(() => {
    if (deck[0].rootName != 'domingo guide') {
      localforage.setItem(deck[0].rootName, JSON.stringify(deck));
    }

  }, [deck]);

  //save global key
  useEffect(() => {
    if (deck[0].rootName != 'domingo guide') {
      localStorage.setItem('globalKey', globalKey);
    }
  }, [globalKey])

  //add card to deck
  const addCard = (e) => {
    const cardPos = getCardPosByMouse(e);
    const cardStyle = e.target.name ? (e.target.name) : ('card-text');
    const cardText = getCardDefaultText(cardStyle);
    const nextKey = globalKey + 1;
    setGlobalKey(nextKey);

    setDeck(deck.concat({
      key: (`${deck[0].rootName}:${nextKey}`),
      localKey: `${deck[0].rootName}:${nextKey}`,
      cardPosX: cardPos.x,
      cardPosY: cardPos.y,
      cardWidth: 200,
      cardHeight: 200,
      cardStyle: cardStyle,
      cardText: cardText,
      cardImage: cardStyle == 'card-image' ? ('test.png') : (undefined),
      cardDate: cardStyle == 'card-diary' ? (Date()) : (undefined)
    }));
  }

  //prevent default ctrl+s behavior
  const handleSavePress = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleSavePress);

    return () => {
      document.removeEventListener('keydown', handleSavePress);
    };
  }, [handleSavePress]);

  return (
    <>
      <main className={theme}>
        <DeckContext.Provider value={{ deck, setDeck, addCard, getCardPosByMouse, boardMoveDisabled, setBoardMoveDisabled, boardList, setBoardList }}>
          <aside onDoubleClick={addCard}>
            <Board></Board>
          </aside>
          <SpawnMenu ></SpawnMenu>
        </DeckContext.Provider >
      </main>
    </>
  )
}

export default App
