//异步树
import Page from '@/components/Common/Page';
import { Icon, Layout, Tree } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { SiderContext } from '../SiderContext';
import { GetOrgTree, GetAsynChildBuildingsForArea } from '@/services/commonItem';

const { TreeNode } = Tree;
const { Sider } = Layout;

interface HouseMoreLeftTreeProps {
  //treeData: any[];
  selectTree(parentId, type): void;
  parentid?: string;
}

function HouseMoreLeftTree(props: HouseMoreLeftTreeProps) {

  const { selectTree, parentid } = props;
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  // const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
  const { hideSider, setHideSider } = useContext(SiderContext);
  //动态子节点
  const [treeData, setTreeData] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState<string[]>([]);

  //let selectedKey=[parentid];  
  // var keys: any[];
  // keys = [];
  let keys: string[] = [];
  // const getAllkeys = res =>
  //   res.map(item => {
  //     if (item.children && item.type != 'D') {
  //       keys.push(getAllkeys(item.children))
  //     }
  //     keys.push(item.key);
  //   });

  const getAllkeys = data =>
    data.forEach(item => {
      if (!item.isLeaf && item.type != 'D') {
        keys.push(getAllkeys(item.children))
      }
      keys.push(item.key);
    });

  //展开到管理处
  useEffect(() => {
    //根据父节点获取房产树
    GetOrgTree().then((res: any[]) => {
      setTreeData(res || []);
      getAllkeys(res || []);
      //setSelectedKey(selects);
      //默认选中
      // let selectid: string[] = [];
      // selectid.push(parentid);  
      // setSelectedKey(selects); 
      // setSelectedKey(selects); 
    });

    setExpandedKeys(keys);
    setSelectedKey([parentid || '']);
    //setExpandedKeys(treeData.map(item => item.id as string)); 

  }, [parentid]);

  const onSelect = (selectedKeys, info) => {
    if (selectedKeys.length === 1) {
      //const item = treeData.filter(treeItem => treeItem.key === selectedKeys[0])[0]; 
      //selectedKey = selectedKeys;
      setSelectedKey(selectedKeys);
      const type = info.node.props.type;
      if ('ABCD'.indexOf(type) != -1)
        return;
      //setSelectedKey(selectedKeys[0]); 
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

  //异步加载
  const onLoadData = treeNode =>
    new Promise<any>(resolve => {
      if (treeNode.props.children &&
        treeNode.props.children.length > 0 &&
        treeNode.props.type != 'D') {
        resolve();
        return;
      }

      setTimeout(() => {
        GetAsynChildBuildingsForArea(treeNode.props.eventKey, treeNode.props.type).then((res: any[]) => {
          treeNode.props.dataRef.children = res || [];
          setTreeData([...treeData]);
        });
        resolve();
      }, 500);
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

  //异步绑定
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
    <Sider
      theme="light"
      style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh + 10px)' }}
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
                loadData={onLoadData}
                showLine
                expandedKeys={expandedKeys}
                onExpand={clickExpend}
                onSelect={onSelect}
                selectedKeys={selectedKey}>
                {renderTreeNodes(treeData)}
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

export default HouseMoreLeftTree;