import React, { useEffect, useState, Children } from 'react';
import styles from './index.less';
interface RoomProps {
  inline: boolean;
  children?: any;
}
const Room = (props: RoomProps) => {
  const { inline, children } = props;

  return (
    <div className={styles.buildingRoom} style={inline ? inlineStyle : notInlineStyle}>
      <div className={styles.roomInnner}>{inline ? null : children}</div>
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
