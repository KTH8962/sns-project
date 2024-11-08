import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Logo from '../components/Logo';
import axios from 'axios';

function Login(props) {
    let idRef = useRef();
    let pwdRef = useRef();
    const navigate = useNavigate();
    
    const handleLogin = async () => {
        const id = idRef.current.value;
        const pwd = pwdRef.current.value;
        const res = await axios.post(`http://13.125.58.106:3100/user`, { id, pwd });
        if(res.data.success) {
            localStorage.setItem("token", res.data.token);
            navigate("/main");
        } else {
            alert(res.data.message);
        }
    }

    const handleKeyPress = (e) => {
        if(e.key === 'Enter') {
            handleLogin();
        }
      }

    return (
        <div className='intro-wrap'>
            <div className='intro-box'>                
                <Logo />
                <Input ref={idRef} placeholder='이메일을 입력하세요' />
                <Input ref={pwdRef} type='password' placeholder='비밀번호를 입력하세요' keyDown={(e) => {handleKeyPress(e)}} />
                <div className='btn-box'>
                    <button type='button' onClick={handleLogin}>로그인</button>
                </div>
            </div>
            <div className='login-join'>
                <span>아이디가 없으신가요?</span><Link to='/join'>회원가입</Link>
            </div>
        </div>
    );
}

export default Login;