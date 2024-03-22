import { useState, useEffect } from 'react';
import './carousel.scss';
import { useTranslation } from 'react-i18next';

export const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [timer, setTimer] = useState(null);
  const { t } = useTranslation();

  const images = [
    'https://cdn.chotot.com/admincentre/1TJBfw07vIEUSPGyd90uAoMZJypUK4dVG1AQLK3XIak/preset:raw/plain/429d11f453939a67bda41fc67bfdab94-2863323975732322441.jpg',
    'https://cdn.chotot.com/admincentre/io-GtFL8wLcKnU7X6yMrfXk00RLrLoBJYUlut8shtyQ/preset:raw/plain/96bcfe1cc4669461c77550934d16ec3b-2840707957964015892.jpg',
    'https://cdn.chotot.com/admincentre/n7qtGDKACkBUcIBngZ8k6UTViVhsvmUdNsUnxzxGZGU/preset:raw/plain/535ac1ee75274be158be148cdae80735-2862504091815441220.jpg'
  ];
  const icon = [
    {
      img: 'https://lighthouse.chotot.com/_next/image?url=https%3A%2F%2Fcdn.chotot.com%2Fadmincentre%2FYAZT-yk1q6NsX00pyCMCkztFxEX1LT9OW2G1B8WlaXk%2Fpreset%3Araw%2Fplain%2Fae798f4ba155d2c9f30d555b77a526b6-2853893244263399934.jpg&w=256&q=95 1x',
      text: t('carousel.sellPhone')
    },
    {
      img: 'https://lighthouse.chotot.com/_next/image?url=https%3A%2F%2Fcdn.chotot.com%2Fadmincentre%2FvmzgXwahsyAR3yqOFOxlC4I54sBtGC8KeSqPhnVqo3M%2Fpreset%3Araw%2Fplain%2Fea30aa00d4c36d21a6d56fe745397327-2741458954087890671.jpg&w=256&q=95 1x',
      text: t('carousel.TopUp')
    },
    {
      img: 'https://lighthouse.chotot.com/_next/image?url=https%3A%2F%2Fcdn.chotot.com%2Fadmincentre%2FTIuAGrBq3aKlyK_5A6rZF6W9TpYYcYrkCMX8qao5jYY%2Fpreset%3Araw%2Fplain%2F508bf25ad611db4034fa5dfde0fe8a73-2741458967710030990.jpg&w=256&q=95',
      text: t('carousel.Voucher')
    },
    {
      img: 'https://lighthouse.chotot.com/_next/image?url=https%3A%2F%2Fcdn.chotot.com%2Fadmincentre%2Fpu3VBwfaHY7VoKkMMkZjYA1tKHBZtt8GDpIYaJgrweU%2Fpreset%3Araw%2Fplain%2Fd5647aa85eaa65381b0a8032499cb915-2815961809231084449.jpg&w=256&q=95',
      text: t('carousel.SellCar')
    },
    {
      img: 'https://lighthouse.chotot.com/_next/image?url=https%3A%2F%2Fcdn.chotot.com%2Fadmincentre%2FlRml-H3PO0o270WLS26nv9eNs5TDVVfiuSVsHXENpIc%2Fpreset%3Araw%2Fplain%2F425fc9c8bdb4d028d8cc52628fbd047d-2804905330699599227.jpg&w=256&q=95',
      text: t('carousel.Premium')
    },
    {
      img: 'https://lighthouse.chotot.com/_next/image?url=https%3A%2F%2Fcdn.chotot.com%2Fadmincentre%2FPeH_Zz-8hDT7yZ8F2Mm-BI4p7HWGasDhgq8I_7xdXyk%2Fpreset%3Araw%2Fplain%2Fe16cec7ca2ff9d7649268427ea9c1e4e-2741458979427623023.jpg&w=256&q=95',
      text: t('carousel.News')
    },
    {
      img: 'https://lighthouse.chotot.com/_next/image?url=https%3A%2F%2Fcdn.chotot.com%2Fadmincentre%2FBJ2sRQGytbTbBoxCqR3juzBaObXNvsJz9Q9KC8O73gQ%2Fpreset%3Araw%2Fplain%2F930641d458c0e05889f865e35a0edefb-2763757223248164734.jpg&w=256&q=95',
      text: t('carousel.PostNews')
    },
    {
      img: 'https://lighthouse.chotot.com/_next/image?url=https%3A%2F%2Fcdn.chotot.com%2Fadmincentre%2FSDwFNRG5QRbMeZWWAa4zI7AL6eJdnzO8P6H_1DxTi4I%2Fpreset%3Araw%2Fplain%2Fc7ae341fb3dad555452cb23a8b903275-2741458990797599981.jpg&w=256&q=95',
      text: t('carousel.savedNews')
    }
  ]
  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleHover = () => {
    setIsHovered((prevState) => !prevState);
  };

  useEffect(() => {
    if (!isHovered) {
      setTimer(
        setInterval(() => {
          goToNextSlide();
        }, 3000)
      );
    } else {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isHovered]);

  return (
    <div className='carousel_box'>
      <div className='carousel_app'>
        <div
          className="carousel"
          style={{ width: '80%', height: '640px' }}
          onMouseEnter={handleHover}
          onMouseLeave={handleHover}
        >
          <img src={images[currentIndex]} alt="carousel slide" />

          {isHovered && (
            <div className="navigation">
              <button type="button" className="btn " onClick={goToPrevSlide}><ion-icon name="chevron-back-outline"></ion-icon></button>
              <button type="button" className="btn " onClick={goToNextSlide}><ion-icon name="chevron-forward-outline"></ion-icon></button>
            </div>
          )}

          <div className="mydots">
            {images.map((image, index) => (
              <span
                key={`${index}${image}`}
                className={index === currentIndex ? 'active' : ''}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
        </div>
        <img className='img_right' src='https://lh3.googleusercontent.com/11qEIhgD-IaHR-nw0yJ8hdOGvbzHCO0EXJ8dCoHJ_F7hNKm_Ew8TCbZsChiBIiDKtsBAugPOUeGic0iGWLV6LBIXXmLYqFZe=w300-rw'></img>
      </div>
      <div className='menu'>
        {icon.map((item) => {
          return <div className='menu_item' key={Math.random() * Date.now()}>
            <img src={item.img}></img>
            <p>{item.text}</p>
          </div>
        })}
      </div>
    </div>
  );
};

