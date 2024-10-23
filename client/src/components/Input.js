import React, { forwardRef } from 'react';

const Input = forwardRef((props, ref) => {
    return (
        <div className='ip-box'>
            <input ref={ref}
             type={props.type === undefined ? "text" : props.type} 
             placeholder={props.placeholder}
             onKeyDown={props.keyDown}
            />
        </div>
    );
});

export default Input;