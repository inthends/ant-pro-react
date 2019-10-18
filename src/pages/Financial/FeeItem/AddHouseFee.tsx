//选择费项房屋
// import { TreeEntity } from '@/model/models';
import { Checkbox, Col, Form, Row, Modal, message, Card } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { UnitFeeSaveForm } from './Main.service';
import SelectTree from '../SelectTree';
import './style.less';

interface AddHouseFeeProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  feeId?: string;
  reload(): void;
  treeData: any[];
}

const AddHouseFee = (props: AddHouseFeeProps) => {
  const { visible, closeModal, feeId, reload, treeData } = props;
  const [checkedList, setCheckedList] = useState<any[]>([]);
  const [unitData, setUnitData] = useState<string[]>([]);
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
      onCancel={() => closeModal()}
      onOk={() => {
        if (unitData.length == 0) {
          message.warning('请选择房屋');
        } else {
          UnitFeeSaveForm({ FeeItemID: feeId, JsonFeeIdArray: JSON.stringify(unitData) }).then(res => {
            closeModal();
            reload();
            message.success('数据保存成功');
          }).catch(() => {
            message.warning('数据保存错误');
          });
        }
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='600px'
    >
      {/* <Row style={{ height: '400px', overflow: 'hidden', marginTop: '5px', backgroundColor: 'rgb(255,255,255)' }}> */}

      <Row gutter={8}>
        <Col span={12} style={{ height: '420px', overflow: 'auto' }}>
          <SelectTree
            treeData={treeData}
            getCheckedKeys={(keys) => {
              setUnitData(keys);
            }}
            selectTree={(id, type, info?) => {
            }}
          />
        </Col>
        <Col span={12}  >
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
    </Modal>
  );
};

export default Form.create<AddHouseFeeProps>()(AddHouseFee);

