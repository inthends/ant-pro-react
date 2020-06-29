//选择优惠政策机构，废弃
import { Input, DatePicker, Select, Card, Spin, Col, Form, Row, Modal, message, Tree } from 'antd';
import Page from '@/components/Common/Page';
// import { TreeEntity } from '@/model/models';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { RebateSaveForm, GetRebateOrgId } from './Main.service';
import { GetOrgBuildingTree } from '../../Resource/House/House.service';

const Option = Select.Option;
const { TextArea } = Input;
// import './style.less';
// import LeftSelectTree from '../LeftSelectTree';
interface AddRebateOrganizeProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  feeId?: string;
  reload(): void;
};

const AddRebateOrganize = (props: AddRebateOrganizeProps) => {
  const { form, visible, closeModal, feeId, reload } = props;
  const { getFieldDecorator } = form;
  const [orgTreeData, setOrgTreeData] = useState<any[]>([]);
  const [orgData, setOrgData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (visible) {
      setLoading(true);
      GetOrgBuildingTree().then(res => {
        //var newTreeNode = resetTreeNode(res[0]);
        setOrgTreeData(res);
      });

      if (feeId != null) {
        GetRebateOrgId(feeId).then(res => {
          let orgs: any[] = [];
          res.map(org => {
            orgs.push(org.pStructId);
          })
          setOrgData(orgs);
        });
      }
      setLoading(false);
    }
  }, [visible]);

  //const [expanded, setExpanded] = useState<string[]>([]); 
  // const resetTreeNode = (treeNode) => {
  //   var newNode = Object.assign({}, treeNode, { checkable: true });
  //   let newSubNodes: any[] = [];
  //   if (newNode.children != null && newNode.children.length > 0) {
  //     newNode.children.map(node => {
  //       var newSubNode = resetTreeNode(node);
  //       newSubNodes.push(newSubNode);
  //     });
  //   }
  //   newNode = Object.assign({}, newNode, { children: newSubNodes });
  //   return newNode;
  // };

  const onCheck = checkedKeys => {
    setOrgData(checkedKeys);
  };

  const Save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        if (orgData.length == 0) {
          message.warning('请选择机构！');
        } else {
          values.beginDate = values.beginDate.format('YYYY-MM-DD');
          values.endDate = values.endDate.format('YYYY-MM-DD');
          values.feeItemId = feeId;
          RebateSaveForm({ ...values, JsonFeeIdArray: JSON.stringify(orgData) }).then(res => {
            closeModal();
            message.success('保存成功');
            reload();
          }).catch(() => {
            message.warning('保存失败');
          });
        }
      }
    })
  };

  //选择优惠政策
  const change = (value, option) => {  
    form.setFieldsValue({ rebateName: option.props.children });
  };

  return (
    <Modal
      title="添加优惠政策"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={closeModal}
      onOk={Save}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='700px'>
      <Spin tip="数据处理中..." spinning={loading}>
        <Row gutter={8}>
          <Col span={10} style={{ height: '479px', overflow: 'auto' }}>
            <Page style={{
              padding: '6px',
              borderLeft: 'none',
              borderBottom: 'none',
              height: '100%',
              overflowY: 'auto'
            }}>
              <Tree
                defaultExpandAll={true}
                checkable={true}
                checkedKeys={orgData}
                onCheck={onCheck}
                showLine
                // onCheck={(keys) => {
                //   setOrgData(keys);
                // }}
                // expandedKeys={expanded} 
                // onExpand={(expandedKeys, { expanded, node }) => {
                //   const selectNode = node.props.eventKey;
                //   if (expanded) {
                //     setExpanded(expend => [...expend, selectNode]);
                //   } else {
                //     setExpanded(expend => expend.filter(item => item !== selectNode));
                //   }
                // }}
                treeData={orgTreeData}>
              </Tree>
            </Page>
          </Col>
          <Col span={14}>
            <Card  hoverable>
              <Form layout="vertical" hideRequiredMark>
                <Form.Item label="优惠政策" required>
                  {getFieldDecorator('rebateCode', {
                    rules: [{ required: true, message: '请选择优惠政策' }]
                  })(
                    <Select placeholder="==请选择优惠政策=="
                      onChange={change}
                    >
                      <Option value={1}>预缴一年赠送一个月</Option>
                      <Option value={2}>预缴一年减免一个月</Option>
                    </Select>
                  )}
                  {getFieldDecorator('rebateName', {
                  })(
                    <input type='hidden' />
                  )}
                </Form.Item>

                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item label="起始日期" required>
                      {getFieldDecorator('beginDate', {
                        rules: [{ required: true, message: '请选择起始日期' }]
                      })(
                        <DatePicker placeholder="请选择起始日期" style={{ width: '100%' }} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    < Form.Item label="结束日期" required >
                      {getFieldDecorator('endDate', {
                        rules: [{ required: true, message: '请选择结束日期' }]
                      })(
                        <DatePicker placeholder="请选择结束日期" style={{ width: '100%' }} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="附加说明">
                  {getFieldDecorator('memo', { 
                  })(
                    <TextArea rows={8} placeholder="请输入附加说明" />
                  )}
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    </Modal >
  );
};
export default Form.create<AddRebateOrganizeProps>()(AddRebateOrganize);

