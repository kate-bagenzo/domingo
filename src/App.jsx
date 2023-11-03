import { useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Rnd } from 'react-rnd';
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
      <Rnd
        default={{
          x: 0,
          y: 0,
          width: 200,
          height: 200,
        }}
        resizeGrid={[20, 20]}
        dragGrid={[20, 20]}
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
      </Rnd >
    </>
  );
}

function Board() {
  const [deck, setDeck] = useState([]);
  const [boardMoveDisabled, setBoardMoveDisabled] = useState(false);
  const addCard = () => {
    setDeck(deck.concat(
      <Card
        moveOff={() => setBoardMoveDisabled(true)}
        key={deck.length}
      >
      </Card >));
  }

  return (
    <>
      <TransformWrapper
        initialScale={1}
        disabled={boardMoveDisabled}
        minScale={1}
        maxScale={1}
        limitToBounds={false}
        pinch={{ step: 5 }}
      >
        <TransformComponent>
          <main onDoubleClick={addCard} onClick={() => setBoardMoveDisabled(false)}>
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
