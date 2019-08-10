import React, { useEffect, useState } from 'react';
import styles from './index.less';
interface RoomProps {
  inline: boolean;
}
const Room = (props: RoomProps) => {
  const { inline } = props;

  return (
    <div className={styles.buildingRoom} style={inline ? inlineStyle : notInlineStyle}>
      <div className={styles.roomInnner}></div>
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
