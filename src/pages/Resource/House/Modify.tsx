import { Card, Col, DatePicker, Drawer, Form, Input, Row, Select, Button } from 'antd';
import React from 'react';
import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface ModifyStates {
  modifyVisible: boolean;
  data?: any;
  closeDrawer(): void;
  form;
}
const Modify = (props: ModifyStates) => {
  const {
    modifyVisible,
    data,
    closeDrawer,
    form: { getFieldDecorator },
  } = props;
  const title = data === undefined ? '添加小区' : '修改小区';

  const close = () => {
    closeDrawer();
  };
  return (
    <Drawer
      title={title}
      placement="right"
      width={600}
      maskClosable={false}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Card title="基本信息" className={styles.card} bordered={false}>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="隶属机构" required>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入隶属机构' }],
                })(<Input placeholder="请输入隶属机构" />)}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="小区编号" required>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入小区编号' }],
                })(<Input placeholder="请输入小区编号" />)}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="小区名称" required>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入小区名称' }],
                })(<Input placeholder="请输入小区名称" />)}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col lg={24}>
              <Form.Item label="所属省市区">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入所属省市区' }],
                })(<Input placeholder="请输入所属省市区" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={24}>
              <Form.Item label="详细地址	">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入详细地址' }],
                })(<Input placeholder="请输入详细地址" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="环线">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入环线' }],
                })(<Input placeholder="请输入环线" />)}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="地铁">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入地铁' }],
                })(<Input placeholder="请输入地铁" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="经度">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入经度' }],
                })(<Input placeholder="请输入经度" />)}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="纬度">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入纬度' }],
                })(<Input placeholder="请输入纬度" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="总建筑面积(㎡)">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入总建筑面积' }],
                })(<Input placeholder="请输入总建筑面积" />)}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="占地面积(㎡)">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入占地面积' }],
                })(<Input placeholder="请输入占地面积" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="容积率(㎡)">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入容积率' }],
                })(<Input placeholder="请输入容积率" />)}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="绿化面积(㎡)">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入绿化面积' }],
                })(<Input placeholder="请输入绿化面积" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="项目类型">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入项目类型' }],
                })(<Input placeholder="请输入项目类型" />)}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="建成年份">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入建成年份' }],
                })(<Input placeholder="请输入建成年份" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="开发商">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入开发商' }],
                })(<Input placeholder="请输入开发商" />)}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="物业公司">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入物业公司' }],
                })(<Input placeholder="请输入物业公司" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={24}>
              <Form.Item label="物业标准费">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入物业标准费' }],
                })(<Input placeholder="请输入物业标准费" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={24}>
              <Form.Item label="附加说明">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入附加说明' }],
                })(<TextArea rows={4} placeholder="请输入物业标准费" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button onClick={close} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={close} type="primary">
            提交
          </Button>
        </div>
    </Drawer>
  );
};

export default Form.create()(Modify);
