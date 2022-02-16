var router = require('express').Router();   // require : 다른 파일이나 라이브러리를 가져와서 씀

router.get('/sports', function(request, response) {
    response.send('스포츠 게시판');
})

router.get('/game', function(request, response) {
    response.send('게임 게시판');
})

module.exports = router;    // module.exports : 반환값?