import React from 'react';
import Footer from '../components/Footer';
import PopupAdd from '../components/PopupAdd';

function Main(props) {
    return (
        <main>
            <div className='main-container'>
                메인이다.
            </div>
            <PopupAdd></PopupAdd>
            <Footer></Footer>
        </main>
    );
}

export default Main;