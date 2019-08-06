import { Layout,Row,Col,DatePicker,Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import LeftTree from '../LeftTree';
import { TreeEntity } from '@/model/models';
import { GetTreeListExpand,GetFeeTreeListExpand } from './Main.service';
import { getResult } from '@/utils/networkUtils';
import  moment from 'moment';

const { Sider, Content } = Layout;

interface AddReductionProps {
  visible:boolean;
  getReducetionItem(data?): void;
  closeModal():void;
}

const AddReductionItem = (props:AddReductionProps)=> {
  const {visible,getReducetionItem,closeModal}= props;
  const [treeData, setTreeData] = useState<TreeEntity[]>([]);
  const [feetreeData, setFeeTreeData] = useState<TreeEntity[]>([]);

  //单元选择
  const [unitData, setUnitData] = useState<string>();
  //费项选择
  const [feeData, setFeeData] = useState<string>();

  const [startDate, setStartDate] = useState<string>();

  const [endDate, setEndDate] = useState<string>();


  useEffect(()=>{
    if (visible){
      setStartDate(getCurrentMonthFirstDay());
      setEndDate(getCurrentDay());
    }
  },[visible])

  const selectStartDate=(date)=>{
    setStartDate(date);
  }

  const selectEndDate=(date)=>{
    setEndDate(date);
  }

  const selectUnitTree = (item) => {
    setUnitData(item);
  };

  const selectFeeTree = ( item) => {
    setFeeData(item);
  };

  const onOk=()=>{
    var data = {
      units:'["'+unitData+'"]',
      feeitemid:feeData,//'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1',//
      begin:moment(startDate).format('YYYY-MM-DD'),
      end:moment(endDate).format('YYYY-MM-DD'),
      Rebate:1,ReductionAmount:1
    };
    getReducetionItem(data);
  }
  useEffect(() => {
    getTreeData().then(res => {
      const root = res.filter(item => item.parentId === '0');
      const rootOrg = root.length === 1 ? root[0] : undefined;
    });

    getFeeTreeData().then(res => {
      const root = res.filter(item => item.parentId === '0');
      const rootOrg = root.length === 1 ? root[0] : undefined;
    });
  }, []);
  // 获取属性数据
  const getTreeData = () => {
    return GetTreeListExpand()
      .then(getResult)
      .then((res: TreeEntity[]) => {
        // const treeList = (res || []).map(item => {
        //   return {
        //     ...item,
        //     id: item.id,
        //     text: item.title,
        //     parentId: item.pId,
        //   };
        // });
        setTreeData(res || []);
        return res || [];
      });
  };

  //获取所有费项
  const getFeeTreeData = () => {
    return GetFeeTreeListExpand()
        .then(getResult)
        .then((res: TreeEntity[]) => {
          setFeeTreeData(res || []);
          return res || [];
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
 //获取当前月份第一天
 const getCurrentDay=() =>{
  var monthStr='';
  var dayStr='';
  var date = new Date()

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
  return (
    <Modal
        title="新增减免的费项"
        visible={visible}
        okText="确认"
        cancelText="取消"
        onCancel={()=>closeModal()}
        onOk={()=>onOk()}
        destroyOnClose={true}
        width='860px'
      >
      <Layout style={{height:'500px'}}>
        <Sider theme="light" style={{height: '100%' ,overflow:'auto'}} width="350px">
          <LeftTree
            selectTree={(id,item) => {
              selectUnitTree(id);
            }}
            treeData={treeData}
          >
          </LeftTree>
        </Sider>
        <Content style={{marginLeft:'10px',border: '1px solid rgb(232, 234, 243)',padding:'15px',paddingLeft:'25px',backgroundColor: '#fff'}}>
          <Row>
            <Col span={12}>&nbsp;账单日：<DatePicker defaultValue={moment(startDate)}  onChange={(date,dateString)=>selectStartDate(dateString)}/></Col>
            <Col span={12}>&nbsp;&nbsp;至：<DatePicker defaultValue={moment(endDate)}  onChange={(date,dateString)=>selectEndDate(dateString)}/></Col>
          </Row>
          <Row style={{marginTop:'15px'}}>
            <Col style={{height: '100%' ,overflow:'auto'}} >
              <LeftTree
                selectTree={(id,item) => {
                  selectFeeTree(id);
                }}
                treeData={feetreeData}
              >
              </LeftTree>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Modal>
  );
};

export default AddReductionItem;
