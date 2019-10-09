
import { Input, Form, Comment, Avatar, List, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { GetCommunicates, SendCommunicate } from './Main.service';
const { TextArea } = Input;

interface CommentBoxProps {
  data?: any;
}

function CommentBox(props: CommentBoxProps) {
  const { data } = props;
  const [commentValue, setCommentValuee] = useState<string>('');
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [comments, setComments] = useState<any[]>([]);

  // 打开抽屉时初始化
  useEffect(() => {
    GetCommunicates(data.id).then(res => {
      setComments(res || []);
    })

  }, []);

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
      ServiceDeskId: data.id,
      Receiver: data.contactName,
      ReceiverCustId: data.custId,
      Content: commentValue,
      ComType: 'PC'
    };
    SendCommunicate(postData).then(res => {
      setIsSubmit(false);
      setCommentValuee('');
      GetCommunicates(data.id).then(res => {
        setComments(res || []);
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
          header={`${comments.length} 回复`}
          itemLayout="horizontal"
          renderItem={props => < Comment {...props} />}
        /> : null}

      <Comment
        avatar={
          <Avatar
            // src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
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
                回复
            </Button>
            </Form.Item>
          </div>
        }
      />
    </div>
  );
}
export default CommentBox;
