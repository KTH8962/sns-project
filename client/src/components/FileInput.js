import React from 'react';

function FileInput(props) {
    return (
        <div className='file-wrap-box'>
            <div className='file-box'>
                <input type='file' 
                    accept={props.accept} 
                    onChange={props.onChange}
                    multiple = {props.multiple === undefined ? '' : props.multiple}
                />
            </div>
            <ul></ul>
        </div>
    );
}

export default FileInput;