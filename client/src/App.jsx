import Breadcrumb from './components/Breadcrumb.jsx';
import PhotoGallery from './components/PhotoGallery.jsx';
import ProductInfo from './components/ProductInfo.jsx';

const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');


$(document).keydown((e) => {
  let productNum = document.location.search;
  if (productNum) {
    productNum = productNum.replace(/(id|=|\?|&)/g, '');
    productNum = Number(productNum);
  } else {
    productNum = 1;
  }

  if (e.which === 37 && productNum > 1) { // prev
    document.location.href = `${document.location.origin}/?id=${productNum - 1}`;
  } else if (e.which === 39 && productNum < 100) { // next
    document.location.href = `${document.location.origin}/?id=${productNum + 1}`;
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getData(prodNum) {
    const prodNumCopy = prodNum || 1;

    const reqProduct = $.get({
      url: '/get',
      context: this,
      data: { id: prodNumCopy },
    });

    reqProduct.done((res) => {
      this.setState(res, () => {
        // onload, select the first option for product variation
        if (res.varKey !== null) {
          this.setState({
            selectedVariation: Object.keys(Object.values(res)[0])[0],
          });
        }
      });

      window.state = this.state;
    });
  };

  selectOption(e) {
    if (e.target.value !== 'Select') {
      this.setState({
        selectedSize: e.target.value, // value of the dropdown
      });
    }
  }

  selectImage(e) {
    this.setState({
      selectedVariation: e.target.getAttribute('data')
    });

    e.stopPropagation();
  }

  componentDidMount() {
    // get "id" from URL params
    // let id = window.location.href.match(/(\?|\&)id=(\d\d?\d?\d?\d?\d?\d?\d?)/);
    let id = window.location.search.replace(/\?id=/,'');
    if (id) {
      // get data using id from window URL
      this.getData(id, this);
    } else {
      // otherwise get data for id=1
      this.getData(1, this);
    }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    this.setState({
      timeLeft: tomorrow - today,
    });
  }

  render() {
    const { selectedVariation, images, timeLeft } = this.state;
    return (
      <React.Fragment>
        <Breadcrumb data={this.state} />
        <div style={{ display: 'flex' }}>
          <PhotoGallery />
          <ProductInfo
            data={this.state}
            selectedVariation={selectedVariation}
            dropdownCb={this.selectOption.bind(this)}
            imageCb={this.selectImage.bind(this)}
            timeLeft={timeLeft}
          />
        </div>
      </React.Fragment>
    );
  }
}

// this for integration
window.ProductInfo = App;


// COMMENT BEFORE UPLOADING
ReactDOM.render(<App />, document.getElementById('ProductInfo'));
