//操作记录
import {
  Comment, //Avatar,
  List
} from 'antd';
import React from 'react';
// import { GetOperationRecords } from './Main.service';

interface OperationRecordProps {
  data: any[]; 
}

function OperationRecord(props: OperationRecordProps) {
  const { data } = props;
  // const [comments, setComments] = useState<any[]>([]);

  // 打开抽屉时初始化
  // useEffect(() => {
  //   GetOperationRecords(billId).then(res => {
  //     setComments(res || []);
  //   })
  // }, [billId]);

  return (
    <div>
      {data.length > 0 ?
        <List
          dataSource={data}
          header={`${data.length} 操作记录`}
          itemLayout="horizontal"
          renderItem={props => < Comment {...props} />}
        /> : null}
      <Comment
        avatar={null}
        content={null}
      />
    </div>
  );
}
export default OperationRecord;
