import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Tag,
  List,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './UserManager.less';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const userTypeMap = {
  admin: '管理员',
  identifier: '鉴定组长',
  member: '普通用户',
};
const userTypeStatusMap = {
  admin: '#f5222d',
  identifier: '#388014',
  member: '#000000a6',
};

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        {form.getFieldDecorator('uid', {
          rules: [{ required: true }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
        {form.getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入至少六个字符！', min: 6 }],
        })(<Input placeholder="请输入" type="password" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="重复密码">
        {form.getFieldDecorator('repassword', {
          rules: [
            { required: true },
            {
              validator: (rule, value, cb) => {
                if (value && value !== form.getFieldValue('password')) {
                  cb('两次输入不一致！');
                }

                // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
                cb();
              },
            },
          ],
        })(<Input placeholder="请输入" type="password" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
        {form.getFieldDecorator('roleName', {
          rules: [{ required: true }],
          initialValue: 'member',
        })(
          <Select>
            {Object.entries(userTypeMap).map(d => (
              <Option key={d[0]} value={d[0]}>
                {d[1]}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const { updateRecord, modalVisible, form, handleUpdate, handleUpdateModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="修改角色"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible()}
    >
      {modalVisible && updateRecord && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
          {form.getFieldDecorator('roleName', {
            rules: [{ required: true }],
            initialValue: updateRecord.role,
          })(
            <Select>
              {Object.entries(userTypeMap).map(d => (
                <Option key={d[0]} value={d[0]}>
                  {d[1]}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      )}
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ members, loading }) => ({ members, loading: loading.models.members }))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    updateRecord: {},
  };

  columns = [
    {
      title: '用户名',
      dataIndex: 'uid',
    },
    {
      title: '姓名',
      dataIndex: 'fullName',
    },
    // {
    //   title: '描述',
    //   dataIndex: 'desc',
    // },
    // {
    //   title: '服务调用次数',
    //   dataIndex: 'callNo',
    //   sorter: true,
    //   render: val => `${val} 万`,
    //   // mark to display a total number
    //   // needTotal: true,
    // },
    {
      title: '角色',
      dataIndex: 'roleName',
      filters: Object.entries(userTypeMap).map(d => ({ text: d[1], value: d[0] })),
      render(val) {
        return <Tag color={userTypeStatusMap[val]}>{userTypeMap[val]}</Tag>;
      },
    },
    {
      title: '上次登录时间',
      dataIndex: 'updatedAt',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.showDetail(record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改角色</a>
          <Divider type="vertical" />
          <a onClick={e => this.handleDelete(e, record)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'members/fetch',
    });
  }

  showDetail = record => {
    Modal.info({
      title: '用户信息',
      content: (
        <div className={styles.breakWord}>
          <List
            dataSource={Object.entries(record).map(row => row.join(':'))}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </div>
      ),
      onOk() {},
    });
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
      type: 'members/fetch',
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
      type: 'members/fetch',
      payload: {},
    });
  };

  handleMutiDelete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    confirm({
      title: '是否删除？',
      content: `用户名：${selectedRows.map(d => d.fullName).join(',')}`,
      onOk() {
        dispatch({
          type: 'members/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        message.success('删除成功');
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

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
        type: 'members/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateRecord: record,
      updateModalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'members/add',
      payload: fields,
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues, updateRecord } = this.state;
    dispatch({
      type: 'members/update',
      payload: {
        query: formValues,
        body: {
          ...fields,
          key: updateRecord.key,
        },
      },
    });

    message.success('修改成功');
    this.handleUpdateModalVisible();
  };

  handleDelete = (e, users) => {
    const { dispatch } = this.props;
    const usersArr = Array.isArray(users) ? users : [users];
    confirm({
      title: '是否删除？',
      content: `用户名：${usersArr.map(d => d.fullName).join(',')}`,
      onOk() {
        dispatch({
          type: 'members/remove',
          payload: {
            key: usersArr.map(d => d.key),
          },
        });

        message.success('删除成功');
      },
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
            <FormItem label="用户名">
              {getFieldDecorator('fullName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="角色">
              {getFieldDecorator('roleName')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {Object.entries(userTypeMap).map(d => (
                    <Option key={d[0]}>{d[1]}</Option>
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      members: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, updateRecord } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="用户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加用户
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleMutiDelete} key="remove">
                    批量删除
                  </Button>
                  {/* <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown> */}
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          updateRecord={updateRecord}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
