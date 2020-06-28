//查看任务详情 
import { Modal, Upload, Tag, Divider, PageHeader, Button, Drawer, Form, Row, Col, Card } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useState } from 'react';
import { GetFilesData } from './Main.service';
import styles from './style.less';

interface ShowProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
  // typeId: string;
  // typeName: string;
};

const Show = (props: ShowProps) => {
  const { data, visible, closeDrawer } = props;
  let initData = data ? data : {};


  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');


  // 打开抽屉时初始化 
  useEffect(() => {
    if (visible) {
      if (data) {
        GetFilesData(data.id).then(res => {
          setFileList(res || []);
        });
      }
    }
  }, [visible]);

  //图片上传
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleCancel = () => setPreviewVisible(false);
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  return (
    <Drawer
      title='查看任务详情'
      placement="right"
      width={820}
      onClose={closeDrawer}
      visible={visible}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <PageHeader
        ghost={false}
        title={null}
        subTitle={
          <div>
            <label style={{ color: '#4494f0', fontSize: '24px' }}>{initData.pointName}</label>
          </div>
        }
        style={{
          border: '1px solid rgb(235, 237, 240)'
        }}>

        <Form layout='vertical'>
          <Row gutter={6}>
            <Col lg={4}>
              <Form.Item label="状态" >
                {initData.status == 1 ? <Tag color="#009688">已巡检</Tag> : <Tag color="#e4aa5b">未巡检</Tag>}
              </Form.Item>
            </Col>
            <Col lg={5}>
              <Form.Item label="路线名称" >
                {initData.lineName}
              </Form.Item>
            </Col>
            <Col lg={5}>
              <Form.Item label="路线编号" >
                {initData.code}
              </Form.Item>
            </Col>
            <Col lg={5}>
              <Form.Item label="所属楼盘" >
                {initData.psName}
              </Form.Item>
            </Col>
            <Col lg={5}>
              <Form.Item label="巡检角色" >
                {initData.roleName}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider dashed />
        {initData.content}
      </PageHeader>
      <Divider dashed />
      <Card className={styles.card}  >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <Col lg={6}>
              <Form.Item label="计划时间">
                {initData.planTime}
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item label="点位状态">
                {initData.pointStatus == 1 ? <Tag color="#009688">正常</Tag> : <Tag color="#e4aa5b">异常</Tag>}
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item label="执行时间">
                {initData.excuteTime}
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item label="执行人">
                {initData.excuteUserName}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={24}>
              <Form.Item label="说明" >
                {initData.memo}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col lg={24}>
              <div className="clearfix">
                <Upload
                  accept='image/*'
                  action={process.env.basePath + '/News/Upload'}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                >
                  {/* 只能查看 */}
                  {/* {fileList.length > 1 ? null : uploadButton} */}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </div>
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
        <Button onClick={closeDrawer}>
          取消
        </Button>
      </div>
    </Drawer >
  );

};

export default Form.create<ShowProps>()(Show);
