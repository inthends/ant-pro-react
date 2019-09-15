//抄表选择单元
import {
  Col,
  Form,
  Row, Modal, message, TreeSelect, Checkbox, DatePicker
} from 'antd';

import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetDataItemTreeJsonNew, SaveUnitForm } from './Meter.service';
import './style.less';
import AsynSelectTree from '../AsynSelectTree';

interface SelectReadingMeterHouseProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  readingDetail: any;
  reload(): any;
  id?: string;
}

const SelectReadingMeterHouse = (props: SelectReadingMeterHouseProps) => {
  const { visible, closeModal, readingDetail, reload } = props;
  const [feeItemData, setFeeItemData] = useState<any[]>([]);
  useEffect(() => {
    if (visible) {
      GetDataItemTreeJsonNew('EnergyMeterType').then(res => {
        setFeeItemData(res);
      });
    }
  }, [visible]);

  const [unitData, setUnitData] = useState<string[]>([]);
  const [isSelfCheck, setIsSelfCheck] = useState<boolean>(true);
  const [beginDate, setBeginDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [meterid, setMeterId] = useState<string>('');

  return (
    <Modal
      title="选择抄表房屋"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        if (unitData.length == 0) {
          message.warning('请选择房间');
        } else {
          var newdata = Object.assign({}, readingDetail, { units: JSON.stringify(unitData), meterid: meterid });
          if (isSelfCheck) {
            if (beginDate == '' || endDate == '') {
              message.warning('请选择开始/结束日期');
              return;
            }
            newdata = Object.assign({}, newdata, { BeginDate: beginDate, EndDate: endDate });
          }
          //console.log(newdata);
          SaveUnitForm(newdata).then(res => {
            closeModal();
            reload();
            message.success('数据保存成功');
          }).catch(() => {
            message.warning('数据保存错误');
          })
        }
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='650px'
    >
      <Row gutter={24} style={{ height: '400px', overflow: 'auto', marginTop: '5px', backgroundColor: 'rgb(255,255,255)' }}>
        <Col span={12} style={{ height: '395px', overflow: 'auto' }}>
          <AsynSelectTree
            parentid={'0'}
            getCheckedKeys={(keys) => {
              setUnitData(keys);
            }}
            selectTree={(id, type, info?) => {
            }}
          />
        </Col>
        <Col span={12}>

          <Form layout="vertical" hideRequiredMark>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item required label="选择费表">
                  <TreeSelect 
                    dropdownStyle={{ maxHeight: 300 }}
                    treeData={feeItemData}  
                    treeDefaultExpandAll
                    placeholder="=请选择=" 
                    onChange={((value, label, extra) => { 
                      setMeterId(value);
                    })}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item required label="">
                  <Checkbox checked={true} disabled={true} onChange={(e) => {
                    setIsSelfCheck(e.target.checked);
                  }}>自定义费项起止日期</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required label="起始日期">
                  <DatePicker disabled={!isSelfCheck} onChange={(date, dateString) => {
                    setBeginDate(dateString);
                  }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required label="终止日期">
                  <DatePicker   disabled={!isSelfCheck} onChange={(date, dateString) => {
                    setEndDate(dateString);
                  }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default Form.create<SelectReadingMeterHouseProps>()(SelectReadingMeterHouse);

