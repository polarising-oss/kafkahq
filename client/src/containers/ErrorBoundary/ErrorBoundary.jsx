import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ErrorPage from '../../containers/ErrorPage';

class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.element
  };
  state = {
    hasError: false,
    error: null,
    info: null
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info, hasError: true });
  }

  static getDerivedStateFromProps = nextProps => {
    if (window.location.pathname === '/ui/error') {
      return { hasError: true };
    }
    return { hasError: false };
  };

  /**
   * If there will be a reload button, use this at onClick: window.location.reload()
   */

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return <ErrorPage history={this.props.history} />;
    }
    return children;
  }
}

export default ErrorBoundary;
