import { useState } from 'react';
import Draggable from 'react-draggable';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import './App.scss';

function Card({ moveOff }) {
  const [text, setText] = useState("new card");
  const [edit, setEdit] = useState(false);
  const handleEdit = (e) => {
    e.stopPropagation();
    setEdit(!edit);
  }

  return (
    <>
      <Draggable
        grid={[20, 20]}
        onMouseDown={moveOff}
      >
        {edit ? (
          <div onDoubleClick={handleEdit} className="card">
            <textarea autoFocus={true} value={text} onChange={e => setText(e.target.value)}></textarea>
          </div>
        ) : (
          <div onDoubleClick={handleEdit} className="card">
            {text}
          </div>
        )}
      </Draggable >
    </>
  );
}

function Board() {
  const [deck, setDeck] = useState([]);
  const [moveDisabled, setMoveDisabled] = useState(false);
  const addCard = () => {
    setDeck(deck.concat(<Card moveOff={() => setMoveDisabled(true)} key={deck.length} ></Card>));
  }

  return (
    <>
      <TransformWrapper
        initialScale={1}
        disabled={moveDisabled}
        minScale={1}
        maxScale={1}
        limitToBounds={false}
        pinch={{ step: 5 }}
      >
        <TransformComponent>
          <main onDoubleClick={addCard} onClick={() => setMoveDisabled(false)}>
            {deck}
          </main>
        </TransformComponent>
      </TransformWrapper>
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
