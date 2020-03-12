//添加编辑费项
import { DatePicker, Spin, Col, Form, Row, Modal, message, } from 'antd';
import { TreeEntity } from '@/model/models';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { CalcUnitFee, GetReceivablesFeeItemTreeJson } from './Main.service';
import './style.less';
import SelectTree from '../SelectTree';
import LeftTree from '../LeftTree';
import moment from 'moment';

interface SelectHouseProps {
  visible: boolean;
  closeModal(): void;
  getBillID(billid): void;
  //getSelectTree(id):void;
  form: WrappedFormUtils;
  feeDetail: any;
  treeData: any[];
}

const SelectHouse = (props: SelectHouseProps) => {
  const { visible, closeModal, feeDetail, getBillID, treeData, form } = props;
  const { getFieldDecorator } = form;
  const [feeTreeData, setFeeTreeData] = useState<TreeEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (visible) {
      GetReceivablesFeeItemTreeJson().then((res) => {
        // const treeList = (res || []).map(item => {
        //   return {
        //     ...item,
        //     id: item.key,
        //     text: item.text,
        //     parentId: item.parentId,
        //   };
        // });
        setFeeTreeData(res);
      });
    }
  }, [visible]);

  const [unitData, setUnitData] = useState<string[]>([]);
  const [selectedFeeId, setSelectedFeeId] = useState<string>('');
  // const [startDate, setStartDate] = useState<string>(); 
  // const selectStartDate = (date) => {
  //   setStartDate(date);
  // };

  return (
    <Modal
      title="选择房屋和费项"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        form.validateFields((errors, values) => {
          if (!errors) {
            if (unitData.length == 0) {
              message.warning('请选择房间');
            } else {
              if (selectedFeeId == null || selectedFeeId == '') {
                message.warning('请选择费项');
              } else {
                setLoading(true);
                var newdata = Object.assign({}, feeDetail, {
                  units: JSON.stringify(unitData),
                  feeItemId: selectedFeeId,
                  startDate: values.startDate.format('YYYY-MM-DD')
                });
                CalcUnitFee(newdata).then(res => {
                  if (res.data != null) {
                    message.warning(res.data);
                    setLoading(false);
                  } else {
                    message.success('数据保存成功');
                    closeModal();
                    getBillID(feeDetail.keyValue);
                    setLoading(false);
                  }
                }).finally(() => {
                  setLoading(false); 
                })
                // .catch(() => {
                // message.warning('保存失败！');
                // });
              }
            }
          }
        })

      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='650px'
    >
      {/* <Row style={{ height: '600px', overflow: 'hidden', marginTop: '5px', backgroundColor: 'rgb(255,255,255)' }}> */}
      <Spin tip="数据处理中..." spinning={loading}>

        <Form layout='inline' hideRequiredMark >
          <Row gutter={24}>
            <Col span={24} >
              <Form.Item label="计费起始日在此之前" required >
                {getFieldDecorator('startDate', {
                  initialValue: moment(new Date()),
                  rules: [{ required: true, message: '请选择日期' }],
                })(
                  <DatePicker style={{ width: '155px' }}
                  //  onChange={(date, dateString) => selectStartDate(dateString)}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Row gutter={12}>
          <Col span={12} style={{ height: '500px', overflow: 'auto' }}>
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
          <Col span={12} style={{ height: '500px', overflow: 'auto' }}>
            <LeftTree
              treeData={feeTreeData}
              selectTree={(id, item) => {
                setSelectedFeeId(id);
              }}
            />
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};

export default Form.create<SelectHouseProps>()(SelectHouse);

