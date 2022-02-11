// express
const { response } = require('express');
const express = require('express');
const app = express();
// parser (전송값)
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
// ejs
app.set('view engine', 'ejs');
//MongoDB
const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect('',function(error, client) {
    if(error) {return console.log(error)};
    db = client.db('Basic');

    // db.collection('post').insertOne({name : 'LCW', age : 23, _id : 100},function(error, result) {
    //     console.log('저장완료');
    // });

    app.listen(8080, function() {   // 포트번호, 띄운 후 실행할 코드
        console.log('listen on 8080');
    });
});

// app.listen(8080, function() {   // 포트번호, 띄운 후 실행할 코드
//     console.log('listen on 8080');
// });

app.get('/pet', function(request, response) {   // pet이라는 get 요청이 들어오면 아래 코드를 response 해줌
    response.send('<script>alert("펫 용품을 쇼핑할 수 있는 페이지입니다.")</script>');
});

// 함수안에 함수: 콜백함수, 순차적으로 실행하고 싶을때 사용

app.get('/beauty', (request, response) => {   
    response.send('<script>alert("뷰티 용품을 쇼핑할 수 있는 페이지입니다.")</script>');
});

app.get('/', function(request, response) {
    console.log(__dirname);
    response.sendFile(__dirname + '/index.html');
});

app.get('/write', function(request, response) { // 누군가 /write로 접속하면 write.html 파일을 보내준다
    response.sendFile(__dirname + '/write.html');
});

app.post('/add', function(request, response) {
    response.send('전송완료');
    console.log(request.body);
    console.log(request.body.title);
    console.log(request.body.date);

    totalPost = db.collection('counter').findOne({name : '게시물갯수'}, function(error, result) {
        console.log(result.totalPost);
        let 총게시물갯수 = result.totalPost;

        db.collection('post').insertOne({ _id : 총게시물갯수 + 1, title : request.body.title, date : request.body.date}, function(error, result) {
            console.log('저장완료');
            db.collection('counter').updateOne({name : '게시물갯수'}, { $inc: {totalPost : 1}}, function(error, result) {
                // $inc: {totalPost : 1}} : inc: 증가시켜주는 operator
                // callback 함수는 순차적으로 실행시키고 싶을 때 사용
                if(error) {
                    return console.log(error);
                }
            });
            // db.collection('counter').updateOne({name : '게시물갯수'}, { $inc: {totalPost : 1}}) 
            // 이렇게 축약해서 사용도 가능
        });
        // auto increment
    });
});

// name 속성: form 데이터를 서버로 전송하고 싶으면 꼭 name 속성으로 이름지정

app.get('/list', function(request, response) {
    db.collection('post').find().toArray(function(error, result) {
        // console.log(result);
        response.render('list.ejs', {posts : result});    // node에서 ejs를 쓰고 싶다면 views 폴더안에 ejs 파일을 넣어야 함
    });
});

app.delete('/delete', function(request, response) {
    console.log(request.body);
    request.body._id = parseInt(request.body._id); // 정수변환
    db.collection('post').deleteOne(request.body, function(error, result){
        console.log('삭제완료');
    });
});