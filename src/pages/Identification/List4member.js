import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Divider, Modal, message, Tabs } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import TableList from './List';
import styles from './List.less';

const { TabPane } = Tabs;

@connect(({ identificationList, loading }) => ({
  identificationList,
  loading: loading.models.identificationList,
}))
class List4member extends PureComponent {
  state = {
    showType: 'member-todo',
  };

  undo = val => {
    const { dispatch } = this.props;
    const { showType } = this.state;
    const currentTask = val;
    Modal.confirm({
      title: '是否撤销',
      onOk: () => {
        dispatch({
          type: `identification/update`,
          payload: {
            type: 'undo',
            ...currentTask,
            user: 'test',
            query: {
              showType,
            },
          },
        });
        message.success('撤回鉴定申请成功');
      },
    });
  };

  submit = val => {
    const { dispatch } = this.props;
    const { showType } = this.state;
    const currentTask = val;
    Modal.confirm({
      title: '是否提交',
      onOk: () => {
        dispatch({
          type: `identification/update`,
          payload: {
            type: 'submit',
            ...currentTask,
            user: 'test',
            query: {
              showType,
            },
          },
        });
        message.success('提交鉴定申请成功');
      },
    });
  };

  handleUpdateClick = () => {
    router.push('/identification/application-form');
  };

  handleTabClick = key => {
    switch (key) {
      case '1':
        this.setState({
          showType: 'member-todo',
        });
        break;
      default:
        this.setState({
          showType: 'member-done',
        });
        break;
    }
  };

  render() {
    const { showType } = this.state;
    const operation = val => {
      const lastProcess = val.processes[val.processes.length - 1];
      const step3 = val.processes.find(d => d.step === "step3");
      const submitPending = lastProcess.step === "step1" && lastProcess.status === 0;
      const checkPending = lastProcess.step === "step2" && lastProcess.status === 0;
      const identified = step3 && step3.status === 1;
      return (
        <Fragment>
          {submitPending && (
            <Fragment>
              <Divider type="vertical" />
              <a onClick={() => this.handleUpdateClick(val)}>修改</a>
              <Divider type="vertical" />
              <a onClick={() => this.submit(val)}>提交</a>
            </Fragment>
          )}
          {checkPending && (
            <Fragment>
              <Divider type="vertical" />
              <a onClick={() => this.undo(val)}>撤销</a>
            </Fragment>
          )}
          {identified && (
            <Fragment>
              <Divider type="vertical" />
              <a href="/iden-result/show" target="_blank">
                查看鉴定报告
              </a>
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
      </PageHeaderWrapper>
    );
  }
}
export default List4member;
