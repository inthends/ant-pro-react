import Page from '@/components/Common/Page';
import { TreeEntity } from '@/model/models';
import React from 'react';
import OrgTree from './OrgTree';

interface LeftTreeProps {
  treeData: TreeEntity[];
  selectTree(treeNode): void;
}
function LeftTree(props: LeftTreeProps) {
  const { treeData, selectTree } = props; 

  return (
    <Page style={{ padding: '6px', borderLeft: 'none', borderBottom: 'none', height: '100%' }}>
      <OrgTree selectTree={selectTree} treeData={treeData}></OrgTree>
    </Page>
  );
}

export default LeftTree;
