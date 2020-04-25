//带sider
import Page from '@/components/Common/Page';
import { Icon, Layout, Tree } from 'antd';
import React, { useContext, useState, useEffect } from 'react';
import { SiderContext } from '../SiderContext';
const { Sider } = Layout;

interface LeftTreeNewProps {
  treeData: any[];
  // selectTree(treeNode, item?: any): void;
  selectTree(orgid, orgtype, organizeId): void;
}

function LeftTreeNew(props: LeftTreeNewProps) { 
  const { treeData, selectTree } = props;
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  // const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
  const { hideSider, setHideSider } = useContext(SiderContext);

  // const getAllkeys = (data) => {
  //   var keys=[];
  //   data.map(item => {
  //     if (item.children) {
  //       return keys.push(getAllkeys(item.children));
  //     }
  //     keys.push(item.key);  
  //   }); 
  //   return keys;
  // }

  //展开全部
  let keys: any[] = [];
  // const getAllkeys = data =>
  //   data.map(item => { 
  //     if (!item.isLeaf) {
  //       keys.push(getAllkeys(item.children))
  //     }
  //     keys.push(item.key); 
  //   });

  const getAllkeys = data =>
    data.forEach(item => {
      if (!item.isLeaf) {
        keys.push(getAllkeys(item.children))
      }
      keys.push(item.key);
    });

  useEffect(() => {
    getAllkeys(treeData);
    setExpandedKeys(keys);
    // console.log(keys);
  }, [treeData]);

  const onSelect = (selectedKeys, info) => {
    // if (selectedKeys.length === 1) {
    //   const item = treeData.filter(treeItem => treeItem.key === selectedKeys[0])[0];
    //   selectTree(selectedKeys[0], item);
    // }  

    if (selectedKeys.length === 1) {
      selectTree(selectedKeys[0], info.node.props.type, info.node.props.organizeId);
    } else {
      //恢复查询
      selectTree('', '', info.node.props.organizeId);
    }
  };

  // const renderTree = (tree: any[], parentId: string) => {
  //   return tree
  //     .filter(item => item.parentId === parentId)
  //     .map(filteditem => {
  //       return (
  //         <TreeNode title={filteditem.title} key={filteditem.key}>
  //           {renderTree(tree, filteditem.key)}
  //         </TreeNode>
  //       );
  //     });
  // };

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

  // const renderTreeNodes = data =>
  //   data.map(item => {
  //     if (item.children) {
  //       return (
  //         <TreeNode {...item} dataRef={item} >
  //           {renderTreeNodes(item.children)}
  //         </TreeNode>
  //       );
  //     }
  //     return <TreeNode {...item} dataRef={item} />;
  //   });


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
                showLine
                treeData={treeData}
                expandedKeys={expandedKeys}
                onExpand={clickExpend}
                onSelect={onSelect} >
              </Tree>
            </Page>
            <div
              style={{ position: 'absolute', top: '40%', right: -15 }}
              onClick={() => {
                setHideSider(true);
              }}>
              <Icon type="double-left" style={{ color: '#1890ff', cursor: 'pointer' }} />
            </div>
          </>
        )}
    </Sider>
  );
}
export default LeftTreeNew;
