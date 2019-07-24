import { TreeEntity } from '@/model/models';
import {
  Checkbox,
  Tabs,
  Select,
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,  
  message
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetFormJson,GetFeeType,GetAllFeeItems } from './Main.service';
import styles from './style.less';

import * as moment from 'moment';

const { Option } = Select;
const { TextArea } = Input; 
const{TabPane} = Tabs;

interface ModifyProps {
  modifyVisible: boolean;
  data?: any;
  closeDrawer(): void;
  form: WrappedFormUtils; 
  treeData: TreeEntity[];
  id?: string;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { modifyVisible, closeDrawer, form, id } = props;
  const { getFieldDecorator } = form;
  const title = id === undefined ? '添加合同' : '修改合同'; 
  const [infoDetail, setInfoDetail] = useState<any>({}); 
  const [feetypes, setFeetype] = useState<TreeEntity[]>([]); 
  const [feeitems, setFeeitems] = useState<TreeEntity[]>([]); 

  //打开抽屉时初始化
  useEffect(() => {   
    //加载关联收费项目
    GetAllFeeItems(id).then(res => {
      setFeeitems(res || []); 
    }); 

  }, []); 


  const changeFeeType = (id: string, init = false) => {
    GetFeeType(id).then(res => {
      setFeetype(res || []);
      if (!init) {
        form.setFieldsValue({ feeType: undefined });
      }
    });  
  };
   

  // 打开抽屉时初始化
  useEffect(() => {

    if (modifyVisible) {  
      if (id) {
        getInfo(id).then((tempInfo: any) => {  
          if (tempInfo.feeKind) {
            var kind = tempInfo.feeKind=="收款费项"?"ReceivablesItem":"PaymentItem"; 
            changeFeeType(kind, true);
          }
          setInfoDetail(tempInfo);
          form.resetFields();
        });
      } else {
        //重置之前选择加载的费项类别
        setFeetype([]);
        setInfoDetail({  });
        form.resetFields();
      }
    } else {
      form.setFieldsValue({});
    }
  }, [modifyVisible]);

