import { useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Rnd } from 'react-rnd';
import './App.scss';

function Card({ moveOff, cardPosX, cardPosY }) {
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
          x: cardPosX,
          y: cardPosY,
          width: 200,
          height: 200,
        }}
        minWidth={40}
        minHeight={40}
        resizeGrid={[20, 20]}
        dragGrid={[20, 20]}
        onMouseDown={moveOff}
        disableDragging={edit}
      >
        {edit ? (
          <div className="card">
            <textarea
              autoFocus={true}
              value={text}
              onChange={e => setText(e.target.value)}
              onBlur={handleEdit}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
            >
            </textarea>
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

  const addCard = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    setDeck(deck.concat(
      <Card
        moveOff={() => setBoardMoveDisabled(true)}
        key={deck.length}
        cardPosX={Math.round(x / 20) * 20 - 100}
        cardPosY={Math.round(y / 20) * 20 - 100}
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
          <main
            onDoubleClick={addCard}
            onClick={() => {
              setBoardMoveDisabled(false);
              { document.activeElement.blur(); }
            }}>
            {deck}
          </main>
        </TransformComponent>
      </TransformWrapper >
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
