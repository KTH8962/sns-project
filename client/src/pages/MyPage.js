import React, { useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PopupView from '../components/PopupView';
import PopupAddProfile from '../components/PopupAddProfile';
import { PopupContext } from '../context/PopupContext';

function MyPage(props) {
    const { view, toggleView, profileImg, toggleProfileImg, completeFeed, completeComment, completeFavorite, completeProfile } = useContext(PopupContext);
    const [profile, setProfile] = useState('');
    const [feedList, setFeedList] = useState([]);
    const [feedNo, setFeedNo] = useState();
    const token = localStorage.getItem('token');
    const loginId = jwtDecode(token).userId;

    useEffect(() => {
        fnMypageSearch();
        console.log(completeFavorite);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ completeFeed, completeComment, completeFavorite, completeProfile ]);

    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate('/');
    }

    const fnMypageSearch = async () => {
        const res = await axios.get(`http://13.125.58.106:3100/mypage`, {
            params : {loginId}
        });
        //console.log(res);
        setProfile(res.data.profile);
        setFeedList(res.data.list);
    };
    

    return (
        <main>
            <div className='main-container'>
                <div className='mypage-wrap'>
                    <div className='mypage-top'>
                        <div className='profile-box'><button type='button' onClick={toggleProfileImg}><img src={profile.userProfilePath === null ? 'assets/images/profile_default.png' : `http://13.125.58.106:3100/${profile.userProfilePath}`} alt={`${profile.userNickName}의 프로필 사진`} /></button></div>
                        <div className='info-box'>
                            <div className='tit-wrap'><p className='nick'>{profile.userNickName}</p><button onClick={logout}>로그아웃</button></div>
                            <p className='count'>게시물 {profile.feedCnt}</p>
                        </div>
                    </div>
                    <div className='mypage-contents'>
                        <div className='img-wrap'>
                            <ul className='img-list'>
                                {feedList.map((item, index) => {
                                    return <li key={index} className={item.imgCnt > 1 ? 'count' : ''}>
                                        <button type='button' className='img-box' onClick={() => {setFeedNo(item.feedNo); toggleView();}}>
                                            <img src={`http://13.125.58.106:3100/${item.imgPath}`} alt='test' />
                                            <span className='icon-box'>
                                                <span className='icon favorite'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>{item.favoriteCnt}</span>
                                                <span className='icon comment'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z"/></svg>{item.commentCnt}</span>
                                            </span>
                                        </button>
                                    </li>
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            {view && <PopupView feedNo={feedNo} loginId={loginId} />}
            {profileImg && <PopupAddProfile />}
            {/* https://www.pngwing.com/ko/free-png-mwfzg */}
        </main>
    );
}

export default MyPage;