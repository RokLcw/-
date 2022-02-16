// express
const { response, request } = require('express');
const express = require('express');
const app = express();
// parser (전송값)
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
//method-override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
// passport (session)
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const { ConnectionCheckedInEvent } = require('mongodb');
app.use(session({secret : '비밀코드', resave : true, saveUninitialized : false}));
app.use(passport.initialize());
app.use(passport.session());    // 미들웨어: 요청과 응답 중간에 뭔가 실행되는 코드
// multer
let multer = require('multer');
// dotenv
require('dotenv').config()
// ejs
app.set('view engine', 'ejs');
//MongoDB
const MongoClient = require('mongodb').MongoClient;

app.use('/public', express.static('public'));   // 미들웨어?

var db;
MongoClient.connect (process.env.DB_URL,function(error, client) {
    if(error) {return console.log(error)};
    db = client.db('Basic');

    // db.collection('post').insertOne({name : 'LCW', age : 23, _id : 100},function(error, result) {
    //     console.log('저장완료');
    // });

    app.listen(process.env.PORT, function() {   // 포트번호, 띄운 후 실행할 코드
        console.log('listen on 8080');
    });
});

// app.listen(8080, function() {   // 포트번호, 띄운 후 실행할 코드
//     console.log('listen on 8080');
// });

// app.get('/pet', function(request, response) {   // pet이라는 get 요청이 들어오면 아래 코드를 response 해줌
//     response.send('<script>alert("펫 용품을 쇼핑할 수 있는 페이지입니다.")</script>');
// });

// // 함수안에 함수: 콜백함수, 순차적으로 실행하고 싶을때 사용

// app.get('/beauty', (request, response) => {   
//     response.send('<script>alert("뷰티 용품을 쇼핑할 수 있는 페이지입니다.")</script>');
// });

app.get('/', function(request, response) {
    console.log(__dirname);
    response.render('index.ejs');
});

app.get('/write', function(request, response) { // 누군가 /write로 접속하면 write.html 파일을 보내준다
    // response.sendFile(__dirname + '/write.html');
    response.render('write.ejs')
});

app.post('/add', function(request, response) {
    response.send('전송완료');
    console.log(request.body);
    console.log(request.body.title);
    console.log(request.body.date);

    db.collection('counter').findOne({name : '게시물갯수'}, function(error, result) {
        console.log(result);
        console.log(result.totalPost);
        let 총게시물갯수 = result.totalPost;
        let 저장할거 = { _id : 총게시물갯수 + 1, title : request.body.title, date : request.body.date, writer : request.user.id};   // request.user.id: 유저의 id 정보를 불러옴 (세션때문에 가능한듯?)

        db.collection('post').insertOne(저장할거, function(error, result) {
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
    // console.log(request.body);
    // request.body._id = parseInt(request.body._id); // 정수변환

    var 삭제할데이터 = {_id : request.body._id, writer : request.user.id}
    db.collection('post').deleteOne(삭제할데이터, function(error, result){
        console.log('삭제완료');
        response.status(200).send({message : '성공했습니다'});   // 응답코드 & 메세지
    });
});

app.get('/detail/:id', function(request, response) { // 어떤놈이 detail/어쩌구로 get 요청을 하면~ (url 파라미터(:id) 이용)
    db.collection('post').findOne({_id : parseInt(request.params.id)}, function(error, result){   // findOne({_id : request.params.id} : url의 파라미터중 id라는 이름을 가진 값
        console.log(result);
        response.render('detail.ejs', {data : result});  // 해석필요 (detail.ejs 파일에 data:result 객체를 보내주세요)
    });
});

app.get('/edit/:id', function(request, response) {
    db.collection('post').findOne({_id : parseInt(request.params.id)}, function(error, result){
        response.render('edit.ejs', {editData : result});
    })
});

app.put('/edit', function(request, response) {
    db.collection('post').updateOne({_id : parseInt(request.body.id)}, {$set : {title : request.body.title, date : request.body.date}}, function(error, result) {
        if(error) {
            return console.log(error);
        }
        console.log('수정완료');
        response.redirect('/list');
    })
})

app.get('/login', function(request, response) {
    response.render('login.ejs');
});

app.post('/login', passport.authenticate('local', { // local 이라는 방식으로 인증, 미들웨어 사용, 미들웨어(id, 비번 검사)가 통과되면 function이 실행됨
    failureRedirect : '/fail'   // 실패하면 fail 경로로 이동
}), function(request, response) {
    response.redirect('/'); // 로그인 성공하면 redirect
});

app.get('/mypage', 로그인했니, function(request, response) {    // 로그인했니 : 미들웨어
    console.log(request.user);
    response.render('mypage.ejs', { 사용자: request.user })
});

function 로그인했니(request, response, next) {
    console.log(request.user);
    if(request.user) {  // request.user: 로그인 후 세션이 있으면 requset.user가 항상 있음.
        next()
    } else {
        response.send('로그인안하셨는데요?')
    }
}


passport.use(new LocalStrategy({    // LocalStrategy 인증 방식
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
  }, function (입력한아이디, 입력한비번, done) {
    console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
      if (에러) return done(에러)
  
      if (!결과) return done(null, false, { message: '존재하지않는 아이디요' }) // done(서버에러, 성공시사용자DB데이터, 에러메세지)
      if (입력한비번 == 결과.pw) {
        return done(null, 결과)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
}));

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(아이디, done) {
    db.collection('login').findOne({ id: 아이디 }, function (error, result) {
        done(null, result)
    })
})

app.get('/search', (request, response) => {
    var 검색조건 = [
        {
            $search: {
                index: 'titleSearch',
                text: {
                  query: request.query.value,   // 검색어
                  path: 'title'  // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
                }
              }
        },
        { $sort : { _id : 1 } },    // 오름차순 정렬
        { $limit : 10 },    // 최대로 가져올 데이터
        { $project : { title : 1, _id : 0, score: {$meta: "searchScore"}} }    // 내가 원하는 데이터만 보여주고 싶을때 사용
    ];
    console.log(request.query.value); // 쿼리스트링 데이터
    // request.body -> FORM 태그 POST 데이터
    db.collection('post').aggregate(검색조건).toArray( function (error, result) {
        console.log(result);
        response.render('search.ejs', { search: result })
    });
});
// aggregate: 조건을 여러개 둘 수 있음

app.post('/register', function(request, response) { // 이런걸 라우팅이라고 함, 코드는 라우트

    db.collection('login').findOne({id : request.body.id}, function(error, result) {
        if(!result) {
            db.collection('login').insertOne({ id : request.body.id, pw : request.body.pw}, function(error, result) {
                response.send('회원가입 완료.');
            })
        } else {
            response.send('이미 있는 아이디요.');
        }
    })
});

app.use('/shop', require('./routes/shop.js'))   // 누군가 / 경로로 요청하면 오른쪽 파라미터 값(미들웨어, 라우터)을 적용해주세요.

app.use('/board/sub', require('./routes/board.js'));

var storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, './public/image')
    },
    filename : function(req, file, cb) {
        cb(null, file.originalname) // cb(null, file.originalname + '날짜') 이런식으로도 가능
    },
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('PNG, JPG만 업로드하세요'))
        }
        callback(null, true)
    },
    limits:{
        fileSize: 1024 * 1024
    }
})

var upload = multer({storage : storage});

app.get('/upload', function(request, response) {
    response.render('upload.ejs')
})

app.post('/upload', upload.single('profile'), function(request, response) { // 여러개 업로드 : upload.array('', 최대개수) -> form 태그도 수정 필요 / single('input의 name 속성값)
    response.send('업로드 완료');
});

app.get('/image/:imageName', function(request, response) {
    response.sendFile(__dirname + '/public/image/' + request.params.imageName);
})

app.post('/chatting', function(request, response) {
    let day = new Date();

    db.collection('counter').findOne({name : '채팅갯수'}, function(error, result) {
        let 총채팅방갯수 = result.totalChat;

        let 저장할거 = {member : [request.body.writer, request.user.id], date : day, title : '채팅방' + String(총채팅방갯수)};

        db.collection('chatroom').insertOne(저장할거, function(error, result) {
            console.log('추가완료');
            db.collection('counter').updateOne({name : '채팅갯수'}, { $inc: {totalChat : 1}}, function(error, result) {
            })
        })
    })
})

app.get('/chat', function(request, response) {

    db.collection('chatroom').find({member : request.user.id}).toArray( function(error, result) {
        response.render('chat.ejs', {chatList : result});
    })
})