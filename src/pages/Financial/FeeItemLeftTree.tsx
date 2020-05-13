//添加费用左侧费项树，可以选中节点和取消选中
import Page from '@/components/Common/Page';
//import { TreeEntity } from '@/model/models';
import { Tree } from 'antd';
import React, { useEffect, useState } from 'react';
// const { TreeNode } = Tree;

interface FeeItemLeftTreeProps {
  treeData: any[];
  selectTree(treeNode, item?: any): void;
  selectedKeys: any[];
}
function FeeItemLeftTree(props: FeeItemLeftTreeProps) {
  const { treeData, selectTree, selectedKeys } = props;
  // const [expanded, setExpanded] = useState<any[]>([]); 
  const [expanded, setExpanded] = useState<string[]>([]);

  let keys: any[];
  keys = [];
  const getAllkeys = res =>
    res.forEach(item => {
      if (item.children) {
        keys.push(getAllkeys(item.children))
      }
      keys.push(item.key);
    });

  useEffect(() => {
    //setExpanded(treeData.map(item => item.key as string));
    getAllkeys(treeData || []);
    setExpanded(keys);
  }, [treeData]);

  // const onSelect = (selectedKeys, info) => { 
  //   if (selectedKeys.length === 1) {
  //     const item = treeData.filter(item => item.key === selectedKeys[0])[0];
  //     selectTree(selectedKeys[0], item);
  //   }
  // };

  const onSelect = (selectedKeys, info) => {
    if (selectedKeys.length === 1) {
      //const item = treeData.filter(item => item.key === selectedKeys[0])[0];
      selectTree(selectedKeys[0], info); 
    }
  };

  // const renderTree = (treeData: TreeEntity[], parentId: string) => {
  //   return treeData
  //     .filter(item => item.parentId === parentId)
  //     .map(filteditem => {
  //       return (
  //         <TreeNode title={filteditem.title} key={filteditem.id}>
  //           {renderTree(treeData, filteditem.id as string)}
  //         </TreeNode>
  //       );
  //     });
  // };

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
    setExpanded(expandedKeys);
    //setAutoExpandParent(false);
  };

  return (
    <Page style={{
      padding: '6px',
      borderLeft: 'none',
      borderBottom: 'none',
      height: '100%',
      overflowY: 'auto'
    }}>

      {treeData != null && treeData.length > 0 ?
        (<Tree
          expandedKeys={expanded}
          showLine
          onSelect={onSelect}
          treeData={treeData}
          autoExpandParent
          // defaultExpandAll={true}
          onExpand={clickExpend}
          selectedKeys={selectedKeys}
        >
          {/* {renderTree(treeData, '0')} */}
        </Tree>) : null}
    </Page>
  );
}

export default FeeItemLeftTree;
