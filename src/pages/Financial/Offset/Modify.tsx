import { TreeEntity } from '@/model/models';
import {
  Select,
  Button,
  Col,Icon,
  DatePicker,
  Drawer,
  Form,
  Row,
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

interface ModifyProps {
  modifyVisible: boolean;
  data?: any;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  organizeId?:string;
  reload(): void;
}

const Modify = (props: ModifyProps) => {
  const { modifyVisible, closeDrawer, form, id,organizeId } = props;
  const title = id === undefined ? '新增冲抵单' : '修改冲抵单';
  const [loading, setLoading] = useState<boolean>(false);
  const [modalvisible,setModalVisible]=useState<boolean>(false);

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
    setModalVisible(false);
  }

  const close = () => {
    closeDrawer();
  };

  const guid=()=> {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  }

  const getRoomTreeData = () =>{
    return GetRoomTreeListExpand()
      .then((res: TreeEntity[]) => {
        const treeList = (res || []).map(item => {
          return {
            ...item,
            id: item.id,
            text: item.title,
            parentId: item.pId,
          };
        });
        setRoomTreeData(treeList);
        return treeList;
      });
  };

  const getCheckTreeData = () =>{
    return GetCheckTreeListExpand()
      .then((res: TreeEntity[]) => {
        const treeList = (res || []).map(item => {
          return {
            ...item,
            id: item.id,
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
            id: item.id,
            text: item.text,
            parentId: item.parentId,
          };
        });
        setBillTreeData(treeList);
        return treeList;
      });
  };

  const selectRoomTree = (org, item) => {
    /*setInfoDetail({
      ...infoDetail,
      units:org
    });*/
    setUnits(org);
  };

  const selectBillTree = (org, item) => {
    /*setInfoDetail({
      ...infoDetail,
      feeitemid:org
    });*/
    setFeeItemId(org);
  };

  const selectCheckTree = (org, item) => {
    /*setInfoDetail({
      ...infoDetail,
      payfeeitemid :org
    });*/
    setPayFeeItemId(org);
  };

  const onSave=()=>{
    form.validateFields((errors, values) => {
      if (!errors) {
        let newData={
          payBeginDate: values.payBeginDate.format('YYYY-MM-DD HH:mm:ss'),
          payEndDate: values.payEndDate.format('YYYY-MM-DD HH:mm:ss'),
          beginDate:values.beginDate.format('YYYY-MM-DD HH:mm:ss'),
          endDate: values.endDate.format('YYYY-MM-DD HH:mm:ss'),
          payfeeitemid: payfeeitemid,
          feeitemid: feeitemid
        };

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
    <Drawer
      title={title}
      placement="right"
      width={880}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={12}>
          <Col span={8}
            style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh - 140px)' }}
          >
            <LeftTree
              treeData={roomTreeData}
              selectTree={(id, item) => {
                selectRoomTree(id, item);
              }}
            />
          </Col>
          <Col span={8}>
            <Row style={{paddingBottom:'7px'}}>
                <Col>
                <Form.Item label="应付日期">
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
            <Row style={{paddingBottom:'7px'}}>
              <Col>
              <Form.Item label="至">
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
            <Row style={{paddingBottom:'7px'}}>
            <Col>
            <Form.Item label="账单日">
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
            <Row style={{paddingBottom:'7px'}}>
            <Col>
            <Form.Item label="至">
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
        onClick={()=>closeDrawer()}
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

export default Form.create<ModifyProps>()(Modify);

