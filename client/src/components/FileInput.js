import React, { forwardRef } from 'react';

const FileInput = forwardRef((ref, props) => {
    return (
        <div className='file-wrap-box'>
            <div className='file-box'>
                <input type='file' 
                    accept={props.accept} 
                    ref={ref}
                    onChange={props.onChange}
                    multiple = {props.multiple === undefined ? '' : props.multiple}
                />
            </div>
        </div>
    );
});

export default FileInput;