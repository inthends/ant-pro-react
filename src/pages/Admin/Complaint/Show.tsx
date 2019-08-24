
import { DatePicker, AutoComplete, Select, Tag, Typography, Row, Divider, PageHeader, Button, Card, Col, Drawer, Form, Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
// import { getResult } from '@/utils/networkUtils';
import { Visit, Handle, Approve, Project } from './Main.service';
import { GetUserList } from '@/services/commonItem';
// import { TreeEntity } from '@/model/models';
import styles from './style.less';
const { Paragraph } = Typography;
const { Option } = Select;

interface ShowProps {
  modifyVisible: boolean;
  data?: any;
  form: WrappedFormUtils;
  closeDrawer(): void;
  reload(): void;
}
const Show = (props: ShowProps) => {
  const { modifyVisible, data, closeDrawer, form, reload } = props;
  const { getFieldDecorator } = form;
  const title = data === undefined ? '添加投诉单' : '查看投诉单';
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [treeData, setTreeData] = useState<any[]>([]);
  const [userSource, setUserSource] = useState<any[]>([]);

  // 打开抽屉时初始化
  useEffect(() => {

    // 获取房产树
    // GetQuickSimpleTreeAll()
    //   .then(getResult)
    //   .then((res: TreeEntity[]) => {
    //     setTreeData(res || []);
    //     return res || [];
    //   }); 

  }, []);

  // 打开抽屉时初始化 
  useEffect(() => {
    if (modifyVisible) {
      if (data) {
        setInfoDetail(data);
        form.resetFields();
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

  const project = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = data ? { ...data, ...values } : values;
        //doSave(newData);
        //newData.keyValue = newData.pCode;
        Project({ ...newData, keyValue: newData.id }).then(res => {
          message.success('立项成功！');
          closeDrawer();
          reload();
        });
      }
    });
  };

  const handle = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = data ? { ...data, ...values } : values;
        //doSave(newData);
        //newData.keyValue = newData.pCode;
        Handle({ ...newData, keyValue: newData.id }).then(res => {
          message.success('处理成功！');
          closeDrawer();
          reload();
        });
      }
    });
  };

  const visit = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = data ? { ...data, ...values } : values;
        //doSave(newData);
        //newData.keyValue = newData.pCode;
        Visit({ ...newData, keyValue: newData.id }).then(res => {
          message.success('回访成功！');
          closeDrawer();
          reload();
        });
      }
    });
  };

  const approve = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = data ? { ...data, ...values } : values;
        //doSave(newData);
        //newData.keyValue = newData.pCode;
        Approve({ ...newData, keyValue: newData.id }).then(res => {
          message.success('审核成功！');
          closeDrawer();
          reload();
        });
      }
    });
  };

  // const doSave = dataDetail => {
  //   dataDetail.keyValue = dataDetail.pCode;
  //   SaveForm({ ...dataDetail, type: 5 }).then(res => {
  //     message.success('保存成功');
  //     closeDrawer();
  //     reload();
  //   });
  // };

  //转换状态
  const GetStatus = (infoDetail) => {
    if (infoDetail.isEnable == 0) {
      return <Tag color="#d82d2d">无效投诉</Tag>
    } else {

      switch (infoDetail.status) {
        case 1:
          return <Tag color="#e4aa5b">待处理</Tag>
        case 2:
          return <Tag color="#19d54e">处理中</Tag>
        case 3:
          return <Tag color="#e4aa5b">待回访</Tag>
        case 4:
          return <Tag color="#61c33a">待审核</Tag>
        case 5:
          return <Tag color="#40A9FF">已归档</Tag>
        default:
          return '';
      }
    }
  }

  const handleSearch = value => {
    if (value == '')
      return;
    GetUserList(value, '业主').then(res => {
      setUserSource(res || []);
    })
  };

  //实际处理人
  const handleUserSearch = value => {
    if (value == '')
      return;
    GetUserList(value, '员工').then(res => {
      setUserSource(res || []);
    })
  };

  const userList = userSource.map
    (item => <Option key={item.id} value={item.name}>{item.name}</Option>);

  //选择投诉对象
  const onOwnerSelect = (value, option) => {
    //form.setFieldsValue({ownerId: option.key });
  }

  //选择投诉对象类型
  const onSelectType = (value, option) => {
    GetUserList('', value).then(res => {
      setUserSource(res || []);
    })
  }

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
        title={infoDetail.billCode}
        subTitle={GetStatus(infoDetail)}
      // extra={[
      //   <Button key="1">附件</Button>
      // ]}
      >
        <Paragraph>
          {infoDetail.complaintAddress}，{infoDetail.complaintUser}，电话：<a>{infoDetail.complaintLink}</a>，在 {infoDetail.billDate} 投诉，内容如下
        </Paragraph>
        {infoDetail.contents}
      </PageHeader>
      <Divider dashed />
      {modifyVisible ? (
        <Form layout="vertical" hideRequiredMark>

          <Card title="立项信息" className={styles.card}  >
            <Row gutter={24}>
              <Col lg={6}>
                <Form.Item label="对象类别" >
                  {infoDetail.byComplaintType}
                </Form.Item>
              </Col>
              <Col lg={6}>
                <Form.Item label="投诉对象"  >
                  {infoDetail.byComplaintUser}
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


          <Card title="处理过程" className={styles.card}  >
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

          <Card title="回访情况" className={styles.card}  >
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
          </Card> 
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

        {infoDetail.status == 1 ? (
          <Button onClick={project} type="primary">
            立项
         </Button>
        ) : null}

        {infoDetail.status == 2 ? (
          <Button onClick={handle} type="primary">
            处理
          </Button>
        ) : null}

        {infoDetail.status == 3 ? (
          <Button onClick={visit} type="primary">
            回访
          </Button>
        ) : null}

        {infoDetail.status == 4 ? (
          <Button onClick={approve} type="primary">
            审核
          </Button>
        ) : null}

      </div>
    </Drawer>
  );
};

export default Form.create<ShowProps>()(Show); 