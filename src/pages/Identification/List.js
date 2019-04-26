import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Tag,
  List,
  Row,
  Col,
  Form,
  Input,
  Select,
  Icon,
  Button,
  DatePicker,
  message,
  Modal,
  Card,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import Process from './Process';

import styles from './List.less';

import { stepMap, statusMap } from '@/const';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

// function BadgeWithColorfulText({ status, text }) {
//   return (
//     <React.Fragment>
//       <Badge status={status} />
//       <span className={styles[`text-${status}`]}>{text}</span>
//     </React.Fragment>
//   );
// }

/* eslint react/no-multi-comp:0 */
@connect(({ identification, loading, user }) => ({
  identification,
  loading: loading.models.identification,
  user,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    currentProcess: {},
    detailModalVisible: false,
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'key',
    },
    {
      title: '获取途径',
      dataIndex: 'obtainWays',
    },
    {
      title: '鉴定类型',
      dataIndex: 'identificationType',
    },

    // {
    //   title: '大类',
    //   dataIndex: 'classification',
    // },
    // {
    //   title: '鉴定单位',
    //   dataIndex: 'unit',
    // },
    {
      title: '送检需求',
      dataIndex: 'identificationObject',
      sorter: true,
      render: val => `${val}`,
      // mark to display a total number
      // needTotal: true,
    },
    {
      title: '当前环节',
      dataIndex: 'processes',
      key: 'steps',
      // filters: Object.entries(stepMap).map(d => ({
      //   text: d[1].name,
      //   value: d[0],
      // })),
      render(val) {
        const currentProcess = val[val.length - 1];
        return (
          <Tag color={stepMap[currentProcess.step].color}>{stepMap[currentProcess.step].name}</Tag>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'processes',
      key: 'statuses',
      // filters: Object.entries(statusMap).map(d => ({
      //   text: d[1].name,
      //   value: d[0],
      // })),
      render(val) {
        const currentProcess = val[val.length - 1];
        return (
          <Tag color={statusMap[currentProcess.status].color}>
            {statusMap[currentProcess.status].name}
          </Tag>
        );
      },
    },
    // {
    //   title: '操作时间',
    //   dataIndex: 'updatedAt',
    //   sorter: true,
    //   render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    // },
    {
      title: '操作',
      render: val => {
        const { operation } = this.props;
        return (
          <React.Fragment>
            <a onClick={() => this.showDetail(val)}>详情</a>
            {operation(val)}
            {/* <Divider type="vertical" />
            <a onClick={() => this.handleDelete(val)}>删除</a> */}
          </React.Fragment>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch, showType } = this.props;
    dispatch({
      type: 'identification/fetch',
      payload: {
        showType,
      },
    });
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    const { showType } = this.props;
    if (showType !== prevProps.showType) {
      this.handleSearch(new Event('click'));
    }
  }

  showDetail = record => {
    this.setState({
      currentProcess: record,
      detailModalVisible: true,
    });
    // Modal.confirm({
    //   closable: true,
    //   title: `鉴定申请${record.key}`,
    //   width: '90%',
    //   content: (
    //     <React.Fragment>
    //       <div className={styles.mb10}>
    //         <Process processes={record.processes} />
    //       </div>
    //       <Card title="表单信息">
    //         <List
    //           dataSource={Object.entries(record).map(row => row.join(':'))}
    //           renderItem={item => <List.Item>{item}</List.Item>}
    //         />
    //       </Card>
    //     </React.Fragment>
    //   ),
    //   onOk() {},
    // });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'identification/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'identification/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'identification/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form, showType } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'identification/fetch',
        payload: {
          showType,
          ...values,
        },
      });
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'identification/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'identification/update',
      payload: {
        query: formValues,
        body: {
          name: fields.name,
          desc: fields.desc,
          key: fields.key,
        },
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  handleDelete = apps => {
    const { dispatch } = this.props;
    const appsArr = Array.isArray(apps) ? apps : [apps];
    confirm({
      title: '是否删除？',
      content: `申请号：${appsArr.map(d => d.key).join('|')}`,
      onOk() {
        dispatch({
          type: 'identification/remove',
          payload: {
            keys: appsArr.map(d => d.key),
          },
        });
        message.success('删除成功');
      },
    });
  };

  handleModalVisible = (modal, visible) => {
    this.setState({
      [modal]: visible,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="大类">
              {getFieldDecorator('key')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {Object.entries(statusMap).map(d => (
                    <Option value={d[0]} key={d[0]}>
                      {d[1]}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="大类">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {Object.entries(statusMap).map(d => (
                    <Option key={d[0]}>{d[1]}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col> */}
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="其他">
              <Input />
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      identification: { data },
      loading,
    } = this.props;
    const { selectedRows, detailModalVisible, currentProcess } = this.state;

    return (
      <React.Fragment>
        {/* <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className={styles.tableListOperator}>
          <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
          {contact && <Button>批量分配</Button>}
          {selectedRows.length > 0 && (
                <span>
                  <Button>批量分配</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
        </div> */}
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          data={data}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
          handleDelete={this.handleDelete}
        />
        <Modal
          title={`鉴定申请${currentProcess.key}`}
          visible={detailModalVisible}
          closable
          footer={<Button onClick={() => this.handleModalVisible('detailModalVisible', false)}>确认</Button>}
          onCancel={() => this.handleModalVisible('detailModalVisible', false)}
        >
          <div className={styles.mb10}>
            <Process processes={currentProcess.processes} />
          </div>
          <Card title="表单信息">
            <List
              dataSource={Object.entries(currentProcess).map(row => row.join(':'))}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

export default TableList;
