import React, { useContext, useEffect, useRef, useState } from 'react';
import Input from './Input';
import axios from 'axios';
import { PopupContext } from '../context/PopupContext';

function PopupAdd(props) {
    const { toggleView, registerComment } = useContext(PopupContext);
    const [feed, setFeed] = useState([]);
    const [list, setList] = useState([]);
    const [imgs, setImgs] = useState([]);
    const [slide, setSelide] = useState(0);
    const commentRef = useRef();

    const fnViewFeed = async () => {
        //console.log(props.feedNo);
        const res = await axios.get(`http://localhost:3100/mypage/view`, {
            params: { feedNo: props.feedNo }
        });
        setFeed(res.data.feed);
        setList(res.data.list);
        setImgs(res.data.feed.imgPath.split(','));
        console.log(res.data);
    }

    const onSubmit = async () => {
        const comment = commentRef.current.value;
        const feedNo = props.feedNo;
        const loginId = props.loginId;
        const res = await axios.post(`http://localhost:3100/feed/comment`, { comment, feedNo, loginId });
        if(res.data.success) {
            fnViewFeed();
            registerComment(true);
            commentRef.current.value = '';
        }
    }
    

    // 파일 목록이 변경될 때 이미지 목록을 업데이트
    useEffect(() => {
        fnViewFeed();
    }, []);

    return (
        <div className='popup-box'>
            <button type='button' className='popup-close-btn' onClick={toggleView}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>닫기
            </button>
            <div className='dimmed' onClick={toggleView}>팝업배경</div>
            <div className='popup-cont view'>
                <div className='popup-board-wrap'>
                    <div className='popup-img-wrap'>                        
                        <div className='img-wrap'>
                            <ul className='img-list'>
                                {imgs && Array.from(imgs).filter((_, index) => index === slide).map((item) => (
                                    <li key={item}>
                                        <div className='img-box'>
                                            <img src={`http://localhost:3100/${item}`} alt={item} />
                                        </div>
                                    </li>
                                ))}               
                                {imgs.length === 0 && (<li className='no-list'>
                                    <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#333333"><path d="M440-440ZM120-120q-33 0-56.5-23.5T40-200v-480q0-33 23.5-56.5T120-760h126l74-80h240v80H355l-73 80H120v480h640v-360h80v360q0 33-23.5 56.5T760-120H120Zm640-560v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM440-260q75 0 127.5-52.5T620-440q0-75-52.5-127.5T440-620q-75 0-127.5 52.5T260-440q0 75 52.5 127.5T440-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Z"/></svg>이미지를 등록하세요</span>
                                </li>)}
                            </ul>
                            {imgs.length > 0 && (<div className='arrow-wrap'>
                                {slide > 0 && (<button type='button' className='arrow prev' onClick={()=>setSelide(prev=>prev-1)}>이전</button>)}
                                {slide < imgs.length-1 && (<button type='button' className='arrow next' onClick={()=>setSelide(prev=>prev+1)}>다음</button>)}
                            </div>)}
                            {imgs.length > 0  && (<div className='img-index-wrap'><span className='current'>{slide+1}</span><span className='total'> / {imgs.length}</span></div>)}
                        </div>
                    </div>
                    <div className='view-comment-wrap'>
                        <div className='comment-wrap'>
                            <div className='ip-list contents'>
                                <div className='tit-box'>
                                    <p className='tit'>피드 컨텐츠</p>
                                </div>
                                <div className='bot-box'>
                                    {feed.feedContents}
                                </div>
                            </div>
                            <div className='ip-list comment'>
                                <div className='tit-box'>
                                    <p className='tit'>댓글</p>
                                </div>
                                <div className='bot-box'>
                                    <ul className='comment-list'>
                                        {list[0]?.commentContents !== null ? list.map((item, index) => {
                                            return <li key={index}>
                                                <div className='img-box'>
                                                    <img 
                                                        src={item.userProfilePath !== null ? `http://localhost:3100/${item.userProfilePath}` : '/assets/images/profile_default.png'} 
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
                                        }) : ''}                            
                                        { list[0]?.commentContents === null ? <li className='no-list'><p className='tit'>아직 댓글이 없습니다.</p><p className='desc'>댓글을 달아주세요.</p></li> : ''}
                                    </ul>
                                </div>
                            </div>
                            <div className='ip-list input'>
                                <div className='tit-box'>
                                    <p className='tit'>댓글 입력</p>
                                </div>
                                <div className='bot-box'>
                                    <Input ref={commentRef} btnText='작성' handleClick={onSubmit}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupAdd;