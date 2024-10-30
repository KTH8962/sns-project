import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PopupAdd(props) {
    const [favorite, setFavorite] = useState([]);

    async function fnFavoriteList(){
        const res = await axios.get(`http://localhost:3100/feed/favorite`, {
            params: { feedNo: props.feedNo }
        });
        if(res.data.success) {
            setFavorite(res.data.list);
        }
    }

    // 파일 목록이 변경될 때 이미지 목록을 업데이트
    useEffect(() => {
        fnFavoriteList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='popup-box'>           
            <div className='dimmed' onClick={() => {props.setFavoritePop(false)}}>팝업배경</div>
            <div className='popup-cont favorite'>
                <div className='popup-tit-wrap'>
                    <p className='popup-tit'>좋아요 목록</p>
                    <button type='button' className='popup-close-btn' onClick={() => {props.setFavoritePop(false)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>닫기
                    </button>
                </div>
                <ul className='favorite-list'>
                    {favorite.map(item => {
                        return <li key={item.userNickName}>
                            <div className='img-box'>
                                <img 
                                    src={item.userProfilePath !== null ? `http://localhost:3100/${item.userProfilePath}` : '/assets/images/profile_default.png'} 
                                    alt={item.userNickName ? `${item.userNickName}의 프로필 사진` : '기본 프로필 사진'}
                                />
                            </div>
                            <div className='info-box'>
                                <p className='nick'>{item.userNickName}</p>
                                <p className='name'>{item.userName}</p>
                            </div>
                        </li>
                    })}
                </ul>
            </div>
        </div>
    );
}

export default PopupAdd;