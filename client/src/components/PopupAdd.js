import React, { useEffect, useRef, useState } from 'react';
import FileInput from './FileInput';

function PopupAdd(props) {
    const [files, setFiles] = useState([]);
    const [imgs, setImgs] = useState();
    const fileRef = useRef();

      // 파일 추가 시 상태 업데이트
    const handleChangeFile = (e) => {
        const newFiles = Array.from(e.target.files);
        const typeCheck = newFiles.filter((item) => {
            let type = item.type.includes('image');
            //console.log(typeCheck, typeCheck == false);
            return type;
        });
        if(typeCheck.length > 0 && newFiles.length == typeCheck.length) {
            setFiles((prev) => [...prev, ...newFiles]);
        } else if(typeCheck.length == 0 || newFiles.length != typeCheck.length) {
            alert('이미지 파일만 업로드 가능합니다.');
        }
    };

    // 파일 객체를 이미지로 변환
    const handleImgFile = (fileList) => {
        const imgPromises = fileList.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve({
                        src: reader.result,  // 이미지 데이터
                        name: file.name      // 파일 이름
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        // 모든 파일이 처리된 후 상태 업데이트
        Promise.all(imgPromises).then((imgList) => {
            setImgs(imgList);
        });
    };

    // 파일 제거
    const handleRemoveFile = (name) => {
        const updatedFiles = files.filter(file => file.name !== name);
        setFiles(updatedFiles);
    };

    // 파일첨부하기
    const handleButtonClick = () => {
        fileRef.current.click();
    }

    // 파일 목록이 변경될 때 이미지 목록을 업데이트
    useEffect(() => {
        handleImgFile(files);
    }, [files]);

    return (
        <div className='popup-box'>
            <button type='button' className='popup-close-btn'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>닫기
            </button>
            <div className='dimmed'>팝업배경</div>
            <div className='popup-cont add'>
                <div className='popup-img-wrap'>
                    <div className='popup-img-box'>
                        <ul>
                            {imgs && Array.from(imgs).map((item, index) => (
                                <li key={index}>
                                    <img src={item.src} />
                                    <button type='button' onClick={() => handleRemoveFile(item.name)}>삭제</button>
                                </li>
                            ))}                    
                        </ul>
                        <button type='button' className='fileUpload-btn' onClick={handleButtonClick}>파일첨부</button>
                        <FileInput 
                            ref={fileRef}
                            accept="image/jpg, image/jpeg, image/png" 
                            multiple="multiple" 
                            onChange={(e) => {handleChangeFile(e)}}
                        />
                    </div>
                    <div className='popup-ip-wrap'>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupAdd;