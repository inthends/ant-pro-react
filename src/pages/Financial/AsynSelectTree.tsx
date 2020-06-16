//多选checkbox异步树
import Page from '@/components/Common/Page';
import { Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import { GetOrgTree, GetAsynChildBuildings } from '@/services/commonItem';
const { TreeNode } = Tree;
interface AsynSelectTreeProps {
  //treeData: any[];
  selectTree(parentId, type): void;
  getCheckedKeys(keys): void;
  parentid: string;
}

function AsynSelectTree(props: AsynSelectTreeProps) {
  const { selectTree, getCheckedKeys } = props;
  // const [checkedKeys, setCheckedKeys] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  // const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
  //动态子节点
  const [treeData, setTreeData] = useState<any[]>([]);

  let keys: any[] = [];
  const getAllkeys = res =>
    res.forEach(item => {
      if (item.children && item.type != 'D') {
        keys.push(getAllkeys(item.children))
      }
      keys.push(item.key);
    });

  useEffect(() => {
    //根据父节点获取房产树
    GetOrgTree().then((res: any[]) => {
      setTreeData(res || []);
      getAllkeys(res || []);
      setExpandedKeys(keys);
    });
    //setExpandedKeys(treeData.map(item => item.id as string));   

  }, []);

  //选择事件
  // const onCheck = (checkedKeys, info) => {  
  //   let keys: any[] = [];
  //   //setCheckedKeys(checkedKeys);
  //   //过滤
  //   info.checkedNodes.forEach(item => { 
  //     //房间或者车位
  //     if (item.props.type == 5 || item.props.type == 9) {
  //       keys.push(item.key);
  //     }
  //   }); 
  //   getCheckedKeys(keys);
  // };

  const onCheck = (checkedKeys, e) => { 
    getCheckedKeys(checkedKeys);
  };


  const onSelect = (selectedKeys, info) => {
    if (selectedKeys.length === 1) {
      //const item = treeData.filter(treeItem => treeItem.key === selectedKeys[0])[0];
      const type = info.node.props.type;
      if ('ABCD'.indexOf(type) != -1)
        return;
      selectTree(selectedKeys[0], type);
    }
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
    //setAutoExpandParent(false);
  };


  const onLoadData = treeNode =>
    new Promise<any>(resolve => {
      if (treeNode.props.children &&
        treeNode.props.children.length > 0) {
        resolve();
        return;
      }
      setTimeout(() => {
        GetAsynChildBuildings(treeNode.props.eventKey, treeNode.props.type).then((res: any[]) => {
          treeNode.props.dataRef.children = res || [];
          setTreeData([...treeData]);
        });
        resolve();
      }, 100);
    });

  // const renderTree = (tree: any[], parentId: string) => {
  //   return tree.filter(item => item.parentId === parentId).map(filteditem => {
  //       return (
  //         <TreeNode title={filteditem.title} key={filteditem.id} dataRef={filteditem}>
  //           {renderTree(tree, filteditem.id as string)}
  //         </TreeNode>
  //       );
  //     });
  // };

  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          // <TreeNode title={item.title} key={item.key} dataRef={item} type={item.type} >
          <TreeNode {...item} dataRef={item} >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });

  return (
    <Page
      style={{
        padding: '6px',
        borderLeft: 'none',
        borderBottom: 'none',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {treeData != null && treeData.length > 0 ?
        (<Tree
          loadData={onLoadData}
          showLine
          checkable
          // checkedKeys={checkedKeys}
          onCheck={onCheck}
          expandedKeys={expandedKeys}
          // expandedKeys={expandedKeys}
          // autoExpandParent={autoExpandParent}
          autoExpandParent
          onExpand={clickExpend}
          onSelect={onSelect}
        >
          {renderTreeNodes(treeData)}
        </Tree>) : null}
    </Page>
  );
};
export default AsynSelectTree;
