import React, { useEffect, useState } from 'react';
import { Modal, Tree, Tabs } from 'antd';
import { TreeNode } from 'antd/lib/tree-select';

import { GetAuths, GetButtonAuths, GetDataAuths } from './Role.service';
const { TabPane } = Tabs;

interface RoleAuthProps {
  visible: boolean;
  roleId?;
  closeModal(): void;
}
const RoleAuth = (props: RoleAuthProps) => {
  const { visible, closeModal, roleId } = props;

  useEffect(() => {
    if (visible) {
      setActiveKey('1');
    }
  }, [visible]);

  const [auths, setAuths] = useState<TreeNode[]>([]);
  const [activeKey, setActiveKey] = useState<string>(ACTIVEKEYS.功能权限);

  const save = () => {};
  const changeTab = (e: string) => {
    setActiveKey(e);
    if (e === ACTIVEKEYS.功能权限) {
      GetAuths(roleId).then(res => {});
    } else if (e === ACTIVEKEYS.操作权限) {
      GetButtonAuths(roleId).then(res => {});
    } else if (e === ACTIVEKEYS.数据权限) {
      GetDataAuths(roleId).then(res => {});
    }
  };

  return (
    <Modal
      title={
        <Tabs size="small" style={{ height: 30 }} activeKey={activeKey} onChange={changeTab}>
          <TabPane tab="功能权限" key={ACTIVEKEYS.功能权限}></TabPane>
          <TabPane tab="操作权限" key={ACTIVEKEYS.操作权限}></TabPane>
          <TabPane tab="数据权限" key={ACTIVEKEYS.数据权限}></TabPane>
        </Tabs>
      }
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => save()}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width="500px"
    >
      {visible ? <div style={{ height: 400, padding: 24 }}>111</div> : null}
    </Modal>
  );
};

export default RoleAuth;
enum ACTIVEKEYS {
  功能权限 = '1',
  操作权限 = '2',
  数据权限 = '3',
}
