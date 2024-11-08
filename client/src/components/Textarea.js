import React, { forwardRef } from 'react';

const Input = forwardRef((props, ref) => {
    return (
        <div className='textbox-box'>
            <textarea ref={ref}
             type={props.type === undefined ? "text" : props.type} 
             placeholder={props.placeholder}
            />
        </div>
    );
});

export default Input;