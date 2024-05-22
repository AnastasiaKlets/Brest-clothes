$('input[name="phone"]').mask("+375(99)999-99-99");

let prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("navbar").style.top = "0";
    } else {
        document.getElementById("navbar").style.top = "-100px";
    }
    prevScrollpos = currentScrollPos;
}

let btn = document.querySelector('.btn');
let blockHidden = document.querySelector('.block');
function showBlock() {
    if(blockHidden.classList.contains('b-show')){
        blockHidden.classList.remove('b-show');
    }
    else {
        blockHidden.classList.add('b-show');
    }
}
btn.addEventListener('click', showBlock);

