import { Spin, message, Form, Row, Col, DatePicker, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
// import AsynSelectTree from '../AsynSelectTree';
import SelectTree from '../SelectTree';

import LeftTree from '../LeftTree';
import { TreeEntity } from '@/model/models';
import { GetReceivablesTree } from './Main.service';
// import { getResult } from '@/utils/networkUtils';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';

interface AddItemProps {
  visible: boolean;
  getReducetionItem(data?): void;
  closeModal(): void;
  form: WrappedFormUtils;
  treeData: any[];
}

const AddItem = (props: AddItemProps) => {
  const { form, visible, getReducetionItem, closeModal, treeData } = props;
  const { getFieldDecorator } = form;
  const [feetreeData, setFeeTreeData] = useState<TreeEntity[]>([]);
  //单元选择多选
  const [unitData, setUnitData] = useState<string[]>([]);
  //费项选择
  const [feeItemId, setFeeItemId] = useState<string>();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      setStartDate(getCurrentMonthFirstDay());
      setEndDate(getCurrentDay());
    }
  }, [visible])

  const selectStartDate = (date) => {
    setStartDate(date);
  };

  const selectEndDate = (date) => {
    setEndDate(date);
  };

  //选择房源
  // const selectUnitTree = (id) => {
  //   setUnitData([...unitData, id]);
  // };

  const selectFeeTree = (id) => {
    setFeeItemId(id);
  };

  const onOk = () => {
    form.validateFields((errors, values) => {
      if (!errors) { 
        //验证房屋和费项
        if (unitData.length == 0) {
          message.warning('请选择房屋！');
          return;
        }

        if (feeItemId == undefined) {
          message.warning('请选择费项！');
          return;
        }

        setLoading(true);
        var data = {
          // units: '["' + unitData + '"]', 
          units: JSON.stringify(unitData),
          feeitemid: feeItemId,
          beginDate: moment(startDate).format('YYYY-MM-DD'),
          endDate: moment(endDate).format('YYYY-MM-DD')
        };
        getReducetionItem(data);
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    // getTreeData().then(res => {
    //   const root = res.filter(item => item.parentId === '0');
    //   const rootOrg = root.length === 1 ? root[0] : undefined;
    // });

    GetReceivablesTree().then(res => {
      setFeeTreeData(res || []);
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
  // const getFeeTreeData = () => {
  //   return GetFeeTreeListExpand()
  //     .then(getResult)
  //     .then((res: TreeEntity[]) => {
  //       //  console.log(res);
  //       var newData = GetAllTreeNode(res);
  //       setFeeTreeData(newData || []);
  //       return newData || [];
  //     });
  // };

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

  // const getCheckedKeys = (keys) => {
  //   setUnitData(keys);
  // }

  return (
    <Modal
      title="新增优惠费项"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => onOk()}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='700px' >
      <Spin tip="数据处理中..." spinning={loading}>
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
            </Col>
            <Col lg={12}>
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
        <Row gutter={12}>
          <Col lg={10} style={{ height: 'calc(70vh)' }} >
            {/* <AsynSelectTree
              parentid={'0'}
              getCheckedKeys={getCheckedKeys}
              selectTree={(parentId) => {
                selectUnitTree(parentId);
              }} /> */}

            <SelectTree
              checkable={true}
              treeData={treeData}
              getCheckedKeys={(keys) => {
                setUnitData(keys);
              }}
              selectTree={(id, type, info?) => {
              }}
            />
          </Col>
          <Col lg={14}>
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
      </Spin>
    </Modal >
  );
};

//export default AddReductionItem; 
export default Form.create<AddItemProps>()(AddItem);
