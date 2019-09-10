import { Modal, Tree, Input } from "antd";
import React, { useEffect, useState } from "react";
import { getRoleTree, getUserList } from "./Role.service";
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

  const [search, setSearch] = useState({
    departmentId: ""
  });

  useEffect(() => {
    if (visible) {
      getRoleTree().then(res => {
        setTreeData(res);
      });
      searchUser({ departmentId: "" });
    }
  }, [visible]);

  const searchUser = ({ departmentId }) => {
    const { roleId } = data;
    getUserList({ roleId, departmentId }).then(res => {
      console.log(res);
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
      <div style={{ height: 500, display: "flex" }}>
        <div
          style={{
            width: 250,
            padding: 24,
            height: "100%",
            overflow: "auto",
            borderRight: "1px solid #e8e8e8"
          }}
        >
          <Tree
            checkable={true}
            showLine
            treeData={treeData}
            expandedKeys={expandedKeys}
            onExpand={clickExpend}
            onSelect={e => {
              console.log(e);
            }}
          ></Tree>
        </div>
        <div
          style={{
            padding: 24,
            flexGrow: 1
          }}
        >
          <div>
            {/* <Search
              className="search-input"
              placeholder="请输入要查询的关键词"
              onSearch={keyword => loadData({ ...search, keyword })}
              style={{ width: 200 }}
            /> */}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChooseUser;
