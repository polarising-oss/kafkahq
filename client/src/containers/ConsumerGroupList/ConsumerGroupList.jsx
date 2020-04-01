import React, { Component } from 'react';
import Table from '../../components/Table';
import endpoints, { uriDeleteGroups } from '../../utils/endpoints';
import constants from '../../utils/constants';
import history from '../../utils/history';
import { Link } from 'react-router-dom';
import ConsumerGroup from './ConsumerGroup/ConsumerGroup';
import Header from '../Header';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import api, { remove } from '../../utils/api';

class ConsumerGroupList extends Component {
  state = {
    consumerGroups: [],
    showDeleteModal: false,
    selectedCluster: '',
    deleteMessage: '',
    groupToDelete: {},
    deleteData: {},
    pageNumber: 1,
    totalPageNumber: 1,
    history: this.props,
    searchData: {
      search: ''
    }
  };

  componentDidMount() {
    let { clusterId } = this.props.match.params;
    this.setState({ selectedCluster: clusterId }, () => {
      this.getConsumerGroup();
    });
  }

  handleSearch = data => {
    const { searchData } = data;
    this.setState({ pageNumber: 1, searchData }, () => {
      this.getConsumerGroup();
    });
  };

  handlePageChangeSubmission = value => {
    const { totalPageNumber } = this.state;
    if (value <= 0) {
      value = 1;
    } else if (value > totalPageNumber) {
      value = totalPageNumber;
    }
    this.setState({ pageNumber: value }, () => {
      this.getConsumerGroup();
    });
  };

  handlePageChange = ({ currentTarget: input }) => {
    const { value } = input;
    this.setState({ pageNumber: value });
  };

  async getConsumerGroup() {
    const { history } = this.props;
    const { selectedCluster, pageNumber } = this.state;
    const { search } = this.state.searchData;

    history.push({
      loading: true
    });

    try {
      let response = await api.get(
        endpoints.uriConsumerGroups(selectedCluster, 'ALL', search, pageNumber)
      );
      response = response.data;
      if (response) {
        let consumerGroups = response.consumerGroups || [];
        this.handleConsumerGroup(consumerGroups);
        this.setState({ selectedCluster, totalPageNumber: response.totalPageNumber });
      }
    } catch (err) {
      history.replace('/error', { errorData: err });
    } finally {
      history.push({
        loading: false
      });
    }
  }

  handleConsumerGroup(consumerGroup) {
    let tableConsumerGroup = [];
    consumerGroup.map(consumerGroup => {
      consumerGroup.size = 0;
      consumerGroup.logDirSize = 0;
      tableConsumerGroup.push({
        id: consumerGroup.id,
        state: consumerGroup.state,
        size: consumerGroup.size,
        coordinator: consumerGroup.coordinator,
        members: consumerGroup.members,
        topicLag: consumerGroup.topicLag
      });
    });
    this.setState({ consumerGroups: tableConsumerGroup });
  }

  handleState(state) {
    return (
      <span className={state.state === 'Stable' ? 'badge badge-success' : 'badge badge-warning'}>
        {state}
      </span>
    );
  }

  handleCoordinator(coordinator) {
    return <span className="badge badge-primary"> {coordinator}</span>;
  }

  handleTopics(topicLag) {
    const { history } = this.props;
    return topicLag.map(lagTopic => {
      return (
        <div
          onClick={() => {
            history.push({
              pathname: `/${this.state.selectedCluster}/topic/${lagTopic.topicId}`,
              tab: constants.TOPIC
            });
          }}
        >
          <Link
            to={{
              pathname: `/${this.state.selectedCluster}/topic/${lagTopic.topicId}`
            }}
            key="lagTopic.topicId"
            className="btn btn-dark btn-sm mb-1"
          >
            {lagTopic.topicId}

            <a href="#" className="badge badge-secondary">
              Lag:{lagTopic.lag}
            </a>
          </Link>
        </div>
      );
    });
  }

