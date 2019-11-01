//选择抄表房屋
import { Col, Form, Row, Modal, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetMeterTreeJson, SaveUnitForm } from './Meter.service';
// import './style.less';
// import AsynSelectTree from '../AsynSelectTree';
import SelectTree from '../SelectTree';

interface SelectReadingMeterHouseProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  readingDetail: any;
  reload(): any;
  id?: string;
  treeData: any[];
};

const SelectReadingMeterHouse = (props: SelectReadingMeterHouseProps) => {
  const { id, treeData, visible, closeModal, readingDetail, reload } = props;
  // const { getFieldDecorator } = form;
  const [feeItemData, setFeeItemData] = useState<any[]>([]);
  useEffect(() => {
    if (visible) {
      GetMeterTreeJson('EnergyMeterType').then(res => {
        setFeeItemData(res);
      });
    }
  }, [visible]);

  const [unitData, setUnitData] = useState<string[]>([]);
  // const [isSelfCheck, setIsSelfCheck] = useState<boolean>(true);
  // const [beginDate, setBeginDate] = useState<string>('');
  // const [endDate, setEndDate] = useState<string>('');
  const [meterId, setMeterId] = useState<string>('');

  return (
    <Modal
      title="选择抄表房屋"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        if (unitData.length == 0) {
          message.warning('请选择房间！');
          return;
        };

        if (meterId == '') {
          message.warning('请选择费表！');
          return;
        };

        // var newdata = Object.assign({}, readingDetail,
        //   { units: JSON.stringify(unitData), meterid: meterid }); 
        // if (isSelfCheck) {
        //   if (beginDate == '' || endDate == '') {
        //     message.warning('请选择开始/结束日期');
        //     return;
        //   }
        //   newdata = Object.assign({}, newdata, { BeginDate: beginDate, EndDate: endDate });
        // }

        // const newData = readingDetail ? { ...readingDetail, ...values } : values;
        readingDetail.keyValue = id;
        readingDetail.units = JSON.stringify(unitData);
        readingDetail.meterId = meterId;
        SaveUnitForm(readingDetail).then(res => {
          message.success('添加成功！');
          closeModal();
          reload();
        }).catch(() => {
          message.warning('添加失败！');
        })

      }}

      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='650px'
    >
      <Row gutter={24}
      // style={{ height: '400px', overflow: 'auto', marginTop: '5px', backgroundColor: 'rgb(255,255,255)' }}
      >
        <Col span={12} style={{ height: '450px', overflow: 'auto' }}>

          {/* <AsynSelectTree
            parentid={'0'}
            getCheckedKeys={(keys) => {
              setUnitData(keys);
            }}
            selectTree={(id, type, info?) => {
            }} */}


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

        <Col span={12} style={{ height: '450px', overflow: 'auto' }}>
          {/* <Card>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item required label="选择费表"> 
                    {getFieldDecorator('meterId', {
                      rules: [{ required: true, message: '请选择费表' }],
                    })(
                      <TreeSelect
                        dropdownStyle={{ maxHeight: 300 }}
                        treeData={feeItemData}
                        treeDefaultExpandAll
                        placeholder="=请选择="
                        // onChange={(value, label, extra) => {
                        //   //设置是否可以自定义日期
                        //   form.setFieldsValue({ isCustomizeDate: extra.triggerNode.props.attributeA });
                        // }
                        // }
                        />
                    )} 
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item label="">
                    {getFieldDecorator('isCustomizeDate', {
                    })(
                      <Checkbox
                        disabled
                      >自定义费项起止日期</Checkbox>
                    )} 
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item required label="计费起始日期">
                    {getFieldDecorator('beginDate', {
                      rules: [{ required: true, message: '请选择计费终止日期' }],
                    })(
                      <DatePicker
                        disabled={form.getFieldValue('isCustomizeDate')}
                        style={{ width: '100%' }}
                        placeholder='请选择计费终止日期'
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item required label="计费终止日期">
                    {getFieldDecorator('endDate', {
                      rules: [{ required: true, message: '请选择计费终止日期' }],
                    })(
                      <DatePicker
                        disabled={form.getFieldValue('isCustomizeDate')}
                        style={{ width: '100%' }}
                        placeholder='请选择计费终止日期' />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card> */}


          <SelectTree
            checkable={false}
            treeData={feeItemData}
            getCheckedKeys={(keys) => {
              // setUnitData(keys);
            }}
            selectTree={(id, type, info?) => {
              setMeterId(id);
            }}
          />


        </Col>
      </Row>
    </Modal>
  );
};
export default Form.create<SelectReadingMeterHouseProps>()(SelectReadingMeterHouse);

