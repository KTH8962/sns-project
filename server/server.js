const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json()); 
app.use(cors({origin : "http://localhost:3000"}));
app.use('/user', require('./route/userRoute'));
app.use('/feed', require('./route/feedRoute'));
app.use('/img', require('./route/imgRoute'));

const port = 3100; //node 서버가 사용할 포트 번호, 리액트의 포트번호(3000)와 충돌하지 않게 다른 번호로 할당
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})