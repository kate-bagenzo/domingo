import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useContext } from "react";
import { DeckContext } from "../DeckContext";
import Card from "./Card";
import './Board.scss';

//the board contains all cards as well as transformwrapper + component which can be dragged / zoomed
function Board() {
    const { deck, boardMoveDisabled } = useContext(DeckContext);
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
                    <main>
                        {deck.map(i => <Card
                            key={i.key}
                            indexKey={i.indexKey}
                            cardPosX={i.cardPosX}
                            cardPosY={i.cardPosY}
                            cardWidth={i.cardWidth}
                            cardHeight={i.cardHeight}
                            cardStyle={i.cardStyle}
                            cardText={i.cardText}
                            cardImage={i.cardImage}
                            rootName={i.rootName}
                            rootAuthor={i.rootAuthor}
                        ></Card>)}
                    </main>
                </TransformComponent>
            </TransformWrapper >
        </>
    )
}

export default Board