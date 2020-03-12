
import { Upload, Modal, Tabs, Spin, Tag, Button, Card, Col, Drawer, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
// import { GetUserList, getCommonItems } from '@/services/commonItem';
import { GetEntity, GetFilesData } from './Main.service';
import styles from './style.less';
import CommentBoxShow from './CommentBoxShow';
const { TabPane } = Tabs;

interface ShowLinkProps {
  showVisible: boolean;
  billId?: string;
  form: WrappedFormUtils;
  closeDrawer(): void;
};

const ShowLink = (props: ShowLinkProps) => {
  const { showVisible, billId, closeDrawer, form } = props;
  const title = '查看服务单';
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  // const [repairMajors, setRepairMajors] = useState<any[]>([]); // 维修专业
  // const [userSource, setUserSource] = useState<any[]>([]);
  // 打开抽屉时初始化
  // useEffect(() => {
  //   // 获取维修专业
  //   getCommonItems('RepairMajor').then(res => {
  //     setRepairMajors(res || []);
  //   });
  // }, []);

  // 打开抽屉时初始化 
  useEffect(() => {
    if (showVisible) {
      setLoading(true);
      if (billId) {
        GetEntity(billId).then(res => {
          setInfoDetail(res);
          //图片
          GetFilesData(billId).then(res => {
            setFileList(res || []);
          });
          setLoading(false);
        })
        //setInfoDetail(billCode);
        //form.resetFields();
      } else {
        setInfoDetail({});
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  }, [showVisible]);

  const close = () => {
    closeDrawer();
  };

  //获取客户回访结果
  const GetCustEvaluate = (status) => {
    switch (status) {
      case 1:
        return '非常不满意';
      case 2:
        return '不满意';
      case 3:
        return '一般';
      case 4:
        return '满意';
      case 5:
        return '非常满意';
      default:
        return '';
    }
  };

  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');

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
      title={title}
      placement="right"
      width={820}
      onClose={close}
      visible={showVisible}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Spin tip="数据处理中..." spinning={loading}>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="基础信息" key="1">
            <Form layout="vertical" hideRequiredMark>
              <Card className={infoDetail.status == 2 ? styles.card2 : styles.card} title="基础信息" >
                <Row gutter={24}>
                  <Col lg={6}>
                    <Form.Item label="服务单号">
                      {infoDetail.billCode}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="单据来源"  >
                      {infoDetail.source}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="单据时间">
                      {infoDetail.billDate}
                    </Form.Item>
                  </Col>

                  <Col lg={4}>
                    <Form.Item label="联系人">
                      {infoDetail.contactName}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="联系电话">
                      {infoDetail.contactPhone}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={6}>
                    <Form.Item label="关联单号">
                      {infoDetail.businessCode}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="业务类型">
                      {infoDetail.billType}
                    </Form.Item>
                  </Col> 
                  <Col lg={5}>
                    <Form.Item label="位置编号">
                      {infoDetail.roomId}
                    </Form.Item>
                  </Col>

                  <Col lg={4}>
                    <Form.Item label="紧急程度">
                      {infoDetail.emergencyLevel}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="重要程度">
                      {infoDetail.importance}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={6}>
                    <Form.Item label="维修区域">
                      {infoDetail.repairArea}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="是否有偿">
                      {infoDetail.isPaid}
                    </Form.Item>
                  </Col>
                  <Col lg={14}>
                    <Form.Item label="详细地址">
                      {infoDetail.address}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="内容">
                      {infoDetail.contents}
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
                      // onChange={handleChange}
                      // onRemove={handleRemove}
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
              </Card>
              <Card title="回访情况" className={styles.card2}  >
                <Row gutter={24}>
                  <Col lg={6}>
                    <Form.Item label="回访方式"  >
                      {infoDetail.returnVisitMode}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="客户评价"  >
                      {GetCustEvaluate(infoDetail.custEvaluate)}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="回访时间" >
                      {infoDetail.returnVisitDate}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="回访人">
                      {infoDetail.returnVisiterName}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="回访结果" >
                      {infoDetail.returnVisitResult}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Form>
          </TabPane>
          {billId ? (
            <TabPane tab="留言动态" key="2">
              <CommentBoxShow billId={billId} />
            </TabPane>
          ) : null}
        </Tabs>
      </Spin>
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

export default Form.create<ShowLinkProps>()(ShowLink); 