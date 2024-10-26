import React, { forwardRef } from 'react';

const FileInput = forwardRef((props, ref) => {
    return (
        <input type='file' 
            accept={props.accept} 
            ref={ref}
            onChange={props.onChange}
            multiple = {props.multiple === undefined ? '' : props.multiple}
        />
    );
});

export default FileInput;