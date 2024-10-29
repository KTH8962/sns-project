import React from 'react';
import Footer from '../components/Footer';
import { jwtDecode } from 'jwt-decode';

function MyPage(props) {
    const token = localStorage.getItem('token');
    const loginId = jwtDecode(token).userId;
    console.log(loginId);

    return (
        <main>
            <div className='main-container'>
                <div className='mypage-wrap'>
                    <div className='mypage-top'>
                        <button type='button'><img src='/assets/images/bugi.png' alt='test'/></button>
                    </div>
                    <div className='mypage-contents'></div>
                </div>
            </div>
            <Footer />
            {/* https://www.pngwing.com/ko/free-png-mwfzg */}
        </main>
    );
}

export default MyPage;