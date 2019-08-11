import { TreeEntity } from '@/model/models';
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Row,
  Spin,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetRoomTreeListExpand,GetBillTreeListExpand,GetCheckTreeListExpand,SaveForm,GetFormJson} from './Offset.service';
import './style.less';
import  moment from 'moment';
import AsynSelectTree from '../AsynSelectTree';
import LeftTree from '../LeftTree';


interface AddDrawerProps {
  addDrawerVisible: boolean;
  data?: any;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  organizeId?:string;
  reload(): void;
}

const AddDrawer = (props: AddDrawerProps) => {
  const { addDrawerVisible, closeDrawer, form, id,organizeId } = props;
  const title = id === undefined ? '新增冲抵单' : '修改冲抵单';
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [payfeeitemid,setPayFeeItemId ] = useState<string>('');
  const [feeitemid,setFeeItemId] = useState<string>('');
  const [units,setUnits] = useState<string[]>([]);
  const [roomTreeData,setRoomTreeData] = useState<any>();
  const [checkTreeData,setCheckTreeData] = useState<any>();
  const [billTreeData,setBillTreeData] = useState<any>();

  const [payBeginDate,setPayBeginDate   ] = useState<string>();
  const [payEndDate,setPayEndDate] = useState<string>();
  const [beginDate,setBeginDate] = useState<string>();
  const [endDate,setEndDate] = useState<string>();

  useEffect(() => {
    getCheckTreeData().then(res => {
    }).then(()=>{
      getBillTreeData();
    });

    if(id)
    {
      setLoading(true);
      GetFormJson(id).then(res=>{
        setInfoDetail(res);
        setLoading(false);
      })
    }else{
      setPayBeginDate(getCurrentMonthFirstDay);
      setPayEndDate(getCurrentMonthLastDay);
      setBeginDate(getCurrentMonthFirstDay);
      setEndDate(getCurrentMonthLastDay);
      setLoading(false);
    }
  }, []);

  const close = () => {
    closeDrawer();
  };

  const guid=()=> {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  }

  const getCheckTreeData = () =>{
    return GetCheckTreeListExpand()
      .then((res: TreeEntity[]) => {
        const treeList = (res || []).map(item => {
          return {
            ...item,
            id: item.key,
            text: item.text,
            parentId: item.parentId,
          };
        });
        setCheckTreeData(treeList);
        return treeList;
      });
  };

  const getBillTreeData = () =>{
    return GetBillTreeListExpand()
      .then((res: TreeEntity[]) => {
        const treeList = (res || []).map(item => {
          return {
            ...item,
            id: item.key,
            text: item.text,
            parentId: item.parentId,
          };
        });
        setBillTreeData(treeList);
        return treeList;
      });
  };

  const selectRoomTree = (org, item) => {
    //setUnits([...units,org]);
  };
  const getCheckedKeys=(keys)=>{
    setUnits(keys);
  }
  const selectBillTree = (org, item) => {
    setFeeItemId(org);
  };

  const selectCheckTree = (org, item) => {
    setPayFeeItemId(org);
  };

  const onSave=()=>{
    form.validateFields((errors, values) => {
      if (!errors) {
        let newData={
          payBeginDate: values.payBeginDate.format('YYYY-MM-DD'),//"2019-07-01",//
          payEndDate: values.payEndDate.format('YYYY-MM-DD'),
          beginDate:values.beginDate.format('YYYY-MM-DD'),
          endDate: values.endDate.format('YYYY-MM-DD'),
          payfeeitemid: payfeeitemid,
          feeitemid: feeitemid
          //payfeeitemid: "fa5df220-bf54-483b-bec4-84f4a0107395",
          //feeitemid: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1"
        };
        var unitsStr="%5B";
        units.forEach(item=>{
          unitsStr+='"'+item+'"%2C';
        });
        unitsStr=unitsStr.substring(0,unitsStr.length-3)+"%5D";
        SaveForm(unitsStr,newData).then((res)=>{
          close();
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
    var dayStr=''+day;
    if (month < 10) {
      monthStr = '0' + month
    }
    if (day < 10) {
      dayStr = '0' + day
    }
    return date.getFullYear() + '-' + monthStr + '-' + dayStr ;
  }
  return (
    <Drawer className="offsetModify"
      title={title}
      placement="right"
      width={880}
      onClose={close}
      visible={addDrawerVisible}
      style={{height:'calc(100vh-50px)'}}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -50px)' }}
    >
      <Form  hideRequiredMark>
        <Spin tip="数据加载中..." spinning={loading}>
          <Row gutter={12}>
          <Col span={8}
            style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh - 140px)' }}
          >
            <AsynSelectTree
              parentid={'0'}
              getCheckedKeys={getCheckedKeys}
              selectTree={(id, item) => {
                selectRoomTree(id, item);
              }}
            />
          </Col>
          <Col span={8}>
            <Row>
                <Col>
                <Form.Item label="应付日期" style={{paddingBottom:'0px'}} labelCol={{span:6}} wrapperCol={{span:18}} >
                {getFieldDecorator('payBeginDate', {
                    initialValue:infoDetail.payBeginDate!=null
                    ? moment(new Date(infoDetail.payBeginDate))
                    : moment(getCurrentMonthFirstDay()),
                  rules: [{ required: true }],
                })(
                  <DatePicker ></DatePicker>
                )}
              </Form.Item>
                </Col>
            </Row>
            <Row>
              <Col>
              <Form.Item label="至"  style={{paddingBottom:'0px'}} labelCol={{span:6}} wrapperCol={{span:18}} >
                {getFieldDecorator('payEndDate', {
                    initialValue:infoDetail.payEndDate!=null
                    ? moment(new Date(infoDetail.payEndDate))
                    : moment(getCurrentMonthLastDay()),
                  rules: [{ required: true }],
                })(
                  <DatePicker ></DatePicker>
                )}
              </Form.Item>
              </Col>
            </Row>
            <Row
              style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh - 300px)' }}
            >
              <LeftTree
                treeData={checkTreeData}
                selectTree={(id, item) => {
                  selectCheckTree(id, item);
                }}
              />
            </Row>
          </Col>
          <Col span={8}>
            <Row>
              <Col>
                <Form.Item label="账单日" style={{paddingBottom:'0px'}}  labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('beginDate', {
                      initialValue:infoDetail.beginDate!=null
                      ? moment(new Date(infoDetail.beginDate))
                      : moment(getCurrentMonthFirstDay()),
                    rules: [{ required: true }],
                  })(
                    <DatePicker></DatePicker>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Item label="至" style={{paddingBottom:'0px'}}  labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('endDate', {
                      initialValue:infoDetail.endDate!=null
                      ? moment(new Date(infoDetail.endDate))
                      : moment(getCurrentMonthLastDay()),
                    rules: [{ required: true }],
                  })(
                    <DatePicker ></DatePicker>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh - 300px)' }}
            >
              <LeftTree
                treeData={billTreeData}
                selectTree={(id, item) => {
                  selectBillTree(id, item);
                }}
              />
            </Row>
          </Col>
        </Row>
        </Spin>
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
        onClick={()=>close()}
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

export default Form.create<AddDrawerProps>()(AddDrawer);

