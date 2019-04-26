import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Modal, Divider, Card, Select, message, Tabs } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import TableList from './List';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './List.less';

import Step2 from './ApplicationFormStep0';

const { Option } = Select;
const { TabPane } = Tabs;
const FormItem = Form.Item;
const IdenTaskForm = Form.create()(props => {
  const { modalVisible, form, handleIden, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleIden(fieldsValue);
    });
  };
  const cancelHandle = () => {
    handleModalVisible('idenModalVisible', false);
  };
  return (
    <Modal
      destroyOnClose
      title="鉴定结果"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => cancelHandle()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
        {form.getFieldDecorator('info', {
          rules: [{ required: true }],
        })(
          <Select>
            <Option key="0">蕨类</Option>
            <Option key="10">牙形石</Option>
            <Option key="20">孢粉</Option>
            <Option key="30">蜥脚</Option>
          </Select>
        )}
      </FormItem>
      模拟的其他表单组件：
      <Step2 />
    </Modal>
  );
});

const BackTaskForm = Form.create()(props => {
  const { modalVisible, form, handleBack, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleBack(fieldsValue);
    });
  };
  const cancelHandle = () => {
    handleModalVisible('backModalVisible', false);
  };
  return (
    <Modal
      destroyOnClose
      title="退回鉴定申请"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="退回原因">
        {form.getFieldDecorator('info', {
          rules: [{ required: true }],
        })(<TextArea />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ identificationList, loading }) => ({
  identificationList,
  loading: loading.models.identificationList,
}))
class List4member extends PureComponent {
  state = {
    idenModalVisible: false,
    backModalVisible: false,
    currentTask: null,
    showType: 'identifier-todo',
  };

  handelClickIden = val => {
    this.setState({
      idenModalVisible: true,
      currentTask: val,
    });
  };

  handleCilckBack = val => {
    this.setState({
      backModalVisible: true,
      currentTask: val,
    });
  };

  handleClickPass = val => {
    const { dispatch } = this.props;
    const { showType } = this.state;
    const currentTask = val;
    Modal.confirm({
      title: '是否通过',
      onOk: () => {
        dispatch({
          type: 'identification/update',
          payload: {
            type: 'pass',
            ...currentTask,
            user: 'test',
            query: {
              showType,
            },
          },
        });
        message.success('通过鉴定申请成功');
      },
    });
  };

  handleClickContribute = val => {
    const { dispatch } = this.props;
    const { showType } = this.state;
    const currentTask = val;
    Modal.confirm({
      title: '完成学者贡献',
      onOk: () => {
        dispatch({
          type: 'identification/update',
          payload: {
            type: 'contribute',
            ...currentTask,
            user: 'test',
            query: {
              showType,
            },
          },
        });
        message.success('完成学者贡献');
      },
    });
  };

  iden = fieldsValue => {
    const { dispatch } = this.props;
    const { currentTask, showType } = this.state;
    dispatch({
      type: 'identification/update',
      payload: {
        type: 'identify',
        ...currentTask,
        user: 'test',
        ...fieldsValue,
        query: {
          showType,
        },
      },
      callback: () => {
        this.handleModalVisible('idenModalVisible', false);
      },
    });
    message.success('完成鉴定');
  };

  back = fieldsValue => {
    const { dispatch } = this.props;
    const { currentTask, showType } = this.state;
    dispatch({
      type: 'identification/update',
      payload: {
        type: 'back',
        ...currentTask,
        user: 'test',
        ...fieldsValue,
        query: {
          showType,
        },
      },
      callback: () => {
        this.handleModalVisible('backModalVisible', false);
      },
    });
    message.success('鉴定申请退回成功');
  };

  handleModalVisible = (modal, visible) => {
    this.setState({
      [modal]: visible,
    });
  };

  handleTabClick = key => {
    switch (key) {
      case '1':
        this.setState({
          showType: 'identifier-todo',
        });
        break;
      default:
        this.setState({
          showType: 'identifier-done',
        });
        break;
    }
  };

  render() {
    const { idenModalVisible, backModalVisible, showType } = this.state;
    const operation = val => {
      const lastProcess = val.processes[val.processes.length - 1];
      const step3 = val.processes.find(d => d.step === 'step3');
      const step4 = val.processes.find(d => d.step === 'step4');
      const checkPending = lastProcess.step === 'step2' && lastProcess.status === 0;
      const idenPending = step3 && step3.status === 0;
      const contPending = step4 && step4.status === 0;

      return (
        <Fragment>
          {checkPending && (
            <Fragment>
              <Divider type="vertical" />
              <a onClick={() => this.handleClickPass(val)}>通过</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleCilckBack(val)}>拒绝</a>
            </Fragment>
          )}
          {idenPending && (
            <Fragment>
              <Divider type="vertical" />
              <a onClick={() => this.handelClickIden(val)}>鉴定</a>
            </Fragment>
          )}
          {contPending && (
            <Fragment>
              <Divider type="vertical" />
              <a onClick={() => this.handleClickContribute(val)}>入库</a>
            </Fragment>
          )}
        </Fragment>
      );
    };
    return (
      <PageHeaderWrapper title="我的鉴定申请">
        <Card bordered={false}>
          <Tabs type="card" onTabClick={this.handleTabClick}>
            <TabPane tab="待办流程" key="1" />
            <TabPane tab="已办流程" key="2" />
          </Tabs>
          <div className={styles.tableList}>
            <TableList operation={operation} showType={showType} />
          </div>
        </Card>
        <IdenTaskForm
          handleIden={this.iden}
          modalVisible={idenModalVisible}
          handleModalVisible={this.handleModalVisible}
        />
        <BackTaskForm
          handleBack={this.back}
          modalVisible={backModalVisible}
          handleModalVisible={this.handleModalVisible}
        />
      </PageHeaderWrapper>
    );
  }
}
export default List4member;
