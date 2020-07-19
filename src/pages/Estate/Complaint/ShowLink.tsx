
import { Tag, Row, Divider, PageHeader, Button, Card, Col, Drawer, Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetEntityByCode } from './Main.service';
import styles from './style.less';
// const { Option } = Select;

interface ShowLinkProps {
  showVisible: boolean;
  billCode?: string;
  form: WrappedFormUtils;
  closeDrawer(type): void;
}
const ShowLink = (props: ShowLinkProps) => {
  const { showVisible, billCode, closeDrawer, form } = props;
  const title = '查看投诉单';
  const [infoDetail, setInfoDetail] = useState<any>({});

  // 打开抽屉时初始化 
  useEffect(() => {
    if (showVisible) {
      if (billCode) {
        GetEntityByCode(billCode).then(res => {
          setInfoDetail(res);
          // setLoading(false);
        })
        // setInfoDetail(billCode);
        // form.resetFields();
      } else {
        setInfoDetail({});
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  }, [showVisible]);

  const close = () => {
    closeDrawer("Complaint");
  };


  //转换状态
  const GetStatus = (status, isEnable) => {
    if (isEnable == 0) {
      return <Tag color="#d82d2d">无效投诉</Tag>
    } else {
      switch (status) {
        case 1:
          return <Tag color="#e4aa5b">待处理</Tag>
        case 2:
          return <Tag color="#19d54e">待完成</Tag>
        case 3:
          return <Tag color="#e4aa5b">待回访</Tag>
        case 4:
          return <Tag color="#61c33a">待审核</Tag>
        case 5:
          return <Tag color="#40A9FF">已审核</Tag>
        case -1:
          return <Tag color="#40A9FF">已作废</Tag>
        default:
          return '';
      }
    }
  }

  return (
    <Drawer
      title={title}
      placement="right"
      width={800}
      onClose={close}
      visible={showVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <PageHeader
        ghost={false}
        title={null}
        subTitle={
          <div>
            <label style={{ color: '#4494f0', fontSize: '24px' }}>{infoDetail.complaintAddress}</label>
          </div>
        }
        style={{
          border: '1px solid rgb(235, 237, 240)'
        }}
      >
        <Form layout='vertical'>
          <Row gutter={6}>
            <Col lg={5}>
              <Form.Item label="单号" >
                {infoDetail.billCode}
              </Form.Item>
            </Col>
            <Col lg={3}>
              <Form.Item label="状态" >
                {GetStatus(infoDetail.status, infoDetail.isEnable)}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item label="联系人" >
                {infoDetail.complaintUser ? infoDetail.complaintUser : '匿名'}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item label="电话" >
                {infoDetail.complaintLink ? infoDetail.complaintLink : '无'}
              </Form.Item>
            </Col>
            <Col lg={5}>
              <Form.Item label="投诉时间" >
                {infoDetail.billDate}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider dashed />
        {infoDetail.contents}
      </PageHeader>
      <Divider dashed />
      {showVisible ? (
        <Form layout="vertical" hideRequiredMark>
          <Card title="立项信息" className={styles.card} hoverable >
            <Row gutter={24}>
              <Col lg={6}>
                <Form.Item label="对象类别" >
                  {infoDetail.byComplaintType}
                </Form.Item>
              </Col>
              <Col lg={6}>
                <Form.Item label="投诉对象"  >
                  {infoDetail.byComplaintUserName}
                </Form.Item>
              </Col>
              <Col lg={6}>
                <Form.Item label="联系电话"  >
                  {infoDetail.byComplaintUerTel}
                </Form.Item>
              </Col>
              <Col lg={6}>
                <Form.Item label="地址"  >
                  {infoDetail.byComplaintRoomAllName}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={6}>
                <Form.Item label="投诉性质"  >
                  {infoDetail.complaintNature}
                </Form.Item>
              </Col>
              <Col lg={6}>
                <Form.Item label="处理负责人"  >
                  {infoDetail.handleCharger}
                </Form.Item>
              </Col>
              <Col lg={6}>
                <Form.Item label="联系电话"  >
                  {infoDetail.handleChargeTel}
                </Form.Item>
              </Col>
              <Col lg={6}>
                <Form.Item label="立项人">
                  {infoDetail.setUpUserName}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={6}>
                <Form.Item label="立项时间">
                  {infoDetail.setUpDate}
                </Form.Item>
              </Col>
              <Col lg={18}>
                <Form.Item label="处理建议"  >
                  {infoDetail.suggestion}
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="处理过程" className={styles.card2} hoverable >
            <Row gutter={24}>
              <Col lg={6}>
                <Form.Item label="实际处理人" >
                  {infoDetail.handleUser}
                </Form.Item>
              </Col>
              <Col lg={18}>
                <Form.Item label="处理过程"  >
                  {infoDetail.handleProcess}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={6}>
                <Form.Item label="完成时间"  >
                  {infoDetail.finishTime}
                </Form.Item>
              </Col>
              <Col lg={18}>
                <Form.Item label="业主意见"  >
                  {infoDetail.custSuggestion}
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* <Card title="回访情况" className={styles.card2} hoverable >
            <Row gutter={24}>
              <Col lg={6}>
                <Form.Item label="回访方式"  >
                  {infoDetail.returnVisitType}
                </Form.Item>
              </Col>

              <Col lg={6}>
                <Form.Item label="回访时间"  >
                  {infoDetail.returnVisitDate}
                </Form.Item>
              </Col>
              <Col lg={6}>
                <Form.Item label="回访人"  >
                  {infoDetail.returnVisitUser}
                </Form.Item>
              </Col>

              <Col lg={6}>
                <Form.Item label="客户评价"  >
                  {infoDetail.custAssess}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={24}>
                <Form.Item label="回访结果"  >
                  {infoDetail.returnVisitResult}
                </Form.Item>
              </Col>
            </Row>
          </Card> */}
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
          关闭
        </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<ShowLinkProps>()(ShowLink); 