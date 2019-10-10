//添加编辑费项
import { Col, Form, Row, Modal, message, } from 'antd';
import { TreeEntity } from '@/model/models';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { SaveUnitFee, GetReceivablesFeeItemTreeJson } from './BillingMain.service';
import './style.less';
import AsynSelectTree from '../AsynSelectTree';
import LeftTree from '../LeftTree';

interface SelectHouseProps {
  visible: boolean;
  closeModal(): void;
  getBillID(billid): void;
  //getSelectTree(id):void;
  form: WrappedFormUtils;
  feeDetail: any;
}

const SelectHouse = (props: SelectHouseProps) => {
  const { visible, closeModal, feeDetail, getBillID } = props;
  const [feeTreeData, setFeeTreeData] = useState<TreeEntity[]>([]);
  useEffect(() => {
    if (visible) {
      GetReceivablesFeeItemTreeJson().then(res => {
        const treeList = (res || []).map(item => {
          return {
            ...item,
            id: item.key,
            text: item.text,
            parentId: item.parentId,
          };
        });
        setFeeTreeData(treeList);
      });
    }
  }, [visible]);

  const [unitData, setUnitData] = useState<string[]>([]);
  const [selectedFeeId, setSelectedFeeId] = useState<string>('');

  return (
    <Modal
      title="选择需要计费的房屋"
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
            var newdata = Object.assign({}, feeDetail, { units: JSON.stringify(unitData), feeitemid: selectedFeeId });
            SaveUnitFee(newdata).then(res => {
              closeModal();
              message.success('数据保存成功');
              getBillID(feeDetail.keyValue);
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
      <Row style={{ height: '600px', overflow: 'hidden', marginTop: '5px', backgroundColor: 'rgb(255,255,255)' }}>
        <Col span={12} style={{ height: '600px', overflow: 'auto' }}>
          <AsynSelectTree
            parentid='0'
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

export default Form.create<SelectHouseProps>()(SelectHouse);

