
import { Spin, Icon, Tooltip, Tag, Divider, PageHeader, List, Button, Card, Col, Drawer, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetFormJson, RefreshFollow } from './Main.service';
import styles from './style.less';
import Follow from './Follow';

interface DetailProps {
  visible: boolean;
  id?: string;//id 
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
}

const Detail = (props: DetailProps) => {
  const { visible, closeDrawer, id, form } = props;
  const title = '客户详情';
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [house, setHouse] = useState<any[]>([]);
  const [followVisible, setFollowVisible] = useState<boolean>(false);
  const [count, setCount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  //最新跟进
  const [newflow, setNewFlow] = useState<string>('');

  const closeFollowDrawer = () => {
    setFollowVisible(false);
  };
  const showFollowDrawer = () => {
    setFollowVisible(true);
  };

  // 打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (id) {
        setLoading(true);
        GetFormJson(id).then((res) => {
          setInfoDetail(res.data);
          setHouse(res.houseList || []);//意向房源
          setCount(res.followCount);//跟进
          setNewFlow(res.newFollow);
          form.resetFields();
          setLoading(false);
          //获取跟进数量
          // GetFollowCount(id).then(res => {
          //   setCount(res);
          //   GetNewFollow(id).then(info => {
          //     setNewFlow(info);
          //     setLoading(false);
          //   });
          // })
        });
      } else {
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  }, [visible]);

  //转换状态
  const GetStatus = (status) => {
    switch (status) {
      case 1:
        return <Tag color="#e4aa4b">初次接触</Tag>;
      case 2:
        return <Tag color="#19d54e">潜在客户</Tag>;
      case 3:
        return <Tag color="#19d54e">意向客户</Tag>;
      case 4:
        return <Tag color="#19d54e">成交客户</Tag>;
      case 5:
        return <Tag color="#19d54e">流失客户</Tag>;
      default:
        return '';
    }
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={1100}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Spin tip="数据处理中..." spinning={loading}>
        <PageHeader
          ghost={false} 
          subTitle={
            <div>
              <label style={{ color: '#4494f0', fontSize: '24px' }}>{infoDetail.customer}</label>
            </div>
          }
          title={null}
          style={{
            border: '1px solid rgb(235, 237, 240)'
          }}
          // title={GetStatus(infoDetail.status)}
          extra={[
            <Tooltip title='跟进人'>
              <Button key="1" icon="user"> {infoDetail.follower}</Button>
            </Tooltip>,
            // <Button key="2" icon="edit" onClick={() => modify(id)}>编辑</Button>,
            <Button key="3" icon="message" onClick={showFollowDrawer} >跟进({count})</Button>
          ]}
        >
          <Divider dashed />
          <Form layout='vertical'>
            <Row gutter={24}>
              <Col lg={6}>
                <Form.Item label="客户状态" >
                  {GetStatus(infoDetail.status)}
                  {String(infoDetail.visitDate).substr(0, 10)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label={<div>最新跟进 <Icon type="sound" /></div>}>
                  {newflow}
                </Form.Item>
              </Col>
              <Col lg={3}>
                <Form.Item label="成交几率" >
                  {infoDetail.tradeOdds ? infoDetail.tradeOdds : '-'}%
              </Form.Item>
              </Col>
              <Col lg={3}>
                <Form.Item label="需求数量/m²" >
                  {infoDetail.demandMinSize + ' - ' + infoDetail.demandMaxSize}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </PageHeader>
        <Divider dashed />
        <Form layout="vertical">
          <Row gutter={24}>
            <Col span={12}>
              <Card title="基本信息" className={styles.card} hoverable>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="客户联系人" >
                      {infoDetail.customerContact}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="联系人电话">
                      {infoDetail.customerTelephone}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="行业">
                      {infoDetail.industry}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="预计签约时间">
                      {infoDetail.signingDate == null ? '' : String(infoDetail.signingDate).substr(0, 10)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="来访渠道" >
                      {infoDetail.visitChannel}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="渠道联系人" >
                      {infoDetail.channelContact}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="备注" >
                      {infoDetail.remark}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card title="需求信息" className={styles.addcard} hoverable>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="城市/区域/商圈"  >
                      {infoDetail.tradingArea}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="期望价格"  >
                      {infoDetail.demandMinPrice == null ? '' : infoDetail.demandMinPrice + ' - ' + infoDetail.demandMaxPrice + infoDetail.demandPriceUnit}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

            </Col>

            <Col span={12}>
              <Card title="意向房源" className={styles.card} hoverable>
                <Row gutter={24}>
                  <Col lg={24}>
                    <List
                      dataSource={house}
                      renderItem={item =>
                        <List.Item  >
                          <List.Item.Meta title={item.allName} />
                          <div>{item.area}㎡</div>
                        </List.Item>
                      }
                    />
                  </Col>
                </Row>
              </Card>

              <Card title="客户当前信息" className={styles.addcard}>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="联系地址" >
                      {infoDetail.customerAddress}
                    </Form.Item>
                  </Col>

                  <Col lg={12}>
                    <Form.Item label="当前合同到期日" >
                      {infoDetail.oldContractDueDate}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="当前租赁数/㎡"  >
                      {infoDetail.leaseSize}
                    </Form.Item>
                  </Col>

                  <Col lg={12}>
                    <Form.Item label="当前租金" >
                      {infoDetail.leasePrice ? infoDetail.leasePrice : '-' + infoDetail.leasePriceUnit}
                    </Form.Item>
                  </Col>

                </Row>
              </Card>
            </Col>
          </Row>
        </Form>

      </Spin>

      <div
        style={{
          position: 'absolute',
          zIndex: 999,
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
          关闭
          </Button>
        {/* <Button type="primary">
          确定
          </Button> */}
      </div>

      {/* 跟进 */}

      <Follow
        visible={followVisible}
        closeDrawer={closeFollowDrawer}
        id={id}
        reload={() => {
          RefreshFollow(id).then(res => {
            setCount(res.followCount);
            setNewFlow(res.newFollow);
            setLoading(false);
          })
        }}
      />

    </Drawer >
  );
};

export default Form.create<DetailProps>()(Detail);

