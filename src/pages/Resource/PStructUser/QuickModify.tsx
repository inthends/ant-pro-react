// import { TreeEntity } from '@/model/models';
//快速添加修改用户
import {
  Button, Card, Col, Drawer, Form, Input, message, Row, Select, TreeSelect, Checkbox,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { SaveForm } from './PStructUser.service';
import { getCommonItems, GetOrgs } from '@/services/commonItem';
import styles from './style.less';
const { Option } = Select;
const { TextArea } = Input;

interface QuickModifyProps {
  modifyVisible: boolean;
  data?: any;
  form: WrappedFormUtils;
  closeDrawer(): void;
  reload(customerId, type): void;
  organizeId: string;
  type: any;
}

const QuickModify = (props: QuickModifyProps) => {
  const { type, organizeId, modifyVisible, data, closeDrawer, form, reload } = props;
  const { getFieldDecorator } = form;
  const title = data === undefined ? '添加客户' : '修改客户';
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [treeData, setTreeData] = useState<any[]>([]); //所属机构
  const [banks, setBanks] = useState<any[]>([]); // 开户银行
  // const [banks, setBanks] = useState<any[]>([]); // 证件类别
  // const [banks, setBanks] = useState<any[]>([]); // 企业性质
  // 打开抽屉时初始化
  useEffect(() => {
    GetOrgs().then((res: any[]) => {
      setTreeData(res || []);
    });
    // 获取开户银行
    getCommonItems('Bank').then(res => {
      setBanks(res || []);
    });

    // // 获取证件类别
    // getCommonItems('Bank').then(res => {
    //   setBanks(res || []);
    // });

    // // 获取企业性质
    // getCommonItems('Bank').then(res => {
    //   setBanks(res || []);
    // });
  }, []);

  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {
      if (data) {
        setInfoDetail({ ...data });
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
        doSave(newData);
      }
    });
  };

  const doSave = dataDetail => {
    dataDetail.keyValue = dataDetail.id;
    SaveForm({ ...dataDetail }).then(res => {
      message.success('保存成功');
      closeDrawer();
      reload(res, type);//回调
    });
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={700}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Card className={styles.card} >
        {modifyVisible ? (
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="隶属机构" required>
                  {getFieldDecorator('organizeId', {
                    initialValue: infoDetail.organizeId ? infoDetail.organizeId : organizeId,
                    rules: [{ required: true, message: '请选择隶属机构' }],
                  })(
                    <TreeSelect
                      placeholder="请选择隶属机构"
                      treeData={treeData}
                      allowClear
                      treeDefaultExpandAll
                      disabled
                      dropdownStyle={{ maxHeight: 350 }}
                    >
                      {/* {renderTree(treeData)} */}
                    </TreeSelect>,
                  )}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="客户类别" required>
                  {getFieldDecorator('flag', {
                    initialValue: infoDetail.flag ? infoDetail.flag : '1',
                    rules: [{ required: true, message: '请选择客户类别' }],
                  })(
                    <Select>
                      <Option value="1" key="1">
                        个人
                      </Option>
                      <Option value="2" key="2">
                        单位
                      </Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="客户名称" required>
                  {getFieldDecorator('name', {
                    initialValue: infoDetail.name,
                    rules: [{ required: true, message: '请输入客户名称' }],
                  })(<Input placeholder="请输入客户名称" />)}
                </Form.Item>
              </Col>
              {/* <Col lg={12}>
                <Form.Item label="客户编号" required>
                  {getFieldDecorator('code', {
                    initialValue: infoDetail.code,
                    rules: [{ required: true, message: '请输入客户编号' }],
                  })(<Input placeholder="请输入客户编号" />)}
                </Form.Item>
              </Col> */}

              <Col lg={12}>
                <Form.Item label="手机号码" required>
                  {getFieldDecorator('phoneNum', {
                    initialValue: infoDetail.phoneNum,
                    rules: [{ required: true, message: '请输入手机号码' }],
                  })(<Input placeholder="请输入手机号码" />)}
                </Form.Item>
              </Col>
            </Row>

            {/* <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="客户简称">
                  {getFieldDecorator('shortName', {
                    initialValue: infoDetail.shortName,
                  })(<Input placeholder="请输入客户简称" />)}
                </Form.Item>
              </Col>

              <Col lg={12}>
                <Form.Item label="手机号码">
                  {getFieldDecorator('phoneNum', {
                    initialValue: infoDetail.phoneNum,
                  })(<Input placeholder="请输入手机号码" />)}
                </Form.Item>
              </Col> 
            </Row> */}

            {/* {form.getFieldValue('flag') === '1' ? (
              <>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="证件类别">
                      {getFieldDecorator('certificateType', {
                        initialValue: infoDetail.certificateType,
                      })(<Input placeholder="请输入证件类别" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="证件号码">
                      {getFieldDecorator('certificateNO', {
                        initialValue: infoDetail.certificateNO,
                      })(<Input placeholder="请输入证件号码" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="发证机关">
                      {getFieldDecorator('issuingOrgan', {
                        initialValue: infoDetail.issuingOrgan,
                      })(<Input placeholder="请输入发证机关" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="证件地址">
                      {getFieldDecorator('documentAddress', {
                        initialValue: infoDetail.documentAddress,
                      })(<Input placeholder="请输入证件地址" />)}
                    </Form.Item>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="企业性质">
                      {getFieldDecorator('nature', {
                        initialValue: infoDetail.nature,
                      })(<Input placeholder="请输入经营范围" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="注册资本">
                      {getFieldDecorator('capital', {
                        initialValue: infoDetail.capital,
                      })(<Input placeholder="请输入注册资本" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="信用代码">
                      {getFieldDecorator('creditCode', {
                        initialValue: infoDetail.creditCode,
                      })(<Input placeholder="请输入信用代码" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="税务识别号">
                      {getFieldDecorator('taxCode', {
                        initialValue: infoDetail.taxCode,
                      })(<Input placeholder="请输入税务识别号" />)}
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )} */}

            {/* <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('telPhoneNum', {
                    initialValue: infoDetail.telPhoneNum,
                  })(<Input placeholder="请输入联系电话" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="手机号码">
                  {getFieldDecorator('phoneNum', {
                    initialValue: infoDetail.phoneNum,
                  })(<Input placeholder="请输入手机号码" />)}
                </Form.Item>
              </Col>
            </Row> */}
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="传真号码">
                  {getFieldDecorator('fax', {
                    initialValue: infoDetail.fax,
                  })(<Input placeholder="请输入传真号码" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="电子邮箱">
                  {getFieldDecorator('email', {
                    initialValue: infoDetail.email,
                  })(<Input placeholder="请输入电子邮箱" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="开户银行">
                  {getFieldDecorator('accountBank', {
                    initialValue: infoDetail.accountBank,
                  })(
                    <Select placeholder="请选择开户银行">
                      {banks.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="银行账号">
                  {getFieldDecorator('bankAccount', {
                    initialValue: infoDetail.bankAccount,
                  })(<Input placeholder="请输入银行账号" />)}
                </Form.Item>
              </Col>
            </Row>
            {/* <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="经营业态">
                  {getFieldDecorator('businessFormat', {
                    initialValue: infoDetail.businessFormat,
                  })(<Input placeholder="请输入经营业态" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="招牌名称">
                  {getFieldDecorator('signboardName', {
                    initialValue: infoDetail.signboardName,
                  })(<Input placeholder="请输入招牌名称" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="品牌名称">
                  {getFieldDecorator('brandName', {
                    initialValue: infoDetail.brandName,
                  })(<Input placeholder="请输入传真号码" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="品牌级别">
                  {getFieldDecorator('brandLevel', {
                    initialValue: infoDetail.brandLevel,
                  })(<Input placeholder="请输入品牌级别" />)}
                </Form.Item>
              </Col>
            </Row> */}
            <Row gutter={24}>
              <Col lg={24}>
                <Form.Item label="附加说明">
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo,
                  })(<TextArea rows={4} placeholder="请输入附加说明" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Form.Item label="加入黑名单">
                  {getFieldDecorator('isBlackName', {
                    initialValue: infoDetail.isBlackName ? true : false,
                  })(<Checkbox checked={form.getFieldValue('isBlackName')} />)}
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

export default Form.create<QuickModifyProps>()(QuickModify);

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

// const renderTree = data =>
//     data.map(item => {
//       if (item.children) {
//         return ( 
//           <TreeNode {...item} dataRef={item} >
//             {renderTree(item.children)}
//           </TreeNode>
//         );
//       }
//       return <TreeNode {...item} dataRef={item} />;
//     });
