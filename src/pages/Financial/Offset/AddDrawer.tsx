//新增冲抵单
import { TreeEntity } from '@/model/models';
import { message, notification, Button, Col, DatePicker, Drawer, Form, Row, Spin } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetReceivablesTree, GetPaymentTree, SaveForm, GetFormJson } from './Offset.service';
// import './style.less';
import moment from 'moment';
import SelectTree from '../SelectTree';
import LeftTree from '../LeftTree';

interface AddDrawerProps {
  addDrawerVisible: boolean;
  data?: any;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  organizeId?: string;
  reload(): void;
  treeData: any[];
};

const AddDrawer = (props: AddDrawerProps) => {
  const { treeData, addDrawerVisible, closeDrawer, form, id,reload } = props;
  const title = id === undefined ? '新增冲抵单' : '修改冲抵单';
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [payfeeitemid, setPayFeeItemId] = useState<string>('');
  const [feeitemid, setFeeItemId] = useState<string>('');
  const [units, setUnits] = useState<string[]>([]);
  //const [roomTreeData, setRoomTreeData] = useState<any>();
  const [checkTreeData, setCheckTreeData] = useState<TreeEntity[]>([]);//付款费项
  const [billTreeData, setBillTreeData] = useState<TreeEntity[]>([]);//收款费项

  // const [payBeginDate, setPayBeginDate] = useState<string>();
  // const [payEndDate, setPayEndDate] = useState<string>();
  // const [beginDate, setBeginDate] = useState<string>();
  // const [endDate, setEndDate] = useState<string>();

  useEffect(() => {
    // getCheckTreeData().then(res => {
    // }).then(() => {
    //   getBillTreeData();
    // });

    GetPaymentTree().then((res) => {
      setCheckTreeData(res || []);
    });

    GetReceivablesTree().then((res) => {
      setBillTreeData(res || []);
    });

    if (id) {
      setLoading(true);
      GetFormJson(id).then(res => {
        setInfoDetail(res);
        setLoading(false);
      })
    } else {
      // setPayBeginDate(getCurrentMonthFirstDay);
      // setPayEndDate(getCurrentMonthLastDay);
      // setBeginDate(getCurrentMonthFirstDay);
      // setEndDate(getCurrentMonthLastDay);
      setLoading(false);
    }
  }, []);

  // const close = () => {
  //   closeDrawer();
  // };

  // const guid = () => {
  //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  //     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  //     return v.toString(16);
  //   });
  // }

  // const getCheckTreeData = () => {
  //   return GetCheckTreeListExpand()
  //     .then((res: TreeEntity[]) => {
  // const treeList = (res || []).map(item => {
  //   return {
  //     ...item,
  //     id: item.key,
  //     text: item.title,
  //     parentId: item.parentId,
  //   };
  // });
  // setCheckTreeData(res || []);
  //return treeList;
  //     });
  // };

  // const getBillTreeData = () => {
  //   return GetBillTreeListExpand()
  //     .then((res: TreeEntity[]) => {
  //       const treeList = (res || []).map(item => {
  //         return {
  //           ...item,
  //           id: item.key,
  //           text: item.title,
  //           parentId: item.parentId,
  //         };
  //       });
  //       setBillTreeData(treeList);
  //       return treeList;
  //     });
  // };

  //const selectRoomTree = (org, item) => {
  //setUnits([...units,org]);
  //};

  // const getCheckedKeys = (keys) => {
  //   setUnits(keys);
  // };

  const selectBillTree = (org, item) => {
    setFeeItemId(org);
  };
  const selectCheckTree = (org, item) => {
    setPayFeeItemId(org);
  };

  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {

        //验证房屋和费项
        if (units.length == 0) {
          message.warning('请选择房屋！');
          return;
        }

        if (payfeeitemid == '') {
          message.warning('请选择付款费项！');
          return;
        }

        if (feeitemid == '') {
          message.warning('请选择收款费项！');
          return;
        }


        let newData = {
          payBeginDate: values.payBeginDate.format('YYYY-MM-DD'),//"2019-07-01",//
          payEndDate: values.payEndDate.format('YYYY-MM-DD'),
          beginDate: values.beginDate.format('YYYY-MM-DD'),
          endDate: values.endDate.format('YYYY-MM-DD'),
          payfeeitemid: payfeeitemid,
          feeitemid: feeitemid,
          units: JSON.stringify(units)
        };
        // var unitsStr = "%5B";
        // units.forEach(item => {
        //   unitsStr += '"' + item + '"%2C';
        // });
        // unitsStr = unitsStr.substring(0, unitsStr.length - 3) + "%5D"; 
        SaveForm(newData).then((res) => {
          if (!res) {
            notification['warning']({
              message: '系统提示',
              description:
                '没有找到要冲抵的费用！'
            });
          } else {
            message.success('保存成功！');
            reload();
            closeDrawer();
          }
        })
      }
    });
  };

  //获取当前月份第一天
  // const getCurrentMonthFirstDay = () => {
  //   var monthStr = '';
  //   var dayStr = '';
  //   var date = new Date();
  //   date.setDate(1);
  //   var month = date.getMonth() + 1;
  //   var day = date.getDate();
  //   if (month < 10) {
  //     monthStr = '0' + month;
  //   } else {
  //     monthStr = '' + month;

  //   }
  //   if (day < 10) {
  //     dayStr = '0' + day;
  //   } else {
  //     dayStr = '' + day;
  //   }
  //   return date.getFullYear() + '-' + monthStr + '-' + dayStr;
  // }

  //获取当前月份最后
  // const getCurrentMonthLastDay = () => {
  //   var monthStr = '';
  //   var dayStr = '';
  //   var date = new Date();
  //   var currentMonth = date.getMonth();
  //   var nextMonth = ++currentMonth;
  //   var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  //   var oneDay = 1000 * 60 * 60 * 24;
  //   var lastTime = new Date(nextMonthFirstDay - oneDay);
  //   var month = lastTime.getMonth() + 1;
  //   var day = lastTime.getDate();
  //   var dayStr = '' + day;
  //   if (month < 10) {
  //     monthStr = '0' + month;
  //   }
  //   if (day < 10) {
  //     dayStr = '0' + day;
  //   }
  //   return date.getFullYear() + '-' + monthStr + '-' + dayStr;
  // };


  return (
    <Drawer
      title={title}
      placement="right"
      width={900}
      onClose={closeDrawer}
      visible={addDrawerVisible}
      style={{ height: 'calc(100vh-50px)' }}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -50px)' }}
    >
      <Form layout='vertical' hideRequiredMark >
        <Spin tip="数据加载中..." spinning={loading}>
          <Row gutter={24}>
            <Col lg={6}>
              <Form.Item label="应付起始日" required>
                {getFieldDecorator('payBeginDate', {
                  initialValue: infoDetail.payBeginDate != null
                    ? moment(new Date(infoDetail.payBeginDate))
                    : moment(new Date()),
                  rules: [{ required: true, message: '请选择应付起始日' }],
                })(
                  <DatePicker />
                )}
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item label="应付截止日" required>
                {getFieldDecorator('payEndDate', {
                  initialValue: infoDetail.payEndDate != null
                    ? moment(new Date(infoDetail.payEndDate))
                    : moment(new Date()).add(1, 'month').add(-1, 'days'),
                  rules: [{ required: true, message: '请选择应付截止日' }],
                })(
                  <DatePicker />
                )}
              </Form.Item>
            </Col>

            <Col lg={6}>
              <Form.Item label="计费起始日" required >
                {getFieldDecorator('beginDate', {
                  initialValue: infoDetail.beginDate != null
                    ? moment(new Date(infoDetail.beginDate))
                    : moment(new Date()),
                  rules: [{ required: true, message: '请选择计费起始日' }],
                })(
                  <DatePicker />
                )}
              </Form.Item>
            </Col>  <Col lg={6}>
              <Form.Item label="计费截止日" required >
                {getFieldDecorator('endDate', {
                  initialValue: infoDetail.endDate != null
                    ? moment(new Date(infoDetail.endDate))
                    : moment(new Date()).add(1, 'month').add(-1, 'days'),
                  rules: [{ required: true, message: '请选择计费截止日' }],
                })(
                  <DatePicker />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8} style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh - 240px)' }}
            >
              {/* <AsynSelectTree
                parentid={'0'}
                getCheckedKeys={getCheckedKeys}
                selectTree={(id, item) => {
                  //selectRoomTree(id, item);
                }}
              /> */}

              <SelectTree
                checkable={true}
                treeData={treeData}
                getCheckedKeys={(keys) => {
                  setUnits(keys);
                }}
                selectTree={(id, type, info?) => {
                }}
              />

            </Col>
            <Col span={8} style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh - 240px)' }}>
              <LeftTree
                treeData={checkTreeData}
                selectTree={(id, item) => {
                  selectCheckTree(id, item);
                }}
              />
            </Col>
            <Col span={8} style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh - 240px)' }}>
              <LeftTree
                treeData={billTreeData}
                selectTree={(id, item) => {
                  selectBillTree(id, item);
                }}
              />
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
            onClick={closeDrawer}
          >
            取消
        </Button>
          <Button type="primary"
            onClick={onSave}
          >
            提交
        </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default Form.create<AddDrawerProps>()(AddDrawer);

