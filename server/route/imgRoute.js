const express = require('express');
const path = require('path');
const router = express.Router();

// 'img' 폴더를 정적 파일 제공 폴더로 설정
router.use('/', express.static(path.join(__dirname, '../img')));



module.exports = router;