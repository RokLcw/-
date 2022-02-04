function nightDayHandler(self){ // 함수 선언 및 매개변수 전달
    // var target = document.querySelector('body');    // body 태그를 가리키는 변수
    // var alist = document.querySelectorAll('a');
    
    var links = {
        setcolor: function(color) {
            // var alist = document.querySelectorAll('a');
            // var i=0;

            // while (i < alist.length) {
            // alist[i].style.color = color;
            // i = i+1;
            // }

            $('a').css('color', color); // jquery
        }
    }

    var body = {
        setColor: function (color) {
            // document.querySelector('body').style.color = color; 
            $('body').css('color', color);  // jquery
        },
        setBackgroundColor: function (color) {
            // document.querySelector('body').style.backgroundColor = color;
            $('body').css('backgroundColor', color);    // jquery
        }
    }

    if(self.value == 'night') {
        body.setColor('white'); // 객체 사용
        body.setBackgroundColor('black');
        // target.style.backgroundColor='black';    // 속성(?) 사용
        // target.style.color='white';
        self.value = 'day'; // onclick 이벤트가 속해있는 input 태그를 가리킴

        links.setcolor('powderblue');
        // while (i < alist.length) {
        //     alist[i].style.color = 'powderblue';
        //     i = i+1;
        // }
    } else {
        body.setColor('black');
        body.setBackgroundColor('white');
        self.value = 'night';

        links.setcolor('black');
    }
}