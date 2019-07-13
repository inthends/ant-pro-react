import React, { ReactNode, useState, Fragment, useEffect } from 'react';
import { Draggable, Droppable, DragDropContext, DragDropContextProps } from 'react-beautiful-dnd';
import { Icon, Dropdown } from 'antd';
import classnames from 'classnames';
import $ from 'jquery';

import GlassPanel from '../GlassPanel';

import styles from './index.less';

export interface DraggableListProps {
  id: string;
  items: Array<any>;
  total: number;
  width?: number;
  height?: number;
  rowHeight?: number;
  children?: React.ReactNode;
  title?: string;
  rowKey: string;
  itemRender: (item: any, index: number) => ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  isDragDisabled?: boolean;
  itemClick: (
    item: any,
    position: { id: string; index: number },
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
  highlight?: boolean;
  footerVisible?: boolean;
}

interface DraggableListGroupProps extends DragDropContextProps {
  children: ReactNode;
}

interface RowInfo {
  index: number;
  item: any;
}

function DraggableList(props: DraggableListProps) {
  const {
    id,
    items,
    total = 0,
    height = 0,
    rowHeight = 128,
    title,
    rowKey,
    itemRender = () => null,
    actions,
    footer,
    isDragDisabled = false,
    itemClick = () => {},
    highlight,
    footerVisible = true,
  } = props;
  const [filter, setFilter] = useState(false);

  const renderRow = ({ index, item }: RowInfo): ReactNode => {
    return (
      <Draggable
        draggableId={item[rowKey]}
        index={index}
        key={item[rowKey] || index}
        isDragDisabled={isDragDisabled}
      >
        {provided => (
          <div
            ref={provided.innerRef}
            className={styles.draggableListItem}
            style={{ height: `${rowHeight}px` }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            // @ts-ignore
            onClick={itemClick.bind(this as any, item, { id, index })}
          >
            {itemRender(item, index)}
          </div>
        )}
      </Draggable>
    );
  };

  useEffect(() => {
    // 不要混用原生事件和合成事件
    const body = document.querySelector<HTMLBodyElement>('body');
    const clickHidden = e => {
      if (
        (e.target && $(e.target).parents(`.${id}-actions`).length > 0) ||
        (e.target && $(e.target).parents('.actions-trigger').length > 0)
      ) {
        return;
      }
      setFilter(false);
    };
    if (body) {
      body.addEventListener('click', clickHidden, false);
    }
    return () => {
      if (body) {
        body.removeEventListener('click', clickHidden, false);
      }
    };
  }, []);

  return (
    <GlassPanel>
      <div className={styles.draggableListHeader}>
        <div className={styles.draggableListTitle}>
          {title}
          <span className={styles.draggableListTotal}>{total}</span>
        </div>
        {actions && (
          <div className={styles.draggableListActions}>
            <Dropdown
              visible={filter}
              overlay={<div className={`${id}-actions`}>{actions}</div>}
              placement="bottomRight"
            >
              <Icon
                type="filter"
                theme="filled"
                className={classnames({ filtered: highlight }, 'actions-trigger')}
                onClick={() => {
                  setFilter(!filter);
                }}
              />
            </Dropdown>
          </div>
        )}
      </div>

      <Droppable droppableId={id}>
        {provided => (
          <div style={{ height: `${height}px`, overflowY: 'auto' }} ref={provided.innerRef}>
            {items.map((item, index) =>
              renderRow({
                item,
                index,
              }),
            )}
          </div>
        )}
      </Droppable>

      {footer && footerVisible && <div className={styles.draggableListFooter}>{footer}</div>}
    </GlassPanel>
  );
}

export function Group(props: DraggableListGroupProps) {
  const { children, onDragEnd } = props;
  return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>;
}

export default DraggableList;
