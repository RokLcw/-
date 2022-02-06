// navbar (defer 속성 꼭 적용)
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.offsetHeight;
console.log(navbarHeight);
document.addEventListener('scroll', () => {
    if (window.scrollY > navbarHeight) {
        navbar.classList.add('navbar--dark');
    } else {
        navbar.classList.remove('navbar--dark');
    }
});

function night_day(self) {
    var target = document.querySelector('#real_body');
    var array = document.querySelectorAll('#real_body a');
    var i=0;

    var links = {   // 객체
        setcolor : function (color) {   // 객체 속 함수, color 라는 매개변수
            while (array.length > i) {
                array[i].style.color = color;
                i = i + 1;
            };
        }
    }

    var body = {
        setBackground : function (color) {
            target.style.backgroundColor = color;
        },
        setcolor : function (color) {
            target.style.color = color;
        }
    }
    
    if(self.value == 'night') {
        body.setBackground('black');
        body.setcolor('white');
        
        links.setcolor('white');
        self.value = 'day';
    } else {
        body.setBackground('white');
        body.setcolor('black');

        links.setcolor('black');
        self.value = 'night';
    }
}