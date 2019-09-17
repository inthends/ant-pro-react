import { Modal, Tree, Input, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { getRoleTree, getUserList, chooseUser } from './Role.service';
import UserLabel from './UserLabel';

const { Search } = Input;
interface ModifyProps {
  visible: boolean;
  data?: any;
  close(): void;
}
const ChooseUser = (props: ModifyProps) => {
  const { visible, data, close } = props;
  const { roleId = '' } = data || {};
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);

  const [searchText, setSearchText] = useState<string>('');
  const [depId, setDepId] = useState<string>('');
  const [userList, setUserList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (visible) {
      getRoleTree().then(res => {
        setTreeData(res);
      });
      searchUser();
    }
  }, [visible]);
  // 此处搜索只能做前端过滤，否则会导致其他部门有权限的员工被清空，除非保存时参数多传部门
  const searchUser = () => {
    getUserList({ roleId, departmentId: '' }).then(res => {
      setUserList(res || []);
    });
  };

  const clickExpend = expandedKeys => {
    setExpandedKeys(expandedKeys);
  };
  const setCheck = (item, list) => {
    item.ischeck = item.ischeck === 1 ? 0 : 1;
    setUserList([...list]);
  };
  const okHandler = (list: any[]) => {
    const userIds = list.filter(item => item.ischeck === 1).map(item => item.id);
    setLoading(true);
    chooseUser({ roleId, userIds })
      .then(close)
      .finally(() => {
        setLoading(false);
      });
  };
  const selectDep = e => {
    if (e && e.length > 0) {
      setDepId(e[0]);
    } else {
      setDepId('');
    }
  };
  return (
    <Modal
      title="选择角色成员"
      maskClosable={false}
      visible={visible}
      onOk={() => okHandler(userList)}
      onCancel={close}
      width={850}
      bodyStyle={{ padding: 0 }}
      confirmLoading={loading}
    >
      <div style={{ height: 500, display: 'flex' }}>
        <div
          style={{
            width: 250,
            padding: 24,
            height: '100%',
            overflow: 'auto',
            borderRight: '1px solid #e8e8e8',
          }}
        >
          <Tree
            showLine
            treeData={treeData}
            expandedKeys={expandedKeys}
            onExpand={clickExpend}
            onSelect={selectDep}
          ></Tree>
        </div>
        <div
          style={{
            padding: 24,
            flex: 1,
          }}
        >
          <div>
            <Search
              className="search-input"
              placeholder="请输入要查询的关键词"
              onSearch={setSearchText}
              style={{ width: 240 }}
            />
          </div>
          <div style={{ paddingTop: 24 }}>
            <Row gutter={16}>
              {userList
                .filter(item => item.departmentId === depId || depId === '')
                .filter(item => item.name.includes(searchText))
                .map(item => {
                  return (
                    <UserLabel {...item} key={item.Id} onClick={() => setCheck(item, userList)} />
                  );
                })}
            </Row>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChooseUser;
