function tabs(tabsContainerSelector, tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    let tabs = document.querySelectorAll(`${tabsContainerSelector} ${tabsSelector}`),
        tabsContent = document.querySelectorAll(`${tabsContainerSelector} ${tabsContentSelector}`),
        tabsParent = document.querySelector(`${tabsContainerSelector} ${tabsParentSelector}`);

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('flex', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove(activeClass);
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('flex', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add(activeClass);
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', function(event) {
        const target = event.target;
        if(target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
}

function openModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function modal(triggerSelector, closeSelector, modalSelector) {
    const modalTrigger = document.querySelectorAll(triggerSelector),
        modal = document.querySelector(modalSelector);
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector));
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute(closeSelector) == '') {
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });
}

function slider({containerSelector, slideSelector, nextSlideSelector, prevSlideSelector, wrapperSelector, fieldSelector, indicatorsClass, elementsPerPage = 1, elementsPerPageMobile = 1, rowGap = 0, duration = 0, swipe = false}) {
    let slideIndex = 1,
        offset = 0,
        timer = 0,
        perPage = 1,
        gap = 0,
        mobile = window.matchMedia('(max-width: 992px)').matches,
        templates = [],
        mainClass,
        slidesNew,
        dots = [];
    const slides = document.querySelectorAll(slideSelector),
        container = document.querySelector(containerSelector),
        prev = document.querySelector(prevSlideSelector),
        next = document.querySelector(nextSlideSelector),
        wrapper = document.querySelector(wrapperSelector),
        field = document.querySelector(fieldSelector);

    if (indicatorsClass) {
        mainClass = indicatorsClass.split('.')[0].slice(0, -11);
    }

    let baseSlides = slides;
    mobile ? perPage = elementsPerPageMobile : perPage = elementsPerPage;
    mobile ? gap = rowGap / 2 : gap = rowGap;
    perPage == 1 ? gap = 0 : gap = gap;
    let width = Math.floor(deleteNotDigits(window.getComputedStyle(wrapper).width) / perPage - (gap * (slides.length - 1) / slides.length)) + 'px';

    field.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";
    field.style.columnGap = gap + "px";

    slides.forEach((slide, index) => {
        slide.style.width = width;
        templates[index] = slide;
    });

    if (slides.length != perPage) {
        for (let i = 0; i < (perPage - 1); i++) {
            field.append(templates[i + 1].cloneNode(true));
        }
        slidesNew = document.querySelectorAll(slideSelector);
    } else {
        slidesNew = slides;
    }

    changeLicensesSlide(slideIndex);

    if (indicatorsClass) {
        let indicators = document.createElement('div');
        indicators.classList.add(indicatorsClass.split('.')[0]);
        container.append(indicators);

        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('div');
            mobile ? dot.style.width = 100 / slides.length + '%' : dot.style.width = '';
            dot.setAttribute('data-slide-to', i + 1);
            dot.classList.add(`${mainClass}_dot`);
            if (i == 0) {
                dot.classList.add(`${mainClass}_active`);
            }
            indicators.append(dot);
            dots.push(dot);
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideTo = e.target.getAttribute('data-slide-to');
                slideIndex = slideTo;
                offset = (deleteNotDigits(width) + gap) * (slideTo - 1);
                changeLicensesSlide(slideIndex);
                changeActivity();
                makeTimer(duration);
            });
        });
    }

    makeTimer(duration);

    window.addEventListener('resize', (e) => {
        mobile = window.matchMedia('(max-width: 992px)').matches;
        mobile ? perPage = elementsPerPageMobile : perPage = elementsPerPage;
        mobile ? gap = rowGap / 2 : gap = rowGap;
        perPage == 1 ? gap = 0 : gap = gap;
        width = Math.floor(deleteNotDigits(window.getComputedStyle(wrapper).width) / perPage - (gap * (slides.length - 1) / slides.length)) + 'px';
        if (document.querySelector('.catalog_items') != null && width == '0px') {
            let lengths = [];
            let wrappers = document.querySelectorAll('.catalog_item_images');
            wrappers.forEach(wrapper => lengths.push(Math.floor(deleteNotDigits(window.getComputedStyle(wrapper).width))));
            width = Math.max(...lengths) + 'px';
        }
        field.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";
        field.style.columnGap = gap + "px";

        if (slides.length != perPage) {
            while (field.childElementCount > baseSlides.length) {
                field.removeChild(field.lastElementChild)
            }
            for (let i = 0; i < (perPage - 1); i++) {
                field.append(templates[i + 1].cloneNode(true));
            }
        }

        slidesNew = document.querySelectorAll(slideSelector);
        slidesNew.forEach((slide, index) => {
            slide.style.width = width;
        });

        if (indicatorsClass) {
            let dots = document.querySelectorAll(`.${mainClass}_dot`);
            dots.forEach((dot) => {
                mobile ? dot.style.width = 100 / slides.length + '%' : dot.style.width = '';
            });
        }

        slideIndex = 1,
            offset = 0,
            changeLicensesSlide(slideIndex);
        changeActivity();
        onSwipe()
    });
    if (containerSelector.includes('catalog_item_images')) {
        document.querySelector(wrapperSelector).addEventListener("mouseover", () => {
            makeTimer(1500);
        });
        document.querySelector(wrapperSelector).addEventListener("mouseout", () => {
            clearInterval(timer);
        });
    }
    if (nextSlideSelector) {
        next.addEventListener("click", () => {
            moveNext();
            makeTimer(duration);
        });
    }

    if (prevSlideSelector) {
        prev.addEventListener("click", () => {
            movePrev();
            makeTimer(duration);
        });
    }

    function moveNext() {
        field.classList.add('trans-5')
        if (offset >= (deleteNotDigits(width) + gap) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += deleteNotDigits(width) + gap;
        }

        if (slideIndex == slides.length) {
            slideIndex = 1;
            field.classList.remove('trans-5')
        } else {
            slideIndex++;
        }
        changeLicensesSlide(slideIndex);
        changeActivity();
    }

    function movePrev() {
        field.classList.add('trans-5')
        if (offset < deleteNotDigits(width) ) {
            offset = (deleteNotDigits(width) + gap) * (slides.length - 1);
        } else {
            offset -= deleteNotDigits(width) + gap;
        }

        if (slideIndex == 1) {
            slideIndex = slides.length;
            field.classList.remove('trans-5')
        } else {
            slideIndex--;
        }
        changeLicensesSlide(slideIndex);
        changeActivity();
    }

    function changeActivity() {
        field.style.transform = `translateX(-${offset}px)`;
        if (indicatorsClass) {
            dots.forEach(dot => dot.classList.remove(`${mainClass}_active`));
            dots[slideIndex-1].classList.add(`${mainClass}_active`);
        }
    }

    function changeLicensesSlide (index) {
        if (slideSelector.includes('hits')) {
            slidesNew.forEach(slide => {
                slide.classList.remove('main');
            });
            slidesNew[index - 1].classList.add('main');
        }
    }

    function makeTimer(duration){
        if (duration == 0) {
            return;
        }
        clearInterval(timer);
        timer = setInterval(moveNext, duration);
    }

    function deleteNotDigits(str) {
        return +str.replace(/[^\d\.]/g, '');
    }

    let startX;
    let endX;

    const start = (e) => {
        startX = e.pageX || e.touches[0].pageX;
    }

    const end = () => {
        let distance = 20;
        if (containerSelector.includes('novelty')) {
            distance = 150;
        }
        if (endX < startX && Math.abs(startX - endX) > distance) {
            moveNext();
            makeTimer(duration);
        }
        if (endX > startX && Math.abs(endX - startX) > distance) {
            movePrev();
            makeTimer(duration);
        }
    }

    const move = (e) => {
        endX = e.pageX || e.touches[0].pageX;
    }

    onSwipe()

    function onSwipe() {
        field.addEventListener('mousedown', start);
        field.addEventListener('touchstart', start, {passive: true});

        field.addEventListener('mousemove', move);
        field.addEventListener('touchmove', move, {passive: true});

        field.addEventListener('mouseup', end);
        field.addEventListener('touchend', end);

        if (!swipe || !mobile) {
            field.removeEventListener('mousedown', start);
            field.removeEventListener('touchstart', start, {passive: true});

            field.removeEventListener('mousemove', move);
            field.removeEventListener('touchmove', move, {passive: true});

            field.removeEventListener('mouseup', end);
            field.removeEventListener('touchend', end);
        }
    }
}

