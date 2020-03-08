
import {   Tag, Divider, PageHeader, Button, Card, Col, Drawer, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
// import { GetUserList, getCommonItems } from '@/services/commonItem';
import { GetEntityShow } from './Main.service'; 
import styles from './style.less'; 

interface ShowLinkProps {
  showVisible: boolean;
  billCode?: string;
  form: WrappedFormUtils;
  closeDrawer(type): void;
};

const ShowLink = (props: ShowLinkProps) => {
  const { showVisible, billCode,closeDrawer, form } = props; 
  const title = '查看维修单';
  const [infoDetail, setInfoDetail] = useState<any>({});
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
      if (billCode) {
        GetEntityShow(billCode).then(res => {
          setInfoDetail(res);
          // setLoading(false);
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
    closeDrawer("Repair");
  };

  //转换状态
  const GetStatus = (status) => {
    switch (status) {
      case 1:
        return <Tag color="#e4aa5b">待派单</Tag>;
      case 2:
        return <Tag color="#19d54e">待接单</Tag>;
      case 3:
        return <Tag color="#e4aa5b">待开工</Tag>;
      case 4:
        return <Tag color="#61c33a">待完成</Tag>;
      // case 5:
      //   return <Tag color="#ff5722">待回访</Tag>;
      case 5:
        return <Tag color="#5fb878">待检验</Tag>;
      case 6:
        return <Tag color="#29cc63">待审核</Tag>;
      case 7:
        return <Tag color="#e48f27">已审核</Tag>;
      case -1:
        return <Tag color="#c31818">已作废</Tag>;
      default:
        return '';
    }
  };

  // const handleSearch = value => {
  //   if (value == '')
  //     return;
  //   GetUserList(value, '员工').then(res => {
  //     setUserSource(res || []);
  //   })
  // };

  // const userList = userSource.map
  //   (item => <Option key={item.id} value={item.name}>{item.name}</Option>);

  // //选择接单人
  // const onReceiverNameSelect = (value, option) => {
  //   //设置id
  //   form.setFieldsValue({ receiverId: option.key });
  // };


  // const range = (start, end) => {
  //   let result: number[] = [];
  //   for (let i = start; i < end; i++) {
  //     result.push(i);
  //   }
  //   return result;
  // };

  // const disabledDateTime = () => {
  //   const mindate = moment(data.beginDate);
  //   const h = mindate.hours();
  //   return {
  //     disabledHours: () => range(0, h),
  //     //disabledMinutes: () => range(30, 60),
  //     //disabledSeconds: () => [55, 56],
  //   };
  // }

  return (
    <Drawer
      title={title}
      placement="right"
      width={850}
      onClose={close}
      visible={showVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <PageHeader
        // title={infoDetail.billCode}
        // subTitle={GetStatus(infoDetail.status)}
        // extra={[
        //   <Button key="3">附件</Button>,
        // ]} 
        title={null}
        subTitle={
          <div>
            <label style={{ color: '#4494f0', fontSize: '24px' }}>{infoDetail.address}</label>
          </div>
        }
        style={{
          border: '1px solid rgb(235, 237, 240)'
        }}>

        <Form layout='vertical'>
          <Row gutter={6}>
            <Col lg={5}>
              <Form.Item label="单号" >
                {infoDetail.billCode}
              </Form.Item>
            </Col>
            <Col lg={3}>
              <Form.Item label="状态" >
                {GetStatus(infoDetail.status)}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item label="联系人" >
                {infoDetail.contactName}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item label="电话" >
                {infoDetail.contactLink}
              </Form.Item>
            </Col>
            <Col lg={3}>
              <Form.Item label="是否有偿" >
                {infoDetail.isPaid}
              </Form.Item>
            </Col>
            <Col lg={5}>
              <Form.Item label="报修时间" >
                {infoDetail.billDate}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider dashed />
        {infoDetail.repairContent}
      </PageHeader>
      <Divider dashed />
      {
        showVisible ? (
          <Form layout="vertical" hideRequiredMark>
            {infoDetail.status == 1 ? (
              <Card title="派单" className={styles.card} hoverable>
                <Row gutter={24}>
                  <Col lg={5}>
                    <Form.Item label="维修专业">
                      {infoDetail.repairMajor}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="指派给" >
                      {infoDetail.receiverName}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="派单人" >
                      {infoDetail.senderName}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="派单时间"  >
                      {infoDetail.sendDate}
                    </Form.Item>
                  </Col>

                  <Col lg={5}>
                    <Form.Item label="接单时间">
                      {infoDetail.receiverDate}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>) : null}
            {infoDetail.status > 3 ? (
              <Card title="开工" className={styles.card} hoverable>
                <Row gutter={24}>
                  <Col lg={6}>
                    <Form.Item label="开工时间"  >
                      {infoDetail.beginDate}
                    </Form.Item>
                  </Col>
                  <Col lg={18}>
                    <Form.Item label="故障判断">
                      {infoDetail.faultJudgement}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ) : null}

            {infoDetail.status > 4 ?
              (<Card title="完成情况" className={infoDetail.status == 5 ? styles.card2 : styles.card} >
                <Row gutter={24}>
                  <Col lg={6}>
                    <Form.Item label="用时(分钟)">
                      {infoDetail.useTime}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="人工费"  >
                      {infoDetail.laborFee}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="材料费"  >
                      {infoDetail.stuffFee}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="费用合计">
                      {infoDetail.totalFee}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={6}>
                    <Form.Item label="完成时间">
                      {infoDetail.endDate}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="完成情况" >
                      {infoDetail.achieved}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="现场评价"  >
                      {infoDetail.fieldEvaluation}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="业主意见"  >
                      {infoDetail.ownerOpinion}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>) : null} 
            {(infoDetail.status > 7 && infoDetail.repairArea == '公共区域') ? (
              <Card title="检验情况" className={styles.card} hoverable >
                <Row gutter={24}>
                  <Col lg={5}>
                    <Form.Item label="检验时间" >
                      {infoDetail.testDate}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
                    <Form.Item label="检验人"  >
                      {infoDetail.testerName}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
                    <Form.Item label="检验结果" >
                      {infoDetail.testResult}
                    </Form.Item>
                  </Col>
                  <Col lg={13}>
                    <Form.Item label="检验说明"  >
                      {infoDetail.testRemark}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ) : null}
          </Form>
        ) : null
      }
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
        }}>
        <Button onClick={close} style={{ marginRight: 8 }}>关闭</Button>

      </div>
    </Drawer >
  );
};

export default Form.create<ShowLinkProps>()(ShowLink); 