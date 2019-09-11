import Page from '@/components/Common/Page';
import { TreeEntity } from '@/model/models';
import { Tree } from 'antd';
import React, { useEffect, useState } from 'react';

const { TreeNode } = Tree;

interface LeftSelectTreeProps {
  treeData: any[];
  selectTree(treeNode, item?: any): void;
  getCheckedKeys(keys):void;

}
function LeftSelectTree(props: LeftSelectTreeProps) {
  const { treeData, selectTree ,getCheckedKeys} = props;

  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    setExpanded(treeData.map(item => item.id as string));
  }, [treeData]);

  const onSelect = (selectedKeys, info) => {
    if (selectedKeys.length === 1) {
      const item = treeData.filter(item => item.key === selectedKeys[0])[0];
      selectTree(selectedKeys[0], item);
    }
  };

  const renderTree = (treeData: TreeEntity[], parentId: string) => {
    return treeData
      .filter(item => item.parentId === parentId)
      .map(filteditem => {
        return (
          <TreeNode title={filteditem.title} key={filteditem.key}>
            {renderTree(treeData, filteditem.key as string)}
          </TreeNode>
        );
      });
  };


  /*const renderTree = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode {...item} dataRef={item} >
            {renderTree(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });*/

  const clickExpend = (expandedKeys, { expanded, node }) => {
    const selectNode = node.props.eventKey;

    if (expanded) {
      setExpanded(expend => [...expend, selectNode]);
    } else {
      setExpanded(expend => expend.filter(item => item !== selectNode));
    }
  };
  const onCheck=(checkedKeys)=>{
    setCheckedKeys(checkedKeys);
    getCheckedKeys(checkedKeys);
  }

  const [checkedKeys,setCheckedKeys]=useState<string[]>([]);
  return (
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
        checkedKeys={checkedKeys}
        onCheck={onCheck}
        expandedKeys={expanded}
        showLine
        onSelect={onSelect}
        onExpand={clickExpend}
        treeData={treeData}>
       {/*renderTree(treeData, '0')*/}
      </Tree>
    </Page>
  );
}

export default LeftSelectTree;
