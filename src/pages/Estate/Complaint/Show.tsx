
import { Tag, Row, Divider, PageHeader, Button, Card, Col, Drawer, Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
// import { getResult } from '@/utils/networkUtils';
import { GetEntity } from './Main.service';
// import { GetUserList } from '@/services/commonItem';
// import { TreeEntity } from '@/model/models';
import styles from './style.less';
// const { Option } = Select;

interface ShowProps {
  modifyVisible: boolean;
  // data?: any;
  id?: string;
  form: WrappedFormUtils;
  closeDrawer(): void;
  // reload(): void;
  showLink(billId): void;
}
const Show = (props: ShowProps) => {
  const { showLink, modifyVisible, id, closeDrawer, form } = props;
  // const { getFieldDecorator } = form;
  const title = id === undefined ? '添加投诉单' : '查看投诉单';
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [treeData, setTreeData] = useState<any[]>([]);
  // const [userSource, setUserSource] = useState<any[]>([]);

  // 打开抽屉时初始化
  // useEffect(() => { 
  //   // 获取房产树
  //   // GetQuickSimpleTreeAll()
  //   //   .then(getResult)
  //   //   .then((res: TreeEntity[]) => {
  //   //     setTreeData(res || []);
  //   //     return res || [];
  //   //   });  
  // }, []);


  const [serverCode, setServerCode] = useState<string>('');
  const [serverId, setServerId] = useState<string>('');

  // 打开抽屉时初始化 
  useEffect(() => {
    if (modifyVisible) {
      if (id) {
        GetEntity(id).then(info => {
          //赋值
          setInfoDetail(info.entity);
          setServerCode(info.serverCode);
          setServerId(info.serverId);
        })
        // setInfoDetail(data);
        // form.resetFields();
      } else {
        setInfoDetail({});
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  }, [modifyVisible]);

  const close = () => {
    closeDrawer();
  };

  // const project = () => {
  //   form.validateFields((errors, values) => {
  //     if (!errors) {
  //       const newData = data ? { ...data, ...values } : values;
  //       //doSave(newData);
  //       //newData.keyvalue = newData.id;
  //       Project({ ...newData, keyvalue: newData.id }).then(res => {
  //         message.success('立项成功');
  //         closeDrawer();
  //         reload();
  //       });
  //     }
  //   });
  // };

  // const handle = () => {
  //   form.validateFields((errors, values) => {
  //     if (!errors) {
  //       const newData = data ? { ...data, ...values } : values;
  //       //doSave(newData);
  //       //newData.keyvalue = newData.id;
  //       Handle({ ...newData, keyvalue: newData.id }).then(res => {
  //         message.success('处理成功！');
  //         closeDrawer();
  //         reload();
  //       });
  //     }
  //   });
  // };

  // const visit = () => {
  //   form.validateFields((errors, values) => {
  //     if (!errors) {
  //       const newData = data ? { ...data, ...values } : values;
  //       //doSave(newData);
  //       //newData.keyvalue = newData.id;
  //       Visit({ ...newData, keyvalue: newData.id }).then(res => {
  //         message.success('回访成功！');
  //         closeDrawer();
  //         reload();
  //       });
  //     }
  //   });
  // };

  // const approve = () => {
  //   form.validateFields((errors, values) => {
  //     if (!errors) {
  //       const newData = data ? { ...data, ...values } : values;
  //       //doSave(newData);
  //       //newData.keyvalue = newData.id;
  //       Approve({ ...newData, keyvalue: newData.id }).then(res => {
  //         message.success('审核成功！');
  //         closeDrawer();
  //         reload();
  //       });
  //     }
  //   });
  // };

  // const doSave = dataDetail => {
  //   dataDetail.keyvalue = dataDetail.id;
  //   SaveForm({ ...dataDetail, type: 5 }).then(res => {
  //     message.success('保存成功');
  //     closeDrawer();
  //     reload();
  //   });
  // };

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

  // const handleSearch = value => {
  //   if (value == '')
  //     return;
  //   GetUserList(value, '业主').then(res => {
  //     setUserSource(res || []);
  //   })
  // };

  //实际处理人
  // const handleUserSearch = value => {
  //   if (value == '')
  //     return;
  //   GetUserList(value, '员工').then(res => {
  //     setUserSource(res || []);
  //   })
  // };

  // const userList = userSource.map
  //   (item => <Option key={item.id} value={item.name}>{item.name}</Option>);

  // //选择投诉对象
  // const onOwnerSelect = (value, option) => {
  //   //form.setFieldsValue({ownerId: option.key });
  // }

  // //选择投诉对象类型
  // const onSelectType = (value, option) => {
  //   GetUserList('', value).then(res => {
  //     setUserSource(res || []);
  //   })
  // }

  return (
    <Drawer
      title={title}
      placement="right"
      width={800}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <PageHeader
        // title={infoDetail.billCode}
        // subTitle={GetStatus(infoDetail)}
        ghost={false}
        title={null}
        subTitle={
          <div>
            <label style={{ color: '#4494f0', fontSize: '24px' }}>{infoDetail.byComplaintUserName}</label>
          </div>
        }
        style={{
          border: '1px solid rgb(235, 237, 240)'
        }} >
        {/* <Paragraph>
          {infoDetail.complaintAddress}，{infoDetail.complaintUser}，电话：<a>{infoDetail.complaintLink}</a>，在 {infoDetail.billDate} 投诉，内容如下
        </Paragraph>
        {infoDetail.contents} */}
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
            <Col lg={3}>
              <Form.Item label="联系人" >
                {infoDetail.complaintUser ? infoDetail.complaintUser : '匿名'}
              </Form.Item>
            </Col>
            <Col lg={3}>
              <Form.Item label="电话" >
                {infoDetail.complaintLink ? infoDetail.complaintLink : '无'}
              </Form.Item>
            </Col>
            <Col lg={5}>
              <Form.Item label="投诉时间" >
                {infoDetail.billDate}
              </Form.Item>
            </Col>
            <Col lg={5}>
              <Form.Item label="关联单号" >
                <a onClick={() => showLink(serverId)}>{serverCode}</a>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider dashed />
        {infoDetail.contents}
      </PageHeader>
      <Divider dashed />
      {modifyVisible ? (
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
          </Card>*/}
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
          取消
        </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<ShowProps>()(Show); 