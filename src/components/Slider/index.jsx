import React from 'react';
import Slide from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Slider({ data }) {
  // const [slider, setSlider] = useState(null);
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
  };

  // const play = () => {
  //   slider.slickPlay();
  // };

  // const pause = () => {
  //   slider.slickPause();
  // };
  return (
    <div className="row col-sm-12 px-0">
      <label style={{ textAlign: 'center' }} htmlFor="slide">
        NEWS
      </label>
      <Slide id="slide" {...settings}>
        {data.map((item) => (
          <img
            style={{ height: 50 }}
            src={item.images[0].url}
            alt={item.name}
          />
        ))}
      </Slide>

      {/* <div style={{ textAlign: 'center' }}>
        <button className="button" onClick={play}>
          Play
        </button>
        <button className="button" onClick={pause}>
          Pause
        </button>
      </div> */}
    </div>
  );
}

export default Slider;
