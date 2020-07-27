//对账
import { Spin, message, Form, Modal, Button, Upload } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState  } from 'react';
import { CheckBill } from './Lastschrift.service';

interface CheckProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
}

const Check = (props: CheckProps) => {
  const { visible, closeModal, form, id, reload } = props;
  const { getFieldDecorator } = form;
  const [loading, setLoading] = useState<boolean>(false);

 
  const save = () => {
    if (!isUpload) {
      message.warning('请上传对账单');
      return;
    }

    setLoading(true);
    Modal.confirm({
      title: '请确认',
      content: '请确认上传数据的准确性，一旦对账无法撤回',
      onOk: () => {
        const newData = { keyvalue: id, uploadFile: form.getFieldValue('uploadFile') };
        CheckBill(newData).then(res => {
          setLoading(false);
          message.success('对账完成，请在列表页查看对账详情');
          closeModal();
          reload();
        });
      },
      onCancel: () => {
        setLoading(false);
      }
    });
  }

  const [isUpload, setIsUpload] = useState<boolean>(false);

  const uploadProps = {
    name: 'file',
    accept: '.xls,.xlsx',
    multiple: false,
    // showUploadList: false,
    action: process.env.basePath + '/Lastschrift/Upload',
    // headers: {
    //   authorization: 'authorization-text',
    // },
    onChange(info) {
      // if (info.fileList.length > 1) {
      //   message.error('只允许上传一个文件，请删除一个'); 
      // } 
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
        form.setFieldsValue({ uploadFile: info.file.response });
        setIsUpload(true);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    onRemove(info) {
      setIsUpload(false);
    }
  };

  return (
    <Modal
      title="对账"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => {
        setIsUpload(false);
        closeModal();
      }}
      onOk={save}
      destroyOnClose={true}
      confirmLoading={loading}
      bodyStyle={{ background: '#f6f7fb', height: '130px' }}
      width='380px'>
      <Spin tip="数据处理中..." spinning={loading}>
        {/* <div style={{ textAlign: 'center' }}> */}
        <Upload {...uploadProps}>
          {isUpload ? null : <Button><UploadOutlined />请上传对账单</Button>}
        </Upload> 
        {getFieldDecorator('uploadFile', {
        })(
          <input type='hidden' />
        )}
        {/* </div> */}
      </Spin>
    </Modal>

  );
};

export default Form.create<CheckProps>()(Check);

