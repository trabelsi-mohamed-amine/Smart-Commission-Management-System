import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './Carousel.css';

const Carousel = () => {
  const slides = [
    {
      img: '/img/smart.png',
      subtitle: 'Meeting & Commission Management',
      title: 'The Best Solution for Meeting Management',
      text: 'Efficiently manage meetings with SmartMeet - your complete solution for planning, commission management, and report generation.',
      buttons: [
        { text: 'Read More', url: '/about', variant: 'primary' },
        { text: 'Contact Us', url: '/contact', variant: 'outline' }
      ]
    },
    {
      img: '/img/smart.png',
      subtitle: 'Streamline Your Meetings & Commission Tasks',
      title: 'Simplifying Meeting & Commission Organization',
      text: 'Streamline your meeting process with SmartMeet - the all-in-one solution for scheduling, commission oversight, and seamless report creation.',
      buttons: [
        { text: 'Get Started', url: '/login', variant: 'primary' },
      ]
    },
  ];

  return (
    <div className="carousel-container position-relative">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        autoplay={{ 
          delay: 5000,
          disableOnInteraction: false 
        }}
        loop
        speed={1000}
        effect="fade"
        className="mySwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div 
              className="carousel-slide position-relative"              style={{ 
                background: `url(${slide.img})`,
                height: '80vh',
                minHeight: '500px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div className="container h-100 d-flex align-items-center">
                <div className="text-white carousel-content">
                  <h5 className="text-uppercase mb-3 carousel-subtitle">
                    {slide.subtitle}
                  </h5>
                  <h1 className="display-4 mb-4 carousel-title">
                    {slide.title}
                  </h1>
                  <p className="fs-5 mb-5 carousel-text">{slide.text}</p>
                  <div className="d-flex gap-3 carousel-buttons">
                    {slide.buttons.map((button, btnIndex) => (
                      <a
                        key={btnIndex}
                        href={button.url}
                        className={`btn btn-${button.variant} py-3 px-4 rounded-pill carousel-button`}
                      >
                        {button.text}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom navigation buttons */}
      <div className="swiper-button-next"></div>
      <div className="swiper-button-prev"></div>
      
      {/* Animated waves at bottom */}
      <div className="position-absolute bottom-0 start-0 w-100 overflow-hidden">
        <svg 
          viewBox="0 0 500 150" 
          preserveAspectRatio="none" 
          className="carousel-wave"
        >
          <path 
            d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" 
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Carousel;