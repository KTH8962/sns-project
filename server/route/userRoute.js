const express = require('express');
const router = express.Router();
const connection = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Rounds = 10;

const JWT_KEY = "asdasd123asdasd123";

router.route("/")
    .post((req, res) => {
        const { id, pwd } = req.body;
        const query = `SELECT * FROM TBL_USER WHERE userId = ?`;
        connection.query(query, [id], async (err, results) => {
            if(err) {
                console.error('피드 조회 실패:', err);
                return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
            }
            if(results[0] == undefined) {
                return res.json({ success: false, message: '이메일을 확인해 주세요.' });
            } else {
                const dbPwd = results[0].userPwd;
                const pwdDecode = await bcrypt.compare(pwd, dbPwd);
                if(pwdDecode) {
                    const user = results[0];
                    const token = jwt.sign({userId: user.userId, userName: user.userName}, JWT_KEY, {expiresIn : '1h'});
                    return res.json({ success: true, message: '로그인 성공!', token: token});
                } else {
                    return res.json({ success: false, message: '비밀번호를 확인해 주세요.' });
                }
            }
        });
    });

router.route("/join")
    .post((req, res) => {
        const { id, pwd, name, nick } = req.body;

        const query = `
            SELECT 
                (SELECT COUNT(*) FROM TBL_USER WHERE userId = ?) AS idExists,
                (SELECT COUNT(*) FROM TBL_USER WHERE userNickName = ?) AS nickExists
            `;

        connection.query(query, [id, nick], async (err, results) => {
            if (err) {
                console.log('회원가입 실패:', err);
                return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
            }

            const { idExists, nickExists } = results[0];

            if (idExists > 0) {
                return res.json({ success: false, message: '이미 사용중인 아이디입니다.' });
            }
            if (nickExists > 0) {
                return res.json({ success: false, message: '이미 사용중인 닉네임입니다.' });
            }

            const insertQuery = `INSERT INTO TBL_USER(userId, userPwd, userName, userNickName) VALUES(?, ?, ?, ?)`;
            const pwdHash = await bcrypt.hash(pwd, Rounds);
            connection.query(insertQuery, [id, pwdHash, name, nick], (err) => {
                if (err) {
                    console.log('회원가입 실패:', err);
                    return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
                }
                return res.json({ success: true, message: '회원가입 완료되었습니다.' });
            });
        });
    });
module.exports = router;