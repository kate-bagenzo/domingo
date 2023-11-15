import { useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Rnd } from 'react-rnd';
import SpawnMenu from './components/SpawnMenu';
import './App.scss';

function Card({ moveOff, moveOn, cardPosX, cardPosY, cardStyle }) {
  let defaultText = 'new card';
  const defaultImage = 'test.png';
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
  };
  const [text, setText] = useState(defaultText);
  const [image, setImage] = useState(defaultImage);
  const [edit, setEdit] = useState(false);

  const handleEdit = (e) => {
    e.stopPropagation();
    setEdit(!edit);
  }

  const changeImage = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  }


  if (cardStyle == 'card-image') {
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
            <div onDoubleClick={handleEdit} className={`card ${cardStyle}`}>
              <input onChange={(e) => { changeImage(e) }} type="file" className='img-input' accept="image/png, image/jpeg" />
            </div>

          ) : (

            <div onDoubleClick={handleEdit} className={`card ${cardStyle}`}>
              <img src={image}></img>
            </div>)}

        </Rnd >
      </>
    );
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
