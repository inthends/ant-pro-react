import { CanvasPanel, DetailPanel, EdgePanel, GroupPanel, MultiPanel, NodePanel } from 'gg-editor';

import { Card } from 'antd';
import React from 'react';
import DetailForm from './DetailForm';
import styles from './index.less'; 

const FlowDetailPanel = (roles) => (
  <DetailPanel className={styles.detailPanel}>
    <NodePanel>
      <DetailForm type="node"  roles={roles}/>
    </NodePanel>
    <EdgePanel>
      <DetailForm type="edge"  roles={roles} />
    </EdgePanel>
    <GroupPanel>
      <DetailForm type="group" roles={roles}/>
    </GroupPanel>
    <MultiPanel>
      <Card type="inner" size="small" title="多选" bordered={false} />
    </MultiPanel>
    <CanvasPanel>
      <Card type="inner" size="small" title="属性" bordered={false} />
    </CanvasPanel>
  </DetailPanel>
);

export default FlowDetailPanel;
