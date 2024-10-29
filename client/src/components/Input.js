import React, { forwardRef } from 'react';

const Input = forwardRef((props, ref) => {
    return (
        <div className={`ip-box ${props.btnText !== undefined ? 'ip-ico-box type2' : ''}`}>
            <input ref={ref}
             type={props.type === undefined ? "text" : props.type} 
             placeholder={props.placeholder}
             onKeyDown={props.keyDown}
             />
             {props.btnText !== undefined ? <div className='btn-box type2'><button type='button' onClick={props.handleClick}>{props.btnText}</button></div> : ''}
        </div>
    );
});

export default Input;