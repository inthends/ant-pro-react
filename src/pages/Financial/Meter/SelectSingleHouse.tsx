//添加编辑费项
import { Col, Form, Row, Modal, } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useState } from 'react';
// import './style.less';
// import AsynLeftTree from '../AsynLeftTree';

import SelectTree from '../SelectTree';

interface SelectSingleHouseProps {
  visible: boolean;
  closeModal(): void;
  getSelectTree(id, allname): void;
  form: WrappedFormUtils;
  treeData: any[];
};

const SelectSingleHouse = (props: SelectSingleHouseProps) => {
  const { visible, closeModal, getSelectTree, treeData } = props;
  // useEffect(() => {
  //   if(visible){ 
  //   }
  // }, [visible]);
  const [unitId, setUnitId] = useState<string>();
  const [allname, setAllname] = useState<string>();

  return (
    <Modal
      title="选择房屋"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        getSelectTree(unitId, allname);
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
      {/* <Row style={{ height: '400px', overflow: 'auto', marginTop: '5px', backgroundColor: 'rgb(255,255,255)' }}>
        <Col span={24}> */}

      <Row>
        <Col style={{ height: '420px', overflow: 'auto' }}>

          {/* <AsynLeftTree
            parentid={'0'}
            selectTree={(id, type,info?) => {
              setTreeNodeInfo(info);
            }}
          /> */}

          <SelectTree
            treeData={treeData}
            checkable={false}
            getCheckedKeys={(keys) => {
              // setUnitData(keys);
            }}
            selectTree={(id, type, allname) => { 
              setUnitId(id);
              setAllname(allname);
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};
export default Form.create<SelectSingleHouseProps>()(SelectSingleHouse);

