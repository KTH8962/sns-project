import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Input from './Input';
import { jwtDecode } from 'jwt-decode';
import { PopupContext } from '../context/PopupContext';

function PopupAdd(props) {
    const { registerComment } = useContext(PopupContext);
    const [comment, setComment] = useState([]);
    const commentRef = useRef();
    const token = localStorage.getItem("token");
    const loginId = jwtDecode(token).userId;

    async function fnCommentList(){
        const res = await axios.get(`http://localhost:3100/feed/comment`, {
            params: { feedNo: props.feedNo }
        });
        if(res.data.success) {
            setComment(res.data.list);
        }
    }

    // 파일 목록이 변경될 때 이미지 목록을 업데이트
    useEffect(() => {
        fnCommentList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const onSubmit = async () => {
        const comment = commentRef.current.value;
        const feedNo = props.feedNo;
        const res = await axios.post(`http://localhost:3100/feed/comment`, { comment, feedNo, loginId });
        if(res.data.success) {
            fnCommentList();
            registerComment(true);
            commentRef.current.value = '';
        }
    }

    return (
        <div className='popup-box'>           
            <div className='dimmed' onClick={() => {props.setCommentPop(false)}}>팝업배경</div>
            <div className='popup-cont comment'>
                <div className='popup-tit-wrap'>
                    <p className='popup-tit'>댓글 목록</p>
                    <button type='button' className='popup-close-btn' onClick={() => {props.setCommentPop(false)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>닫기
                    </button>
                </div>
                <div className='comment-wrap'>
                    <ul className='comment-list'>
                        {comment.map((item, index) => {
                            return <li key={index}>
                                <div className='img-box'>
                                    <img 
                                        src={item.userProfilePath !== null ? item.userProfilePath : '/assets/images/profile_default.png'} 
                                        alt={item.userNickName ? `${item.userNickName}의 프로필 사진` : '기본 프로필 사진'}
                                    />
                                </div>
                                <div className='info-box'>
                                    <div className='top'>
                                        <p className='nick'>{item.userNickName}</p>
                                        <p className='date'>{item.createDate}</p>
                                    </div>
                                    <p className='content'>{item.commentContents}</p>
                                </div>
                            </li>
                        })}
                        {comment.length === 0 && <li className='no-list'><p className='tit'>아직 댓글이 없습니다.</p><p className='desc'>댓글을 달아주세요.</p></li>}
                    </ul>
                    <div className='comment-ip-wrap'>
                        <Input ref={commentRef} btnText='작성' handleClick={onSubmit}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupAdd;