
import { Input, Form, Comment, Avatar, List, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { GetFollow, SaveFollow } from './Main.service';
const { TextArea } = Input;

interface CommentBoxProps {
  id?: any;
  visible: boolean;
  reload(): void;
}

function CommentBox(props: CommentBoxProps) {
  const { id, visible, reload } = props;
  const [commentValue, setCommentValuee] = useState<string>('');
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [comments, setComments] = useState<any[]>([]);


  // 打开抽屉时初始化
  useEffect(() => {
    GetFollow(id).then(res => {
      setComments(res || []);
    })
  }, [visible]);

  const handleChange = e => {
    setCommentValuee(e.target.value);
  };

  const handleSubmit = () => {
    if (!commentValue) {
      return;
    }
    setIsSubmit(true);
    //提交评论 
    var postData = {
      leaseContractId: id,
      content: commentValue,
    };

    SaveFollow(postData).then(res => {
      setIsSubmit(false);
      setCommentValuee('');
      GetFollow(id).then(res => {
        setComments(res || []);
        reload();
      })
    });
    
  }

  // const CommentList = ({ comments }) => (
  //   <List
  //     dataSource={comments}
  //     header={`${comments.length} 回复`}
  //     itemLayout="horizontal"
  //     renderItem={props => < Comment {...props} />}
  //   />
  // );

  return (
    <div>
      {/* {comments.length > 0 && <CommentList comments={comments} />} */}
      {comments.length > 0 ?
        <List
          dataSource={comments}
          header={`${comments.length} 跟进`}
          itemLayout="horizontal"
          renderItem={props => < Comment {...props} />}
        /> : null}
      <Comment
        avatar={
          <Avatar
            src={`${localStorage.getItem('avatar')}`}
            alt={`${localStorage.getItem('name')}`}
          />
        }
        content={
          <div>
            <Form.Item>
              <TextArea rows={4} onChange={handleChange} value={commentValue} />
            </Form.Item>
            <Form.Item>
              <Button loading={isSubmit} onClick={handleSubmit} type="primary">
                跟进
            </Button>
            </Form.Item>
          </div>
        }
      />
    </div>
  );
}
export default CommentBox;
