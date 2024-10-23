import React from 'react';
import { Link } from 'react-router-dom';

function Menu(props) {
    return (
        <div className='nav-wrap'>
            <nav>
                <ul>
                    <li><Link to='/feed'>피드</Link></li>
                    <li><Link to='/search'>검색</Link></li>
                    <li><Link to='/alarm'>알림</Link></li>
                    <li><Link to='/dm'>디엠</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Menu;