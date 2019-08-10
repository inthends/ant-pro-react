import React, { useEffect, useState } from 'react';
import styles from './index.less';
import Block from './Block';
import Room from './Room';
import { Icon } from 'antd';

const Atlas = () => {
  const [inline, setInline] = useState(false);
  return (
    <>
      <div className={styles.buildingInfo}>
        <Block title="未售" borderColor="#c32c2b" background="#dc7b78" />
        <Block title="待交房" borderColor="#cf366f" background="#de7b9e" />
        <Block title="装修" borderColor="#e97d1c" background="#feb97a" />
        <Block title="出租" borderColor="#9ac82b" background="#bfe06c" />
        <Block title="自用" borderColor="#e7ba0d" background="#fee067" />
        <Block title="空置" borderColor="#566485" background="#728db0" />
        {inline ? (
          <Icon
            type="fullscreen"
            className={styles.buildingIcon}
            onClick={() => setInline(!inline)}
          />
        ) : (
          <Icon
            type="fullscreen-exit"
            className={styles.buildingIcon}
            onClick={() => setInline(!inline)}
          />
        )}
      </div>
      <div style={{ paddingTop: 20 }}>
        <div className={styles.buildingTable}>
          <div className={styles.buildingRow}>
            <div className={styles.buildingTtitle}>第27层</div>
            <div style={{ flexGrow: 1 }}>
              <div className={styles.buildingRooms}>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
              </div>
            </div>
          </div>
          <div className={styles.buildingRow}>
            <div className={styles.buildingTtitle}>第28层</div>
            <div style={{ flexGrow: 1 }}>
              <div className={styles.buildingRooms}>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
                <Room inline={inline}></Room>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Atlas;
