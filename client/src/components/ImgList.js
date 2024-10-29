import React, { useState } from 'react';

function ImgList(props) {
    const [slide, setSlide] = useState(0);
    const imgPathList = props.imgPathList.split(',');
    const imgName = props.imgName.split(',');

    const handlePrev = () => {
        setSlide((prev) => (prev > 0 ? prev - 1 : imgPathList.length - 1));
    };

    const handleNext = () => {
        setSlide((prev) => (prev < imgPathList.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className='img-wrap'>
            <ul className='img-list'>
                {imgPathList.filter((_, index) => index === slide).map((img, idx) => {
                    return <li key={idx}><img src={`http://localhost:3100/${img}`} alt={imgName[idx]} /></li>
                })}                    
            </ul>
            {imgPathList.length > 1 && (<div className='arrow-wrap'>
                <button type='button' className='arrow prev' onClick={handlePrev}>이전</button>
                <button type='button' className='arrow next' onClick={handleNext}>다음</button>
            </div>)}
            {imgPathList.length > 1 && (<div className='bullet-wrap'>
                {imgPathList.map((item, index) => {
                    return<span className={`bullet ${index === slide ? 'active' : ''}`} key={index} >{index}</span>
                })}
            </div>)}
        </div>
    );
}

export default ImgList;