import { stylesMain, stylesPopupBox } from '../styles/Popup.css';
import Arrow from './PopupArrow.jsx';
import PopupHistogram from './PopupHistogram.jsx';
import PopupMessage from './PopupMessage.jsx';

const React = require('react');

const Popup = ({
  dir, show, content, rating, numReviews, clickCb,
}) => {
  let popupStyle;
  // console.log(`show: ${show}`);

  if (content === 'ratings') {
    popupStyle = {
      width: '35vmin',
      height: '25vmin',
      left: '-100%',
      marginTop: '0.5vmin',
    };
  } else {
    popupStyle = {
      width: '44vmin',
      height: '9vmin',
      top: '-11vmin',
      left: '-15vmin',
    };
  }

  if (show) {
    popupStyle.display = 'block';
  } else {
    popupStyle.display = 'none';
  }
  // console.log(content);
  // popupStyle.display = 'block';

  return (
    <div
      style={popupStyle}
      className={`${stylesMain} popup${dir}`}
    >

      <Arrow dir={dir} />
      <div className={stylesPopupBox}>
        {
          (content === 'ratings')
            ? <PopupHistogram rating={rating} numReviews={numReviews} />
            : <PopupMessage content={content} clickCb={clickCb} />
        }
      </div>
    </div>
  );
};

export default Popup;
