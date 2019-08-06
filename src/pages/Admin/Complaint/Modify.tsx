
import {
  Divider, PageHeader,
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Row
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { SaveForm } from './Main.service';
import styles from './style.less';

const { TextArea } = Input;

interface ModifyProps {
  modifyVisible: boolean;
  data?: any;
  form: WrappedFormUtils;
  closeDrawer(): void;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { modifyVisible, data, closeDrawer, form, reload } = props;
  const { getFieldDecorator } = form;
  const title = data === undefined ? '添加维修单' : '修改维修单';
  const [infoDetail, setInfoDetail] = useState<any>({});

  // 打开抽屉时初始化
  useEffect(() => { }, []);

  // 打开抽屉时初始化 
  useEffect(() => {
    if (modifyVisible) {
      if (data) {
        setInfoDetail(data);
        form.resetFields();
      } else {
        setInfoDetail({});
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  }, [modifyVisible]);

  const close = () => {
    closeDrawer();
  };
  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = data ? { ...data, ...values } : values;
        doSave(newData);
      }
    });
  };
  const doSave = dataDetail => {
    dataDetail.keyValue = dataDetail.pCode;
    SaveForm({ ...dataDetail, type: 5 }).then(res => {
      message.success('保存成功');
      closeDrawer();
      reload();
    });
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={800}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >

      <PageHeader title={infoDetail.billCode}
        extra={[
          <Button key="3">附件</Button>,
        ]}
      />
      <Divider dashed />
      {modifyVisible ? (
        <Form layout="vertical" hideRequiredMark>
          <Card title="派单信息" className={styles.card}  >
            <Row gutter={24}>
              <Col lg={5}>
                <Form.Item label="维修专业" required>
                  {getFieldDecorator('name', {
                    initialValue: infoDetail.name,
                    rules: [{ required: true, message: '请选择维修专业' }],
                  })(<Input placeholder="请选择维修专业" />)}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="派单人" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="派单时间" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="接单人" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item label="接单时间" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="开工信息" className={styles.card}  >
            <Row gutter={24}>
              <Col lg={5}>
                <Form.Item label="维修专业" required>
                  {getFieldDecorator('name', {
                    initialValue: infoDetail.name,
                    rules: [{ required: true, message: '请选择维修专业' }],
                  })(<Input placeholder="请选择维修专业" />)}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="派单人" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="派单时间" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="接单人" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item label="接单时间" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="完成情况" className={styles.card}  >
            <Row gutter={24}>
              <Col lg={5}>
                <Form.Item label="维修专业" required>
                  {getFieldDecorator('name', {
                    initialValue: infoDetail.name,
                    rules: [{ required: true, message: '请选择维修专业' }],
                  })(<Input placeholder="请选择维修专业" />)}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="派单人" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="派单时间" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="接单人" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item label="接单时间" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="检验情况" className={styles.card}  >
            <Row gutter={24}>
              <Col lg={5}>
                <Form.Item label="维修专业" required>
                  {getFieldDecorator('name', {
                    initialValue: infoDetail.name,
                    rules: [{ required: true, message: '请选择维修专业' }],
                  })(<Input placeholder="请选择维修专业" />)}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="派单人" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="派单时间" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="接单人" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item label="接单时间" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
            </Row>
          </Card>



        </Form>


      ) : null}
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
        <Button onClick={save} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<ModifyProps>()(Modify); 