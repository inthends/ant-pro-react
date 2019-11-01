//权责摊销
import { Col, Form, Row, Modal, message, } from 'antd';
import { TreeEntity } from '@/model/models';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { SaveDivide, GetReceivablesFeeItemTreeJson } from './BillingMain.service';
import './style.less';
import SelectTree from '../SelectTree';
import LeftTree from '../LeftTree';

interface DivideProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  treeData: any[];
}

const Divide = (props: DivideProps) => {
  const { visible, closeModal, treeData } = props;
  const [feeTreeData, setFeeTreeData] = useState<TreeEntity[]>([]);
  useEffect(() => {
    if (visible) {
      GetReceivablesFeeItemTreeJson().then((res) => {
        setFeeTreeData(res);
      });
    }
  }, [visible]);

  const [unitData, setUnitData] = useState<string[]>([]);
  const [selectedFeeId, setSelectedFeeId] = useState<string>('');

  return (
    <Modal
      title="权责摊销"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        if (unitData.length == 0) {
          message.warning('请选择房间');
        } else {
          if (selectedFeeId == null || selectedFeeId == '') {
            message.warning('请选择费项');
          } else {
            var newdata = Object.assign({}, { units: JSON.stringify(unitData), feeitemid: selectedFeeId });
            SaveDivide(newdata).then(res => {
              closeModal();
              message.success('数据保存成功');
            }).catch(() => {
              message.warning('数据保存错误');
            });
          }
        }
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='600px'
    >
      <Row gutter={12} >
        <Col span={12} style={{ height: '600px', overflow: 'auto' }}>
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
        <Col span={12} style={{ height: '600px', overflow: 'auto' }}>
          <LeftTree
            treeData={feeTreeData}
            selectTree={(id, item) => {
              setSelectedFeeId(id);
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default Form.create<DivideProps>()(Divide);

