import { Card, Form, Layout, Row, Col, DatePicker, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import AsynSelectTree from '../AsynSelectTree';
import LeftTree from '../LeftTree';
import { TreeEntity } from '@/model/models';
import { GetFeeTreeListExpand } from './Main.service';
import { getResult } from '@/utils/networkUtils';
import moment from 'moment';

interface AddReductionProps {
  visible: boolean;
  getReducetionItem(data?): void;
  closeModal(): void;
}

const AddReductionItem = (props: AddReductionProps) => {
  const { visible, getReducetionItem, closeModal } = props;
  const [feetreeData, setFeeTreeData] = useState<TreeEntity[]>([]);

  //单元选择多选
  const [unitData, setUnitData] = useState<string[]>([]);
  //费项选择
  const [feeData, setFeeData] = useState<string>();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  useEffect(() => {
    if (visible) {
      setStartDate(getCurrentMonthFirstDay());
      setEndDate(getCurrentDay());
    }
  }, [visible])

  const selectStartDate = (date) => {
    setStartDate(date);
  }

  const selectEndDate = (date) => {
    setEndDate(date);
  }

  //选择房源
  const selectUnitTree = (id) => {
    //setUnitData([...unitData,id]);
  };

  const selectFeeTree = (id) => {
    setFeeData(id);
  };

  const onOk = () => {
    var data = {
      units: '["' + unitData + '"]',
      feeitemid: feeData,
      begin: moment(startDate).format('YYYY-MM-DD'),
      end: moment(endDate).format('YYYY-MM-DD'),
      Rebate: 1,
      ReductionAmount: 1
    };
    getReducetionItem(data);
  }
  useEffect(() => {
    // getTreeData().then(res => {
    //   const root = res.filter(item => item.parentId === '0');
    //   const rootOrg = root.length === 1 ? root[0] : undefined;
    // });

    getFeeTreeData().then(res => {
      // const root = res.filter(item => item.parentId === '0');
      // const rootOrg = root.length === 1 ? root[0] : undefined;
    });


  }, []);

  // 获取属性数据
  // const getTreeData = () => {
  //   return GetTreeListExpand()
  //     .then(getResult)
  //     .then((res: TreeEntity[]) => {
  //       // const treeList = (res || []).map(item => {
  //       //   return {
  //       //     ...item,
  //       //     id: item.id,
  //       //     text: item.title,
  //       //     parentId: item.pId,
  //       //   };
  //       // });
  //       setTreeData(res || []);
  //       return res || [];
  //     });
  // };

  const GetAllTreeNode=(root)=>{
    var treeListNodes=[];
    root.forEach((rootItem=>{
      var node={
        key: rootItem.key,
        parentId: rootItem.parentId,
        title: rootItem.title,
        value:rootItem.value,
        type: rootItem.type,
        id: rootItem.key
      };
      treeListNodes.push(node);
      if(rootItem.children&&rootItem.children.length>0)
      {
        var nodes=GetAllTreeNode(rootItem.children);
        nodes.forEach(item=>{
          treeListNodes.push(item);
        });
      }
    }));
    return treeListNodes;
  }


  //获取所有费项
  const getFeeTreeData = () => {
    return GetFeeTreeListExpand()
      .then(getResult)
      .then((res: TreeEntity[]) => {
      //  console.log(res);
        var newData=GetAllTreeNode(res);
        setFeeTreeData(newData || []);
        return newData || [];
      });
  };

  //获取当前月份第一天
  const getCurrentMonthFirstDay = () => {
    var monthStr = '';
    var dayStr = '';
    var date = new Date()
    date.setDate(1)
    var month = date.getMonth() + 1
    var day = date.getDate()
    if (month < 10) {
      monthStr = '0' + month
    } else {
      monthStr = '' + month

    }
    if (day < 10) {
      dayStr = '0' + day
    } else {
      dayStr = '' + day
    }
    return date.getFullYear() + '-' + monthStr + '-' + dayStr
  }
  //获取当前月份第一天
  const getCurrentDay = () => {
    var monthStr = '';
    var dayStr = '';
    var date = new Date()

    var month = date.getMonth() + 1
    var day = date.getDate()
    if (month < 10) {
      monthStr = '0' + month
    } else {
      monthStr = '' + month

    }
    if (day < 10) {
      dayStr = '0' + day
    } else {
      dayStr = '' + day
    }
    return date.getFullYear() + '-' + monthStr + '-' + dayStr
  }

  const getCheckedKeys=(keys)=>{
    setUnitData(keys);
  }

  return (
    <Modal
      title="新增减免的费项"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => onOk()}
      destroyOnClose={true}
      width='860px' >
      <Layout>
        <Row style={{height:'calc(60vh)'}}>
          <Col span={12} style={{ height: '100%'}}>
            <AsynSelectTree parentid={'0'}
              getCheckedKeys={getCheckedKeys}
              selectTree={(parentId) => {
                selectUnitTree(parentId);
              }}/>
          </Col>
          <Col span={12}>
            <Form layout="vertical" hideRequiredMark  >
              <Card >
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="账单日">
                      <DatePicker defaultValue={moment(startDate)}
                        onChange={(date, dateString) => selectStartDate(dateString)} /></Form.Item>
                  </Col>
                  <Col span={12}><Form.Item label="至">
                    <DatePicker
                    defaultValue={moment(endDate)}
                    onChange={(date, dateString) => selectEndDate(dateString)} /></Form.Item></Col>
                </Row>
                <LeftTree
                  selectTree={(id, item) => {
                    selectFeeTree(id);
                  }}
                  treeData={feetreeData} />
              </Card>
            </Form>
          </Col>
        </Row>
      </Layout>
    </Modal>
  );
};

export default AddReductionItem;
