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
import { SaveForm } from './ParkingLot.service';
import styles from './style.less';

const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = Tree;

interface ModifyProps {
  modifyVisible: boolean;
  data?: ParkingData;
  closeDrawer(): void;
  form: WrappedFormUtils;
  organizeId: string;
  treeData: TreeEntity[];
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { treeData, modifyVisible, data, closeDrawer, form, organizeId, reload } = props;
  const { getFieldDecorator } = form;
  const title = data === undefined ? '添加小区' : '修改小区';
  const [infoDetail, setInfoDetail] = useState<any>({});

  // 打开抽屉时初始化
  useEffect(() => {}, []);

  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {
      if (data) {
        setInfoDetail(data);
        form.resetFields();
      } else {
        const type = treeData.filter(item => item.id === organizeId)[0].type;
        if (type === '4') {
          form.setFieldsValue({ parentId: organizeId });
        }
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
        console.log(newData.auditMark);
        if (newData.auditMark) {
          Modal.confirm({
            title: '警告',
            content: '数据审核后将无法进行修改！',
            onOk: () => {
              newData.auditMark = 1;
              doSave(newData);
            },
          });
        } else {
          newData.auditMark = 0;
          doSave(newData);
        }
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
  const selectOrg = orgId => {
    const type = treeData.filter(item => item.id === orgId)[0].type;
    if (type !== '4') {
      Modal.warn({
        title: '警告',
        content: '只能选到楼层不可以选择其他层次！',
      });
    }
    form.setFieldsValue({ parentId: undefined });
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
                <Form.Item label="车库名称" required>
                  {getFieldDecorator('name', {
                    initialValue: infoDetail.name,
                    rules: [{ required: true, message: '请输入车库名称' }],
                  })(<Input placeholder="请输入车库名称" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="隶属机构" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请选择隶属机构' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="车库编号" required>
                  {getFieldDecorator('parentId', {
                    initialValue: infoDetail.parentId,
                    rules: [{ required: true, message: '请输入车库编号' }],
                  })(<Input placeholder="请输入车库编号" />)}
                </Form.Item>
              </Col>>
              <Col lg={12}>
                <Form.Item label="所属小区">
                  {getFieldDecorator('otherCode', {
                    rules: [{ required: true, message: '请选择所属小区' }],
                    initialValue: infoDetail.otherCode,
                  })(<Input placeholder="请输入位置描述" />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo,
                  })(<Input placeholder="请输入联系电话" />)}
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

export default Form.create<ModifyProps>()(Modify);

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
