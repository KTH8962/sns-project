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
    const textRef = useRef();
    const searchRef = useRef();
    
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

    // 이미지 첨부하기
    const handleButtonClick = () => {
        fileRef.current.value = '';
        fileRef.current.click();
    }

    // 파일 등록하기
    const onSubmit = async () => {
        const token = localStorage.getItem('token');
        const id = jwtDecode(token).userId;
        const contents = textRef.current.value;
        const search = searchRef.current.value;
        if(files.length === 0) {
            alert('이미지를 등록해주세요');
            return;
        } else if(contents === '') {
            alert('내용을 입력해주세요');
            return;
        } else if(search === '') {
            alert('검색어를 입력해주세요');
            return;
        } else {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }
            formData.append('contents', contents);
            formData.append('search', search);
            formData.append('id', id);
            try {
                const response = await axios.post('http://13.125.58.106:3100/feed/insert', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  }
                });
                alert(response.data.message);
                if(response.data.success === true) {
                    if(['/main', '/mypage'].includes(location.pathname)){
                        registerFeed(true);
                    }
                    togglePopup();
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
            <button type='button' className='popup-close-btn' onClick={togglePopup}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>닫기
            </button>
            <div className='dimmed' onClick={togglePopup}>팝업배경</div>
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
                                    <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#333333"><path d="M440-440ZM120-120q-33 0-56.5-23.5T40-200v-480q0-33 23.5-56.5T120-760h126l74-80h240v80H355l-73 80H120v480h640v-360h80v360q0 33-23.5 56.5T760-120H120Zm640-560v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM440-260q75 0 127.5-52.5T620-440q0-75-52.5-127.5T440-620q-75 0-127.5 52.5T260-440q0 75 52.5 127.5T440-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Z"/></svg>이미지를 등록하세요</span>
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
                                <Textarea 
                                    ref={textRef}
                                    placeholder='내용을 입력해주세요'
                                />
                            </div>
                        </div>
                        <div className='ip-list'>
                            <div className='tit-box'>
                                <p className='tit'>검색어 입력</p>
                            </div>
                            <div className='bot-box'>
                                <Input 
                                    ref={searchRef}
                                    placeholder='검색어를 입력해주세요'
                                 />
                            </div>
                        </div>
                        <button type='button' className='fileUpload-btn' onClick={onSubmit}>피드 등록</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupAdd;