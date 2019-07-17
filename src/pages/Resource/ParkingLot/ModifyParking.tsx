import { ParkingData, TreeEntity } from '@/model/models';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Tree,
  TreeSelect,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { SaveForm, getEstateTreeData } from './ParkingLot.service';
import styles from './style.less';

const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = Tree;

interface ModifyParkingProps {
  modifyVisible: boolean;
  data?: ParkingData;
  closeDrawer(): void;
  form: WrappedFormUtils;
  organizeId: string;
  treeData: TreeEntity[];
  reload(): void;
}
const ModifyParking = (props: ModifyParkingProps) => {
  const { treeData, modifyVisible, data, closeDrawer, form, organizeId, reload } = props;
  const { getFieldDecorator } = form;
  const title = data && data.baseInfo && data.baseInfo.id === undefined ? '添加车库' : '修改车库';
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [estateTree, setEstateTree] = useState<any[]>([]);

  // 打开抽屉时初始化
  useEffect(() => {}, []);

  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {
      if (data) {
        setInfoDetail({ ...data.baseInfo, ...data.parkingDetail });
        getEstateTreeData(organizeId, '8').then(res => {
          let treeList = res || [];
          setEstateTree(treeList);
        });
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  }, [modifyVisible]);

  const close = () => {
    closeDrawer();
  };
  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        let newData = data ? { ...data, ...values } : values;
        doSave(newData);
      }
    });
  };
  const doSave = dataDetail => {
    dataDetail.keyValue = dataDetail.pCode;
    SaveForm({ ...dataDetail, type: 5 }).then(res => {
      message.success('保存成功');
      closeDrawer();
      reload();
    });
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={600}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Card title="基本信息" className={styles.card} bordered={false}>
        {modifyVisible ? (
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="车位名称" required>
                  {getFieldDecorator('name', {
                    initialValue: infoDetail.name,
                    rules: [{ required: true, message: '请输入车位名称' }],
                  })(<Input placeholder="请输入车位名称" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="车位编号" required>
                  {getFieldDecorator('code', {
                    initialValue: infoDetail.code,
                    rules: [{ required: true, message: '请输入车位编号' }],
                  })(<Input placeholder="请输入车位编号" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="所属上级" required>
                  {getFieldDecorator('parentId', {
                    rules: [{ required: true, message: '请选择所属小区' }],
                    initialValue: infoDetail.parentId,
                  })(
                    <TreeSelect placeholder="请选择所属上级" allowClear treeDefaultExpandAll>
                      {estateTree.map(item => {
                        return <TreeNode title={item.text} key={item.id} value={item.id} />;
                      })}
                    </TreeSelect>,
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="车位状态">
                  {getFieldDecorator('activeMark', {
                    initialValue: infoDetail.activeMark,
                  })(
                    <Select>
                      <Option value="0">空置</Option>
                      <Option value="0">空置</Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col lg={12}>
                <Form.Item label="车库全称">
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo,
                  })(<Input disabled placeholder="请输入车库全称" />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="建筑面积(㎡)">
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo,
                  })(<Input placeholder="请输入建筑面积(㎡)" />)}
                </Form.Item>
              </Col>

              <Col lg={12}>
                <Form.Item label="占地面积(㎡)">
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo,
                  })(<Input disabled placeholder="请输入占地面积(㎡)" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={24}>
                <Form.Item label="附加说明">
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo,
                  })(<TextArea rows={4} placeholder="请输入附加说明" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : null}
      </Card>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={close} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={save} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<ModifyParkingProps>()(ModifyParking);

const renderTree = (treeData: TreeEntity[], parentId: string) => {
  return treeData
    .filter(item => item.parentId === parentId)
    .map(filteditem => {
      return (
        <TreeNode title={filteditem.text} key={filteditem.id} value={filteditem.id}>
          {renderTree(treeData, filteditem.id as string)}
        </TreeNode>
      );
    });
};
