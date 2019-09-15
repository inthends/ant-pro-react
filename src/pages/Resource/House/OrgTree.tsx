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
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  useEffect(() => {
    setExpandedKeys(treeData.map(item => item.key as string));
  }, [treeData]);

  const onSelect = (selectedKeys, info) => {
    if (selectedKeys.length === 1) {
      selectTree(selectedKeys[0]);
    }
  };

  // const renderTree = (treeData: TreeEntity[], parentId: string) => {
  //   return treeData
  //     .filter(item => item.parentId === parentId)
  //     .map(filteditem => {
  //       return (
  //         <TreeNode title={filteditem.text} key={filteditem.id}>
  //           {renderTree(treeData, filteditem.id as string)}
  //         </TreeNode>
  //       );
  //     });
  // };

  // const clickExpend = (expandedKeys, { expanded, node }) => {
  //   const selectNode = node.props.eventKey;

  //   if (expanded) {
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


  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });


  return (
    <Tree
      autoExpandParent={autoExpandParent}
      expandedKeys={expandedKeys}
      showLine
      onSelect={onSelect}
      onExpand={clickExpend}>
      {renderTreeNodes(treeData)}
    </Tree>
  );
}

export default OrgTree;
