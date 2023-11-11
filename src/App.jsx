import { useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Rnd } from 'react-rnd';

function Card({ moveOff, moveOn, cardPosX, cardPosY, cardStyle }) {
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
        onClick={moveOn}
        disableDragging={edit}
      >
        {edit ? (
          <div className={`card ${cardStyle}`}>
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
          <div onDoubleClick={handleEdit} className={`card ${cardStyle}`}>
            {text}
          </div>
        )}
      </Rnd >
    </>
  );
}

function Board({ isBoardStopped, allCards }) {
  return (
    <>
      <TransformWrapper
        initialScale={1}
        disabled={isBoardStopped}
        minScale={1}
        maxScale={1}
        limitToBounds={false}
        pinch={{ step: 5 }}
      >
        <TransformComponent>
          <main>
            {allCards}
          </main>
        </TransformComponent>
      </TransformWrapper >
    </>
  )
}

const transform = document.getElementsByClassName('react-transform-component');
const reX = /te[(](-*\d+)/
const reY = /\s(-*\d+)/

function App() {
  const [deck, setDeck] = useState([]);
  const [boardMoveDisabled, setBoardMoveDisabled] = useState(false);
  const [cardStyle, setCardStyle] = useState('card-text');

  const addCard = (e) => {
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
        cardStyle={cardStyle}
      >
      </Card >));
  }
  return (
    <>
      <aside
        onDoubleClick={addCard}
        onContextMenu={console.log('rightclick')}
      >
        <Board
          isBoardStopped={boardMoveDisabled}
          allCards={deck}
        >
        </Board>
      </aside>
    </>
  )
}

export default App
