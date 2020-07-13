
import { Upload, Tag, Input, Divider, PageHeader, Drawer, Col, Button, Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { Audit, GetFilesData } from "./ApartmentApp.service";
import styles from './style.less';
const { TextArea } = Input;
interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
};

const Modify = (props: ModifyProps) => {
  const { reload, form, data, closeDrawer, visible } = props;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [fileList, setFileList] = useState<any[]>([]);
  const { getFieldDecorator } = form;
  //打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (data) {
        //获取明细
        setInfoDetail(data);
        GetFilesData(data.id).then(res => {
          setFileList(res || []);
        });
      }
    }
  }, [visible]);

  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        let newData = {
          keyvalue: infoDetail.id,
          VerifyMemo: values.verifyMemo
        };
        Audit(newData).then(() => {
          closeDrawer();
          reload();
        });
      }
    });
  };

  return (
    <Drawer
      title='申请信息'
      placement="right"
      width={700}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }} >
      <Form layout='vertical'>
        <PageHeader
          ghost={false}
          title={null}
          subTitle={
            <div>
              <label style={{ color: '#4494f0', fontSize: '24px' }}>{infoDetail.name}</label>
            </div>
          }
          style={{
            border: '1px solid rgb(235, 237, 240)'
          }}
        // extra={[<img src={infoDetail.headImgUrl}></img>]}
        >

          <Row gutter={6}>
            <Col lg={4}>
              <Form.Item label="审核状态" >
                {infoDetail.ifVerify ? <Tag color="#61c33a">已审核</Tag> : <Tag color="#d82d2d">待审核</Tag>}
              </Form.Item>
            </Col>
            <Col lg={3}>
              <Form.Item label="类别" >
                {infoDetail.userType}
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item label="手机号码" >
                {infoDetail.phoneNum}
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item label="电子邮箱" >
                {infoDetail.email}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item label="申请日期" >
                {String(infoDetail.appDate).substr(0, 10)}
              </Form.Item>
            </Col>
          </Row>

          <Divider dashed />
          {infoDetail.address}
        </PageHeader>
        <Divider dashed />
        <Card className={styles.card} hoverable>

          {infoDetail.userType === '个人' ?
            <>
              <Row gutter={24}>
                <Col lg={24}>
                  <Form.Item label="工作单位">
                    {infoDetail.workUnit}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={8}>
                  <Form.Item label="证件类别">
                    {infoDetail.certificateType}
                  </Form.Item>
                </Col>
                <Col lg={16}>
                  <Form.Item label="证件号码">
                    {infoDetail.certificateNO}
                  </Form.Item>
                </Col>
              </Row></> :

            <Row gutter={24}>
              <Col lg={8}>
                <Form.Item label='法人代表'>
                  {infoDetail.legal}
                </Form.Item>
              </Col>
              <Col lg={16}>
                <Form.Item label='组织机构代码'>
                  {infoDetail.taxCode}
                </Form.Item>
              </Col>
            </Row>}

          <Row gutter={24}>
            <Col lg={8}>
              <Form.Item label='传真号码'>
                {infoDetail.fax}
              </Form.Item>
            </Col>
            <Col lg={16}>
              <Form.Item label='说明'>
                {infoDetail.memo}
              </Form.Item>
            </Col>
          </Row>
          <div className="clearfix">
            <Upload
              accept='image/*'
              //action={process.env.basePath + '/Apartment/Upload?keyvalue='}
              listType="picture-card"
              fileList={fileList}
              disabled={true}
            >
            </Upload>
          </div>

          {!infoDetail.ifVerify ?
            <Row>
              <Col span={24}>
                <Form.Item label="审核情况"  >
                  {getFieldDecorator('verifyMemo', {
                    initialValue: infoDetail.verifyMemo
                  })(
                    <TextArea rows={4} placeholder="请输入审核情况" />
                  )}
                </Form.Item>
              </Col>
            </Row> : null}
        </Card>
      </Form>
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

        <Button type="primary"
          onClick={onSave}
        >
          {infoDetail.ifVerify ? '反审' : '审核'}
        </Button>
      </div>
    </Drawer>

  );
};

export default Form.create<ModifyProps>()(Modify);
