//checkbox树
import Page from '@/components/Common/Page';
import { Tree } from 'antd';
import React, {  useState } from 'react';  
interface SelectTreeProps {
  treeData: any[];
  selectTree(item, type): void;
  getCheckedKeys(keys): void;
}

function SelectTree(props: SelectTreeProps) { 
  const { treeData, selectTree } = props;
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const onCheck = (checkedKeys, e) => { 
    setCheckedKeys(checkedKeys);
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
          showLine
          checkable
          checkedKeys={checkedKeys}
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
export default SelectTree;
