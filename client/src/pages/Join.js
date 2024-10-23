import React, { useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Logo from '../components/Logo';
import axios from 'axios';

function Join() {
    const navigate = useNavigate();
    const idRef = useRef();
    const pwdRef = useRef();
    const nameRef = useRef();
    const nickRef = useRef();
    const [btnState, setBtnState] = useState(false);
    
    const handleJoin = async () => {
        const id = idRef.current.value;
        const pwd = pwdRef.current.value;
        const name = nameRef.current.value;
        const nick = nickRef.current.value;
        let check1 = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let check2 = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_])[a-zA-Z0-9\W_]{8,}$/; // 패스워드 정규식
        let check3 = /^(?=.*[가-힣])|(?=.*[a-zA-Z])|(?=.*[!@#$%^&*(),.?":{}|<>])[^\s]+$/;
        if(!(compare(check1, id, "이메일 형식에 맞춰 작성해주세요"))) {
            return;
        } else if(!(compare(check2, pwd, "패스워드는 숫자, 영문자, 특수기호 포함 8자이상 작성해주세요."))){
            return;
        } else if(!(compare(check3, name, "이름을 입력해주세요"))) {
            return;
        } else if(!(compare(check3, nick, "닉네임을 입력해주세요"))) {
            return;
        } else {
            setBtnState(true);
            //console.log(id, pwd, name, nick, {id, pwd, name, nick});
            const res = await axios.post(`http://localhost:3100/user/join`, {id, pwd, name, nick});
            alert(res.data.message);
            setBtnState(false);
            if(res.data.success) {
                navigate('/');
            }
        }
    }

    function compare(check, form, message) {
        if(check.test(form)) {
            return true;
        }
        alert(message);
        return false;
    }

    return (
        <div className='intro-wrap'>
            <div className='intro-box join'>
                <Logo />
                <Input ref={idRef} placeholder='이메일을 입력하세요' />
                <Input ref={pwdRef} type='password' placeholder='비밀번호를 입력하세요' />
                <Input ref={nameRef} placeholder='이름을 입력하세요' />
                <Input ref={nickRef} placeholder='닉네임을 입력하세요' />
                <div className='btn-box'>
                    <button type='button' onClick={handleJoin} disabled={btnState}>회원가입</button>
                </div>
            </div>
            <div className='login-join'>
                <span>아이디가 있으신가요?</span><Link to='/'>로그인</Link>
            </div>
        </div>
    )
}

export default Join
