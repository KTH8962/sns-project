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
      cb(null, 'img/profile'); // 서버 내 img 폴더
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
        const loginId = req.query.loginId;
        const query = `SELECT userNickName, userProfilePath, feedCnt
                        FROM tbl_user U
                        LEFT JOIN (
                            SELECT COUNT(userId) AS feedCnt, userId
                            from tbl_feed
                            GROUP BY userId
                        ) F ON U.userId = F.userId
                        WHERE U.userId = ?`;
        const query2 = `SELECT F.feedNo, I.imgPath, I.imgCnt, IFNULL(L.favoriteCnt, 0) AS favoriteCnt, IFNULL(C.commentCnt, 0) AS commentCnt
                        FROM tbl_feed F
                        INNER JOIN (
                            SELECT *
                            FROM (
                                SELECT ROW_NUMBER() OVER (PARTITION BY feedNo ORDER BY imgPath) AS RM, I.feedNo, imgPath, imgCnt
                                FROM tbl_feed_img I
                                INNER JOIN (
                                    SELECT COUNT(feedNo) AS imgCnt, feedNo
                                    FROM tbl_feed_img
                                    GROUP BY feedNo
                                ) I2 ON I.feedNo = I2.feedNo
                            ) AS T WHERE RM = 1
                        ) I ON F.feedNo = I.feedNo
                        LEFT JOIN (
                            SELECT COUNT(feedNo) AS favoriteCnt, feedNo
                            FROM tbl_favorite
                            GROUP BY feedNo
                        ) L ON F.feedNo = L.feedNo
                        LEFT JOIN (
                            SELECT COUNT(feedNo) AS commentCnt, feedNo
                            FROM tbl_feed_comment
                            GROUP BY feedNo
                        ) C ON F.feedNo = C.feedNo
                        WHERE F.userId = ?
                        ORDER BY F.feedNO DESC`;
        connection.query(query, [loginId], (err, result) => {
            if(err) {
                console.error('프로필 조회 실패:', err);
                return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
            }
            connection.query(query2, [loginId], (err, results) => {
                if(err) {
                    console.error('피드 조회 실패:', err);
                    return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
                }
                return res.json({ success: true, message: '조회 완료 되었습니다.', list: results, profile: result[0]});
            })
        });
    });

router.route('/view')
    .get((req, res) => {
        const feedNo = req.query.feedNo;
        const query = `SELECT F.feedNo, F.feedContents, F.feedSearch, F.createAt, C.commentNo, C.userId, C.commentContents, L.favoriteCnt, U.userNickName, U.userProfilePath,
                        GROUP_CONCAT(I.imgName SEPARATOR ',') AS imgName,
                        GROUP_CONCAT(I.imgPath SEPARATOR ',') AS imgPath,
                        CASE 
                            WHEN DATEDIFF(CURRENT_DATE, C.createAt) < 1 THEN DATE_FORMAT(C.createAt, '%m-%d %H:%i')
                            WHEN DATEDIFF(CURRENT_DATE, C.createAt) < 7 THEN CONCAT(DATEDIFF(CURRENT_DATE, C.createAt), '일 전')
                            WHEN DATEDIFF(CURRENT_DATE, C.createAt) < 30 THEN CONCAT(FLOOR(DATEDIFF(CURRENT_DATE, C.createAt) / 7), '주 전')
                            ELSE CONCAT(FLOOR(DATEDIFF(CURRENT_DATE, C.createAt) / 30), '달 전')
                        END AS createDate
                        FROM tbl_feed F
                        LEFT JOIN tbl_feed_img I ON F.feedNo = I.feedNo
                        LEFT JOIN tbl_feed_comment C ON F.feedNo = C.feedNo
                        LEFT JOIN (
                            SELECT COUNT(feedNo) AS favoriteCnt, feedNo
                            FROM tbl_favorite
                            GROUP BY feedNo
                        ) L ON F.feedNo = L.feedNo
                        LEFT JOIN tbl_user U ON U.userId = C.userId
                        WHERE F.feedNo = ?
                        GROUP BY F.feedNo, F.feedContents, F.feedSearch, F.createAt, C.commentNo, C.userId, C.commentContents, L.favoriteCnt, U.userNickName, U.userProfilePath, C.createAt`;

        connection.query(query, [feedNo], (err, results) => {
            if(err) {
                console.error('피드 조회 실패:', err);
                return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
            }
            res.json({ success: true, message: '조회 완료 되었습니다.', list: results, feed: results[0]});
        });
    });

router.route('/insert')   
    .post(upload.array('images'), (req, res) => {
        const { id } = req.body;
        console.log(req.body);
        const query = `UPDATE tbl_user SET userProfilePath = ? WHERE userId = ?`;

        const files = req.files;
        if (!files || files.length === 0) {
            return res.json({ success: false, message: "파일이 업로드되지 않았습니다." });
        }
        const filePath = req.files[0].path;
        
        //const imgData = files.map(file => [null, file.filename, file.path]);
        //console.log(files);
        connection.query(query, [filePath, id], async (err, feedResult) => {
            if(err) {
                console.error('피드 업로드 실패:', err);
                return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
            }
            return res.json({ success: true, message: "프로필 변경 되었습니다!" });
        });

        //     const imgQuery = 'INSERT INTO tbl_feed_img(imgNo, feedNo, imgName, imgPath, createAt) VALUES ?';
        //     connection.query(imgQuery, [imgData], (err, imgResult) => {
        //         if (err) {
        //         console.error('이미지 저장 실패:', err);
        //             return res.status(500).json({ success: false, message: "이미지 저장 실패" });
        //         }
        //         res.json({ success: true, message: "피드 및 파일이 성공적으로 저장되었습니다!" });
        //     });
        // });
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