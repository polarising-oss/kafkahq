import React, { Component } from 'react';
import './styles.scss';
import image from '../../images/icon.svg';
class Loading extends Component {
  render() {
    const { show } = this.props;
    let loadingContainer = show ? 'loading-container' : 'loading-none';
    return (
      <div>
        <div className={loadingContainer}>
          <div className="loading">
            <h3 className="logo">
              <img src={image} />
              <sup>
                <strong>HQ</strong>
              </sup>
            </h3>
          </div>
        </div>

        {this.props.children}
      </div>
    );
  }
}

export default Loading;
