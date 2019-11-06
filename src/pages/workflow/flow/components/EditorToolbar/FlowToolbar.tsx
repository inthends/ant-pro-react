import { Divider } from 'antd';
import React from 'react';
import { Toolbar } from 'gg-editor';
import ToolbarButton from './ToolbarButton';
import styles from './index.less';

const FlowToolbar = () => (
  <Toolbar className={styles.toolbar}>
    <ToolbarButton command="save" icon="save" text="保存" />
    <ToolbarButton command="undo" icon="undo" text="撤销" />
    <ToolbarButton command="redo" icon="redo" text="重做" />
    <Divider type="vertical" />
    <ToolbarButton command="copy" icon="copy" text="复制" />
    <ToolbarButton command="paste" icon="snippets" text="粘贴" />
    <ToolbarButton command="delete" icon="delete" text="删除" />
    <Divider type="vertical" />
    <ToolbarButton command="zoomIn" icon="zoom-in" text="放大" />
    <ToolbarButton command="zoomOut" icon="zoom-out" text="缩小" />
    <ToolbarButton command="autoZoom" icon="fullscreen" text="自适应" />
    <ToolbarButton command="resetZoom" icon="fullscreen-exit" text="实际大小" />
    {/* <Divider type="vertical" />
    <ToolbarButton command="toBack" icon="to-back" text="下降层级" />
    <ToolbarButton command="toFront" icon="to-front" text="提升层级" />
    <Divider type="vertical" />
    <ToolbarButton command="multiSelect" icon="multi-select" text="多选" />
    <ToolbarButton command="addGroup" icon="group" text="成组" />
    <ToolbarButton command="unGroup" icon="ungroup" text="取消组" /> */}
  </Toolbar>
);

export default FlowToolbar;
