//checkbox选择房产树,同步树
import Page from '@/components/Common/Page';
import { Tree } from 'antd';
import React, { useState } from 'react';
interface SelectTreeProps {
  treeData: any[];
  selectTree(item, type, allname?): void;
  GetCheckedKeys(keys): void;
  checkable: boolean;
}

function SelectTree(props: SelectTreeProps) {
  const { checkable, treeData, selectTree, GetCheckedKeys } = props;
  //const [checkedKeys, setCheckedKeys] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const onCheck = (checkedKeys, e) => {
    //setCheckedKeys(checkedKeys);
    let keys: any[] = [];
    //只选中房屋和车位
    e.checkedNodes.forEach(item => {
      //公共区域也就是巡检点
      if (item.props.type == 6) {
        keys.push(item.key);
      }
    });
    GetCheckedKeys(keys);
  };

  const onSelect = (selectedKeys, info) => {
    if (selectedKeys.length === 1) {
      //const item = treeData.filter(treeItem => treeItem.key === selectedKeys[0])[0];
      const type = info.node.props.type;
      if ('ABCD'.indexOf(type) != -1)
        return; 
      const allname = info.node.props.attributeA;
      selectTree(selectedKeys[0], type, allname);
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
export default SelectTree;
