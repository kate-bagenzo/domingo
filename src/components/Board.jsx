import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import './Board.scss';
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

export default Board