import { TreeEntity } from '@/model/models';
import { Tree } from 'antd';
import React, { useEffect, useState } from 'react';

const { TreeNode } = Tree;
interface OrgTreeProps {
  treeData: TreeEntity[];
  selectTree(treeNode): void;
}
function OrgTree(props: OrgTreeProps) {
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

  return (
    <Tree expandedKeys={expanded} showLine onSelect={onSelect} onExpand={clickExpend}>
      {renderTree(treeData, '0')}
    </Tree>
  );
}

export default OrgTree;
