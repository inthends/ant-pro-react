import { ConnectFormProps } from '@/models/connect';
import { Button, Form, Input, message } from 'antd';
import { connect } from 'dva';
import React, { FormEvent, useState } from 'react';
import styles from './index.less';
import router from 'umi/router';
import { delay } from 'lodash';
import { loginService } from '@/services/login';

const { Item: FormItem } = Form;

function Login(props: ConnectFormProps) {
  const { form, dispatch } = props;
  const { getFieldDecorator } = form;

  const [isLoading, setLoading] = useState<boolean>(false);
  const login = (e: FormEvent) => {
    e.preventDefault();
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true);
        loginService(values)
          .then(({ code, msg, data }) => {
            if (code === 200) {
              //console.log(data); 
              //const { token, id } = data;
              message.success('登陆成功');
              //localStorage.setItem('token', token);
              const { userid } = data;
              localStorage.setItem('userid', userid);
              delay(() => {
                // router.push('/resource');
                router.push('/dashboard');
              }, 500);
              dispatch!({ type: 'user/setCurrent', payload: data });
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };
  return (
    <div className={styles.main}>
      <Form onSubmit={login} hideRequiredMark>
        <FormItem label="账号" colon={false} required>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名' }],  
          })(<Input size="large" placeholder="账号" allowClear />)}
        </FormItem>
        <FormItem label="密码" colon={false} required>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],  
          })(
            <Input.Password size="large" placeholder="密码" allowClear />,
          )}
        </FormItem>
        <FormItem>
          <Button
            size="large"
            style={{ width: '100%' }}
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            登录
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

export default connect(({ UserModel }) => ({ UserModel }))(Form.create()(Login));
