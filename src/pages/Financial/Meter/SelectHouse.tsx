//费表装表选择房间，修改为同步树
import { Col, Form, Row, Modal, message } from 'antd';
// import { TreeEntity } from '@/model/models';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { UnitMeterSaveForm } from './Meter.service';
// import './style.less';
import SelectTree from '../SelectTree';
// const Option = Select.Option;
interface SelectHouseProps {
  visible: boolean;
  closeModal(): void;
  //getSelectTree(id):void;
  form: WrappedFormUtils;
  feeDetail: any;
  treeData: any[];
  reload(): void;
}

const SelectHouse = (props: SelectHouseProps) => {
  const { reload, visible, closeModal, feeDetail, treeData } = props;
  useEffect(() => {
    if (visible) {
    }
  }, [visible]);

  const [unitData, setUnitData] = useState<any[]>([]);

  return (
    <Modal
      title="选择房屋"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        if (unitData.length == 0) {
          message.warning('请选择房间');
        } else {
          var newdata = Object.assign({}, feeDetail, { units: JSON.stringify(unitData) });
          UnitMeterSaveForm(newdata).then(res => {
            closeModal();
            message.success('添加成功！');
            reload();
          })
          //.catch(() => {
          //message.warning('数据保存错误');
          //});
        }
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='400px'
    >
      {/* <Row gutter={8}>
        <Col span={18}>
          <Input placeholder="请输入要查询的关键字" />
        </Col>
        <Col span={6}>
          <Button style={{ width: '100%' }}>
            <Icon type="search" />查询</Button>
        </Col>
      </Row> */}
      {/* <Row style={{ height: '400px', overflow: 'auto', marginTop: '5px', backgroundColor: 'rgb(255,255,255)' }}> */}

      <Row>
        <Col style={{ height: '420px', overflow: 'auto' }}>
          {/* <AsynSelectTree
            parentid={'0'}
            getCheckedKeys={(keys)=>{
              setUnitData(keys);
            }} 
            selectTree={(id, type, info?) => {
            }}
          /> */}

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
      </Row>
    </Modal>
  );
};

export default Form.create<SelectHouseProps>()(SelectHouse);

