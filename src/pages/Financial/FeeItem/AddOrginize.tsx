//选择所属机构
import { Col, Form, Row, Modal, message, Tree } from 'antd';
import Page from '@/components/Common/Page';
// import { TreeEntity } from '@/model/models';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { OrganizeSaveForm, GetOrgAndBulidingTree, GetOrganizeForm } from './Main.service';
// import './style.less';
// import LeftSelectTree from '../LeftSelectTree';
interface AddOrginizeProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  feeId?: string;
  reload(): void;
};

const AddOrginize = (props: AddOrginizeProps) => {
  const { visible, closeModal, feeId, reload } = props;
  const [orgTreeData, setOrgTreeData] = useState<any[]>([]);
  const [orgData, setOrgData] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      GetOrgAndBulidingTree().then(res => {
        //var newTreeNode = resetTreeNode(res[0]);
        setOrgTreeData(res);
      });

      if (feeId != null) {
        GetOrganizeForm(feeId).then(res => {
          let orgs: any[] = [];
          res.map(org => {
            orgs.push(org.pStructId);
          })
          setOrgData(orgs);
        });
      }
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
  }

  return (
    <Modal
      title="添加机构"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        if (orgData.length == 0) {
          message.warning('请选择机构！');
        } else {
          OrganizeSaveForm({ FeeItemID: feeId, JsonFeeIdArray: JSON.stringify(orgData) }).then(res => {
            closeModal();
            message.success('数据保存成功！');
            reload();
          }).catch(() => {
            message.warning('数据保存失败！');
          });
        }
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='400px'>
      <Row>
        <Col style={{ height: '420px', overflow: 'auto' }}> 
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
              // onCheck={(keys) => {
              //   setOrgData(keys);
              // }}
              // expandedKeys={expanded}
              showLine 
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
      </Row>
    </Modal>
  );
};

export default Form.create<AddOrginizeProps>()(AddOrginize);

