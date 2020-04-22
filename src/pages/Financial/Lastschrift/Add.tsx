//新增划账单
import { TreeEntity } from '@/model/models';
import {Input, message, notification, Button, Col, DatePicker, Drawer, Form, Row, Spin } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetReceivablesTree, SaveForm, GetFormJson } from './Lastschrift.service';
// import './style.less';
import moment from 'moment';
import SelectTree from '../SelectTree';
import SelectFeeItem from './SelectFeeItem';
// import LeftTree from '../LeftTree';

interface AddProps {
  addDrawerVisible: boolean;
  // data?: any;
  treeData: any[];
  form: WrappedFormUtils;
  id?: string;
  // organizeId?: string;
  reload(): void;
  closeDrawer(): void;
};

const Add = (props: AddProps) => {
  const { treeData, addDrawerVisible, closeDrawer, form, id, reload } = props;
  const title = id === undefined ? '新增划账单' : '修改划账单';
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [payfeeitemid, setPayFeeItemId] = useState<string>('');
  // const [feeitemid, setFeeItemId] = useState<string>('');
  const [units, setUnits] = useState<string[]>([]);
  //const [roomTreeData, setRoomTreeData] = useState<any>();
  // const [checkTreeData, setCheckTreeData] = useState<TreeEntity[]>([]);//付款费项
  const [billTreeData, setBillTreeData] = useState<TreeEntity[]>([]);//收款费项
  const [feeItemIds, setFeeItemIds] = useState<string[]>([]);

  // const [payBeginDate, setPayBeginDate] = useState<string>();
  // const [payEndDate, setPayEndDate] = useState<string>();
  // const [beginDate, setBeginDate] = useState<string>();
  // const [endDate, setEndDate] = useState<string>();

  useEffect(() => {
    // getCheckTreeData().then(res => {
    // }).then(() => {
    //   getBillTreeData();
    // }); 
    // GetPaymentTree().then((res) => {
    //   setCheckTreeData(res || []);
    // });
    GetReceivablesTree().then((res) => {
      setBillTreeData(res || []);
    });
  }, []);

  // 打开抽屉时初始化
  useEffect(() => {
    if (addDrawerVisible) {
      if (id) {
        GetFormJson(id).then(res => {
          setInfoDetail(res);
          setLoading(false);
        })
      } else {
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  }, [addDrawerVisible]);

  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        //验证房屋和费项
        if (units.length == 0) {
          message.warning('请选择房屋！');
          return;
        }

        if (feeItemIds.length == 0) {
          message.warning('请选择费项！');
          return;
        }

        let newData = {
          beginDate: values.beginDate.format('YYYY-MM-DD'),
          endDate: values.endDate.format('YYYY-MM-DD'), 
          feeItemIds: JSON.stringify(feeItemIds),
          units: JSON.stringify(units),
          memo: values.memo
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
                '没有找到要划账的费用！'
            });
          } else {
            message.success('保存成功');
            reload();
            closeDrawer();
          }
        })
      }
    });
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={700}
      onClose={closeDrawer}
      visible={addDrawerVisible}
      style={{ height: 'calc(100vh-50px)' }}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -50px)' }} >
      <Form layout='vertical' hideRequiredMark >
        <Spin tip="数据处理中..." spinning={loading}>
          <Row gutter={24}>
            <Col lg={6}>
              <Form.Item label="账单日起" required >
                {getFieldDecorator('beginDate', {
                  initialValue: infoDetail.beginDate != null
                    ? moment(new Date(infoDetail.beginDate))
                    : moment(new Date()),
                  rules: [{ required: true, message: '请选择账单日起' }],
                })(
                  <DatePicker />
                )}
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item label="账单日止" required >
                {getFieldDecorator('endDate', {
                  initialValue: infoDetail.endDate != null
                    ? moment(new Date(infoDetail.endDate))
                    : moment(new Date()).add(1, 'month').add(-1, 'days'),
                  rules: [{ required: true, message: '请选择账单日止' }],
                })(
                  <DatePicker />
                )}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="备注" required >
                {getFieldDecorator('memo', {
                })(
                  <Input placeholder='请输入备注' ></Input>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12} style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh - 240px)' }} >
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
            <Col span={12} style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh - 240px)' }}>
              <SelectFeeItem
                checkable={true}
                treeData={billTreeData}
                getCheckedKeys={(keys) => {
                  setFeeItemIds(keys);
                }}
                selectTree={(id) => {
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
            onClick={closeDrawer} >
            取消
        </Button>
          <Button type="primary"
            onClick={onSave}>
            提交
        </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default Form.create<AddProps>()(Add);

