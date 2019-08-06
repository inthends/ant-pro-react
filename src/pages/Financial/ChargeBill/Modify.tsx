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
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetFormJson,GetFeeType,GetAllFeeItems } from './Main.service';
import styles from './style.less';

import   moment from 'moment';

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
  const title = id === undefined ? '添加费项' : '修改费项'; 
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
      width={780}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
        <Form layout="vertical" hideRequiredMark>
     <Tabs defaultActiveKey="1" >
        <TabPane tab="基本信息" key="1">
          <Card className={styles.card} bordered={false}>
          
              <Row gutter={24}>
                <Col lg={12}>
                   
                 <Form.Item label="费项类别" required>
                    {getFieldDecorator('feeKind', {
                      initialValue: infoDetail.feeKind,
                      rules: [{ required: true, message: '请选择费项种类' }],
                    })(<Select placeholder="请选择费项种类"  onChange={changeFeeType}  > 
                      <Option value="ReceivablesItem">收款费项</Option>
                      <Option value="PaymentItem" >付款费项</Option> 
                    </Select>
                    )}
                  </Form.Item> 

                </Col>

                <Col lg={12}> 
                  <Form.Item label="费项类别" required>
                  {getFieldDecorator('feeType', {
                    initialValue: infoDetail.feeType,
                    rules: [{ required: true, message: '请选择费项类别' }]
                  })(
                    <Select placeholder="请选择费项类别">
                      {feetypes.map(item => (
                        <Option key={item.value} value={item.value}>
                          {item.text}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item> 
                </Col>
              </Row>

              <Row gutter={24}>
                <Col lg={12}>
                  <Form.Item label="费项名称" required>
                    {getFieldDecorator('feeName', {
                      initialValue: infoDetail.feeName,
                      rules: [{ required: true, message: '请输入费项名称' }],
                    })(<Input placeholder="请输入费项名称" />)}
                  </Form.Item>
                </Col>
            
                <Col lg={12}>
                  <Form.Item label="单价">
                    {getFieldDecorator('feePrice', {
                      initialValue: infoDetail.feePrice,
                      rules: [{ required: true, message: '请输入单价' }],
                    })(<Input placeholder="请输入单价" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}> 
              <Col lg={12}>
                  <Form.Item label="关联收费项目" >
                    {getFieldDecorator('linkFee', {
                        initialValue: infoDetail.linkFee,
                    })(<Select
                    placeholder="请选择关联收费项目"  
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children.indexOf(input) >= 0
                    }
                    > 
                      {feeitems.map(item => (
                        <Option key={item.value} value={item.value}>
                          {item.text}
                        </Option>
                      ))}
                      </Select>
                      )}
                  </Form.Item>
                </Col>
                <Col lg={7}>
                  <Form.Item label="计费周期">
                    {getFieldDecorator('cycleValue', {
                      initialValue: infoDetail.cycleValue,
                      rules: [{ required: true, message: '请输入计费周期' }],
                    })(<Input placeholder="请输入计费周期" />)}
                  </Form.Item>
                </Col>
                <Col lg={5}>
                  <Form.Item label="&nbsp;">
                    {getFieldDecorator('cycleType', {
                       initialValue: infoDetail.cycleType,
                      rules: [{ required: true, message: '请选择单位' }],
                    })(<Select placeholder="请选择单位">
                      <Option value="日">日</Option>
                      <Option value="月" >月</Option>
                      <Option value="年">年</Option>
                    </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12}> 
                  <Form.Item label="计费起始日期">
                  {getFieldDecorator('beginDate', {
                    initialValue: infoDetail.beginDate
                      ? moment(new Date(infoDetail.beginDate))
                      : moment(new Date()),
                      rules: [{ required: true, message: '请选择计费起始日期' }],
                  })(<DatePicker placeholder="请选择计费起始日期"   />)}
                </Form.Item> 


                </Col>
                <Col lg={12}>  
                  <Form.Item label="计费终止日期">
                  {getFieldDecorator('beginDate', {
                    initialValue: infoDetail.endDate
                      ? moment(new Date(infoDetail.endDate))
                      : moment(new Date()),
                      rules: [{ required: true, message: '计费终止日期' }], 
                  })(<DatePicker placeholder="计费终止日期"  />)}
                </Form.Item>  
                </Col>
              </Row>


              <Row gutter={24}>
              <Col lg={24}>  
              <Form.Item  >
                  <Checkbox >起止日期不允许为空</Checkbox>
                  <Checkbox >允许修改起止日期</Checkbox>
                  <Checkbox >允许在合同中添加</Checkbox>
                  <Checkbox >含税单价</Checkbox>
                  <Checkbox >减免费项</Checkbox>
                  
                  </Form.Item> 
                </Col>
                </Row>
                <Row gutter={24}>
              <Col lg={24}>  
              <Form.Item  >
                <Checkbox >不允许临时加费</Checkbox>
                  <Checkbox >临时加费不允许修改单价</Checkbox>
                  <Checkbox >自定义起止日期</Checkbox>
                  <Checkbox >是否停用</Checkbox>
                  </Form.Item> 
                </Col>
                </Row>

              <Row gutter={24}>
                <Col lg={21}>
                  <Form.Item label="用量公式">
                    {getFieldDecorator('feeFormulaOne', {
                      initialValue: infoDetail.feeFormulaOne,
                      rules: [{ required: true, message: '请设置用量公式' }],
                    })(<Input placeholder="请设置用量公式" />)}
                  </Form.Item>
                </Col>

                <Col lg={3}>
                  <Form.Item label="&nbsp;">
                  <Button type="primary">设置</Button>
                  </Form.Item>
                </Col>

              </Row>

              <Row gutter={24}>
                <Col lg={21}>
                  <Form.Item label="系数公式">
                    {getFieldDecorator('feeApportion', {
                       initialValue: infoDetail.feeApportion,
                      rules: [{ required: true, message: '请设置系数公式' }],
                    })(<Input placeholder="请设置系数公式" />)}
                  </Form.Item>
                </Col>
                <Col lg={3}>
                  <Form.Item label="&nbsp;">
                  <Button type="primary">设置</Button>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col lg={12}>
                  <Form.Item label="滞纳金比例(%)">
                    {getFieldDecorator('delayRate', {
                       initialValue: infoDetail.delayRate,
                      rules: [{ required: true, message: '请输入滞纳金比例' }],
                    })(<Input placeholder="请输入滞纳金比例" />)}
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item label="计算方法">
                    {getFieldDecorator('delayType', {
                        initialValue: infoDetail.delayType,
                      rules: [{ required: true, message: '请输入计算方法' }],
                    })(<Input placeholder="请输入计算方法" />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col lg={24}>
                  <Form.Item label="附加说明">
                    {getFieldDecorator('memo', {
                      initialValue: infoDetail.memo,
                      rules: [{ required: true, message: '请输入附加说明' }],
                    })(<TextArea rows={6} placeholder="请输入附加说明" />)}
                  </Form.Item>
                </Col>
              </Row>
         
          </Card>
        </TabPane>
        <TabPane tab="高级" key="2">

        <Card title="小数精度" bordered={false}>   
        <Row gutter={24}>
                <Col lg={12}>
                  <Form.Item label="中间每一步计算结果保留">
                    {getFieldDecorator('delayRate', {
                       initialValue: infoDetail.delayRate,
                      rules: [{ required: true, message: '请选择小数位数' }],
                    })(

                      <Select placeholder="请选择单位">
                      <Option value="0">0</Option>
                      <Option value="1" >1</Option>
                      <Option value="2">2</Option>
                      <Option value="3" >3</Option>
                      <Option value="4">4</Option>
                    </Select>


                    )}
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item label="对最后一位">
                    {getFieldDecorator('delayType', {
                        initialValue: infoDetail.delayType,
                      rules: [{ required: true, message: '请选择小数处理方法' }],
                    })(
                    
                      <Select placeholder="请选择小数处理方法">
                      <Option value="0">四舍五入</Option>
                      <Option value="1" >直接舍去</Option>
                      <Option value="2">有数进一</Option> 
                    </Select>
                    
                    
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12}>
                  <Form.Item label="最终结果保留小数位数">
                    {getFieldDecorator('delayRate', {
                       initialValue: infoDetail.delayRate,
                      rules: [{ required: true, message: '请选择小数位数' }],
                    })( 

                      <Select placeholder="请选择单位">
                      <Option value="0">0</Option>
                      <Option value="1" >1</Option>
                      <Option value="2">2</Option>
                      <Option value="3" >3</Option>
                      <Option value="4">4</Option>
                    </Select>


                    )}
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item label="对最后一位">
                    {getFieldDecorator('delayType', {
                        initialValue: infoDetail.delayType,
                      rules: [{ required: true, message: '请选择小数处理方法' }],
                    })(
                    

                      <Select placeholder="请选择小数处理方法">
                      <Option value="0">四舍五入</Option>
                      <Option value="1" >直接舍去</Option>
                      <Option value="2">有数进一</Option> 
                    </Select>
                    
                    
                    
                      )}
                  </Form.Item>
                </Col>
              </Row>
        </Card>
        <Card title="账单日设置" bordered={false}>   
        </Card>

        <Card title="其他" bordered={false}>   
        </Card>

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
        <Button onClick={save} type="primary">
          提交
        </Button>
      </div>

      </Form>


    </Drawer>
   
  );
};

export default Form.create<ModifyProps>()(Modify);