  const close = () => {
    closeDrawer();
  };
  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        getInfo(id).then(tempInfo => {
          let newvalue = { ...values, date: values.date.format('YYYY-MM-DD') }; 
           
        });
      }
    });
  };
  const getInfo = id => {
    if (id) {
      return GetFormJson(id).then(res => {
        const { feeItem, feeItemDetail } = res || ({} as any);
        let info = {
          ...feeItem,
          ...feeItemDetail,
        };
        info.id = feeItem && feeItem.feeItemID;   
        return info;
      });
    } else {
      return Promise.resolve({
        parentId: 0,
        type: 1,
      });
    }
  };
  
	return (
    <Drawer
    title={title}
    placement="right"
    width={1000}
    onClose={close}
    visible={modifyVisible}
    bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
  > 

      <Tabs defaultActiveKey="1" >
        <TabPane tab="基本信息" key="1">
          <div>
            <Row gutter={24}>
              <Col span={12}>
                <Card title="基本信息" className={styles.card}  >
                  <Form layout="vertical" hideRequiredMark>
                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="模板选择" required>
                          {getFieldDecorator('template', {
                            rules: [{ required: true, message: '请选择' }],
                          })(<Select placeholder="请选择" />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="合同编号" required>
                          {getFieldDecorator('no', {
                            rules: [{ required: true, message: '如不填写系统将自动生成' }],
                          })(<Input placeholder="如不填写系统将自动生成" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="跟进人" required>
                          {getFieldDecorator('followerId', {
                            rules: [{ required: true, message: '请选择跟进人' }],
                          })(<Select placeholder="请选择跟进人" />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="租赁数量（m²)">
                          {getFieldDecorator('leaseSize', {
                            rules: [{ required: true, message: '请输入面积' }],
                          })(<Input placeholder="请输入面积" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="合同签订时间" required>
                          {getFieldDecorator('contractStartDate', {
                            rules: [{ required: true, message: '请输入小区名称' }],
                          })(<DatePicker />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="合同计租时间">
                          {getFieldDecorator('billingDate', {
                            rules: [{ required: true, message: '请输入详细地址' }],
                          })(<DatePicker placeholder="请输入详细地址" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="合同失效时间" required>
                          {getFieldDecorator('contractEndDate', {
                            rules: [{ required: true, message: '请输入小区名称' }],
                          })(<DatePicker placeholder="请输入小区名称" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="单价保留小数点">
                          {getFieldDecorator('precision', {
                            rules: [{ required: true, message: '请填写保留几位' }],
                          })(<Input placeholder="请填写保留几位" />)}
                        </Form.Item>
                      </Col>



                      <Col lg={12}>
                        <Form.Item label="计算精度">
                          {getFieldDecorator('calcPrecisionModeId', {
                             initialValue: infoDetail.calcPrecisionModeId?infoDetail.calcPrecisionModeId:"1",
                          })(<Select>
                              <Option value="1" >精确计算结果保留2位</Option>
                              <Option value="2" >每步计算结果保留2位</Option> 
                            </Select>
                            )}

                          <input type="hidden" id="calcPrecisionMode" value="精确计算结果保留2位" />
                        </Form.Item>
                      </Col>
                    </Row>

                  </Form>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="房源信息"  > 
                 </Card>
              </Col>
            </Row>
          </div>

          <div>
            <Row gutter={24}>
              <Col span={12}>
                <Card title="租客信息" className={styles.card}  >
                  <Form layout="vertical" hideRequiredMark>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="租客" required>
                          {getFieldDecorator('customerId', {
                            rules: [{ required: true, message: '请填写姓名或公司' }],
                          })(<Input placeholder="请填写姓名或公司" />)}
                          <input type="hidden" id="customer" />
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="行业" required>
                          {getFieldDecorator('industryId', {
                            rules: [{ required: true, message: '请选择行业' }],
                          })(<Select placeholder="请选择行业" />)}
                          <input type="hidden" id="industry" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="法人" required>
                          {getFieldDecorator('legalPerson', {
                            rules: [{ required: true, message: '请填写法人' }],
                          })(<Input placeholder="请填写法人" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="签订人" required>
                          {getFieldDecorator('signer', {
                            rules: [{ required: true, message: '请输入签订人' }],
                          })(<Input placeholder="请输入签订人" />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="租客联系人">
                          {getFieldDecorator('customerContact', {
                            rules: [{ required: true, message: '请输入租客联系人' }],
                          })(<Input placeholder="请输入租客联系人" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="滞纳金"  >
                  <Form layout="vertical" hideRequiredMark>
                    <Row gutter={24}>
                      <Col lg={6}>
                        <Form.Item label="滞纳金比例" required>
                          {getFieldDecorator('lateFee', {
                            rules: [{ required: true, message: '请输入' }],
                          })(<Input placeholder="请输入" />)}
                        </Form.Item>
                      </Col> 
                      <Col lg={6}>
                        <Form.Item label="&nbsp;" required>
                        {getFieldDecorator('lateFeeUnitId', {
                            rules: [{ required: true, message: '请输入滞纳金比例' }],
                          })(
                        <Select defaultValue='%/天'>
                          <Option value="%/天">%/天</Option>
                          </Select>)}
                        </Form.Item>
                      </Col>

                      <Col lg={7}>
                        <Form.Item label="滞纳金上限" required>
                          {getFieldDecorator('maxLateFee', {
                            rules: [{ required: true, message: '请输入' }],
                          })(<Input placeholder="请输入" />)},
                  </Form.Item>
                      </Col>
                      <Col lg={5}>
                        <Form.Item label="&nbsp;" required>
                        {getFieldDecorator('maxLateFeeUnitId', {
                            rules: [{ required: true, message: '请输入滞纳金比例' }],
                          })( <Select defaultValue='%'>
                          <Option value="%">%</Option>
                          </Select>)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane tab="费用条款" key="2"> 
        </TabPane> 
      </Tabs>
       
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
          <Button onClick={close} type="primary">
            确定
          </Button>
        </div>
    </Drawer>
  );

};

export default Form.create<ModifyProps>()(Modify);

