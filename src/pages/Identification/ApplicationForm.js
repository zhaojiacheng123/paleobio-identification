import React, { PureComponent, Fragment } from 'react';
import { Card, Steps, Divider } from 'antd';
import styles from './ApplicationForm.less';

const { Step } = Steps;

export default class StepForm extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'detail':
        return 0;
      case 'result':
        return 1;
      default:
        return 0;
    }
  }

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <h2 className={styles.heading}>标本鉴定申请单</h2>
        <Divider />
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              {/* <Step title="选择大类和鉴定单位" /> */}
              <Step title="详细鉴定信息" />
              <Step title="完成" />
            </Steps>
            {children}
          </Fragment>
        </Card>
      </React.Fragment>
    );
  }
}
