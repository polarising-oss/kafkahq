import React, { Component } from 'react';
import './styles.scss';

import Header from '../../Header/Header';

class ConnectCreate extends Component {
  state = {
    ClusterId:this.props.clusterId,
    ConnectId:this.props.connectId,

  };

  componentDidMount(){
console.log(this.ConnectId , this.ClusterId);
  }

  
  render() {
    return (
      <div id="content">
        <Header title="Create a definition" />
        ConnectCreate
      </div>
    );
  }
}

export default ConnectCreate;