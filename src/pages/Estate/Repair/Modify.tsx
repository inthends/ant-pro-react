
import {DatePicker,AutoComplete,Select,Typography,Tag,Divider, PageHeader,Button,Card,Col,Drawer,Form,Input,message,Row} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { Dispatch, Change, Receive, Start, Handle, Visit, Check } from './Main.service';
import { GetUserList, getCommonItems } from '@/services/commonItem';
import moment from 'moment';
import styles from './style.less';
const { Paragraph } = Typography;
const { Option } = Select;

interface ModifyProps {
  modifyVisible: boolean;
  data?: any;
  form: WrappedFormUtils;
  closeDrawer(): void;
  reload(): void;
};

const Modify = (props: ModifyProps) => {
  const { modifyVisible, data, closeDrawer, form, reload } = props;
  const { getFieldDecorator } = form;
  const title = data === undefined ? '添加维修单' : '修改维修单';
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [repairMajors, setRepairMajors] = useState<any[]>([]); // 维修专业
  const [userSource, setUserSource] = useState<any[]>([]);
  // 打开抽屉时初始化
  useEffect(() => {
    // 获取维修专业
    getCommonItems('RepairMajor').then(res => {
      setRepairMajors(res || []);
    });

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

  //转换状态
  const GetStatus = (infoDetail) => {
    switch (infoDetail.status) {
      case 1:
        return <Tag color="#e4aa5b">待派单</Tag>
      case 2:
        return <Tag color="#19d54e">待接单</Tag>
      case 3:
        return <Tag color="#e4aa5b">待开工</Tag>
      case 4:
        return <Tag color="#61c33a">处理中</Tag>
      case 5:
        return <Tag color="#ff5722">暂停</Tag>
      case 6:
        return <Tag color="#5fb878">待回访</Tag>
      case 7:
        return <Tag color="#29cc63">待检验</Tag>
      case 8:
        return <Tag color="#e48f27">待审核</Tag>
      case 9:
        return <Tag color="#c31818">已退单</Tag>
      case 10:
        return <Tag color="#009688">已归档</Tag>
      case -1:
        return <Tag color="#d82d2d">已作废</Tag>
      default:
        return '';
    }
  };

  const handleSearch = value => {
    if (value == '')
      return;
    GetUserList(value, '员工').then(res => {
      setUserSource(res || []);
    })
  };

  const userList = userSource.map
    (item => <Option key={item.id} value={item.name}>{item.name}</Option>);

  //选择接单人
  const onReceiverNameSelect = (value, option) => {
    //设置id
    form.setFieldsValue({ receiverId: option.key });
  };

  //派单
  const dispatch = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = data ? { ...data, ...values } : values;
        Dispatch({ ...newData, keyValue: newData.id }).then(res => {
          message.success('派单成功！');
          closeDrawer();
          reload();
        });
      }
    });
  };

  //接单
  const receive = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        Receive(data.id).then(res => {
          message.success('接单成功！');
          closeDrawer();
          reload();
        });
      }
    });
  };

  //转单
  const change = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        Change(data.id).then(res => {
          message.success('转单成功！');
          closeDrawer();
          reload();
        });
      }
    });
  };

  //开工
  const start = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = data ? { ...data, ...values } : values;
        newData.beginDate = values.beginDate.format('YYYY-MM-DD HH:mm');
        Start({ ...newData, keyValue: newData.id }).then(res => {
          message.success('已开工！');
          closeDrawer();
          reload();
        });
      }
    });
  };

  //处理完成
  const handle = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = data ? { ...data, ...values } : values;
        newData.endDate = values.endDate.format('YYYY-MM-DD HH:mm');
        Handle({ ...newData, keyValue: newData.id }).then(res => {
          message.success('处理完成');
          closeDrawer();
          reload();
        });
      }
    });
  };

  //回访
  const visit = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = data ? { ...data, ...values } : values;
        Visit({ ...newData, keyValue: newData.id }).then(res => {
          message.success('回访完成');
          closeDrawer();
          reload();
        });
      }
    });
  };

  //检验
  const check = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = data ? { ...data, ...values } : values;
        newData.testDate = values.testDate.format('YYYY-MM-DD HH:mm');
        Check({ ...newData, keyValue: newData.id }).then(res => {
          message.success('检验完成');
          closeDrawer();
          reload();
        });
      }
    });
  };

  //计算用时
  const onEndDateChange = (date) => {
    //var sbegin = new Date(data.beginDate).getTime(), send = new Date(date).getTime();
    //var total = (send - sbegin) / 1000 / 60; 
    const total = date.unix() - moment(data.beginDate).unix();
    form.setFieldsValue({ useTime: (total / 60).toFixed(2) });
  }

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current <= moment(data.beginDate);
  };

  const disabledTestDate = (current) => {
    // Can not select days before today and today
    return current && current <= moment(data.endDate);
  };

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
      width={800}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <PageHeader
        title={infoDetail.billCode}
        subTitle={GetStatus(infoDetail)}
      // extra={[
      //   <Button key="3">附件</Button>,
      // ]}
      >
        <Paragraph>
          {infoDetail.address}，{infoDetail.contactName}，电话：<a>{infoDetail.contactLink}</a>，在 {infoDetail.billDate} 报修，内容如下
        </Paragraph>
        {infoDetail.repairContent}
      </PageHeader>
      <Divider dashed />
      {
        modifyVisible ? (
          <Form layout="vertical" hideRequiredMark>
            {infoDetail.status == 1 ? (
              <Card title="派单" className={styles.card}  >
                <Row gutter={24}>
                  <Col lg={5}>
                    <Form.Item label="维修专业" required>
                      {getFieldDecorator('repairMajor', {
                        rules: [{ required: true, message: '请选择维修专业' }],
                      })(
                        <Select placeholder="请选择维修专业">
                          {repairMajors.map(item => (
                            <Option value={item.title} key={item.key}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>)
                      }
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="指派给" required>
                      {getFieldDecorator('receiverName', {
                        rules: [{ required: true, message: '请选择接单人' }],
                      })(
                        <AutoComplete
                          dataSource={userList}
                          onSearch={handleSearch}
                          placeholder="请选择接单人"
                          onSelect={onReceiverNameSelect}
                        />
                      )}
                      {getFieldDecorator('receiverId', {
                      })(<Input type='hidden' />)}
                    </Form.Item>
                  </Col>

                  <Col lg={5}>
                    <Form.Item label="派单人" >
                      {getFieldDecorator('senderName', {
                      })(<Input placeholder="自动获取派单人" readOnly />)}
                      {getFieldDecorator('senderId', {
                      })(<Input type='hidden' />)}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="派单时间"  >
                      {getFieldDecorator('sendDate', {
                      })(<Input placeholder="自动获取时间" readOnly />)}
                    </Form.Item>
                  </Col>

                  <Col lg={5}>
                    <Form.Item label="接单时间">
                      {getFieldDecorator('receiverDate', {
                      })(<Input placeholder="自动获取时间" readOnly />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>) : (
                <Card title="派单" className={styles.card}  >
                  <Row gutter={24}>
                    <Col lg={5}>
                      <Form.Item label="维修专业">
                        {infoDetail.repairMajor}
                      </Form.Item>
                    </Col>

                    <Col lg={4}>
                      <Form.Item label="指派给">
                        {infoDetail.receiverName}
                      </Form.Item>
                    </Col>

                    <Col lg={3}>
                      <Form.Item label="派单人" >
                        {infoDetail.senderName}
                      </Form.Item>
                    </Col>
                    <Col lg={6}>
                      <Form.Item label="派单时间"  >
                        {infoDetail.sendDate}
                      </Form.Item>
                    </Col>

                    <Col lg={6}>
                      <Form.Item label="接单时间">
                        {infoDetail.receiverDate}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              )}
            {infoDetail.status == 3 ? (
              <Card title="开工" className={styles.card}  >
                <Row gutter={24}>
                  <Col lg={7}>
                    <Form.Item label="开工时间" required>
                      {getFieldDecorator('beginDate', {
                        initialValue: moment(new Date()),
                        rules: [{ required: true, message: '请选择开工时间' }],
                      })(<DatePicker placeholder="请选择开工时间" showTime={true} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={17}>
                    <Form.Item label="故障判断" required>
                      {getFieldDecorator('faultJudgement', {
                        initialValue: infoDetail.faultJudgement,
                        rules: [{ required: true, message: '请输入故障判断' }],
                      })(<Input placeholder="请输入故障判断" />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ) : infoDetail.status > 3 ? (
              <Card title="开工" className={styles.card}  >
                <Row gutter={24}>
                  <Col lg={5}>
                    <Form.Item label="开工时间"  >
                      {infoDetail.beginDate}
                    </Form.Item>
                  </Col>
                  <Col lg={19}>
                    <Form.Item label="故障判断">
                      {infoDetail.faultJudgement}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ) : null}

            {infoDetail.status == 4 ? (
              <Card title="完成情况" className={styles.card}  >
                <Row gutter={24}>
                  <Col lg={7}>
                    <Form.Item label="完成时间" required>
                      {getFieldDecorator('endDate', {
                        //initialValue: moment(new Date()),
                        rules: [{ required: true, message: '请选择完成时间' }],
                      })(<DatePicker
                        format="YYYY-MM-DD HH:mm"
                        placeholder="请选择完成时间" showTime={true}
                        onChange={onEndDateChange}
                        disabledDate={disabledDate}
                      // disabledTime={disabledDateTime}
                      />)}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="用时(分钟)">
                      {getFieldDecorator('useTime', {
                        initialValue: infoDetail.useTime
                      })(<Input placeholder="自动获取" readOnly />)}
                    </Form.Item>
                  </Col>

                  <Col lg={4}>
                    <Form.Item label="人工费"  >
                      {getFieldDecorator('laborFee', {
                        initialValue: infoDetail.laborFee
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="材料费"  >
                      {getFieldDecorator('stuffFee', {
                        initialValue: infoDetail.stuffFee
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="费用合计">
                      {getFieldDecorator('totalFee', {
                        initialValue: infoDetail.totalFee
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={7}>
                    <Form.Item label="完成情况" required>
                      {getFieldDecorator('achieved', {
                        rules: [{ required: true, message: '请输入完成情况' }],
                      })(<Input placeholder="请输入完成情况" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="现场评价"  >
                      {getFieldDecorator('fieldEvaluation', {
                        initialValue: infoDetail.fieldEvaluation
                      })(<Input placeholder="请输入现场评价" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={9}>
                    <Form.Item label="业主意见"  >
                      {getFieldDecorator('ownerOpinion', {
                        initialValue: infoDetail.ownerOpinion
                      })(<Input placeholder="请输入业主意见" />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ) : infoDetail.status > 4 ? (<Card title="完成情况" className={styles.card}  >
              <Row gutter={24}>
                <Col lg={5}>
                  <Form.Item label="完成时间">
                    {infoDetail.endDate}
                  </Form.Item>
                </Col>
                <Col lg={5}>
                  <Form.Item label="用时(分钟)">
                    {infoDetail.useTime}
                  </Form.Item>
                </Col>
                <Col lg={5}>
                  <Form.Item label="人工费"  >
                    {infoDetail.laborFee}
                  </Form.Item>
                </Col>
                <Col lg={5}>
                  <Form.Item label="材料费"  >
                    {infoDetail.stuffFee}
                  </Form.Item>
                </Col>
                <Col lg={4}>
                  <Form.Item label="费用合计">
                    {infoDetail.totalFee}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={8}>
                  <Form.Item label="完成情况" >
                    {infoDetail.achieved}
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label="现场评价"  >
                    {infoDetail.fieldEvaluation}
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label="业主意见"  >
                    {infoDetail.ownerOpinion}
                  </Form.Item>
                </Col>
              </Row>
            </Card>) : null}

            {infoDetail.status == 6 ? (
              <Card title="回访情况" className={styles.card}  >
                <Row gutter={24}>
                  <Col lg={6}>
                    <Form.Item label="回访方式" required>
                      {getFieldDecorator('returnVisitMode', {
                        initialValue: '在线'
                      })(
                        <Select >
                          <Option value="在线">在线</Option>
                          <Option value="电话">电话</Option>
                          <Option value="上门">上门</Option>
                          <Option value="其他">其他</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="客户评价" required>
                      {getFieldDecorator('custEvaluate', {
                        initialValue: '4'
                      })(
                        <Select >
                          <Option value="5">非常满意</Option>
                          <Option value="4">满意</Option>
                          <Option value="3">一般</Option>
                          <Option value="2">不满意</Option>
                          <Option value="1">非常不满意</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="回访时间" >
                      {getFieldDecorator('returnVisitDate', {
                      })(<Input placeholder="自动获取时间" readOnly />)}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="回访人">
                      {getFieldDecorator('returnVisiterName', {
                      })(<Input placeholder="自动获取回访人" readOnly />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="回访结果" required>
                      {getFieldDecorator('returnVisitResult', {
                      })(<Input placeholder="请输入回访结果" />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ) : (infoDetail.status > 6 && infoDetail.repairArea == '客户区域') ? (<Card title="回访情况" className={styles.card}  >
              <Row gutter={24}>
                <Col lg={6}>
                  <Form.Item label="回访方式"  >
                    {infoDetail.returnVisitMode}
                  </Form.Item>
                </Col>
                <Col lg={6}>
                  <Form.Item label="客户评价"  >
                    {infoDetail.custEvaluate}
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
            </Card>) : null}

            {infoDetail.status == 7 ? (
              <Card title="检验情况" className={styles.card}  >
                <Row gutter={24}>
                  <Col lg={7}>
                    <Form.Item label="检验时间" required>
                      {getFieldDecorator('testDate', {
                        initialValue: infoDetail.testDate,
                        rules: [{ required: true, message: '请选择检验时间' }],
                      })(
                        <DatePicker
                          format="YYYY-MM-DD HH:mm"
                          placeholder="请选择完成时间"
                          showTime={true}
                          disabledDate={disabledTestDate}
                        // disabledTime={disabledDateTime}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="检验人"  >
                      {getFieldDecorator('testerName', {
                        initialValue: infoDetail.testerName,
                      })(<Input placeholder="自动获取" readOnly />)}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="检验结果" required>
                      {getFieldDecorator('testResult', {
                        initialValue: '1',
                        rules: [{ required: true, message: '请选择检验结果' }],
                      })(
                        <Select >
                          <Option value="1">合格</Option>
                          <Option value="0">不合格</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={7}>
                    <Form.Item label="检验说明"  >
                      {getFieldDecorator('testRemark', {
                        initialValue: infoDetail.testRemark
                      })(<Input placeholder="请输入检验说明" />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ) : (infoDetail.status > 7 && infoDetail.repairArea == '公共区域') ? (
              <Card title="检验情况" className={styles.card}  >
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
        {infoDetail.status == 1 ? (
          <div>
            <Button onClick={close} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={dispatch} type="primary">
              派单
         </Button></div>
        ) : null}
        {infoDetail.status == 2 ? (
          <div>
            <Button onClick={close} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={receive} type="primary">
              接单
            </Button>
          </div>
        ) : null}
        {infoDetail.status == 3 ? (
          <div>
            <Button onClick={close} style={{ marginRight: 8 }}>
              取消
         </Button>
            <Button onClick={start} type="primary" style={{ marginRight: 8 }}>
              开工
         </Button>
            <Button onClick={change} type="primary">
              转单
            </Button>
          </div>
        ) : null}

        {infoDetail.status == 4 ? (
          <div>
            <Button onClick={close} style={{ marginRight: 8 }}>
              取消
        </Button>
            <Button onClick={start} type="primary" style={{ marginRight: 8 }}>
              呼叫增援
         </Button>
            <Button onClick={start} type="primary" style={{ marginRight: 8 }}>
              暂停
        </Button>
            <Button onClick={start} type="primary" style={{ marginRight: 8 }}>
              退单
        </Button>
            <Button onClick={handle} type="primary">
              完成
        </Button></div>
        ) : null}

        {infoDetail.status == 6 ? (
          <div>
            <Button onClick={close} style={{ marginRight: 8 }}>
              取消
        </Button>
            <Button onClick={visit} type="primary">
              回访
        </Button></div>
        ) : null}


        {infoDetail.status == 7 ? (
          <div>
            <Button onClick={close} style={{ marginRight: 8 }}>
              取消
        </Button>
            <Button onClick={check} type="primary">
              检验
        </Button></div>
        ) : null}

        {infoDetail.status == 8 ? (
          <div>
            <Button onClick={close} style={{ marginRight: 8 }}>
              取消
          </Button>
            <Button onClick={visit} type="primary">
              通过
        </Button></div>
        ) : null}

      </div>
    </Drawer >
  );
};

export default Form.create<ModifyProps>()(Modify); 