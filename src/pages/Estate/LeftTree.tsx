import Page from '@/components/Common/Page';
//import { TreeEntity } from '@/model/models';
import { Icon, Layout, Tree } from 'antd';
import React, { useEffect, useState, useContext } from 'react';
import { SiderContext } from '../SiderContext';
const { Sider } = Layout;
// const { TreeNode } = Tree;

interface LeftTreeProps {
  treeData: any[];
  selectTree(value, item?: any): void;
}
function LeftTree(props: LeftTreeProps) {
  const { treeData, selectTree } = props;
  const { hideSider, setHideSider } = useContext(SiderContext);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);


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

  const clickExpend = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeys);
    //setAutoExpandParent(false);
  };

  // const [expanded, setExpanded] = useState<string[]>([]);

  //useEffect(() => {
  // setExpanded(treeData.map(item => item.key as string));
  //}, [treeData]);

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
    } else {
      //恢复查询
      selectTree('', info);
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

  // return (
  //   <Page style={{
  //     padding: '6px',
  //     borderLeft: 'none',
  //     borderBottom: 'none',
  //     height: '100%',
  //     overflowY: 'auto'
  //   }}>
  //     <Tree
  //       //expandedKeys={expanded}
  //       showLine
  //       onSelect={onSelect}
  //       treeData={treeData}
  //       defaultExpandAll={true}
  //     // defaultExpandAll={true}
  //     // onExpand={clickExpend}
  //     >
  //       {/* {renderTree(treeData, '0')} */}
  //     </Tree>
  //   </Page>
  // );


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
                onSelect={onSelect}
              >
              </Tree>
            </Page>
            <div
              style={{ position: 'absolute', top: '40%', right: -15 }}
              onClick={() => {
                setHideSider(true);
              }}
            >
              <Icon type="double-left" style={{ color: '#1890ff', cursor: 'pointer' }} />
            </div>
          </>
        )}
    </Sider>
  );





}

export default LeftTree;
