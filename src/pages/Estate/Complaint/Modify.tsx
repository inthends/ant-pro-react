
import { DatePicker, AutoComplete, Select, Tag, Typography, Row, Divider, PageHeader, Button, Card, Col, Drawer, Form, Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
// import { getResult } from '@/utils/networkUtils';
import { GetUserByCustomerId, Visit, Handle, Approve, Project } from './Main.service';
import { GetUserList } from '@/services/commonItem';
// import { TreeEntity } from '@/model/models';
import styles from './style.less';
const { Paragraph } = Typography;
const { Option } = Select;

interface ModifyProps {
  modifyVisible: boolean;
  data?: any;
  form: WrappedFormUtils;
  closeDrawer(): void;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { modifyVisible, data, closeDrawer, form, reload } = props;
  const { getFieldDecorator } = form;
  const title = data === undefined ? '添加投诉单' : '修改投诉单';
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
        //newData.keyValue = newData.id;
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
        //newData.keyValue = newData.id;
        newData.finishTime = values.finishTime.format('YYYY-MM-DD HH:mm');
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
        //newData.keyValue = newData.id;
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
        //newData.keyValue = newData.id;
        Approve({ ...newData, keyValue: newData.id }).then(res => {
          message.success('审核成功！');
          closeDrawer();
          reload();
        });
      }
    });
  };

  // const doSave = dataDetail => {
  //   dataDetail.keyValue = dataDetail.id;
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
          return <Tag color="#e4aa5b">待处理</Tag>;
        case 2:
          return <Tag color="#e2aa5c">待完成</Tag>;
        case 3:
          return <Tag color="#e4aa5b">待回访</Tag>;
        case 4:
          return <Tag color="#61c33a">待审核</Tag>;
        case 5:
          return <Tag color="#40A9FF">已审核</Tag>;
        case -1:
          return <Tag color="#40A9FF">已作废</Tag>;
        default:
          return '';
      }
    }
  }

  //投诉对象
  const handleSearch = value => {
    if (value == '')
      return;
    var type = form.getFieldValue('byComplaintType');
    GetUserList(value, type).then(res => {
      setUserSource(res || []);
    })
  };

  //处理负责人
  const handleChargerSearch = value => {
    if (value == '')
      return;
    GetUserList(value, '员工').then(res => {
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
  const onByComplaintUserSelect = (value, option) => {
    //form.setFieldsValue({ownerId: option.key }); 
    //加载联系人以及联系电话 
    if (value) {
      var type = form.getFieldValue('byComplaintType');
      GetUserByCustomerId(option.key, type).then((res: any) => {
        if (res != null) {
          form.setFieldsValue({ byComplaintUserName: res.contactName });
          form.setFieldsValue({ byComplaintUerTel: res.contactPhone });
          form.setFieldsValue({ byComplaintUserId: res.custId });
          form.setFieldsValue({ byComplaintRoomAllName: res.contactAddress });
        }
      });

    } else {
      form.setFieldsValue({ byComplaintUserName: '' });
      form.setFieldsValue({ byComplaintUerTel: '' });
      form.setFieldsValue({ byComplaintUserId: '' });
      form.setFieldsValue({ byComplaintRoomAllName: '' });
    }
  };

  //选择处理负责人
  const onHandleChargerSelect = (value, option) => {
    if (value) {
      GetUserByCustomerId(option.key, '员工').then((res: any) => {
        if (res != null) {
          form.setFieldsValue({ handleChargerId: res.custId });
          form.setFieldsValue({ handleChargeTel: res.contactPhone });
        }
      });
    }
    else {
      form.setFieldsValue({ handleChargerId: '' });
      form.setFieldsValue({ handleChargeTel: '' });
    }
  };


  //实际处理人
  const onHandleUserSelect = (value, option) => {
    if (value) {
      form.setFieldsValue({ handleId: option.key });
    }
    else {
      form.setFieldsValue({ handleId: '' }); 
    }
  };

  //选择投诉对象类型
  const onSelectType = (value, option) => {
    //先清空
    form.setFieldsValue({ byComplaintUserName: '' });
    form.setFieldsValue({ byComplaintUerTel: '' });
    form.setFieldsValue({ byComplaintUserId: '' });
    form.setFieldsValue({ byComplaintRoomAllName: '' });
    GetUserList('', value).then(res => {
      setUserSource(res || []);
    })
  };

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
          投诉来自于{infoDetail.complaintAddress}，联系人：{infoDetail.complaintUser ? infoDetail.complaintUser : '匿名'}，电话：{infoDetail.complaintLink ? infoDetail.complaintLink : '无'}，在 {infoDetail.billDate} 投诉，内容如下
        </Paragraph>
        {infoDetail.contents}
      </PageHeader>
      <Divider dashed />
      {modifyVisible ? (
        <Form layout="vertical" hideRequiredMark>
          {infoDetail.status == 1 ? (
            <Card title="立项信息"  className={infoDetail.status == 1 ? styles.card2 : styles.card} >
              <Row gutter={24}>
                <Col lg={6}>
                  <Form.Item label="对象类别" required>
                    {getFieldDecorator('byComplaintType', {
                      initialValue: infoDetail.byComplaintType == undefined ? '业主' : infoDetail.byComplaintType,
                      rules: [{ required: true, message: '请选对象类别' }],
                    })(
                      <Select onSelect={onSelectType}>
                        <Option value="业主">业主</Option>
                        <Option value="员工">员工</Option>
                        {/* <Option value="其他" >其他</Option> */}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6}>
                  <Form.Item label="投诉对象" required>
                    {getFieldDecorator('byComplaintUserName', {
                      initialValue: infoDetail.byComplaintUserName,
                      rules: [{ required: true, message: '请输入投诉对象' }],
                    })(
                      // <TreeSelect
                      //   placeholder="请选择投诉对象"
                      //   allowClear
                      //   dropdownStyle={{ maxHeight: 300 }}
                      //   treeData={treeData}
                      //   treeDataSimpleMode={true} /> 
                      <AutoComplete
                        dataSource={userList}
                        onSearch={handleSearch}
                        placeholder="请输入投诉对象"
                        onSelect={onByComplaintUserSelect}
                      />
                    )}

                    {getFieldDecorator('byComplaintUserId', {
                      initialValue: infoDetail.byComplaintUserId,
                    })(
                      <input type='hidden' />
                    )}

                  </Form.Item>
                </Col>
                <Col lg={6}>
                  <Form.Item label="联系电话" required>
                    {getFieldDecorator('byComplaintUerTel', {
                      initialValue: infoDetail.byComplaintUerTel,
                      rules: [{ required: true, message: '请输入联系电话' }],
                    })(<Input placeholder="请输入联系电话" />)}
                  </Form.Item>
                </Col>
                <Col lg={6}>
                  <Form.Item label="地址" required>
                    {getFieldDecorator('byComplaintRoomAllName', {
                      initialValue: infoDetail.byComplaintRoomAllName,
                      rules: [{ required: true, message: '请输入地址' }],
                    })(<Input placeholder="请输入地址" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={6}>
                  <Form.Item label="投诉性质" required>
                    {getFieldDecorator('complaintNature', {
                      initialValue: infoDetail.complaintNature == undefined ? '一般投诉' : infoDetail.complaintNature,
                      rules: [{ required: true, message: '请选投诉性质' }],
                    })(
                      <Select>
                        <Option value="一般投诉" >一般投诉</Option>
                        <Option value="严重投诉" >严重投诉</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6}>
                  <Form.Item label="处理负责人" required>
                    {getFieldDecorator('handleCharger', {
                      initialValue: infoDetail.handleCharger,
                      rules: [{ required: true, message: '请选择处理负责人' }],
                    })(

                      // <Input placeholder="请选择处理负责人" />

                      <AutoComplete
                        dataSource={userList}
                        onSearch={handleChargerSearch}
                        placeholder="请选择处理负责人"
                        onSelect={onHandleChargerSelect}
                      />

                    )}
                    {getFieldDecorator('handleChargerId', {
                      initialValue: infoDetail.handleChargerId
                    })(<Input type='hidden' />)}
                  </Form.Item>
                </Col>
                <Col lg={6}>
                  <Form.Item label="联系电话" required>
                    {getFieldDecorator('handleChargeTel', {
                      initialValue: infoDetail.handleChargeTel,
                      rules: [{ required: true, message: '请输入联系电话' }],
                    })(<Input placeholder="请输入联系电话" />)}
                  </Form.Item>
                </Col>
                <Col lg={6}>
                  <Form.Item label="立项人">
                    {getFieldDecorator('setUpUserName', {
                      initialValue: infoDetail.setUpUserName
                    })(<Input placeholder="自动获取立项人" readOnly />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col lg={6}>
                  <Form.Item label="立项时间">
                    {getFieldDecorator('setUpDate', {
                      initialValue: infoDetail.setUpDate,
                    })(<Input placeholder="自动获取时间" readOnly />)}
                  </Form.Item>
                </Col>
                <Col lg={18}>
                  <Form.Item label="处理建议" required>
                    {getFieldDecorator('suggestion', {
                      initialValue: infoDetail.suggestion,
                      rules: [{ required: true, message: '请输入处理建议' }],
                    })(<Input placeholder="请输入处理建议" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ) : (
              <Card title="立项信息" className={styles.card}  >
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
            )}

          {infoDetail.status == 2 ? (
            <Card title="处理过程" className={infoDetail.status == 2 ? styles.card2 : styles.card}  >
              <Row gutter={24}>
                <Col lg={6}>
                  <Form.Item label="实际处理人" required>
                    {getFieldDecorator('handleUser', {
                      initialValue: infoDetail.handleUser,
                      rules: [{ required: true, message: '请输入实际处理人' }],
                    })(
                      <AutoComplete
                        dataSource={userList}
                        onSearch={handleUserSearch}
                        placeholder="请输入实际处理人"
                        onSelect={onHandleUserSelect}
                      />
                    )}

                    {getFieldDecorator('handleId', {
                      initialValue: infoDetail.handleId
                    })(<Input type='hidden' />)}

                  </Form.Item>
                </Col>
                <Col lg={18}>
                  <Form.Item label="处理过程" required>
                    {getFieldDecorator('handleProcess', {
                      initialValue: infoDetail.handleProcess,
                      rules: [{ required: true, message: '请输入处理过程' }],
                    })(<Input placeholder="请输入处理过程" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={6}>
                  <Form.Item label="完成时间" required>
                    {getFieldDecorator('finishTime', {
                      initialValue: infoDetail.finishTime,
                      rules: [{ required: true, message: '请选择完成时间' }],
                    })(<DatePicker placeholder="请选择完成时间" />)}
                  </Form.Item>
                </Col>
                <Col lg={18}>
                  <Form.Item label="业主意见" required>
                    {getFieldDecorator('custSuggestion', {
                      initialValue: infoDetail.custSuggestion,
                      rules: [{ required: true, message: '请输入业主意见' }],
                    })(<Input placeholder="请输入业主意见" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ) : null}

          {infoDetail.status == 3 ? (
            <Card title="回访情况" className={styles.card}  >
              <Row gutter={24}>
                <Col lg={6}>
                  <Form.Item label="回访方式" required>
                    {getFieldDecorator('returnVisitType', {
                      initialValue: infoDetail.returnVisitType ? '电话' : infoDetail.returnVisitType,
                    })(
                      <Select>
                        <Option value="在线" >在线</Option>
                        <Option value="电话" >电话</Option>
                        <Option value="上门" >上门</Option>
                        <Option value="其他" >其他</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>

                <Col lg={6}>
                  <Form.Item label="回访时间"  >
                    {getFieldDecorator('returnVisitDate', {
                      initialValue: infoDetail.returnVisitDate,
                    })(<Input placeholder="自动获取回访时间" readOnly />)}
                  </Form.Item>
                </Col>
                <Col lg={6}>
                  <Form.Item label="回访人"  >
                    {getFieldDecorator('returnVisitUser', {
                      initialValue: infoDetail.returnVisitUser
                    })(<Input placeholder="自动获取回访人" readOnly />)}
                  </Form.Item>
                </Col>

                <Col lg={6}>
                  <Form.Item label="客户评价" required>
                    {getFieldDecorator('custAssess', {
                      initialValue: infoDetail.custAssess,
                      rules: [{ required: true, message: '请输入客户评价' }],
                    })(<Input placeholder="请输入客户评价" />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col lg={24}>
                  <Form.Item label="回访结果" required>
                    {getFieldDecorator('returnVisitResult', {
                      initialValue: infoDetail.returnVisitResult,
                      rules: [{ required: true, message: '请输入回访结果' }],
                    })(<Input placeholder="请输入回访结果" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ) : null}

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

export default Form.create<ModifyProps>()(Modify); 