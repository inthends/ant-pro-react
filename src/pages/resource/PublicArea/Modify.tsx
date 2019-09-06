// import { TreeEntity } from '@/model/models';
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
  TreeSelect,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { SaveForm } from './PublicArea.service';
import styles from './style.less';
const { TextArea } = Input;
// const { TreeNode } = Tree;

interface ModifyProps {
  modifyVisible: boolean;
  data?: any;
  form: WrappedFormUtils;
  organizeId: string;
  treeData: any[];
  closeDrawer(): void;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { modifyVisible, data, closeDrawer, form, reload, treeData } = props;
  const { getFieldDecorator } = form;
  const title = data === undefined ? '添加公共区域' : '修改公共区域';
  const [infoDetail, setInfoDetail] = useState<any>({});

  // 打开抽屉时初始化
  useEffect(() => {
  }, []);

  // 打开抽屉时初始化
  // useEffect(() => {
  //   if (modifyVisible) {
  //     if (data) {
  //       setInfoDetail(data);
  //       form.resetFields();
  //     } else {
  //       const type = treeData.filter(item => item.id === organizeId)[0].type;
  //       if (type === '4') {
  //         form.setFieldsValue({ parentId: organizeId });
  //       }
  //     }
  //   } else {
  //     form.resetFields();
  //   }
  // }, [modifyVisible]);


  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {
      if (data) {
        setInfoDetail(data);
        form.resetFields();
      } else {
        setInfoDetail({});
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
        const newData = data ? { ...data, ...values } : values;
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
    dataDetail.keyValue = dataDetail.id;
    SaveForm({ ...dataDetail, type: 5 }).then(res => {
      message.success('保存成功');
      closeDrawer();
      reload();
    });
  };
  const selectOrg = orgId => {
    //const type = treeData.filter(item => item.id === orgId)[0].type;
    // if (type !== '4') {
    //   Modal.warn({
    //     title: '警告',
    //     content: '只能选到楼层不可以选择其他层次！',
    //   });
    // }
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
      <Card className={styles.card}  >
        {modifyVisible ? (
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="名称" required>
                  {getFieldDecorator('name', {
                    initialValue: infoDetail.name,
                    rules: [{ required: true, message: '请输入名称' }],
                  })(<Input placeholder="请输入名称" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="编码" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={24}>
                <Form.Item label="所在位置" required>
                  {getFieldDecorator('parentId', {
                    initialValue: infoDetail.parentId,
                    rules: [{ required: true, message: '请选择所在位置' }],
                  })(
                    <TreeSelect
                      placeholder="请选择所在位置"
                      dropdownStyle={{ maxHeight: 350 }}
                      treeData={treeData}
                      onSelect={selectOrg}
                      treeDataSimpleMode={true}>
                    </TreeSelect>,
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col lg={24}>
                <Form.Item label="位置描述">
                  {getFieldDecorator('otherCode', {
                    initialValue: infoDetail.otherCode,
                  })(<Input placeholder="请输入位置描述" />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col lg={24}>
                <Form.Item label="备注">
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo,
                  })(<TextArea rows={4} placeholder="请输入附加说明" />)}
                </Form.Item>
              </Col>
            </Row>
            {data ? (
              <Row gutter={24}>
                <Col lg={24}>
                  {getFieldDecorator('auditMark', {
                    initialValue: infoDetail.auditMark === 1,
                  })(
                    <Checkbox
                      disabled={infoDetail.auditMark === 1}
                      checked={form.getFieldValue('auditMark')}
                    >
                      是否审核
                    </Checkbox>,
                  )}
                </Col>
              </Row>
            ) : null}
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

// const renderTree = (treeData: TreeEntity[], parentId: string) => {
//   return treeData
//     .filter(item => item.parentId === parentId)
//     .map(filteditem => {
//       return (
//         <TreeNode title={filteditem.text} key={filteditem.id} value={filteditem.id}>
//           {renderTree(treeData, filteditem.id as string)}
//         </TreeNode>
//       );
//     });
// };
