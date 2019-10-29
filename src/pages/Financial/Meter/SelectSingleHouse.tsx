//添加编辑费项
import {
  Button,
  Col,
  Form,Input,
  Row,Icon,Modal,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import './style.less';
import AsynLeftTree from '../AsynLeftTree';

interface SelectSingleHouseProps {
  visible: boolean;
  closeModal(): void;
  getSelectTree(id):void;
  form: WrappedFormUtils;
}

const SelectSingleHouse = (props: SelectSingleHouseProps) => {
  const { visible, closeModal,getSelectTree} = props;
  // useEffect(() => {
  //   if(visible){ 
  //   }
  // }, [visible]);

  const [treeNodeInfo,setTreeNodeInfo]=useState<string[]>([]);

  return (
    <Modal
      title="选择收费项目"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        getSelectTree(treeNodeInfo);
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='400px'
    >
      <Row gutter={8}>
        <Col span={18}>
          <Input placeholder="请输入要查询的关键字"/>
        </Col>
        <Col span={6}>
          <Button style={{width:'100%'}}>
          <Icon type="search" />查询</Button>
        </Col>
      </Row>
      <Row style={{height:'400px',overflow:'auto' ,marginTop:'5px',backgroundColor:'rgb(255,255,255)'}}>
        <Col span={24}>
          <AsynLeftTree
            parentid={'0'}
            selectTree={(id, type,info?) => {
              setTreeNodeInfo(info);
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default Form.create<SelectSingleHouseProps>()(SelectSingleHouse);

