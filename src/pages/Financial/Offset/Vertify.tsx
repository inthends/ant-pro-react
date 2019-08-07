import { TreeEntity } from '@/model/models';
import {
  Select,
  Button,
  Col,Icon,
  DatePicker,
  Drawer,
  Form,
  Row,
  Input,
  notification ,
  message,
  RangePicker
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetRoomTreeListExpand,GetBillTreeListExpand,GetCheckTreeListExpand,SaveForm} from './Offset.service';
import styles from './style.less';
import  moment from 'moment';
import LeftTree from '../LeftTree';

interface VertifyProps {
  vertifyVisible: boolean;
  data?: any;
  closeVertify(): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
}

const Vertify = (props: VertifyProps) => {
  const { vertifyVisible, closeVertify, form, id,organizeId } = props;
  const title = id === undefined ? '新增冲抵单' : '修改冲抵单';
  const [loading, setLoading] = useState<boolean>(false);
  const [vertifyvisible,setVertifyVisible]=useState<boolean>(false);

  const { getFieldDecorator } = form;

  const [infoDetail, setInfoDetail] = useState<any>({});

  const [payfeeitemid,setPayFeeItemId ] = useState<string>('');
  const [feeitemid,setFeeItemId] = useState<string>('');
  const [units,setUnits] = useState<string>([]);

  const [roomTreeData,setRoomTreeData] = useState<any>();
  const [checkTreeData,setCheckTreeData] = useState<any>();
  const [billTreeData,setBillTreeData] = useState<any>();


  const [payBeginDate,setPayBeginDate   ] = useState<string>();
  const [payEndDate,setPayEndDate] = useState<string>();
  const [beginDate,setBeginDate] = useState<string>();
  const [endDate,setEndDate] = useState<string>();

  useEffect(() => {
    getRoomTreeData().then(res => {

    }).then(()=>{
      getCheckTreeData();
    }).then(()=>{
      getBillTreeData();
    });

    if(id)
    {

    }else{
      setPayBeginDate(getCurrentMonthFirstDay);
      setPayEndDate(getCurrentMonthLastDay);
      setBeginDate(getCurrentMonthFirstDay);
      setEndDate(getCurrentMonthLastDay);
    }
  }, []);

  const closeModal=()=>{
    setVertifyVisible(false);
  }

  const close = () => {
    closeVertify ();
  };

  const guid=()=> {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  }

  const onSave=()=>{
    form.validateFields((errors, values) => {
      if (!errors) {
        let newData={}

        SaveForm(units,newData).then((res)=>{
          console.log(res);
          closeModal();
        })
      }
    });
  };

  //获取当前月份第一天
  const getCurrentMonthFirstDay=() =>{
    var monthStr='';
    var dayStr='';
    var date = new Date()
    date.setDate(1)
    var month = date.getMonth() + 1
    var day = date.getDate()
    if (month < 10) {
      monthStr = '0' + month
    }else{
      monthStr = ''+month

    }
    if (day < 10) {
      dayStr = '0' + day
    }else{
      dayStr = ''+day
    }
    return date.getFullYear() + '-' + monthStr + '-' + dayStr
  }


  //获取当前月份最后
  const getCurrentMonthLastDay=() =>{
    var monthStr='';
    var dayStr='';
    var date=new Date();
    var currentMonth=date.getMonth();
    var nextMonth=++currentMonth;
    var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
    var oneDay=1000*60*60*24;
    var lastTime = new Date(nextMonthFirstDay-oneDay);
    var month = parseInt(lastTime.getMonth()+1);
    var day = lastTime.getDate();
    var dayStr=''+dayStr;
    if (month < 10) {
      monthStr = '0' + month
    }
    if (day < 10) {
      dayStr = '0' + day
    }
    return date.getFullYear() + '-' + monthStr + '-' + dayStr ;
  }
  return (
    <Drawer
      title={title}
      placement="right"
      width={880}
      onClose={close}
      visible={vertifyvisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="单号">
              {getFieldDecorator('billcode', {
                  initialValue:infoDetail.billcode,
                rules: [{ required: true }],
              })(
                <Input></Input>
              )}
            </Form.Item>
          </Col>
          <Col span={8} >
            <Form.Item label="账单日期">
              {getFieldDecorator('billdate', {
                  initialValue:infoDetail.billdate!=null
                  ? moment(new Date(infoDetail.billdate))
                  : moment(getCurrentMonthLastDay()),
                rules: [{ required: true }],
              })(
                <DatePicker ></DatePicker>
              )}
            </Form.Item>
          </Col>
          <Col span={8} >
            <Form.Item label="冲抵人">
              {getFieldDecorator('verifyperson', {
                  initialValue:infoDetail.verifyperson,
                rules: [{ required: true }],
              })(
                <Input ></Input>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
                <Form.Item label="业户名称">
                  {getFieldDecorator('custname', {
                      initialValue:infoDetail.custname,
                    rules: [{ required: true }],
                  })(
                    <Input></Input>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核日期">
                  {getFieldDecorator('verifydate', {
                      initialValue:infoDetail.verifydate!=null
                      ? moment(new Date(infoDetail.verifydate))
                      : moment(getCurrentMonthLastDay()),
                    rules: [{ required: true }],
                  })(
                    <DatePicker ></DatePicker>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核人">
                  {getFieldDecorator('verifyperson', {
                      initialValue:infoDetail.verifyperson,
                    rules: [{ required: true }],
                  })(
                    <Input ></Input>
                  )}
                </Form.Item>
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
        <Button style={{ marginRight: 8 }}
        onClick={()=>closeVertify()}
        >
          取消
        </Button>
        <Button type="primary"
          onClick={()=>onSave()}
        >
          提交
        </Button>
      </div>
      </Form>
    </Drawer>
  );
};

export default Form.create<VertifyProps>()(Vertify);

