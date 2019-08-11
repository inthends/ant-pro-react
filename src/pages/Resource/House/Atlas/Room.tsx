import React, { useEffect, useState, Children } from 'react';
import styles from './index.less';
interface RoomProps {
  inline: boolean;
  children?: any;
  state: string;
}
const Room = (props: RoomProps) => {
  const { inline, children, state } = props;
  const color = RoomStates[state] || {};
  const pad = inline ? { padding: '12px 0' } : { padding: 12 };

  return (
    <div className={styles.buildingRoom} style={inline ? inlineStyle : notInlineStyle}>
      <div className={styles.roomInnner} style={{ ...pad, ...color }}>
        {children}
      </div>
    </div>
  );
};
export default Room;
const inlineStyle = {
  flexGrow: 1,
};
const notInlineStyle = {
  flex: '0 0 16%',
};
const RoomStates = {
  未售: {
    borderColor: '#c32c2b',
    background: '#dc7b78',
  },
  待交房: {
    borderColor: '#cf366f',
    background: '#de7b9e',
  },
  装修: {
    borderColor: '#e97d1c',
    background: '#feb97a',
  },
  出租: {
    borderColor: '#9ac82b',
    background: '#bfe06c',
  },
  自用: {
    borderColor: '#e7ba0d',
    background: '#fee067',
  },
  空置: {
    borderColor: '#566485',
    background: '#728db0',
  },
};