let images_containers = document.querySelectorAll('.product_images');

images_containers.forEach((container, index) => {
    let product_images = container.querySelectorAll('img');
    let bottom_images = container.querySelectorAll('.product_images_bottom img');

    product_images.forEach(image => {
        image.addEventListener('click', (e) => {
            let zoom = image.getAttribute('alt') == "zoom" ? true : false;
            product_images.forEach((image, id) => {
                if (id == 0 && zoom) {
                    return;
                }
                let src = image.getAttribute('src');
                if (image.getAttribute('alt') == "zoom") {
                    image.setAttribute('data-src', product_images[0].getAttribute('src'));
                } else if (image.getAttribute('video-src')) {
                    image.setAttribute('data-src', image.getAttribute('video-src'));
                } else {
                    image.setAttribute('data-src', src);
                }

                if (zoom) {
                    image.setAttribute('data-fancybox', `product_${index}`);
                } else if (image.getAttribute('video-src')) {
                    image.setAttribute('data-fancybox', `product_video_${index}`);
                } else {
                    image.removeAttribute('data-src');
                    image.removeAttribute('data-fancybox');
                }
            });
        });
    });

    bottom_images.forEach(image => {
        image.addEventListener('click', (e) => {
            if (image.getAttribute('video-src')) {
                return;
            }
            let new_src = image.getAttribute('src');
            let main_image = container.querySelector('.product_images_main img');
            let old_src = main_image.getAttribute('src');
            main_image.setAttribute('src', new_src);
            image.setAttribute('src', old_src);
        });
    });
});