  handleOnDelete(group) {
    this.setState({ groupToDelete: group }, () => {
      this.showDeleteModal(`Delete ConsumerGroup ${group.id}?`);
    });
  }

  showDeleteModal = deleteMessage => {
    this.setState({ showDeleteModal: true, deleteMessage });
  };

  closeDeleteModal = () => {
    this.setState({ showDeleteModal: false, deleteMessage: '' });
  };

  deleteConsumerGroup = () => {
    const { selectedCluster, groupToDelete } = this.state;
    const { history } = this.props;
    const deleteData = {
      clusterId: selectedCluster,
      groupId: groupToDelete.id
    };

    history.push({ loading: true });
    remove(uriDeleteGroups(), deleteData)
      .then(res => {
        this.props.history.push({
          showSuccessToast: true,
          successToastMessage: `Consumer Group '${groupToDelete.id}' is deleted`,
          loading: false
        });
        this.setState({ showDeleteModal: false, groupToDelete: {} });
        this.handleConsumerGroup(res.data.group);
      })
      .catch(err => {
        this.props.history.push({
          showErrorToast: true,
          errorToastMessage: `Could not delete '${groupToDelete.id}'`,
          loading: false
        });
        this.setState({ showDeleteModal: false, groupToDelete: {} });
      });
  };
  render() {
    const { consumerGroup, selectedCluster, searchData, pageNumber, totalPageNumber } = this.state;
    const { history } = this.props;
    const { clusterId } = this.props.match.params;

    return (
      <div id="content">
        <Header title="Consumer Groups" />
        <nav
          className="navbar navbar-expand-lg navbar-light bg-light mr-auto
         khq-data-filter khq-sticky khq-nav"
        >
          <SearchBar
            showSearch={true}
            search={searchData.search}
            showPagination={true}
            pagination={pageNumber}
            showTopicListView={false}
            showConsumerGroup
            groupListView={'ALL'}
            doSubmit={this.handleSearch}
          />

          <Pagination
            pageNumber={pageNumber}
            totalPageNumber={totalPageNumber}
            onChange={this.handlePageChange}
            onSubmit={this.handlePageChangeSubmission}
          />
        </nav>

        <Table
          columns={[
            {
              id: 'id',
              accessor: 'id',
              colName: 'Id'
            },
            {
              id: 'state',
              accessor: 'state',
              colName: 'State',
              cell: obj => {
                return this.handleState(obj.state);
              }
            },
            {
              id: 'coordinator',
              accessor: 'coordinator',
              colName: 'Coordinator',
              cell: obj => {
                return this.handleCoordinator(obj.coordinator);
              }
            },
            {
              id: 'members',
              accessor: 'members',
              colName: 'Members'
            },
            {
              id: 'topics',
              accessor: 'topics',
              colName: 'Topics',
              cell: obj => {
                if (obj.topicLag) {
                  return this.handleTopics(obj.topicLag);
                }
              }
            }
          ]}
          data={this.state.consumerGroups}
          onDelete={group => {
            this.handleOnDelete(group);
          }}
          onDetails={id => {
            history.push(`/${selectedCluster}/group/${id}`);
          }}
          actions={[constants.TABLE_DELETE, constants.TABLE_DETAILS]}
        />

        <div
          className="navbar navbar-expand-lg navbar-light mr-auto
         khq-data-filter khq-sticky khq-nav"
        >
          <div className="collapse navbar-collapse" />
          <Pagination
            pageNumber={pageNumber}
            totalPageNumber={totalPageNumber}
            onChange={this.handlePageChange}
            onSubmit={this.handlePageChangeSubmission}
          />
        </div>
        <ConfirmModal
          show={this.state.showDeleteModal}
          handleCancel={this.closeDeleteModal}
          handleConfirm={this.deleteConsumerGroup}
          message={this.state.deleteMessage}
        />
      </div>
    );
  }
}
export default ConsumerGroupList;
