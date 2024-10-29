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
                <div className='mypage-wrap'></div>
            </div>
            <Footer />
        </main>
    );
}

export default MyPage;