import { Modal, Tree, Input, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { getRoleTree, getUserList } from './Role.service';
import UserLabel from './UserLabel';

const { Search } = Input;
interface ModifyProps {
  visible: boolean;
  data?: any;
  close(): void;
}
const ChooseUser = (props: ModifyProps) => {
  const { visible, data, close } = props;
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);

  const [searchText, setSearchText] = useState<string>('');
  const [userLIst, setUserLIst] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      getRoleTree().then(res => {
        setTreeData(res);
      });
      searchUser({ departmentId: '' });
    }
  }, [visible]);

  const searchUser = ({ departmentId }) => {
    const { roleId } = data;
    getUserList({ roleId, departmentId }).then(res => {
      setUserLIst(JSON.parse(res) || []);
    });
  };

  const clickExpend = expandedKeys => {
    setExpandedKeys(expandedKeys);
  };
  return (
    <Modal
      title="选择角色成员"
      maskClosable={false}
      visible={visible}
      onOk={close}
      onCancel={close}
      width={800}
      bodyStyle={{ padding: 0 }}
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
            onSelect={e => {
              searchUser({ departmentId: e });
            }}
          ></Tree>
        </div>
        <div
          style={{
            padding: 24,
            flexGrow: 1,
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
              {userLIst.map(item => {
                return <UserLabel {...item} key={item.Id} />;
              })}
            </Row>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChooseUser;
