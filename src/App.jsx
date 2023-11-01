import { useState } from 'react';
import Draggable from 'react-draggable';
import './App.scss';

function Card() {
  const [text, setText] = useState("new card");
  const [edit, setEdit] = useState(false);
  const handleEdit = (e) => {
    e.stopPropagation();
    setEdit(!edit);
  }

  return (
    <>
      <Draggable
        grid={[20, 20]}>
        {edit ? (
          <div onDoubleClick={handleEdit} className="card">
            <textarea autoFocus={true} value={text} onChange={e => setText(e.target.value)}></textarea>
          </div>
        ) : (
          <div onDoubleClick={handleEdit} className="card">{text}</div>
        )}
      </Draggable >
    </>
  );
}

function Board() {
  const [deck, setDeck] = useState([]);
  const addCard = () => {
    setDeck(deck.concat(<Card key={deck.length}></Card>));
  }

  return (
    <>
      <main onDoubleClick={addCard}>{deck}</main>
    </>
  )
}

function App() {
  return (
    <>
      <Board></Board>
    </>
  )
}

export default App
