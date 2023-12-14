import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { useCallback, useContext, useEffect, useRef } from "react";
import { DeckContext } from "../DeckContext";
import Card from "./Card";
import './Board.scss';



function Board() {
    const { deck, boardMoveDisabled } = useContext(DeckContext);
    const boardRef = useRef(null);

    useEffect(() => {
        if (boardRef.current) {
            const newX = -(deck[0].cardPosX + 250 - (window.innerWidth / 2));
            const newY = -(deck[0].cardPosY + 150 - (window.innerHeight / 2));
            boardRef.current.setTransform(newX, newY, 1, 0);
        }
    }, [deck[0].rootName]);

    return (
        <>
            <TransformWrapper
                initialScale={1}
                disabled={boardMoveDisabled}
                minScale={1}
                maxScale={1}
                limitToBounds={false}
                pinch={{ step: 5 }}
                ref={boardRef}
            >
                <TransformComponent>
                    <ul>
                        {deck.map(i => <Card
                            rootName={i.rootName}
                            rootAuthor={i.rootAuthor}
                            key={i.key}
                            localKey={i.localKey}
                            cardPosX={i.cardPosX}
                            cardPosY={i.cardPosY}
                            cardWidth={i.cardWidth}
                            cardHeight={i.cardHeight}
                            cardStyle={i.cardStyle}
                            cardText={i.cardText}
                            cardImage={i.cardImage}
                            cardDate={i.cardDate ? (new Date(i.cardDate)) : (undefined)}
                        ></Card>)}
                    </ul>
                </TransformComponent>
            </TransformWrapper >
        </>
    )
}

export default Board