import { Form, Row, Col, DatePicker, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import AsynSelectTree from '../AsynSelectTree';
import LeftTree from '../LeftTree';
import { TreeEntity } from '@/model/models';
import { GetFeeTreeListExpand } from './Main.service';
import { getResult } from '@/utils/networkUtils';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';

interface AddReductionItemProps {
  visible: boolean;
  getReducetionItem(data?): void;
  closeModal(): void;
  form: WrappedFormUtils;
}

const AddReductionItem = (props: AddReductionItemProps) => {
  const { form, visible, getReducetionItem, closeModal } = props;
  const { getFieldDecorator } = form;
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
    form.validateFields((errors, values) => {
      if (!errors) {

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
    });
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

  const GetAllTreeNode = (root) => {
    let treeListNodes: any[] = [];
    root.forEach((rootItem => {
      let node = {
        key: rootItem.key,
        parentId: rootItem.parentId,
        title: rootItem.title,
        value: rootItem.value,
        type: rootItem.type,
        id: rootItem.key
      };
      treeListNodes.push(node);
      if (rootItem.children && rootItem.children.length > 0) {
        var nodes = GetAllTreeNode(rootItem.children);
        nodes.forEach(item => {
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
        var newData = GetAllTreeNode(res);
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

  const getCheckedKeys = (keys) => {
    setUnitData(keys);
  }

  return (
    <Modal
      title="新增减免费项"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => onOk()}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='700px' >
      <Form layout='inline' hideRequiredMark >
        <Row gutter={24}>
          <Col lg={12}>
            <Form.Item label="账单起始日" required >
              {getFieldDecorator('startDate', {
                initialValue: moment(startDate),
                rules: [{ required: true, message: '请选择账单起始日' }],
              })(
                <DatePicker onChange={(date, dateString) => selectStartDate(dateString)} />
              )}
            </Form.Item>

          </Col> <Col lg={12}>
            <Form.Item label="账单截止日" required >

              {getFieldDecorator('endDate', {
                initialValue: moment(endDate),
                rules: [{ required: true, message: '请选择账单截止日' }],
              })(
                <DatePicker onChange={(date, dateString) => selectEndDate(dateString)} />
              )}
            </Form.Item>
          </Col>

        </Row>
      </Form>
      <Row  >
        <Col lg={10} style={{ height: 'calc(70vh)' }} >
          <AsynSelectTree
            parentid={'0'}
            getCheckedKeys={getCheckedKeys}
            selectTree={(parentId) => {
              selectUnitTree(parentId);
            }} />
        </Col>
        <Col lg={14}  >

          <Row gutter={24} >
            <Col lg={24} style={{ height: 'calc(70vh)' }}>
              <LeftTree
                selectTree={(id, item) => {
                  selectFeeTree(id);
                }}
                treeData={feetreeData}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal >
  );
};

//export default AddReductionItem; 
export default Form.create<AddReductionItemProps>()(AddReductionItem);
