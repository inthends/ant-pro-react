
import { Comment, Avatar, List } from 'antd';
import React, { useEffect, useState } from 'react';
import { GetCommunicates } from './Main.service';

interface CommentBoxShowProps {
  billId?: any;
}

function CommentBoxShow(props: CommentBoxShowProps) {
  const { billId } = props;
  const [comments, setComments] = useState<any[]>([]);

  // 打开抽屉时初始化
  useEffect(() => {
    GetCommunicates(billId).then(res => {
      setComments(res || []);
    })
  }, [billId]);

  return (
    <div>
      {comments.length > 0 ?
        <List
          dataSource={comments}
          header={`${comments.length} 回复`}
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
export default CommentBoxShow;
