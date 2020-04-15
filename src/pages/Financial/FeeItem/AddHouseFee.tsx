//选择费项房屋
// import { TreeEntity } from '@/model/models';
import { Spin, Checkbox, Col, Form, Row, Modal, message, Card } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { UnitFeeSaveForm } from './Main.service';
import SelectTree from '../SelectTree';
// import './style.less';

interface AddHouseFeeProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  feeId?: string;
  reload(): void;
  treeData: any[];
};

const AddHouseFee = (props: AddHouseFeeProps) => {
  const { visible, closeModal, feeId, reload, treeData } = props;
  const [checkedList, setCheckedList] = useState<any[]>([]);
  const [unitData, setUnitData] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // const [houseTreeData,setHouseTreeData]=useState<TreeEntity[]>([]);
  // useEffect(() => {
  //   if(visible){
  // var queryJson={FeeItemID:feeId}
  // GetQuickSimpleTreeAll(JSON.stringify(queryJson)).then((res) => {
  //   setHouseTreeData(res || []);
  // });
  //   }
  // }, [visible]);

  return (
    <Modal
      title="添加费项房产"
      visible={visible}
      okText="确认"
      cancelText="取消"
      confirmLoading={loading}
      closable={!loading}
      onCancel={() => {
        setLoading(false);
        closeModal();
      }}
      onOk={() => {
        if (unitData.length == 0) {
          message.warning('请选择房屋');
        } else {
          setLoading(true);
          UnitFeeSaveForm({ FeeItemID: feeId, JsonFeeIdArray: JSON.stringify(unitData) }).then(res => {
            message.success('添加成功');
            setLoading(false);
            closeModal();
            reload();
          }).catch(() => {
            message.warning('添加失败');
          });
        }
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='600px'
    >
      {/* <Row style={{ height: '400px', overflow: 'hidden', marginTop: '5px', backgroundColor: 'rgb(255,255,255)' }}> */}
      <Spin tip="数据处理中..." spinning={loading}>
        <Row gutter={8}>
          <Col span={16} style={{ height: '420px', overflow: 'auto' }}>
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
          <Col span={8}>
            <Card >
              <Checkbox.Group
                options={["入住", "空置"]}
                value={checkedList}
                onChange={(checkedList) => {
                  setCheckedList(checkedList);
                }}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};
export default Form.create<AddHouseFeeProps>()(AddHouseFee);

