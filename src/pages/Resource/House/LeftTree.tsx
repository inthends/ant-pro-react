import Page from '@/components/Common/Page';
import { Tree } from 'antd';
import React from 'react';
import { TreeEntity } from '@/model/models';


const { TreeNode } = Tree;
interface LeftTreeProps {
  treeData: TreeEntity[];
  selectTree(treeNode): void;
}
function LeftTree(props: LeftTreeProps) {
  const { treeData, selectTree } = props;
  const onSelect = (selectedKeys, info) => {
    if(selectedKeys.length ===1) {
      selectTree(selectedKeys[0]);
    }
  };

  const renderTree = (treeData: TreeEntity[], parentId: string ) =>  {
    return treeData.filter(item => item.parentId === parentId).map(item => {
      return <TreeNode title={item.text} key={item.id}>
        {
          renderTree(treeData, item.id as string)
        }
      </TreeNode>
    })
  }

  return (
    <Page style={{ padding: '6px', borderLeft: 'none', borderBottom: 'none', height: '100%' }}>
      <Tree defaultExpandAll={true} showLine  onSelect={onSelect}>
        {
          renderTree(treeData, '0' )
        }
      </Tree>
    </Page>
  );
}

export default LeftTree;
