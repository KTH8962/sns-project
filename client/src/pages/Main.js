import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { PopupContext } from '../context/PopupContext';
import Footer from '../components/Footer';
import PopupFavorite from '../components/PopupFavorite';
import PopupComment from '../components/PopupComment';
import ImgList from '../components/ImgList';

function Main(props) {
    const { completeFeed, completeComment } = useContext(PopupContext);
    const [feeds, setFeeds] = useState([]);
    const [feedNo, setFeedNo] = useState();
    const [favoritePop, setFavoritePop] = useState(false);
    const [commentPop, setCommentPop] = useState(false);
    const token = localStorage.getItem("token");
    const loginId = jwtDecode(token).userId;
    
    async function fnFeedSearch() {
        //console.log(token);
      try {
        const res = await axios.get("http://localhost:3100/feed", { headers: {token} });
        setFeeds(res.data.list);
      } catch (error) {
        console.log(error);
      }
    }

    async function handleToggleLike(feedNo, id) {
        try {
            const res = await axios.post("http://localhost:3100/feed/favorite", {feedNo, id});
            if(res.data.state === 'like') {
                await axios.delete("http://localhost:3100/feed/favorite", {
                    params: { feedNo, id }
                });
            }
            fnFeedSearch();
        } catch(error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
      fnFeedSearch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ completeFeed, completeComment ]);
    
    return (
        <main>
            <div className='main-container'>
                <div className='feed-wrap'>
                    {feeds.map((item, index) => {
                        return <div className='feed-box' key={item.feedNo}>
                            <ImgList imgPathList={item.imgPath} imgName={item.imgName} />
                            <div className='feed-contents'>
                                <div className='icon-wrap'>
                                    <div className='icon-box favorite'>
                                        <button type='button' onClick={() => {handleToggleLike(item.feedNo, loginId)}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg></button>
                                        <button type='button' onClick={() => {setFavoritePop(true); setFeedNo(item.feedNo);}}>{item.favoriteCnt}</button>                                        
                                    </div>
                                    <div className='icon-box comment'>
                                        <button type='button' onClick={() => {setCommentPop(true); setFeedNo(item.feedNo);}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z"/></svg>{item.commentCnt}</button>
                                    </div>
                                </div>
                                <div className='name'>{item.userNickName}</div>
                                <div className='contents'>{item.feedContents}</div>
                                <div className='search'>{item.feedSearch}</div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
            <Footer />
            {favoritePop && <PopupFavorite feedNo={feedNo} setFavoritePop={setFavoritePop} />}
            {commentPop && <PopupComment feedNo={feedNo} setCommentPop={setCommentPop}/>}
        </main>
    );
}

export default Main;