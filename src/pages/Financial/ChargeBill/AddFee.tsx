import { TreeEntity } from '@/model/models';
import {
  Checkbox,
  Tabs,
  Select,
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,InputNumber,
  Row,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetFormJson,GetFeeType,GetAllFeeItems ,GetReceivablesFeeItemTreeJson} from './Main.service';
import styles from './style.less';
import LeftTree from '../LeftTree';
import   moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const{TabPane} = Tabs;

interface AddFeeProps {
  addFeeVisible: boolean;
  closeAddDrawer(): void;
  form: WrappedFormUtils;
  organizeId?:string;
  id?:string;
  reload(): void;
}
const AddFee = (props: AddFeeProps) => {
  const { addFeeVisible, closeAddDrawer, form, organizeId,id} = props;
  const { getFieldDecorator } = form;
  const title = '新增费用' ;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [feeTreeData, setFeeTreeData] = useState<TreeEntity[]>([]);

  const [relatrionIds,setRelatrionID]=useState<any[]>([]);
  const [unitIds,setUnitIds]=useState<any[]>([]);

  // 打开抽屉时初始化
  useEffect(() => {
    if (addFeeVisible) {
      GetReceivablesFeeItemTreeJson().then(res=>{
        const treeList = (res || []).map(item => {
          return {
            ...item,
            id: item.key,
            text: item.text,
            parentId: item.parentId,
          };
        });
        setFeeTreeData(treeList);
      });
      //重置之前选择加载的费项类别
      setInfoDetail({  });
      form.resetFields();
    } else {
      form.setFieldsValue({});
    }
  }, [addFeeVisible]);

  const close = () => {
    closeAddDrawer();
  };
  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {

      }
    });
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={780}
      onClose={close}
      visible={addFeeVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Row>
        <Col span={8}  style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh - 140px)' }}>
          <LeftTree
            treeData={feeTreeData}
            selectTree={(id, item) => {

            }}
          />
        </Col>
        <Col span={16}>
          <Form hideRequiredMark>
            <Row>
              <Form.Item label="加费对象" required labelCol={{span:4}} wrapperCol={{span:20}} >
                {getFieldDecorator('relatrionId', {
                  initialValue: infoDetail.relatrionId,
                  rules: [{ required: true, message: '请选择加费对象' }]
                })(
                  <Select placeholder="=请选择=">
                    {relatrionIds.map(item => (
                      <Option key={item.value} value={item.value}>
                        {item.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="选择房屋" required  labelCol={{span:4}} wrapperCol={{span:20}} >
                {getFieldDecorator('unitId', {
                  initialValue: infoDetail.unitId,
                  rules: [{ required: true, message: '请选择房屋' }]
                })(
                  <Select placeholder="=请选择=">
                    {unitIds.map(item => (
                      <Option key={item.value} value={item.value}>
                        {item.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Row>
            <Row>
              <Col span={10}>
                <Form.Item label="单价" required labelCol={{span:10}} wrapperCol={{span:14}} >
                  {getFieldDecorator('price', {
                    initialValue: infoDetail.price,
                    rules: [{ required: true, message: '请输入单价' }]
                  })(
                    <InputNumber  disabled={true} style={{width:'100%'}} ></InputNumber>
                  )}
                </Form.Item>
              </Col>
              <Col span={1}  style={{lineHeight:"32px",textAlign:'center'}}>
              X
              </Col>
              <Col span={6}>
                <Form.Item label="" required wrapperCol={{span:24}}>
                  {getFieldDecorator('quantity', {
                    initialValue: infoDetail.quantity,
                    rules: [{ required: true, message: '请输入数量' }]
                  })(
                    <InputNumber disabled={true} style={{width:'100%'}}></InputNumber>
                  )}
                </Form.Item>
              </Col>
              <Col span={1} style={{lineHeight:"32px",textAlign:'center'}}>
              X
              </Col>
              <Col span={6}>
                <Form.Item label="" required wrapperCol={{span:24}}>
                  {getFieldDecorator('number', {
                    initialValue: infoDetail.number,
                    rules: [{ required: true, message: '请输入系数' }]
                  })(
                    <InputNumber style={{width:'100%'}}></InputNumber>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="金额" required   labelCol={{span:4}} wrapperCol={{span:20}} >
                  {getFieldDecorator('amouant', {
                    initialValue: infoDetail.amouant,
                    rules: [{ required: true, message: '=请选择=' }]
                  })(
                    <InputNumber disabled={true} style={{width:'100%'}} ></InputNumber>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label="周期" required   labelCol={{span:10}} wrapperCol={{span:14}} >
                  {getFieldDecorator('cycleValue', {
                    initialValue: infoDetail.cycleValue,
                    rules: [{ required: true, message: '=请选择=' }]
                  })(
                    <InputNumber  style={{width:'100%'}}></InputNumber>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="" required   labelCol={{span:0}} wrapperCol={{span:24}} >
                  {getFieldDecorator('cycleType', {
                    initialValue: infoDetail.cycleType,
                    rules: [{ required: true, message: '请选择周期单位' }]
                  })(
                    <Select placeholder="=请选择="  style={{width:'100%'}}>
                      <Option key='日' value='日'>
                        {'日'}
                      </Option>
                      <Option key='月' value='月'>
                        {'月'}
                      </Option>
                      <Option key='年' value='年'>
                        {'年'}
                      </Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="起始日期" required   labelCol={{span:10}} wrapperCol={{span:14}} >
                  {getFieldDecorator('beginDate', {
                    initialValue: infoDetail.beginDate,
                    rules: [{ required: true, message: '请选择起始日期' }]
                  })(
                    <DatePicker  style={{width:'100%'}}/>
                  )}
                </Form.Item>
              </Col>
              <Col  span={12}>
                <Form.Item label="结束日期" required  labelCol={{span:10}} wrapperCol={{span:14}}>
                  {getFieldDecorator('endDate', {
                    initialValue: infoDetail.endDate,
                    rules: [{ required: true, message: '请选择结束日期' }]
                  })(
                    <DatePicker  style={{width:'100%'}}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col  span={12}>
                <Form.Item label="账单日" required   labelCol={{span:10}} wrapperCol={{span:14}}>
                  {getFieldDecorator('billDate', {
                    initialValue: infoDetail.billDate,
                    rules: [{ required: true, message: '请选择账单日' }]
                  })(
                    <DatePicker  style={{width:'100%'}}/>
                  )}
                </Form.Item>
              </Col>
              <Col  span={12}>
                <Form.Item label="应收期间" required   labelCol={{span:10}} wrapperCol={{span:14}}>
                  {getFieldDecorator('period', {
                    initialValue: infoDetail.period,
                    rules: [{ required: true, message: '请选择应收期间' }]
                  })(
                    <DatePicker  style={{width:'100%'}}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="备注" required  labelCol={{span:4}} wrapperCol={{span:20}}>
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo,
                    rules: [{ required: false }]
                  })(
                    <Input.TextArea rows={8}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
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
export default Form.create<AddFeeProps>()(AddFee);

