import React, { Component } from 'react';
import Table from '../../components/Table';
import endpoints, { uriDeleteSchema } from '../../utils/endpoints';
import constants from '../../utils/constants';
import { Link } from 'react-router-dom';
import Header from '../Header';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import api, { remove } from '../../utils/api';
import './styles.scss';
import CodeViewModal from '../../components/Modal/CodeViewModal/CodeViewModal';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-merbivore_soft';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class SchemaList extends Component {
  state = {
    schemasRegistry: [],
    showDeleteModal: false,
    selectedCluster: '',
    deleteMessage: '',
    schemaToDelete: {},
    deleteData: {},
    pageNumber: 1,
    totalPageNumber: 1,
    history: this.props,
    searchData: {
      search: ''
    },
    createSubjectFormData: {
      subject: '',
      compatibilityLevel: '',
      schema: ''
    },
    showSchemaModal: false,
    schemaModalBody: '',
    roles: JSON.parse(sessionStorage.getItem('roles'))
  };

  componentDidMount() {
    let { clusterId } = this.props.match.params;

    this.setState({ selectedCluster: clusterId }, () => {
      this.getSchemaRegistry();
    });
  }

  showSchemaModal = body => {
    this.setState({
      showSchemaModal: true,
      schemaModalBody: body
    });
  };

  closeSchemaModal = () => {
    this.setState({ showSchemaModal: false, schemaModalBody: '' });
  };

  handleSearch = data => {
    const { searchData } = data;
    this.setState({ pageNumber: 1, searchData }, () => {
      this.getSchemaRegistry();
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
      this.getSchemaRegistry();
    });
  };

  handlePageChange = ({ currentTarget: input }) => {
    const { value } = input;
    this.setState({ pageNumber: value });
  };

  async getSchemaRegistry() {
    const { history } = this.props;
    const { selectedCluster, pageNumber } = this.state;
    const { search } = this.state.searchData;

    history.replace({
      loading: true
    });
    try {
      let response = await api.get(
        endpoints.uriSchemaRegistry(selectedCluster, search, pageNumber)
      );

      let schemasRegistry = response.data ? response.data.results || [] : [];
      this.handleSchemaRegistry(schemasRegistry);
      this.setState({ selectedCluster, totalPageNumber: response.page });
    } finally {
      history.replace({
        loading: false
      });
    }
  }

  handleSchemaRegistry(SchemaRegistry) {
    let tableSchemaRegistry = [];
    SchemaRegistry.forEach(SchemaRegistry => {
      SchemaRegistry.size = 0;
      SchemaRegistry.logDirSize = 0;
      tableSchemaRegistry.push({
        id: SchemaRegistry.id,
        subject: SchemaRegistry.subject,
        version: SchemaRegistry.version,
        schema: JSON.stringify(JSON.parse(SchemaRegistry.schema), null, 2)
      });
    });
    this.setState({ schemasRegistry: tableSchemaRegistry });
  }

  handleVersion(version) {
    return <span className="badge badge-primary"> {version}</span>;
  }

  handleOnDelete(schema) {
    this.setState({ schemaToDelete: schema }, () => {
      this.showDeleteModal(`Delete SchemaRegistry ${schema.subject}?`);
    });
  }

  showDeleteModal = deleteMessage => {
    this.setState({ showDeleteModal: true, deleteMessage });
  };

  closeDeleteModal = () => {
    this.setState({ showDeleteModal: false, deleteMessage: '' });
  };

  deleteSchemaRegistry = () => {
    const { selectedCluster, schemaToDelete } = this.state;
    const { history } = this.props;
    const deleteData = {
      clusterId: selectedCluster,
      subject: schemaToDelete.subject
    };
    history.replace({ loading: true });
    remove(uriDeleteSchema(selectedCluster, schemaToDelete.subject), deleteData)
      .then(() => {
        this.props.history.replace({
          loading: false
        });
        toast.success(`Schema '${schemaToDelete.subject}' is deleted`);
        this.setState({ showDeleteModal: false, schemaToDelete: {} });
        this.getSchemaRegistry();
      })
      .catch(() => {
        this.props.history.replace({
          loading: false
        });
        this.setState({ showDeleteModal: false, schemaToDelete: {} });
      });
  };
  render() {
    const {
      selectedCluster,
      searchData,
      pageNumber,
      totalPageNumber,
      showSchemaModal,
      schemaModalBody
    } = this.state;
    const roles = this.state.roles || {};
    const { history } = this.props;
    const { clusterId } = this.props.match.params;

    return (
      <div>
        <Header title="Schema Registry" history={history} />
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
            showSchemaRegistry
            schemaListView={'ALL'}
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
              id: 'subject',
              accessor: 'subject',
              colName: 'Subject'
            },
            {
              id: 'version',
              accessor: 'version',
              colName: 'Version',
              cell: obj => {
                return this.handleVersion(obj.version);
              }
            },
            {
              id: 'schema',
              name: 'schema',
              accessor: 'schema',
              colName: 'Schema',
              type: 'text',
              extraRow: true,
              extraRowContent: (obj, col, index) => {
                return (
                  <AceEditor
                    mode="json"
                    id={'value' + index}
                    theme="merbivore_soft"
                    value={obj[col.accessor]}
                    readOnly
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: true }}
                    style={{ width: '100%', minHeight: '25vh' }}
                  />
                );
              },
              cell: (obj, col) => {
                return (
                  <pre className="mb-0 khq-data-highlight">
                    <code>
                      {obj[col.accessor]
                        ? obj[col.accessor].substring(0, 100).replace(/(\r\n|\n|\r)/gm, '')
                        : 'N/A'}
                      {obj[col.accessor] && obj[col.accessor].length > 100 && '(...)'}
                    </code>
                  </pre>
                );
              }
            }
          ]}
          data={this.state.schemasRegistry}
          updateData={data => {
            this.setState({ schemasRegistry: data });
          }}
          onDelete={schema => {
            this.handleOnDelete(schema);
          }}
          onDetails={schemaId => {
            let schema = this.state.schemasRegistry.find(schema => {
              return schema.id === schemaId;
            });
            history.push({
              pathname: `/ui/${selectedCluster}/schema/details/${schema.subject}`,
              schemaId: schema.subject
            });
          }}
          actions={
            roles.registry && roles.registry['registry/delete']
              ? [constants.TABLE_DELETE, constants.TABLE_DETAILS]
              : [constants.TABLE_DETAILS]
          }
          extraRow
          noStripes
          onExpand={obj => {
            return Object.keys(obj.headers).map(header => {
              return (
                <tr
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%'
                  }}
                >
                  <td
                    style={{
                      width: '100%',
                      display: 'flex',
                      borderStyle: 'dashed',
                      borderWidth: '1px',
                      backgroundColor: '#171819'
                    }}
                  >
                    {header}
                  </td>
                  <td
                    style={{
                      width: '100%',
                      display: 'flex',
                      borderStyle: 'dashed',
                      borderWidth: '1px',
                      backgroundColor: '#171819'
                    }}
                  >
                    {obj.headers[header]}
                  </td>
                </tr>
              );
            });
          }}
          handleExtraExpand={(extraExpanded, el) => {
            const currentExpandedRows = extraExpanded;
            const isRowCurrentlyExpanded = currentExpandedRows.includes(el.subject);

            const newExpandedRows = isRowCurrentlyExpanded
              ? currentExpandedRows
              : currentExpandedRows.concat({ id: el.id, subject: el.subject });
            return newExpandedRows;
          }}
          handleExtraCollapse={(extraExpanded, el) => {
            const currentExpandedRows = extraExpanded;
            const isRowCurrentlyExpanded = currentExpandedRows.some(
              obj => obj.subject === el.subject
            );

            const newExpandedRows = !isRowCurrentlyExpanded
              ? currentExpandedRows
              : currentExpandedRows.filter(
                  obj => !(obj.id === el.id && obj.subject === el.subject)
                );
            return newExpandedRows;
          }}
          noContent={'No schemas available'}
        />
        {roles.registry && roles.registry['registry/insert'] && (
          <aside>
            <Link
              to={{
                pathname: `/ui/${clusterId}/schema/create`,
                state: { formData: this.state.createSubjectFormData }
              }}
              className="btn btn-primary"
            >
              Create a Subject
            </Link>
          </aside>
        )}

        <ConfirmModal
          show={this.state.showDeleteModal}
          handleCancel={this.closeDeleteModal}
          handleConfirm={this.deleteSchemaRegistry}
          message={this.state.deleteMessage}
        />

        <CodeViewModal
          show={showSchemaModal}
          body={schemaModalBody}
          handleClose={this.closeSchemaModal}
        />
      </div>
    );
  }
}

export default SchemaList;
