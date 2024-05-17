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
	let width = Math.floor(deleteNotDigits(window.getComputedStyle(wrapper).width)) / perPage + 'px';

    field.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";

    slides.forEach((slide, index) => {
		slide.style.width = width;
        if (index != 0) {
            if (mobile) {
                slide.style.paddingLeft = rowGap / 2 + 'px';
            } else {
                slide.style.paddingLeft = rowGap + 'px';
            }
        }
        templates[index] = slide;
	});

    for (let i = 0; i < (perPage - 1); i++) {
        if (slideSelector.includes('licenses')) {
            field.append(templates[i].cloneNode(true));
        } else {
            field.append(templates[i + 1].cloneNode(true));
        }
    }
    slidesNew = document.querySelectorAll(slideSelector);

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
                offset = deleteNotDigits(width) * (slideTo - 1);
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
        width = Math.floor(deleteNotDigits(window.getComputedStyle(wrapper).width) / perPage) + 'px';
        if (document.querySelector('.catalog_items') != null && width == '0px') {
            let lengths = [];
            let wrappers = document.querySelectorAll('.catalog_item_images');
            wrappers.forEach(wrapper => lengths.push(Math.floor(deleteNotDigits(window.getComputedStyle(wrapper).width))));
            width = Math.max(...lengths) + 'px';
        }
        field.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";

        while (field.childElementCount > baseSlides.length) {
            field.removeChild(field.lastElementChild)
        }
        for (let i = 0; i < (perPage - 1); i++) {
            field.append(templates[i + 1].cloneNode(true));
        }

        slidesNew = document.querySelectorAll(slideSelector);
        slidesNew.forEach((slide, index) => {
            slide.style.width = width;
            if (index != 0) {
                if (mobile) {
                    slide.style.paddingLeft = rowGap / 2 + 'px';
                } else {
                    slide.style.paddingLeft = rowGap + 'px';
                }
            }
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
    }); 

    document.querySelector(wrapperSelector).addEventListener("mouseover", () => {
        makeTimer(1500);
    });
    document.querySelector(wrapperSelector).addEventListener("mouseout", () => {
        clearInterval(timer);
    });

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
        if (!slideSelector.includes('assortment')) {
            field.classList.add('trans-5')
        }
        if (offset == deleteNotDigits(width) * (slides.length - 1)) {
			offset = 0;
		} else {
			offset += deleteNotDigits(width);
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
        if (!slideSelector.includes('assortment')) {
            field.classList.add('trans-5')
        }
        if (offset == 0) {
			offset = deleteNotDigits(width) * (slides.length - 1);
		} else {
			offset -= deleteNotDigits(width);
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
        if (slideSelector.includes('licenses')) {
            slidesNew.forEach(slide => {
                slide.firstElementChild.classList.remove('absolute');
                slide.style.height = '';
            });
            if (!mobile) {
                slidesNew[index].style.height = '400px';
                slidesNew[index].firstElementChild.classList.add('absolute');
            }
        }
        if (slideSelector.includes('monthly') || slideSelector.includes('assortment')) {
            slidesNew.forEach(slide => {
                slide.classList.remove('main');
                slide.lastElementChild.classList.remove('show');
            });
            slidesNew[index - 1].classList.add('main');
            slidesNew[index - 1].lastElementChild.classList.add('show');
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

    if (swipe) {
        let startX;
        let endX;

        const start = (e) => {
            startX = e.pageX || e.touches[0].pageX;	
        }

        const end = () => {
            if (endX < startX) {
                moveNext();
                makeTimer(duration);
            }  
            if (endX > startX) {
                movePrev();
                makeTimer(duration);
            }
        }

        const move = (e) => {
            endX = e.pageX || e.touches[0].pageX;
        }

        field.addEventListener('mousedown', start);
        field.addEventListener('touchstart', start, {passive: true});

        field.addEventListener('mousemove', move);
        field.addEventListener('touchmove', move, {passive: true});

        field.addEventListener('mouseup', end);
        field.addEventListener('touchend', end);
    }
}

if (document.querySelector('.catalog_dropdown') != null) {
    document.querySelectorAll('.catalog_dropdown_item').forEach(item => {
        item.addEventListener('click', (e) => {
            document.getElementById('catalog_collections').checked = false;
        });
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

document.querySelector('.consult_form').addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal('.consult');
    openModal('.thanks');
});
