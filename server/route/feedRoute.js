const express = require('express');
const router = express.Router();
const connection = require('../db');
const path = require('path');
const multer = require("multer");
const jwtAuthentication = require('../jwtAuth');

// 파일 저장 경로 및 이름 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      //console.log(file);
      cb(null, 'img/'); // 서버 내 img 폴더
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); // 파일 확장자
      cb(null, Date.now() + ext); // 날짜 데이터를 이용해서 파일 이름으로 저장
    },
  });
  
  // 파일 업로드 미들웨어 설정
  const upload = multer({ storage: storage });
  


router.route('/')
    .get((req, res) => {
        const query = `SELECT F.feedNo, 
                        F.feedContents,
                        F.feedSearch,
                        U.userNickName,
                        F.userId,
                        GROUP_CONCAT(I.imgName SEPARATOR ',') AS imgName,
                        GROUP_CONCAT(I.imgPath SEPARATOR ',') AS imgPath,
                        IFNULL(CNT.favoriteCnt, 0) AS favoriteCnt,
                        IFNULL(C.commentCnt, 0) AS commentCnt
                        FROM tbl_feed F
                        INNER JOIN tbl_user U ON F.userId = U.userId
                        LEFT JOIN tbl_feed_img I ON F.feedNo = I.feedNo
                        LEFT JOIN (
                        SELECT feedNo, COUNT(feedNo) AS favoriteCnt
                        FROM tbl_favorite
                        GROUP BY feedNo	
                        ) CNT ON F.feedNo = CNT.feedNo
                        LEFT JOIN (
                            SELECT COUNT(feedNo) AS commentCnt, feedNo
                            FROM TBL_FEED_COMMENT
                            GROUP BY feedNo
                        ) C ON F.feedNo = C.feedNo
                        GROUP BY F.feedNo, F.feedSearch, F.userId, F.feedContents, U.userNickName, CNT.favoriteCnt, C.commentCnt
                        ORDER BY feedNo DESC`;
        connection.query(query, (err, results) => {
            if(err) {
                console.error('피드 조회 실패:', err);
                return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
            }
            return res.json({ success: true, message: '조회 완료 되었습니다.', list: results})
        });
    })

router.route('/insert')   
    .post(upload.array('images'), (req, res) => {
        const { contents, search, id } = req.body;
        //console.log(contents, search, token, req.body);
        const query = `INSERT INTO TBL_FEED(feedNo, userId, feedContents, feedSearch, createAt, updateAt) VALUES(NULL, ?, ?, ?, NOW(), NOW())`;
        connection.query(query, [id, contents, search], async (err, feedResult) => {
            if(err) {
                console.error('피드 업로드 실패:', err);
                return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
            }
            const feed_id = feedResult.insertId;
            const files = req.files;
            if (!files || files.length === 0) {
                return res.json({ success: false, message: "파일이 업로드되지 않았습니다." });
            }

            const imgQuery = 'INSERT INTO tbl_feed_img(imgNo, feedNo, imgName, imgPath, createAt) VALUES ?';
            const imgData = files.map(file => [null, feed_id, file.filename, file.path, new Date()]);
            connection.query(imgQuery, [imgData], (err, imgResult) => {
                if (err) {
                console.error('이미지 저장 실패:', err);
                    return res.status(500).json({ success: false, message: "이미지 저장 실패" });
                }
                res.json({ success: true, message: "피드 및 파일이 성공적으로 저장되었습니다!" });
            });
        });
    });

router.route('/favorite')
    .get((req, res) => {
        const feedNo = req.query.feedNo;
        const query = `SELECT F.feedNo, U.userName, U.userNickName, U.userProfilePath FROM tbl_favorite F 
                    INNER JOIN tbl_user U ON F.userId = U.userId
                    WHERE feedNo = ?`;
        connection.query(query, [feedNo], (err, results) => {
            if(err) {
                console.error('좋아요 리스트 조회 실패:', err);
                return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
            }
            //console.log(results);
            return res.json({ success: true, message: '좋아요 리스트 조회 완료', list: results });
        });
    })
    .post((req, res) => {
        const { feedNo, id } = req.body;
        const query = `SELECT * FROM tbl_favorite WHERE feedNo = ? AND userId = ?`;
        connection.query(query, [feedNo, id], (err, results) => {
            if(err) {
                console.error('좋아요 조회 실패:', err);
                return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
            }
            console.log(results.length);
            if(results.length > 0) {
                return res.json({ success: true, state: 'like', message: '좋아요 취소' });
            } else {
                const insertQeury = `INSERT INTO tbl_favorite(feedNo, userId) VALUES(?, ?)`;
                connection.query(insertQeury, [feedNo, id], (err, results) => {
                    if(err) {
                        console.error('좋아요 추가 실패:', err);
                        return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
                    }
                    return res.json({ success: true, state: 'none', message: '좋아요 선택' });
                });
            }
        });
    })
    .delete((req, res) => {
        const { feedNo, id } = req.query;
        //console.log(req.query);
        const query = `DELETE FROM tbl_favorite WHERE feedNo = ? AND userId = ?`;
        connection.query(query, [feedNo, id], (err, result) => {
            if(err) {
                console.error('좋아요 취소 실패:', err);
                return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
            }
            return res.json({ success: true, message: '좋아요 취소 완료' });
        });
    });

router.route('/comment')
    .get((req, res) => {
        const feedNo = req.query.feedNo;
        const query = `SELECT C.feedNo, C.commentContents, U.userNickName, U.userProfilePath ,
                        CASE 
                            WHEN DATEDIFF(CURRENT_DATE, createAt) < 1 THEN DATE_FORMAT(createAt, '%m-%d %H:%i')
                            WHEN DATEDIFF(CURRENT_DATE, createAt) < 7 THEN CONCAT(DATEDIFF(CURRENT_DATE, createAt), '일 전')
                            WHEN DATEDIFF(CURRENT_DATE, createAt) < 30 THEN CONCAT(FLOOR(DATEDIFF(CURRENT_DATE, createAt) / 7), '주 전')
                            ELSE CONCAT(FLOOR(DATEDIFF(CURRENT_DATE, createAt) / 30), '달 전')
                        END AS createDate
                    FROM tbl_feed_comment C 
                    INNER JOIN tbl_user U ON C.userId = U.userId
                    WHERE feedNo = ?`;
        connection.query(query, [feedNo], (err, results) => {
            if(err) {
                console.error('좋아요 리스트 조회 실패:', err);
                return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
            }
            //console.log(results);
            return res.json({ success: true, message: '좋아요 리스트 조회 완료', list: results });
        });
    })
    .post((req, res) => {
        const { feedNo, loginId, comment } = req.body;
        const query = `INSERT INTO tbl_feed_comment(commentNo, feedNo, userId, commentContents, createAt) VALUES(NULL, ?, ?, ?, NOW())`;

        connection.query(query, [feedNo, loginId, comment], (err, result) => {
            if(err) {
                console.error('댓글 등록 실패:', err);
                return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
            }
            return res.json({ success: true, message: '댓글 등록 완료' });
        });
    })

module.exports = router;