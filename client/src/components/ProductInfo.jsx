import Rating from './Rating.jsx';
import Countdown from './Countdown.jsx';
import SelectorDropdown from './SelectorDropdown.jsx';
import SelectorImage from './SelectorImage.jsx';
import DescBullet from './DescBullet.jsx';
import styles from '../styles/ProductInfo.css';
import {addCommas, renderPrice, savedPercent} from './ProductInfo.js';

const React = require('react');

const {
  styleMain,
  styleTitleBlock,
  styleProductName,
  styleSeller,
  styleSellerName,
  styleRatingsAverage,
  styleRatingsCount,
  styleSubhedPipe,
  styleQuestionsCount,
  styleAmazonsChoice,
  styleAmazonsChoiceOrange,
  styleAmazonsChoiceTriangle,
  styleAvailable,
  styleUnavailable,
  stylePriceLabel,
  stylePrice,
  styleListPrice,
  styleYouSave,
  styleFreeShipping,
  styleSale,
  styleDescription,
  styleCompare,
  styleUsed,
  styleUsedBold,
} = styles;


// here i had functions addCommas and rednerPrice

const ProductInfo = (props) => {
  const {
    data, timeLeft, imageCb, selectedVariation
  } = props;

  const {
    amazonsChoice, available, categoryName, curSelect, description, freeReturns,
    freeShipping, id, hasCountdown, images, price, priceList, productName,
    questionsCount, ratingsAverage, ratingsCount, sellerName, soldByName,
    usedCount, usedPrice
  } = data;

  return (
    <div className={styleMain}>

      <div className={styleTitleBlock}>
        <h3 className={styleProductName}>{productName}</h3>
        <div className={styleSeller}>
          by&nbsp;
          <a className={styleSellerName} href="http://hackreactor.com">
            {sellerName}
          </a>
        </div>

        <Rating
          className={styleRatingsAverage}
          rating={Math.round(ratingsAverage * 10) / 10}
          numReviews={ratingsCount}
        />

        {ratingsCount
          ? (
            <a className={styleRatingsCount} href="http://hackreactor.com">
              {addCommas(ratingsCount)}
              &nbsp;customer&nbsp;
              {ratingsCount === 1 ? 'review' : 'reviews'}
            </a>
          )
          : ''
        }

        {ratingsCount && questionsCount ? <span className={styleSubhedPipe}>|</span> : ''}

        {questionsCount ? (
          <a className={styleQuestionsCount} href="http://hackreactor.com">
            {addCommas(questionsCount)}
            &nbsp;answered&nbsp;
            {questionsCount === 1 ? 'question' : 'questions'}
          </a>)
          : ''
        }

        {amazonsChoice ? (
          <div>
            <div className={styleAmazonsChoice}>
              Amazon&apos;s&nbsp;
              <span className={styleAmazonsChoiceOrange}>Choice</span>
            </div>
          </div>)
          : ''
        }

      </div>


      <table>
        <tbody>
          {priceList ? (
            <tr>
              <td className={stylePriceLabel}>List Price: </td>
              <td className={styleListPrice}>{renderPrice(priceList)}</td>
            </tr>)
            : (<tr><td /></tr>)}

          {price ? (
            <tr>
              <td className={stylePriceLabel}>Price: </td>
              <td className={stylePrice}>{renderPrice(price)}</td>
            </tr>)
            : (<tr><td /></tr>)}

          {priceList && price ? (
            <tr>
              <td className={stylePriceLabel}>You Save: </td>
              <td className={styleYouSave}>
                {renderPrice((priceList - price))}
                &nbsp;(
                {savedPercent(priceList, price)}
                %)
              </td>
            </tr>)
            : <tr><td /></tr>}
        </tbody>
      </table>

      {available
        ? (<div className={styleAvailable}>In Stock.</div>)
        : (<div className={styleUnavailable}>Out of Stock.</div>)
      }

      {hasCountdown && available
        ? (<Countdown timeLeft={timeLeft} />)
        : ''
      }

      {/* dropdown size selector */}
      {data.images && data.images.size && available
        ? (
          <SelectorDropdown
            images={data.images.size}
            cb={props.dropdownCb}
          />
        )
        : ''
      }

      {/* image color selector */}
      {data.images && data.images.color && available
        ? (
          <SelectorImage
            images={data.images.color}
            cb={imageCb}
            selectedVariation={selectedVariation}
          />
        )
        : ''
      }

      {/* {sale ? "ON SALE" : ''} */}

      <ul className={styleDescription}>
        {/* convert \n-separated text to bulleted list */}
        {description
          ? description
            .split(/\n/g)
            .map(x => <DescBullet text={x} key={x} />)
          : ''}
      </ul>

      <div className={styleCompare}><a href="http://hackreactor.com">Compare with similar items</a></div>

      {usedCount > 0 && available
        ? (
          <div className={styleUsed}>
            <a href="http://hackreactor.com">
              <span className={styleUsedBold}>Used & new</span>
              &nbsp;(
              {usedCount}
            ) from&nbsp;
              {renderPrice(usedPrice)}
            </a>
            {freeShipping
              ? ' & FREE shipping'
              : ''
            }
            .&nbsp;
            <a href="http://hackreactor.com">Details</a>
          </div>
        )
        : ''
      }


    </div>
  );
};

export default ProductInfo;
