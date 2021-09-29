const responsive = {
    mobile: {
        breakpoint: {
            max: 464,
            min: 0,
        },
        items: 1,
        partialVisibilityGutter: 30,
    },
    tablet: {
        breakpoint: {
            max: 1024,
            min: 464,
        },
        items: 1,
        partialVisibilityGutter: 30,
    },
};

export const carouselOptions = {
    infinite: true,
    deviceType: 'mobile',
    responsive,
    additionalTransform: 0,
    arrows: true,
    autoPlaySpeed: 3000,
    centerMode: true,
    className: '',
    containerClass: 'container',
    dotListClass: '',
    draggable: true,
    focusOnSelect: false,
    itemClass: '',
    keyBoardControl: true,
    minimumTouchDrag: 80,
    renderButtonGroupOutside: false,
    renderDotsOutside: false,
    showDots: false,
    sliderClass: '',
    slidesToSlide: 1,
    swipeable: false,
};
