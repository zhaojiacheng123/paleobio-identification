import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import styles from './ApplicationForm.less';

const taxa = {
  无脊椎: '宗普',
  脊椎: '王旭日',
  孢粉: '郭彩清',
  微体: '武桂春',
  植物: '',
};

@connect(({ identification }) => ({
  data: identification.step,
}))
class Step3 extends React.PureComponent {
  render() {
    const { data } = this.props;
    const onFinish = () => {
      router.push('/identification/list4member');
    };
    const information = (
      <div className={styles.information}>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            大类：
          </Col>
          <Col xs={24} sm={16}>
            {data.classification}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            鉴定组长：
          </Col>
          <Col xs={24} sm={16}>
            {taxa[data.classification]}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            获得途径：
          </Col>
          <Col xs={24} sm={16}>
            {data.obtainWays}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            鉴定类别：
          </Col>
          <Col xs={24} sm={16}>
            {data.identificationType}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            送检需求：
          </Col>
          <Col xs={24} sm={16}>
            {data.identificationObject}
          </Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          返回首页
        </Button>
        {/* <Button>查看账单</Button> */}
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="申请成功"
        description="预计X天内完成"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default Step3;
