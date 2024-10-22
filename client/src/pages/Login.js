import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login(props) {
    const navigate = useNavigate();
    return (
        <div className='login-wrap'>
            <div className='login-box'>
                <div className='ip-box'>
                    <input type='text' placeholder='이메일을 입력해주세요' />
                </div>
                <div className='ip-box'>
                    <input type='password' placeholder='비밀번호를 입력해주세요' />
                </div>
                <div className='btn-box'>
                    <button type='button'>로그인</button>
                </div>
            </div>
            <div className='login-join'>
                <Link to='/join'>회원가입하기</Link>
            </div>
        </div>
    );
}

export default Login;