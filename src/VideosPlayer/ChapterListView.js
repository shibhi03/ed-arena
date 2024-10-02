import { ListGroup } from 'react-bootstrap';
// import { useState } from 'react';
import './Styles/chapterViewList.css';

const ChapterList = ({ chapters, onSelectedChapter }) => {

    return (
        <div className="container">
            <ListGroup className='items-list'>
                {chapters.map((chapter, index) => (
                    <div key={index}>
                        <ListGroup.Item className='items text-wrap rounded-lg'
                            onClick={() => onSelectedChapter(index)}
                        >
                            {chapter}
                        </ListGroup.Item>
                    </div>
                ))}
            </ListGroup>
        </div>
    )
}

export default ChapterList;