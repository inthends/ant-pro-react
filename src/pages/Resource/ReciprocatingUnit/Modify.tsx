
import {
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
  TreeSelect
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { SaveForm } from './ReciprocatingUnit.service';
import { getCommonItems } from '@/services/commonItem';
import styles from './style.less';

const { Option } = Select;
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
  const { treeData, modifyVisible, data, closeDrawer, form, reload } = props;
  const { getFieldDecorator } = form;
  const title = data === undefined ? '添加往来单位' : '修改往来单位';
  const [infoDetail, setInfoDetail] = useState<any>({});

  const [venderTypes, setVenderTypes] = useState<any[]>([]); // 所属类别
  const [banks, setBanks] = useState<any[]>([]); // 开户银行
  const [states, setStates] = useState<any[]>([]); // 状态
  const [creditLevels, setCreditLevels] = useState<any[]>([]); // 信誉等级 
  const [natures, setNatures] = useState<any[]>([]);

  // 打开抽屉时初始化
  useEffect(() => {
    // 获取信誉等级
    getCommonItems('CreditLevel').then(res => {
      setCreditLevels(res || []);
    });
    // 获取开户银行
    getCommonItems('Bank').then(res => {
      setBanks(res || []);
    });
    // 获取所属类别
    getCommonItems('VenderType').then(res => {
      setVenderTypes(res || []);
    });
    // 获取状态
    getCommonItems('TypeState').then(res => {
      setStates(res || []);
    });
    // 单位性质
    getCommonItems('Bank').then(res => {
      setNatures(res || []);
    });
  }, []);

  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {
      if (data) {
        // setInfoDetail({ ...data.vendor });
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
        doSave(newData);
      }
    });
  };
  const doSave = dataDetail => {
    dataDetail.keyValue = dataDetail.id;
    SaveForm({ ...dataDetail }).then(res => {
      message.success('保存成功');
      closeDrawer();
      reload();
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
      <Card className={styles.card}>
        {modifyVisible ? (
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="隶属机构" required>
                  {getFieldDecorator('organizeId', {
                    initialValue: infoDetail.organizeId,
                    rules: [{ required: true, message: '请选择隶属机构' }],
                  })(
                    <TreeSelect
                      placeholder="请选择隶属机构"
                      dropdownStyle={{ maxHeight: 350 }}
                      treeData={treeData}
                      allowClear
                      treeDefaultExpandAll>
                      {/* {renderTree(treeData)} */}
                    </TreeSelect>,
                  )}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="所属类别" required>
                  {getFieldDecorator('parentId', {
                    initialValue: infoDetail.parentId,
                    rules: [{ required: true, message: '请选择所属类别' }],
                  })(
                    <Select placeholder="请选择所属类别">
                      {venderTypes.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={8}>
                <Form.Item label="单位名称" required>
                  {getFieldDecorator('fullName', {
                    initialValue: infoDetail.fullName,
                    rules: [{ required: true, message: '请输入单位名称' }],
                  })(<Input placeholder="请输入单位名称" />)}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="编号" required>
                  {getFieldDecorator('enCode', {
                    initialValue: infoDetail.enCode,
                    rules: [{ required: true, message: '请输入编号' }],
                  })(<Input placeholder="请输入编号" />)}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="简称">
                  {getFieldDecorator('shortName', {
                    initialValue: infoDetail.shortName,
                  })(<Input placeholder="请输入简称" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>

              <Col lg={8}>
                <Form.Item label="单位性质">
                  {/* {getFieldDecorator('nature', {
                    initialValue: infoDetail.nature,
                  })(<Input placeholder="请输入单位性质" />)} */}

                  {getFieldDecorator('nature', {
                    initialValue: infoDetail.nature,
                  })(
                    <Select placeholder="请选择开户银行">
                      {natures.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>,
                  )}


                </Form.Item>
              </Col>

              <Col lg={8}>
                <Form.Item label="经营范围">
                  {getFieldDecorator('businessScope', {
                    initialValue: infoDetail.businessScope,
                  })(<Input placeholder="请输入经营范围" />)}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="负责人">
                  {getFieldDecorator('manager', {
                    initialValue: infoDetail.manager,
                  })(<Input placeholder="请输入负责人" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={8}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('innerPhone', {
                    initialValue: infoDetail.innerPhone,
                  })(<Input placeholder="请输入联系电话" />)}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="联系地址">
                  {getFieldDecorator('address', {
                    initialValue: infoDetail.address,
                  })(<Input placeholder="请输入联系地址" />)}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="电子邮箱">
                  {getFieldDecorator('email', {
                    initialValue: infoDetail.email,
                  })(<Input placeholder="请输入电子邮箱" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>

              <Col lg={8}>
                <Form.Item label="邮政编码">
                  {getFieldDecorator('postalcode', {
                    initialValue: infoDetail.postalcode,
                  })(<Input placeholder="请输入邮政编码" />)}
                </Form.Item>
              </Col>

              <Col lg={8}>
                <Form.Item label="税务地址">
                  {getFieldDecorator('taxAddress', {
                    initialValue: infoDetail.taxAddress,
                  })(<Input placeholder="请输入税务地址" />)}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="注册资金">
                  {getFieldDecorator('registeredCapital', {
                    initialValue: infoDetail.registeredCapital,
                  })(<Input placeholder="请输入注册资金" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={8}>
                <Form.Item label="信用代码">
                  {getFieldDecorator('uscCode', {
                    initialValue: infoDetail.uscCode,
                  })(<Input placeholder="请输入信用代码" />)}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="税务识别号">
                  {getFieldDecorator('taxNumber', {
                    initialValue: infoDetail.taxNumber,
                  })(<Input placeholder="请输入税务识别号" />)}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="开户银行">
                  {getFieldDecorator('bank', {
                    initialValue: infoDetail.bank,
                  })(
                    <Select placeholder="请选择开户银行">
                      {banks.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>

              <Col lg={8}>
                <Form.Item label="银行账号">
                  {getFieldDecorator('bankCcount', {
                    initialValue: infoDetail.bankCcount,
                  })(<Input placeholder="请输入银行账号" />)}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="信誉等级">
                  {getFieldDecorator('creditLevel', {
                    initialValue: infoDetail.creditLevel,
                  })(
                    <Select placeholder="请选择信誉等级">
                      {creditLevels.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="状态">
                  {getFieldDecorator('state', {
                    initialValue: infoDetail.state,
                  })(
                    <Select placeholder="请选择状态">
                      {states.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>,
                  )}
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
//   data.map(item => {
//     if (item.children) {
//       return (
//         <TreeNode {...item} dataRef={item} >
//           {renderTree(item.children)}
//         </TreeNode>
//       );
//     }
//     return <TreeNode {...item} dataRef={item} />;
//   });
