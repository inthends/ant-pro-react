
import { DatePicker, TreeSelect, Select, Tag, Typography, Row, Divider, PageHeader, Button, Card, Col, Drawer, Form, Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { getResult } from '@/utils/networkUtils';
import { GetQuickSimpleTreeAll, SaveForm } from './Main.service';
import { TreeEntity } from '@/model/models';
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
  const [treeData, setTreeData] = useState<any[]>([]);

  // 打开抽屉时初始化
  useEffect(() => {

    // 获取房产树
    GetQuickSimpleTreeAll()
      .then(getResult)
      .then((res: TreeEntity[]) => {
        setTreeData(res || []);
        return res || [];
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
  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = data ? { ...data, ...values } : values;
        doSave(newData);
      }
    });
  };
  const doSave = dataDetail => {
    dataDetail.keyValue = dataDetail.pCode;
    SaveForm({ ...dataDetail, type: 5 }).then(res => {
      message.success('保存成功');
      closeDrawer();
      reload();
    });
  };

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
        extra={[
          <Button key="1">附件</Button>
        ]}
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
                <Form.Item label="对象类别" required>
                  {getFieldDecorator('byComplaintType', {
                    initialValue: infoDetail.byComplaintType == undefined ? '业主' : infoDetail.byComplaintType,
                    rules: [{ required: true, message: '请选对象类别' }],
                  })(
                    <Select>
                      <Option value="业主" >业主</Option>
                      <Option value="员工" >员工</Option>
                      <Option value="其他" >其他</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6}>
                <Form.Item label="投诉对象" required>
                  {getFieldDecorator('byComplaintUser', {
                    initialValue: infoDetail.byComplaintUser,
                    rules: [{ required: true, message: '请选择投诉对象' }],
                  })(
                    <TreeSelect
                      placeholder="请选择投诉对象"
                      allowClear
                      dropdownStyle={{ maxHeight: 300 }}
                      treeData={treeData}
                      treeDataSimpleMode={true} />

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
                  })(<Input placeholder="请选择处理负责人" />)}

                  {getFieldDecorator('handleChargerID', {
                    initialValue: infoDetail.handleChargerID
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

          {infoDetail.status == 2 ? (
            <Card title="处理过程" className={styles.card}  >
              <Row gutter={24}>
                <Col lg={6}>
                  <Form.Item label="实际处理人" required>
                    {getFieldDecorator('handleUser', {
                      initialValue: infoDetail.handleUser,
                      rules: [{ required: true, message: '请选择实际处理人' }],
                    })(<Input placeholder="请选择实际处理人" />)}
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
        <Button onClick={save} type="primary">
          立项
        </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<ModifyProps>()(Modify); 