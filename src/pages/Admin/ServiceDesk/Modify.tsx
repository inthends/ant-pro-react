import { TreeEntity } from '@/model/models';
import {

  Tabs,
  Select,
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Row,
  TreeSelect,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetQuickSimpleTreeAll, SaveForm } from './Main.service';
import { getResult } from '@/utils/networkUtils';
import styles from './style.less';
import CommentBox from './CommentBox';


const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

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
  const title = data === undefined ? '添加服务单' : '修改服务单';
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



  return (
    <Drawer
      title={title}
      placement="right"
      width={800}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      {modifyVisible ? (
        <Tabs defaultActiveKey="1" >

          <TabPane tab="基础信息" key="1">
            <Form layout="vertical" hideRequiredMark>
              <Card className={styles.card}  >
                <Row gutter={24}>
                  <Col lg={8}>
                    <Form.Item label="单据编号">
                      {getFieldDecorator('name', {
                        initialValue: infoDetail.billCode
                      })(<Input placeholder="自动获取编号" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="单据时间">
                      {getFieldDecorator('billDate', {
                        initialValue: infoDetail.billDate
                      })(<Input placeholder="自动获取时间" />)}
                    </Form.Item>
                  </Col>

                  <Col lg={8}>
                    <Form.Item label="单据来源">
                      {getFieldDecorator('source', {
                        initialValue: infoDetail.source
                      })(
                        <Select placeholder='请选择单据来源'>
                          <Option value="服务总台">服务总台</Option>
                          <Option value="社区APP">社区APP</Option>
                          <Option value="社区APP">微信公众号</Option>
                          <Option value="社区APP">员工APP</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col lg={8}>
                    <Form.Item label="业务类型">
                      {getFieldDecorator('billType', {
                        initialValue: infoDetail.billType
                      })(
                        <Select placeholder='请选择业务类型'>
                          <Option value="报修">报修</Option>
                          <Option value="投诉">投诉</Option>
                          <Option value="服务">服务</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="紧急程度">
                      {getFieldDecorator('emergencyLevel', {
                        initialValue: infoDetail.emergencyLevel
                      })(
                        <Select placeholder='请选择紧急程度'>
                          <Option value="一般">一般</Option>
                          <Option value="紧急">紧急</Option>
                          <Option value="非常紧急">非常紧急</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="重要程度">
                      {getFieldDecorator('importance', {
                        initialValue: infoDetail.importance
                      })(
                        <Select placeholder='请选择重要程度'>
                          <Option value="一般">一般</Option>
                          <Option value="重要">重要</Option>
                          <Option value="非常重要">非常重要</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col lg={8}>
                    <Form.Item label="关联地址" required>
                      {getFieldDecorator('address', {
                        initialValue: infoDetail.address,
                        rules: [{ required: true, message: '请选择关联地址' }],
                      })(
                        <TreeSelect
                          placeholder="请选择房源"
                          allowClear
                          dropdownStyle={{ maxHeight: 300 }}
                          treeData={treeData}
                          treeDataSimpleMode={true} >
                        </TreeSelect>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="联系人">
                      {getFieldDecorator('contactName', {
                        initialValue: infoDetail.contactName
                      })(<Input placeholder="请选择联系人" />)}
                    </Form.Item>
                  </Col>

                  <Col lg={8}>
                    <Form.Item label="联系电话">
                      {getFieldDecorator('contactPhone', {
                        initialValue: infoDetail.contactPhone
                      })(<Input placeholder="请输入联系电话" />)}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="内容">
                      {getFieldDecorator('memo', {
                        initialValue: infoDetail.memo,
                      })(<TextArea rows={4} placeholder="请输入内容" />)}
                    </Form.Item>
                  </Col>
                </Row>



              </Card>
            </Form>
          </TabPane>

          <TabPane tab="留言动态" key="2">

            <CommentBox data={data} />

          </TabPane>
        </Tabs>) : null}

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
          提交
        </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<ModifyProps>()(Modify);
