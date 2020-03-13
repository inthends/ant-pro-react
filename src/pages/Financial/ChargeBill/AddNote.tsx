//补充票据
import { message, Col, Form, Row, Modal, Input } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React from 'react'; 
import { SaveNote } from './Main.service';

interface AddNoteProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  keyValue: string;
  reload(): void;
}

const AddNote = (props: AddNoteProps) => {
  const { visible, closeModal, form, keyValue, reload } = props;
  const { getFieldDecorator } = form;
  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = { keyValue: keyValue, ...values};
        SaveNote(newData).then(res => {
          message.success('保存成功');
          closeModal();
          reload();
        });
      }
    });
  }

  return (
    <Modal
      title="补充票据"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={save}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb', height: '250px' }}
      width='400px' >
      <Form layout="vertical" hideRequiredMark> 
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label="收据编号">
              {getFieldDecorator('payCode', {
              })(<Input placeholder="请输入收据编号" />)}
            </Form.Item>
          </Col> 
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label="发票编号">
              {getFieldDecorator('invoiceCode', {
              })(<Input placeholder="请输入发票编号" />)}
            </Form.Item>
          </Col>
        </Row> 
      </Form>
    </Modal>
  );
};

export default Form.create<AddNoteProps>()(AddNote);

