import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

function PopupAdd(props) {
    const [favorite, setFavorite] = useState([]);

    async function fnFavoriteList(){
        const res = await axios.get(`http://localhost:3100/feed/favorite`, {
            params: { feedNo: 1 }
        });
        if(res.data.success) {
            console.log(res.data.list);
            setFavorite(res.data.list);
        }
    }

    // 파일 목록이 변경될 때 이미지 목록을 업데이트
    useEffect(() => {
        fnFavoriteList();
    }, []);

    return (
        <div className='popup-box'>
            <button type='button' className='popup-close-btn' onClick=''>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>닫기
            </button>
            <div className='dimmed'>팝업배경</div>
            <div className='popup-cont favorite'>
                <ul>
                    {favorite.map(item => {
                        return <li key={item.userId}>
                            {item.userName}, {item.userNickName}, {item.userId}
                        </li>
                    })}
                </ul>
            </div>
        </div>
    );
}

export default PopupAdd;