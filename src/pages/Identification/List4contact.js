import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Modal, Card, Select, message } from 'antd';
import TableList from './List';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './List.less';

const { Option } = Select;
const FormItem = Form.Item;
const AssignTaskForm = Form.create()(props => {
  const { modalVisible, form, handleAssign, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAssign(fieldsValue);
    });
  };
  const cancelHandle = () => {
    handleModalVisible();
  };
  return (
    <Modal
      destroyOnClose
      title="分配鉴定任务"
      visible={modalVisible}
      // visible="true"
      onOk={okHandle}
      onCancel={() => cancelHandle()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="鉴定人">
        {form.getFieldDecorator('fullName', {
          rules: [{ required: true }],
        })(
          <Select>
            <Option key="0">张三</Option>
            <Option key="10">李四</Option>
            <Option key="20">王五</Option>
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ identificationList, loading }) => ({
  identificationList,
  loading: loading.models.identificationList,
}))
@Form.create()
class List4member extends PureComponent {
  state = {
    assignTaskFormVisiable: false,
    currentTask: null,
  };

  assignTask = prop => {
    this.setState({
      assignTaskFormVisiable: true,
      currentTask: prop,
    });
  };

  handleAssign = () => {
    const { dispatch } = this.props;
    const { currentTask } = this.state;
    dispatch({
      type: 'identification/update',
      payload: {
        type: 'assign',
        ...currentTask,
        user: 'test',
      },
      callback: () => {
        this.handleModalVisible();
      },
    });
    message.success('assign success');
  };

  handleModalVisible = () => {
    this.setState({
      assignTaskFormVisiable: false,
    });
  };

  render() {
    const { assignTaskFormVisiable } = this.state;
    const operation = val => (
      <Fragment>
        <a onClick={() => this.assignTask(val)}>分配</a>
      </Fragment>
    );
    return (
      <PageHeaderWrapper title="分配鉴定申请">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <TableList title="分配鉴定申请" operation={operation} />
          </div>
        </Card>
        <AssignTaskForm
          handleAssign={this.handleAssign}
          modalVisible={assignTaskFormVisiable}
          handleModalVisible={this.handleModalVisible}
        />
      </PageHeaderWrapper>
    );
  }
}
export default List4member;
