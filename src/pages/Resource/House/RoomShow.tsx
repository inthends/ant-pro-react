//显示房产信息
import { Tag, Divider, PageHeader, Upload, Modal, Button, Card, Col, Drawer, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import styles from './style.less';
import { GetFormInfoJson } from './House.service';

interface RoomShowProps {
  visible: boolean;
  form: WrappedFormUtils;
  close(): void;
  unitId?: any;
};

const RoomShow = (props: RoomShowProps) => {
  const { visible, close, form, unitId } = props;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');

  // 打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (unitId) {
        GetFormInfoJson(unitId).then(res => {
          setInfoDetail(res);
          //加载图片
          let files: any[]; files = [];
          if (res.mainPic != null) {
            const filedate = {
              url: res.mainPic,
              uid: res.id//必须
            }
            files.push(filedate);
          }
          setFileList(files);
        });
        form.resetFields();
      } else {
        setInfoDetail({});
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  }, [visible]);

  // const close = () => {
  //   closeDrawer();
  // };

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
  //图片上传end

  //转换状态
  const GetStatus = (status) => {
    switch (status) {
      case 0:
        return <Tag color="#c32c2b">未售</Tag>
      case 1:
        return <Tag color="#cf366f">待交房</Tag>
      case 2:
        return <Tag color="#e97d1c">装修</Tag>
      case 3:
        return <Tag color="#566485">空置</Tag>
      case 4:
        return <Tag color="#9ac82b">出租</Tag>
      case 5:
        return <Tag color="#e7ba0d">自用</Tag>
      case -1:
        return <Tag color="#40A9FF">已作废</Tag>
      default:
        return '';
    }
  }

  return (
    <Drawer
      title="查看房间"
      placement="right"
      width={650}
      onClose={close}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }} >
      <PageHeader
        ghost={false} 
        title={null}
        subTitle={
          <div>
            <label style={{ color: '#4494f0', fontSize: '24px' }}>{infoDetail.code}</label>
          </div>
        }
        style={{
          border: '1px solid rgb(235, 237, 240)'
        }}>
        <Form layout='vertical'>
          <Row gutter={6}>
            <Col lg={4}>
              <Form.Item label="名称" >
                {infoDetail.name}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item label="状态" >
                {GetStatus(infoDetail.state)}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item label="业主名称">
                {infoDetail.ownerName}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item label="业主电话">
                {infoDetail.ownerPhone}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item label="租户名称">
                {infoDetail.tenantName}
              </Form.Item>
            </Col> 
            <Col lg={4}>
              <Form.Item label="租户电话">
                {infoDetail.tenantPhone}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider dashed />
        {infoDetail.allName}
      </PageHeader>
      <Divider dashed />
      <Card className={styles.card}  hoverable>
        {visible ? (
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={24}>
              <Col lg={6}>
                <Form.Item label="建筑面积(㎡)">
                  {infoDetail.area}
                </Form.Item>
              </Col>
              <Col lg={6}>
                <Form.Item label="产权面积(㎡)">
                  {infoDetail.propertyArea}
                </Form.Item>
              </Col>
              <Col lg={6}>
                <Form.Item label="计费面积(㎡)">
                  {infoDetail.billArea}
                </Form.Item>
              </Col>
              <Col lg={6}>
                <Form.Item label="管家电话">
                  {infoDetail.phoneNum}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={24}>
                <Form.Item label="附加说明">
                  {infoDetail.memo}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={24}>
                <div className="clearfix">
                  <Upload
                    accept='image/*'
                    action={process.env.basePath + '/PStructs/Upload'}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview} >
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              </Col>
            </Row>
          </Form>
        ) : null}
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
      </div>
    </Drawer>
  );
};

export default Form.create<RoomShowProps>()(RoomShow); 
