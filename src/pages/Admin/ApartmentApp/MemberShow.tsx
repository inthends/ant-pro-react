
import { Modal, Col, Drawer, Button, Upload, Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { GetMemberFilesData } from "./ApartmentApp.service";
import styles from './style.less';
interface MemberShowProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}

const MemberShow = (props: MemberShowProps) => {
  const { closeDrawer, data, visible } = props;
  const [infoDetail, setInfoDetail] = useState<any>({});

  //打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (data) {
        setInfoDetail(data);
        GetMemberFilesData(data.id).then(res => {
          setFileList(res || []);
        });
      }
    }
  }, [visible]);

  //图片上传
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [fileList, setFileList] = useState<any[]>([]);
  const handleCancel = () => setPreviewVisible(false);
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  return (
    <Drawer
      title='入住人员'
      placement="right"
      width={700}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }} >

      <Card className={styles.card} hoverable>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <Col lg={5}>
              <Form.Item label='姓名'>
                {infoDetail.name}
              </Form.Item>
            </Col>
            <Col lg={5}>
              <Form.Item label='手机号码'>
                {infoDetail.phoneNum}
              </Form.Item>
            </Col>
            <Col lg={5}>
              <Form.Item label='证件类型'>
                {infoDetail.certificateType}
              </Form.Item>
            </Col>
            <Col lg={9}>
              <Form.Item label='证件号码'>
                {infoDetail.certificateNO}
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={24}>
            <Col lg={5}>
              <Form.Item label='学历'>
                {infoDetail.education}
              </Form.Item>
            </Col>
            <Col lg={5}>
              <Form.Item label='荣誉证书'>
                {infoDetail.certificate}
              </Form.Item>
            </Col>
            <Col lg={5}>
              <Form.Item label='合住人数'>
                {infoDetail.sharing}
              </Form.Item>
            </Col>
            <Col lg={9}>
              <Form.Item label='合住人'>
                {infoDetail.sharingMan}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col lg={5}>
              <Form.Item label='合住人关系'>
                {infoDetail.sharingRelation}
              </Form.Item>
            </Col>
            <Col lg={19}>
              <Form.Item label='合住人联系方式'>
                {infoDetail.sharingTel}
              </Form.Item>
            </Col>
          </Row>

          <div className="clearfix">
            <Upload
              accept='image/*'
              //action={process.env.basePath + '/Apartment/UploadMember?keyvalue=' + keyvalue}
              listType="picture-card"
              fileList={fileList}
              disabled={true}
              onPreview={handlePreview}
            >
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>

        </Form>
      </Card>

      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          zIndex: 999,
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button style={{ marginRight: 8 }}
          onClick={closeDrawer}  >
          关闭
        </Button>
      </div>

    </Drawer >
  );
};

export default Form.create<MemberShowProps>()(MemberShow);
