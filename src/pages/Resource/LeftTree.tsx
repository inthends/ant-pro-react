import Page from '@/components/Common/Page';
import { TreeEntity } from '@/model/models';
import { Icon, Layout, Tree } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { SiderContext } from './SiderContext';

const { TreeNode } = Tree;
const { Sider, Content } = Layout;

interface LeftTreeProps {
  treeData: TreeEntity[];
  selectTree(treeNode, item?: any): void;
}
function LeftTree(props: LeftTreeProps) {
  const { treeData, selectTree } = props;

  const [expanded, setExpanded] = useState<string[]>([]);
  const { hideSider, SetHideSider } = useContext(SiderContext);

  useEffect(() => {
    setExpanded(treeData.map(item => item.id as string));
  }, [treeData]);

  const onSelect = (selectedKeys, info) => {
    if (selectedKeys.length === 1) {
      const item = treeData.filter(item => item.id === selectedKeys[0])[0];
      selectTree(selectedKeys[0], item);
    }
  };

  const renderTree = (treeData: TreeEntity[], parentId: string) => {
    return treeData
      .filter(item => item.parentId === parentId)
      .map(filteditem => {
        return (
          <TreeNode title={filteditem.text} key={filteditem.id}>
            {renderTree(treeData, filteditem.id as string)}
          </TreeNode>
        );
      });
  };

  const clickExpend = (expandedKeys, { expanded, node }) => {
    const selectNode = node.props.eventKey;

    if (expanded) {
      setExpanded(expend => [...expend, selectNode]);
    } else {
      setExpanded(expend => expend.filter(item => item !== selectNode));
    }
  };

  return (
    <Sider
      theme="light"
      style={{ overflow: 'visible', position: 'relative', height: '100%' }}
      width={hideSider ? 20 : 245}
    >
      {hideSider ? (
        <div style={{ position: 'absolute', top: '40%', left: 5 }}>
          <Icon
            type="double-right"
            onClick={() => {
              SetHideSider(false);
            }}
            style={{ color: '#1890ff' }}
          />
        </div>
      ) : (
        [
          <Page
            style={{
              padding: '6px',
              borderLeft: 'none',
              borderBottom: 'none',
              height: '100%',
              overflowY: 'auto',
            }}
          >
            <Tree expandedKeys={expanded} showLine onSelect={onSelect} onExpand={clickExpend}>
              {renderTree(treeData, '0')}
            </Tree>
          </Page>,
          <div
            style={{ position: 'absolute', top: '40%', right: -15 }}
            onClick={() => {
              SetHideSider(true);
            }}
          >
            <Icon type="double-left" style={{ color: '#1890ff' }} />
          </div>,
        ]
      )}
    </Sider>
  );
}

export default LeftTree;
