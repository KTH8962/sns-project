import React, { useEffect, useRef, useState } from 'react';
import FileInput from './FileInput';

function PopupAdd(props) {
    const [files, setFiles] = useState([]);
    const [imgs, setImgs] = useState();
    const handleChangeFile = (e) => {
        let fileList;
        console.log(e.type);
        if(e.type === "change") {
            fileList = Array.from(e.target.files);
        } else {
            fileList = files;
        }
        for(let file of fileList) {
            setFiles((prev) => {
                //console.log(file);
                return [file];
            });
        }
        //console.log(fileList)
        //console.log(files, e.target.files);
        let imgList = [];
        for(let i = 0; i < fileList.length; i++) {
            const reader = new FileReader();
            reader.readAsDataURL(fileList[i]);
            reader.onload = async () => {
                const imgObject = {
                    src: reader.result,  // 이미지 데이터
                    name: fileList[i].name // 파일 이름
                };
                imgList.push(imgObject);
                //imgList.push(reader.result, fileList[i].name);
                setImgs(imgList);
            };
        }
    }
    const handleRemoveFile = (name) => {
        let removeFile = files.filter((file) => file.name != name);
        setFiles(removeFile);
        handleChangeFile(removeFile);
    }
    const test = () => {
        console.log(files);
    }
    
    return (
        <div className='popup-box'>
            <button type='button' className='popup-close-btn'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>닫기
            </button>
            <div className='dimmed'>팝업배경</div>
            <div className='popup-cont add'>
                <button onClick={test}>테스트</button>
                <ul>
                    {imgs && Array.from(imgs).map((item, index) => (
                        <li key={index}>
                            <img src={item.src} />
                            <button type='button' onClick={() => handleRemoveFile(item.name)}>삭제</button>
                        </li>
                    ))}                    
                </ul>
                <div className='popup-img-wrap'>
                    <FileInput 
                        accept="image/jpg, image/jpeg, image/png" 
                        multiple="multiple" 
                        onChange={(e) => {handleChangeFile(e)}}
                    />
                </div>
            </div>
        </div>
    );
}

export default PopupAdd;