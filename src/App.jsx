import { useState } from 'react';
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

  const addCard = (e) => {
    console.log(deck);
    const x = e.clientX;
    const y = e.clientY;
    const offsetX = Number(transform[0].style.transform.match(reX)[1]);
    const offsetY = Number(transform[0].style.transform.match(reY) ? (transform[0].style.transform.match(reY)[1]) : (0));
    setDeck(deck.concat(
      <Card
        moveOff={() => setBoardMoveDisabled(true)}
        moveOn={() => setBoardMoveDisabled(false)}
        key={deck.length}
        cardPosX={(Math.round((x - offsetX) / 20) * 20 - 100)}
        cardPosY={(Math.round((y - offsetY) / 20) * 20 - 100)}
        cardStyle={e.target.name ? (e.target.name) : ('card-text')}
      >
      </Card >));
  }
  return (
    <>
      <aside
        onDoubleClick={addCard}
      >
        <Board
          isBoardStopped={boardMoveDisabled}
          allCards={deck}
        >
        </Board>
      </aside>
      <SpawnMenu addCard={addCard}></SpawnMenu>
    </>
  )
}

export default App
