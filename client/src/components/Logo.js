import React from 'react';
import { Link } from 'react-router-dom';

function Logo(props) {
    return (
        <>
            {props.type === 'main' ? <h1 className='h-logo'><Link to='/main'><span>dailygram로고</span></Link></h1> : <h1 className='logo'><img src={`assets/images/logo.png`} /></h1>}
        </>
    );
}

export default Logo;