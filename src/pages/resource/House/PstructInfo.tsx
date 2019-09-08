//房产信息

import { Select, AutoComplete, Button, Card, Col, Drawer, Form, Input, Row, message, InputNumber } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { SaveForm, GetCustomerList } from './House.service';
import styles from './style.less';

const { TextArea } = Input;
const { Option } = AutoComplete;

interface PstructInfoProps {
  modifyVisible: boolean;
  data?: any;
  form: WrappedFormUtils;
  organizeId: string;
  parentId: string;
  type?: number;
  closeDrawer(): void;
  reload(parentId, type): void;
}

const PstructInfo = (props: PstructInfoProps) => {
  const { organizeId, parentId, type, modifyVisible, closeDrawer, form, data, reload } = props;
  const { getFieldDecorator } = form;
  const title = data === undefined ? '添加' : '修改';
  let formLabel = '楼栋';
  if (data != undefined) {
    if (data.type == 2) {
      formLabel = '楼栋';
    }
    else if (data.type == 4) {
      formLabel = '楼层';
    } else {
      formLabel = '房间';
    }
  }

  const [infoDetail, setInfoDetail] = useState<any>({});
  const [userSource, setUserSource] = useState<any[]>([]);

  // 打开抽屉时初始化
  useEffect(() => {
  }, []);


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
        //const newData = data ? { ...data.vendor, ...values } : values;
        const newData = data ? { ...data, ...values } : values;
        doSave(newData);
      }
    });
  };

  const doSave = dataDetail => {
    dataDetail.keyValue = dataDetail.id;
    dataDetail.organizeId = organizeId;
    dataDetail.parentId = parentId;
    //设置房产类型
    if (type == 1)
      dataDetail.type = 2;
    else if (type == 2)
      dataDetail.type = 4;
    else
      dataDetail.type = 5;
    SaveForm({ ...dataDetail }).then(res => {
      message.success('保存成功');
      closeDrawer();
      reload(parentId, type);
    });
  };

  // const getInfo = orgId => {
  //   if (orgId) {
  //     return GetFormInfoJson(orgId).then(res => {
  //       const { baseInfo, pProperty } = res || ({} as any);
  //       const info: any = {
  //         ...pProperty,
  //         ...baseInfo,
  //       };
  //       info.id = pProperty && pProperty.id;
  //       info.pStructId = baseInfo && baseInfo.id;
  //       info.area = pProperty!.area;
  //       return info;
  //     });
  //   } else {
  //     return Promise.resolve({
  //       parentId: 0,
  //       type: 1,
  //     });
  //   }
  // };

  //用户选择
  const handleSearch = value => {
    if (value == '')
      return;
    GetCustomerList(value).then(res => {
      setUserSource(res || []);
    })
  };

  const userList = userSource.map
    (item => <Option key={item.id} value={item.name}>{item.name}</Option>);

  const onOwnerSelect = (value, option) => {
    form.setFieldsValue({ ownerId: option.key });
  };

  const onTenantSelect = (value, option) => {
    form.setFieldsValue({ tenantId: option.key });
  };

  return (
    <Drawer
      title={title + formLabel}
      placement="right"
      width={650}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Card className={styles.card} >
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
                <Form.Item label="全称"  >
                  {getFieldDecorator('allName', {
                    initialValue: infoDetail.allName,
                  })(<Input readOnly />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="编号" required>
                  {getFieldDecorator('code', {
                    initialValue: infoDetail.code,
                    rules: [{ required: true, message: '请输入编号' }],
                  })(<Input placeholder="请输入编号" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('phoneNum', {
                    initialValue: infoDetail.phoneNum,
                  })(<Input placeholder="请输入联系电话" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="建筑面积(㎡)">
                  {getFieldDecorator('area', {
                    initialValue: infoDetail.area || 0,
                  })(<InputNumber placeholder="请输入建筑面积" style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
              <Col lg={12}>

                {data != undefined && data.type == 5 ? (
                  <Form.Item label="计费面积(㎡)">
                    {getFieldDecorator('billArea', {
                      initialValue: infoDetail.billArea || 0,
                    })(<InputNumber placeholder="请输入计费面积" style={{ width: '100%' }} />)}
                  </Form.Item>) :
                  (<Form.Item label="占地面积(㎡)">
                    {getFieldDecorator('coverArea', {
                      initialValue: infoDetail.coverArea || 0,
                    })(<InputNumber placeholder="请输入占地面积" style={{ width: '100%' }} />)}
                  </Form.Item>)}
              </Col>
            </Row>

            {type == 1 ? (<Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="业态">
                  {getFieldDecorator('buildingFormat', {
                    initialValue: infoDetail.buildingFormat ? '多层' : infoDetail.buildingFormat,
                  })(
                    <Select>
                      <Option value="多层" >多层</Option>
                      <Option value="小高层">小高层</Option>
                      <Option value="高层" >高层</Option>
                      <Option value="超高层" >超高层</Option>
                      <Option value="联排别墅" >联排别墅</Option>
                      <Option value="独栋别墅" >独栋别墅</Option>
                      <Option value="叠加别墅" >叠加别墅</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>) : null}

            {type == 4 ? (
              <Row gutter={24}>
                <Col lg={12}>
                  <Form.Item label="业主">
                    {getFieldDecorator('ownerName', {
                      initialValue: infoDetail.ownerName,
                    })(
                      <AutoComplete
                        dataSource={userList}
                        style={{ width: '100%' }}
                        onSearch={handleSearch}
                        placeholder="请输入业主"
                        onSelect={onOwnerSelect}
                      />
                    )}
                    {getFieldDecorator('ownerId', {
                      initialValue: infoDetail.ownerId,
                    })(
                      <input type='hidden' />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item label="租户">
                    {getFieldDecorator('tenantName', {
                      initialValue: infoDetail.tenantName,
                    })(<AutoComplete
                      dataSource={userList}
                      style={{ width: '100%' }}
                      onSearch={handleSearch}
                      placeholder="请输入租户"
                      onSelect={onTenantSelect}
                    />)}
                    {getFieldDecorator('tenantId', {
                      initialValue: infoDetail.tenantId,
                    })(
                      <input type='hidden' />
                    )}
                  </Form.Item>
                </Col>
              </Row>) : null}

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

export default Form.create<PstructInfoProps>()(PstructInfo);

// const renderTree = (treeData: TreeEntity[], parentId) => {
//   return treeData
//     .filter(item => item.parentId === parentId)
//     .map(filteditem => {
//       return (
//         <TreeNode title={filteditem.title} key={filteditem.key} value={filteditem.value} >
//           {renderTree(treeData, filteditem.key)}
//         </TreeNode>
//       );
//     });
// };