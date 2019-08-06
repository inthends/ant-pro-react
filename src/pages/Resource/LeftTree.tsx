import Page from '@/components/Common/Page';
import { Icon, Layout, Tree } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { SiderContext } from '../SiderContext';

const { TreeNode } = Tree;
const { Sider } = Layout;

interface LeftTreeProps {
  treeData: any[];
  selectTree(treeNode, item?: any): void;
}
function LeftTree(props: LeftTreeProps) {
  const { treeData, selectTree } = props;
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
  const { hideSider, setHideSider } = useContext(SiderContext);

  useEffect(() => {
    setExpandedKeys(treeData.map(item => item.id as string));
  }, [treeData]);

  const onSelect = (selectedKeys, info) => {
    if (selectedKeys.length === 1) {
      const item = treeData.filter(treeItem => treeItem.id === selectedKeys[0])[0];
      selectTree(selectedKeys[0], item);
    }
  };

  const renderTree = (tree: any[], parentId: string) => {
    return tree
      .filter(item => item.parentId === parentId)
      .map(filteditem => {
        return (
          <TreeNode title={filteditem.title} key={filteditem.id}>
            {renderTree(tree, filteditem.id as string)}
          </TreeNode>
        );
      });
  };

  // const clickExpend = (expandedKeys, { isExpanded, node }) => {
  //   const selectNode = node.props.eventKey; 
  //   if (isExpanded) {
  //     setExpanded(expend => [...expend, selectNode]);
  //   } else {
  //     setExpanded(expend => expend.filter(item => item !== selectNode));
  //   }
  // };

  const clickExpend = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };


  return (
    <Sider
      theme="light"
      style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh - 60px)' }}
      width={hideSider ? 20 : 245}
    >
      {hideSider ? (
        <div style={{ position: 'absolute', top: '40%', left: 5 }}>
          <Icon
            type="double-right"
            onClick={() => {
              setHideSider(false);
            }}
            style={{ color: '#1890ff' }}
          />
        </div>
      ) : (
          <>
            <Page
              style={{
                padding: '6px',
                borderLeft: 'none',
                borderBottom: 'none',
                height: '100%',
                overflowY: 'auto',
              }}
            >
              <Tree
                expandedKeys={expandedKeys}
                showLine
                autoExpandParent={autoExpandParent}
                onSelect={onSelect}
                onExpand={clickExpend}>
                { renderTree(treeData,'0') }

              </Tree>
            </Page>
            <div
              style={{ position: 'absolute', top: '40%', right: -15 }}
              onClick={() => {
                setHideSider(true);
              }}
            >
              <Icon type="double-left" style={{ color: '#1890ff' }} />
            </div>
          </>
        )}
    </Sider>
  );
}

export default LeftTree;
