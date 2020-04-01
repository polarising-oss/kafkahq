import React, { Component } from 'react';
import './styles.scss';

import Table from '../../../../components/Table/Table';
import constants from '../../../../utils/constants';
import {
  uriGetDefinition,
  uriPauseDefinition,
  uriResumeDefinition,
  uriRestartDefinition,
  uriRestartTask
} from '../../../../utils/endpoints';
import { get, put } from '../../../../utils/api';
import ConfirmModal from '../../../../components/Modal/ConfirmModal/ConfirmModal';

class ConnectTasks extends Component {
  state = {
    clusterId: this.props.clusterId || this.props.match.params.clusterId,
    connectId: this.props.connectId || this.props.match.params.connectId,
    definitionId: this.props.definitionId || this.props.match.params.clusterId,
    definition: {},
    definitionModifyMessage: '',
    definitionModifyData: {},
    tableData: [],
    showActionModal: false,
    actionMessage: ''
  };

  definitionState = {
    PAUSE: 'PAUSE',
    RESUME: 'RESUME',
    RESTART: 'RESTART',
    RESTART_TASK: 'RESTART_TASK'
  };

  componentDidMount() {
    this.getDefinition();
  }

  handleTasks() {
    const tasks = this.state.definition.tasks;
    let tableData = [];
    tasks.map(task => {
      tableData.push({
        id: task.id,
        worker: task.name,
        state: task.state
      });
    });
    this.setState({ tableData });
  }

  async getDefinition() {
    let definition = {};
    const { clusterId, connectId, definitionId } = this.state;
    const { history } = this.props;
    history.push({
      loading: true
    });
    try {
      definition = await get(uriGetDefinition(clusterId, connectId, definitionId));
      this.setState({ definition: definition.data }, () => this.handleTasks());
    } catch (err) {
      console.error('Error:', err);
    } finally {
      history.push({
        loading: false
      });
    }
  }

  // async restartTask(taskId) {
  //   const { clusterId, connectId, definitionId } = this.state;
  //   const { history } = this.props;
  //   history.push({
  //     loading: true
  //   });
  //   const body = {
  //     clusterId,
  //     connectId,
  //     definitionId,
  //     taskId
  //   };
  //   await put(uriRestartTask(), body)
  //     .then(() => this.getDefinition())
  //     .then(() => {
  //       this.props.history.push({
  //         showSuccessToast: true,
  //         successToastMessage: `Definition '${definitionId}' tasks ${taskId} is restarted`,
  //         loading: false
  //       });
  //     })
  //     .catch(err => {
  //       this.props.history.push({
  //         showErrorToast: true,
  //         errorToastMessage: `Failed to restart tasks ${taskId} from '${definitionId}'`,
  //         loading: false
  //       });
  //     });
  // }

  modifyDefinitionState = () => {
    const { clusterId, connectId, definitionId } = this.state;
    const { uri, action, failedAction, taskId } = this.state.definitionModifyData;
    const { history } = this.props;
    history.push({
      loading: true
    });
    let body = {
      clusterId,
      connectId,
      definitionId
    };

    if (taskId !== undefined) body.taskId = taskId;

    put(uri, body)
      .then(() => this.getDefinition())
      .then(() => {
        this.props.history.push({
          showSuccessToast: true,
          successToastMessage: `${
            taskId !== undefined
              ? `Definition '${definitionId}' tasks ${taskId} is restarted`
              : `Definition '${definitionId}' is ${action}`
          }`,
          loading: false
        });
        this.closeActionModal();
      })
      .catch(err => {
        this.props.history.push({
          showErrorToast: true,
          errorToastMessage: `${
            taskId !== undefined
              ? `Failed to restart tasks ${taskId} from '${definitionId}'`
              : `Failed to ${failedAction} definition from '${definitionId}'`
          }`,
          loading: false
        });
      });
  };

  showActionModal = definitionModifyMessage => {
    this.setState({ showActionModal: true, definitionModifyMessage });
  };

  closeActionModal = () => {
    this.setState({
      showActionModal: false,
      definitionModifyMessage: '',
      definitionModifyData: {}
    });
  };

  handleAction = (option, taskId) => {
    let uri = '';
    let action = '';
    let failedAction = '';

    switch (option) {
      case 'PAUSE':
        uri = uriPauseDefinition();
        action = 'paused';
        failedAction = 'pause';
        break;
      case 'RESUME':
        uri = uriResumeDefinition();
        action = 'resumed';
        failedAction = 'resume';
        break;
      case 'RESTART':
        uri = uriRestartDefinition();
        action = 'restarted';
        failedAction = 'restart';
        break;
      case 'RESTART_TASK':
        uri = uriRestartTask();
        action = 'restarted';
        failedAction = 'restart';
        break;
      default:
        uri = uriResumeDefinition();
        action = 'resumed';
        failedAction = 'resume';
        break;
    }

    let definitionModifyData = {
      uri,
      action,
      failedAction
    };

    if (taskId !== undefined) definitionModifyData.taskId = taskId;

    this.setState({ definitionModifyData }, () => {
      this.showActionModal(
        `${
          taskId !== undefined
            ? `Do you want to restart task: ${taskId} from ${this.state.definitionId}`
            : `Do you want to ${failedAction} definition: ${this.state.definitionId}`
        }`
      );
    });
  };

  renderTask = task => {
    let className = 'btn btn-sm mb-1 btn-';
    switch (task) {
      case 'RUNNING':
        className += 'success';
        break;
      case 'FAILED':
        className += 'danger';
        break;
      default:
        className += 'warning';
        break;
    }
    return <span class={`btn btn-sm mb-1 ${className}`}>{task}</span>;
  };

  render() {
    const { tableData, definition } = this.state;

    return (
      <div class="tab-pane active" role="tabpanel">
        <div class="table-responsive">
          <Table
            columns={[
              {
                id: 'id',
                name: 'id',
                accessor: 'id',
                colName: 'Id',
                type: 'text'
              },
              {
                id: 'worker',
                name: 'worker',
                accessor: 'worker',
                colName: 'Worker',
                type: 'text'
              },
              {
                id: 'state',
                name: 'state',
                accessor: 'state',
                colName: 'State',
                type: 'text',
                cell: (obj, col) => {
                  return this.renderTask(obj[col.accessor]);
                }
              }
            ]}
            data={tableData}
            actions={[constants.TABLE_RESTART]}
            onRestart={row => {
              this.handleAction(this.definitionState.RESTART_TASK, row.id);
            }}
          />
        </div>
        <aside>
          {definition.paused ? (
            <a
              href="#"
              className="btn btn-primary mr-2"
              onClick={() => this.handleAction(this.definitionState.RESUME)}
            >
              <i class="fa fa-play" aria-hidden="true"></i> Resume Definition
            </a>
          ) : (
            <React.Fragment>
              <a
                href="#"
                type="pause"
                className="btn btn-primary mr-2"
                onClick={() => this.handleAction(this.definitionState.PAUSE)}
              >
                <i class="fa fa-pause" aria-hidden="true"></i> Pause Definition
              </a>

              <a
                href="#"
                class="btn btn-primary mr-2"
                onClick={() => this.handleAction(this.definitionState.RESTART)}
              >
                <i className="fa fa-refresh" aria-hidden="true"></i> Restart Definition
              </a>
            </React.Fragment>
          )}
        </aside>
        <ConfirmModal
          show={this.state.showActionModal}
          handleCancel={this.closeActionModal}
          handleConfirm={this.modifyDefinitionState}
          message={this.state.definitionModifyMessage}
        />
      </div>
    );
  }
}

export default ConnectTasks;
