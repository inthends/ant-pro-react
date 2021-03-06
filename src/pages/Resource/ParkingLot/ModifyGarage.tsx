
import { Select, Button, Card, Col, Drawer, Form, Input, message, Row, TreeSelect, InputNumber } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { SaveGarageForm, GetAreasByOrganizeId } from './ParkingLot.service';
import styles from './style.less';
const { Option } = Select;
const { TextArea } = Input;
// const { TreeNode } = Tree;

interface ModifyGarageProps {
  modifyVisible: boolean;
  data?: any;
  form: WrappedFormUtils;
  organizeId: string;
  treeData: any[];
  closeDrawer(): void;
  reload(): void;
}

const ModifyGarage = (props: ModifyGarageProps) => {
  const { modifyVisible, data, closeDrawer, form, reload, treeData } = props;
  const { getFieldDecorator } = form;
  const title = data === undefined ? '添加车库' : '修改车库';
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [orgTree, setOrgTree] = useState<any[]>([]);
  // const [estateTree, setEstateTree] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]); //小区

  // 打开抽屉时初始化
  // useEffect(() => {
  //   GetQuickParkingTree('8').then(res => {
  //     setOrgTree(res || []);
  //   });
  // }, []);

  // useEffect(() => {
  //   if (form.getFieldValue('organizeId') === undefined) {
  //     return;
  //   }
  // getEstateTreeData(form.getFieldValue('organizeId'), '1').then(res => {
  //   const treeList = res || [];
  //   if (!treeList.map(item => item.id).includes(form.getFieldValue('parentId'))) {
  //     form.setFieldsValue({ parentId: undefined });
  //   } 
  //   setEstateTree(treeList);
  // });
  // }, [form.getFieldValue('organizeId')]);

  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {
      if (data) {
        // setInfoDetail(data.baseInfo);
        //加载小区
        GetAreasByOrganizeId(data.organizeId).then(res => {
          setAreas(res || []); 
          setInfoDetail(data);
        })
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
        // const newData = data!.baseInfo ? { ...data!.baseInfo, ...values } : values;
        const newData = data ? { ...data, ...values } : values;
        doSave(newData);
      }
    });
  };
  const doSave = dataDetail => {
    dataDetail.keyvalue = dataDetail.id;
    SaveGarageForm({ ...dataDetail, type: 8 }).then(res => {
      message.success('保存成功');
      closeDrawer();
      reload();
    });
  };

  //管理处选择
  const onOrgSelect = (value) => {
    GetAreasByOrganizeId(value).then(res => {
      setAreas(res || []);
    })
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
      <Card className={styles.card}  hoverable>
        {modifyVisible ? (
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="隶属机构" required>
                  {getFieldDecorator('organizeId', {
                    initialValue: infoDetail.organizeId,
                    rules: [{ required: true, message: '请选择隶属机构' }],
                  })(
                    <TreeSelect placeholder="请选择隶属机构"
                      allowClear
                      treeData={treeData}
                      treeDefaultExpandAll
                      dropdownStyle={{ maxHeight: 300 }}
                      onSelect={onOrgSelect}
                    >
                      {/* {renderTree(orgTree, '0')} */}
                    </TreeSelect>,
                  )}
                </Form.Item>
              </Col>

              <Col lg={12}>
                <Form.Item label="所属小区">
                  {getFieldDecorator('parentId', {
                    initialValue: infoDetail.parentId,
                    rules: [{ required: true, message: '请选择所属小区' }]
                  })(
                    <Select placeholder="请选择所属小区">
                      {areas.map(item => (
                        <Option value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>

              {/* <Col lg={12}>
                <Form.Item label="所属小区">
                  {getFieldDecorator('parentId', {
                    rules: [{ required: true, message: '请选择所属小区' }],
                    initialValue: infoDetail.parentId,
                  })(
                    <TreeSelect placeholder="请选择隶属机构" allowClear treeDefaultExpandAll>
                      {renderTree(estateTree, '0')}
                    </TreeSelect>,
                  )}
                </Form.Item>
              </Col> */}

            </Row>
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
                <Form.Item label="车库编号" required>
                  {getFieldDecorator('code', {
                    initialValue: infoDetail.code,
                    rules: [{ required: true, message: '请输入车库编号' }],
                  })(<Input placeholder="请输入车库编号" />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('phoneNum', {
                    initialValue: infoDetail.phoneNum,
                  })(<Input placeholder="请输入联系电话" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="车库全称">
                  {getFieldDecorator('allName', {
                    initialValue: infoDetail.allName,
                  })(<Input disabled placeholder="车库全称" />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="建筑面积(㎡)">
                  {getFieldDecorator('area', {
                    initialValue: infoDetail.area || 0,
                  })(<InputNumber placeholder="请输入建筑面积(㎡)" style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>

              <Col lg={12}>
                <Form.Item label="占地面积(㎡)">
                  {getFieldDecorator('coverArea', {
                    initialValue: infoDetail.coverArea || 0,
                  })(<InputNumber placeholder="请输入占地面积(㎡)" style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={24}>
                <Form.Item label="附加说明">
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo,
                  })(<TextArea rows={5} placeholder="请输入附加说明" />)}
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

export default Form.create<ModifyGarageProps>()(ModifyGarage);

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
