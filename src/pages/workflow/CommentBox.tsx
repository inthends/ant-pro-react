
import { Comment, List } from 'antd';
import React, { useEffect, useState } from 'react';
import { GetApproveLog } from '@/services/commonItem'; 

interface CommentBoxProps {
  instanceId?: string;
}

function CommentBox(props: CommentBoxProps) {
  const { instanceId } = props;
  const [comments, setComments] = useState<any[]>([]);

  // 打开抽屉时初始化
  useEffect(() => {
    GetApproveLog(instanceId).then(res => {
      setComments(res || []);
    }) 
  }, []);

  return (
    <div>
      {/* {comments.length > 0 && <CommentList comments={comments} />} */}
      {comments.length > 0 ?
        <List
          dataSource={comments}
          header={`${comments.length} 记录`}
          itemLayout="horizontal"
          renderItem={props => < Comment {...props}  />} 
        /> : null}
    </div>
  );
}
export default CommentBox;
