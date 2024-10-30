import React, { useContext, useEffect, useRef, useState } from 'react';
import FileInput from './FileInput';
import Input from './Input';
import Textarea from './Textarea';
import axios from 'axios';
import { PopupContext } from '../context/PopupContext';
import { jwtDecode } from 'jwt-decode';
import { useLocation } from 'react-router-dom';

function PopupAdd(props) {
    const { togglePopup, registerFeed } = useContext(PopupContext);
    const location = useLocation();
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
        } else if(typeCheck.length > 0 && newFiles.length === typeCheck.length) {
            setFiles(newFiles);
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
    };

    // 이미지 첨부하기
    const handleButtonClick = () => {
        fileRef.current.value = '';
        fileRef.current.click();
    }

    // 파일 등록하기
    const onSubmit = async () => {
        const token = localStorage.getItem('token');
        const id = jwtDecode(token).userId;
        if(files.length === 0) {
            alert('이미지를 등록해주세요');
            return;
        } else {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }
            formData.append('id', id);
            try {
                const response = await axios.post('http://localhost:3100/mypage/insert', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  }
                });
                alert(response.data.message);
                if(response.data.success === true) {
                    if(['/mypage'].includes(location.pathname)){
                        //registerFeed(true);
                    }
                    //togglePopup();
                }
            } catch (error) {
                console.error('피드 등록 오류:', error);
            }
        }
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
            <div className='popup-cont profile'>
                <div className='popup-board-wrap'>
                    <div className='popup-img-wrap'>                        
                        <div className='img-wrap'>
                            <ul className='img-list'>
                                {imgs && Array.from(imgs).map((item, index) => (
                                    <li key={item.name}>
                                        <div className='img-box'>
                                            <img src={item.src} alt={item.name} />
                                            <button type='button' className='remove-btn' onClick={() => handleRemoveFile(slide)}>삭제</button>
                                        </div>
                                    </li>
                                ))}               
                                {imgs.length === 0 && (<li className='no-list'>
                                    <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#333333"><path d="M440-440ZM120-120q-33 0-56.5-23.5T40-200v-480q0-33 23.5-56.5T120-760h126l74-80h240v80H355l-73 80H120v480h640v-360h80v360q0 33-23.5 56.5T760-120H120Zm640-560v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM440-260q75 0 127.5-52.5T620-440q0-75-52.5-127.5T440-620q-75 0-127.5 52.5T260-440q0 75 52.5 127.5T440-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Z"/></svg>이미지를 등록하세요</span>
                                </li>)}
                            </ul>
                        </div>
                        <div className='popup-btn-wrap'>
                            <button type='button' className='fileUpload-btn' onClick={handleButtonClick}>파일첨부</button>                        
                            <button type='button' className='fileUpload-btn' onClick={onSubmit}>프로필 등록</button>
                        </div>
                        <FileInput 
                            ref={fileRef}
                            accept="image/jpg, image/jpeg, image/png" 
                            onChange={(e) => {handleChangeFile(e)}}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupAdd;