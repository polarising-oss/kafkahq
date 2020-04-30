import React, { Component } from 'react';
import './styles.scss';

import Header from '../../Header/Header';
import ConnectTasks from './ConnectTasks/ConnectTasks';
import ConnectConfigs from './ConnectConfigs/ConnectConfigs';
import { Link } from 'react-router-dom';

class Connect extends Component {
  state = {
    clusterId: this.props.history.clusterId || this.props.match.params.clusterId,
    connectId: this.props.history.connectId || this.props.match.params.connectId,
    definitionId: this.props.history.definitionId || this.props.match.params.definitionId,
    selectedTab: 'tasks'
  };

  selectTab = tab => {
    this.setState({ selectedTab: tab });
  };

  tabClassName = tab => {
    const { selectedTab } = this.state;
    return selectedTab === tab ? 'nav-link active' : 'nav-link';
  };

  renderSelectedTab() {
    const { clusterId, connectId, definitionId, selectedTab } = this.state;
    const { history, match } = this.props;

    switch (selectedTab) {
      case 'tasks':
        return (
          <ConnectTasks
            clusterId={clusterId}
            connectId={connectId}
            definitionId={definitionId}
            history={history}
            match={match}
          />
        );
      case 'configs':
        return (
          <ConnectConfigs
            clusterId={clusterId}
            connectId={connectId}
            definitionId={definitionId}
            history={history}
            match={match}
          />
        );
      default:
        return (
          <ConnectTasks
            clusterId={clusterId}
            connectId={connectId}
            definitionId={definitionId}
            history={history}
            match={match}
          />
        );
    }
  }

  render() {
    const { clusterId, connectId, definitionId } = this.state;

    return (
      <div>
        <Header title={`Connect: ${definitionId}`} />
        <div className="tabs-container">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item">
              <a
                className={this.tabClassName('tasks')}
                onClick={() => this.selectTab('tasks')}
                role="tab"
              >
                Tasks
              </a>
            </li>
            <li className="nav-item">
              <a
                className={this.tabClassName('configs')}
                onClick={() => this.selectTab('configs')}
                role="tab"
              >
                Configs
              </a>
            </li>
          </ul>

          <div className="tab-content">
            <div className="tab-pane active" role="tabpanel">
              {this.renderSelectedTab()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Connect;
