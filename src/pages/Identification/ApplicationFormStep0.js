import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Divider, Row, Col, Radio, Cascader, Select } from 'antd';
import PicturesWall from '@/components/PicturesWall';
import styles from './ApplicationFormStep.less';
import pcaCode from './pca-code.json';

const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const formItemLayoutWide = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 18,
  },
};

const taxa = {
  无脊椎动物化石: '宗普',
  脊椎动物化石: '王旭日',
  // 孢粉: '郭彩清',
  微体化石: '武桂春',
  植物化石: '',
};

@connect(({ identification, user, loading }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: identification.step,
  currentUser: user.currentUser,
}))
@Form.create()
class Step2 extends React.PureComponent {
  state = {
    taxon: Object.keys(taxa)[0],
  };

  handleTaxonChange = e => {
    this.setState({
      taxon: e,
    });
  };

  render() {
    const { form, data, dispatch, submitting, currentUser } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { taxon } = this.state;
    const onValidateForm = (e, type) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'identification/add',
            payload: {
              type,
              ...data,
              ...values,
            },
          });
        }
      });
    };
    return (
      <Form layout="horizontal" className={styles.stepFormDetail}>
        <Row gutter={24}>
          <Col md={12} lg={8}>
            <Form.Item {...formItemLayout} label="申请人">
              {getFieldDecorator('uid', {
                rules: [
                  {
                    required: true,
                    message: '必填项',
                  },
                ],
                initialValue: currentUser.uid,
              })(<Input type="text" autoComplete="off" placeholder="请输入姓名" />)}
            </Form.Item>
          </Col>
          <Col md={12} lg={8}>
            <Form.Item {...formItemLayout} label="邮箱地址">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '必填项',
                  },
                ],
                initialValue: currentUser.email,
              })(<Input type="text" autoComplete="off" />)}
            </Form.Item>
          </Col>
          <Col md={12} lg={8}>
            <Form.Item {...formItemLayout} label="联系电话">
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '必填项',
                  },
                ],
                initialValue: currentUser.mobile,
              })(<Input type="text" autoComplete="off" />)}
            </Form.Item>
          </Col>
          <Col md={12} lg={8}>
            <Form.Item {...formItemLayout} label="获取途径">
              {getFieldDecorator('obtainWays', {
                rules: [
                  {
                    required: true,
                    message: '必填项',
                  },
                ],
                initialValue: '发现',
              })(
                <RadioGroup name="obtainWays">
                  <Radio value="发现">发现</Radio>
                  <Radio value="购买">购买</Radio>
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
          <Col md={12} lg={8}>
            <Form.Item {...formItemLayout} label="发现地">
              {getFieldDecorator('findPlace', {
                rules: [
                  {
                    required: true,
                    message: '必填项',
                  },
                ],
              })(<Cascader options={pcaCode} placeholder="选择省市区" />)}
            </Form.Item>
          </Col>
          <Col md={12} lg={8}>
            <Form.Item {...formItemLayout} label="详细发现地">
              {getFieldDecorator('siteDetail', {
                rules: [
                  {
                    required: true,
                    message: '必填项',
                  },
                ],
              })(<Input type="text" autoComplete="off" />)}
            </Form.Item>
          </Col>
          <Col md={12} lg={8}>
            <Form.Item {...formItemLayout} label="大类">
              {getFieldDecorator('classification', {
                initialValue: taxon,
                rules: [{ required: true, message: '请选择大类' }],
              })(
                <Select onChange={this.handleTaxonChange}>
                  {Object.keys(taxa).map(d => (
                    <Option value={d}>{d}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={12} lg={8}>
            <Form.Item {...formItemLayout} label="鉴定组长">
              {taxa[taxon]}
            </Form.Item>
          </Col>
          <Col md={12} lg={8}>
            <Form.Item {...formItemLayout} label="送检方式">
              {getFieldDecorator('identificationObject', {
                rules: [
                  {
                    required: true,
                    message: '必填项',
                  },
                ],
                initialValue: '寄送样品',
              })(
                <RadioGroup name="identificationObject">
                  <Radio value="寄送样品">寄送样品</Radio>
                  <Radio value="仅文字图片">仅文字图片</Radio>
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item {...formItemLayoutWide} label="送检需求">
              <TextArea placeholder="请输入送检需求" autosize={{ minRows: 2, maxRows: 6 }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item {...formItemLayoutWide} label="样品图片">
              <PicturesWall />
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ margin: '24px 0' }} />
        <Row>
          <Col>
            <Form.Item
              style={{ marginBottom: 8 }}
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: {
                  span: 8,
                  offset: 8,
                },
              }}
              label=""
            >
              <Button
                type="primary"
                onClick={e => onValidateForm(e, 'submit')}
                loading={submitting}
              >
                提交
              </Button>
              <Button onClick={e => onValidateForm(e, 'save')} style={{ marginLeft: 8 }}>
                保存
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Step2;
