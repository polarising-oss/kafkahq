import React from 'react';
import './App.scss';
import { BrowserRouter as Router, HashRouter } from 'react-router-dom';
import { baseUrl, uriClusters } from './utils/endpoints';
import Routes from './utils/Routes';
import history from './utils/history';
import api from './utils/api';
class App extends React.Component {
  state = {
    clusterId: ''
  };


  componentDidMount() {
    api.get(uriClusters()).then(res => {
      this.setState({ clusterId: res.data[0].id });
    });
  }
  render() {
    const { clusterId } = this.state;
    if (clusterId) {
      return (
        <HashRouter>
          <Routes clusterId={clusterId} location={baseUrl} />
        </HashRouter>
      );
    }
    return <span />;
  }
}

export default App;
