import React, { useEffect, useRef, useState } from 'react';
import FileInput from './FileInput';
import Input from './Input';
import Textarea from './Textarea';

function PopupAdd(props) {
    const [files, setFiles] = useState([]);
    const [imgs, setImgs] = useState([]);
    const [slide, setSelide] = useState(0);
    const fileRef = useRef();

      // 파일 추가 시 상태 업데이트
    const handleChangeFile = (e) => {
        const newFiles = Array.from(e.target.files);
        const typeCheck = newFiles.filter((item) => {
            let type = item.type.includes('image');
            return type;
        });
        if(typeCheck.length === 0 || newFiles.length !== typeCheck.length) {
            alert('이미지 파일만 업로드 가능합니다.');
        } else if(files.length + newFiles.length > 5) {
            alert('이미지는 5개까지 등록 가능합니다.');
            return;
        } else if(typeCheck.length > 0 && newFiles.length === typeCheck.length) {
            setFiles((prev) => [...prev, ...newFiles]);
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
    const handleRemoveFile = (index) => {
        const updatedFiles = files.filter((_, idx) => idx !== index);
        setFiles(updatedFiles);
        if(index === 0) {
            setSelide(0);
        } else {
            setSelide(index-1);
        }
    };

    // 파일첨부하기
    const handleButtonClick = () => {
        fileRef.current.value = '';
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
                <div className='popup-board-wrap'>
                    <div className='popup-img-wrap'>                        
                        <div className='img-wrap'>
                            <ul className='img-list'>
                                {imgs && Array.from(imgs).filter((item, index) => index === slide).map((item, index) => (
                                    <li key={item.name}>
                                        <div className='img-box'>
                                            <img src={item.src} alt={item.name} />
                                            <button type='button' className='remove-btn' onClick={() => handleRemoveFile(slide)}>삭제</button>
                                        </div>
                                    </li>
                                ))}               
                                {imgs.length === 0 && (<li className='no-list'>
                                    <div className=''>이미지를 등록하세요</div>
                                </li>)}
                            </ul>
                            {imgs.length > 0 && (<div className='arrow-wrap'>
                                {slide > 0 && (<button type='button' className='arrow prev' onClick={()=>setSelide(prev=>prev-1)}>이전</button>)}
                                {slide < imgs.length-1 && (<button type='button' className='arrow next' onClick={()=>setSelide(prev=>prev+1)}>다음</button>)}
                            </div>)}
                            {imgs.length > 0  && (<div className='img-index-wrap'><span className='current'>{slide+1}</span><span className='total'> / {imgs.length}</span></div>)}
                        </div>
                        <button type='button' className='fileUpload-btn' onClick={handleButtonClick}>파일첨부</button>
                        <FileInput 
                            ref={fileRef}
                            accept="image/jpg, image/jpeg, image/png" 
                            multiple="multiple" 
                            onChange={(e) => {handleChangeFile(e)}}
                        />
                    </div>
                    <div className='popup-ip-wrap'>
                        <div className='ip-list flex flex-column flex-grow'>
                            <div className='tit-box'>
                                <p className='tit'>컨텐츠 입력</p>
                            </div>
                            <div className='bot-box flex-grow'>
                                <Textarea />
                            </div>
                        </div>
                        <div className='ip-list'>
                            <div className='tit-box'>
                                <p className='tit'>검색어 입력</p>
                            </div>
                            <div className='bot-box'>
                                <Input />
                            </div>
                        </div>
                        <button type='button' className='fileUpload-btn' onClick={handleButtonClick}>피드 등록</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupAdd;