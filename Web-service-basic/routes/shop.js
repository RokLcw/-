var router = require('express').Router();   // require : 다른 파일이나 라이브러리를 가져와서 씀

function 로그인했니(request, response, next) {
    console.log(request.user);
    if(request.user) {  // request.user: 로그인 후 세션이 있으면 requset.user가 항상 있음.
        next()
    } else {
        response.send('로그인안하셨는데요?')
    }
}

router.use(로그인했니); // 전역 미들웨어
// router.use('shirts', 로그인했니); // shirts에 접속할때만 적용되는 전역 미들웨어

router.get('/shirts', function(request, response) {
    response.send('셔츠파는 페이지입니다.');
});

router.get('/pants', function(request, response) {
    response.send('바지파는 페이지입니다.');
})

module.exports = router;    // module.exports : 반환값?