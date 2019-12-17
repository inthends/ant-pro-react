import React, { useEffect, useState } from 'react';
import styles from './index.less';
import Block from './Block';
import Room from './Room';
import { Icon, Spin } from 'antd';
import {
  GetFloorData//, GetRoomData
} from '../House.service';

interface AtlasProps {
  parentId?: string;
  showDrawer(item): void;
}
const Atlas = (props: AtlasProps) => {
  const [inline, setInline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const { parentId, showDrawer } = props;
  useEffect(() => {
    setLoading(true);
    // 获取楼层信息
    GetFloorData(parentId).then(res => {
      const floors = res || [];
      // const promises = floors.map(item => {
      //   // 获取房间信息
      //   return GetRoomData(item.id).then(rooms => {
      //     item.rooms = rooms || [];
      //     return rooms;
      //   });
      // }); 
      // if (floors.length === 0) {
      //   setLoading(false);
      // }
      // Promise.all(promises).then(() => {
      //   setData(floors);
      //   setLoading(false);
      // });

      setData(floors);
      setLoading(false);

    });
  }, [parentId]);
  return (
    <>
      <div className={styles.buildingInfo}>
        <Block title="未售" borderColor="#c32c2b" background="#dc7b78" />
        <Block title="待交房" borderColor="#cf366f" background="#de7b9e" />
        <Block title="装修" borderColor="#e97d1c" background="#feb97a" />
        <Block title="空置" borderColor="#566485" background="#728db0" />
        <Block title="出租" borderColor="#9ac82b" background="#bfe06c" />
        <Block title="自用" borderColor="#e7ba0d" background="#fee067" /> 
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

      {/* {loading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" style={{ marginTop: 200 }} />
        </div>
      ) : null} */}


      <Spin spinning={loading}>

        <div style={{ paddingTop: 20 }}>
          <div className={styles.buildingTable}>
            {data.map(floor => (
              <div className={styles.buildingRow}>
                <div className={styles.buildingTtitle}>{floor.item.name}</div>
                <div style={{ flexGrow: 1 }}>
                  <div
                    className={styles.buildingRooms}
                    style={inline ? undefined : { flexFlow: 'row wrap' }}
                  >
                    {floor.rooms.map(room => (
                      <Room inline={inline} state={room.state} onClick={() => showDrawer(room)}>
                        <div>{room.name}</div>
                        <div>{room.area}㎡</div>
                        <div>{room.tenantName}</div>
                      </Room>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </Spin>

    </>
  );
};
export default Atlas;
