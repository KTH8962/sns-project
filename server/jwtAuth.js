const jwt = require('jsonwebtoken');

const jwtAuthentication = (req, res, next) => {
    //console.log(req.headers.token);
    const token = req.headers.token;
    if(!token) {
        return res.json({ success: false, message: "로그인 후 이용해주세요."});
    }
    jwt.verify(token, "asdasd123asdasd123", (err, user) => {
        if(err) {
            return res.json({ success: false, message: "토근이 유효하지 않습니다."});
        }
        next();
    });
};

module.exports = jwtAuthentication;