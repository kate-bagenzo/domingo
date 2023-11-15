import { useState } from 'react';
import { Rnd } from 'react-rnd';
import './Card.scss';

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

export default Card