const express = require('express');
const router = express.Router();
const connection = require('../db');

router.get("/", (req, res) => {
    const query = 'SELECT * FROM TBL_FEED';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('피드 조회 실패:', err);
            return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
        }
        return res.json({ success: true, list: results });
    });
});

module.exports = router;