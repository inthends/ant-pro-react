//checkbox选择费项
import Page from '@/components/Common/Page';
import { Tree } from 'antd';
import React, { useState } from 'react';
interface SelectFeeItemProps {
  treeData: any[];
  selectTree(item): void;
  getCheckedKeys(keys): void;
  checkable: boolean;
}

function SelectFeeItem(props: SelectFeeItemProps) {
  const { checkable, treeData, selectTree, getCheckedKeys } = props;
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const onCheck = (checkedKeys, e) => {
    let keys: any[] = [];
    e.checkedNodes.forEach(item => { 
      //只能选择费项
      if (item.props.isLeaf) {
        keys.push(item.key);
      }
    });
    getCheckedKeys(keys);
  };

  const onSelect = (selectedKeys, info) => {
    if (selectedKeys.length === 1) {
      // const type = info.node.props.type;
      if (info.node.props.isLeaf)
        return;
      // const allname = info.node.props.attributeA;
      selectTree(selectedKeys[0]);
    }
  };

  const clickExpend = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeys);
    //setAutoExpandParent(false);
  };

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
          treeData={treeData}
          showLine
          checkable={checkable}
          //checkedKeys={checkedKeys}
          onCheck={onCheck}
          expandedKeys={expandedKeys}
          autoExpandParent
          onExpand={clickExpend}
          onSelect={onSelect}
        >
        </Tree>) : null}
    </Page>
  );
};
export default SelectFeeItem;