if (document.querySelector('.catalog_dropdown') != null) {
    document.querySelectorAll('.catalog_dropdown_item').forEach(item => {
        item.addEventListener('click', (e) => {
            document.getElementById('catalog_collections').checked = false;
        });
    });
}

if (document.querySelector('.novelty_field') != null) {
    slider({
        containerSelector: '.novelty_container',
        slideSelector: '.catalog_item',
        wrapperSelector: '.novelty_wrapper',
        fieldSelector: '.novelty_field',
        elementsPerPage: 3,
        elementsPerPageMobile: 1,
        indicatorsClass: `novelty_indicators`,
        rowGap: 31,
        swipe: true,
    });
}
if (document.querySelector('.hits_field') != null) {
    slider({
        containerSelector: '.hits_container',
        slideSelector: '.hits_slide',
        wrapperSelector: '.hits_wrapper',
        fieldSelector: '.hits_field',
        elementsPerPage: 4,
        elementsPerPageMobile: 1,
        indicatorsClass: `novelty_indicators`,
        duration: 3000,
        rowGap: 30,
        swipe: true,
    });
}

if (document.querySelector('.catalog_item_field') != null) {
    let catalog_items = document.querySelectorAll('.catalog_item');
    catalog_items.forEach((item, index) => {
        let catalog_tabs = item.querySelectorAll('.catalog_item_field');
        catalog_tabs.forEach((item, tabIndex) => {
            slider({
                containerSelector: `.catalog_item_images.images_${index}${tabIndex}`,
                slideSelector: `.catalog_item_slide.slide_${index}${tabIndex}`,
                wrapperSelector: `.catalog_item_images.images_${index}${tabIndex}`,
                fieldSelector: `.catalog_item_field.field_${index}${tabIndex}`,
                indicatorsClass: `catalog_item_indicators`,
                swipe: true,
            });
        });
        if (catalog_tabs.length > 1) {
            tabs(`.catalog_item.item_${index}`, '.catalog_item_color', `.catalog_item_field.field_${index}`, '.catalog_item_colors', 'catalog_item_color_active');
        }
    })
}

if (document.querySelector('.catalog_items') != null) {
    tabs('.catalog_items', '.catalog_collection', '.catalog_items_wrapper', '.catalog_collections', 'catalog_active');
    tabs('.catalog_items', '.catalog_dropdown_item', '.catalog_items_wrapper', '.catalog_dropdown_items', 'catalog_dropdown_active');
}

if (document.querySelector('.consult') != null) {
    modal('[data-modal]', 'data-close', '.consult');
    modal('[data-thanks]', 'data-close', '.thanks');
}
if (document.querySelector('.product') != null) {
    modal('[data-product]', 'data-close', '.product');
}
if (document.querySelector('.product_images') != null) {
    tabs('.product_wrapper', '.product_descr_color', '.product_images', '.product_descr_colors', 'product_descr_color_active');
}

document.querySelector('.consult_form').addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal('.consult');
    openModal('.thanks');
});

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