import Page from '@/components/Common/Page';
import { Tree } from 'antd';
import React, { useState, useEffect } from 'react';
import { TreeEntity } from '@/model/models';
import Item from 'antd/lib/list/Item';

const { TreeNode } = Tree;
interface LeftTreeProps {
  treeData: TreeEntity[];
  selectTree(treeNode): void;
}
function LeftTree(props: LeftTreeProps) {
  const { treeData, selectTree } = props;
  const [expanded, setExpanded] = useState<string[]>([]);
  useEffect(() => {
    setExpanded(treeData.map(item => item.id as string));
  }, [treeData]);

  const onSelect = (selectedKeys, info) => {
    if (selectedKeys.length === 1) {
      selectTree(selectedKeys[0]);
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

  console.log(expanded)
  return (
    <Page style={{ padding: '6px', borderLeft: 'none', borderBottom: 'none', height: '100%' }}>
      <Tree expandedKeys={expanded} showLine onSelect={onSelect} onExpand={clickExpend}>
        {renderTree(treeData, '0')}
      </Tree>
    </Page>
  );
}

export default LeftTree;
