import { ConnectFormProps } from '@/models/connect';
import { Button, Form, Input, message } from 'antd';
import { connect } from 'dva';
import React, { FormEvent, useState } from 'react';
import styles from './index.less';
import router from 'umi/router';
import { Link } from 'umi';
// import { delay } from 'lodash';
import { loginService } from '@/services/login';
const { Item: FormItem } = Form;
import md5 from 'blueimp-md5';

function Login(props: ConnectFormProps) {
  const { form, dispatch } = props;
  const { getFieldDecorator } = form;
  const [isLoading, setLoading] = useState<boolean>(false);
  const login = (e: FormEvent) => {
    e.preventDefault();
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true);
        values.password = md5(values.password);
        
        loginService(values).then(async ({ code, msg, data }) => {

          if (code === 200) {
            if (data == null) {
              message.error(msg);
            } else {
              //const { token, id } = data;
              message.success('登录成功');
              //localStorage.setItem('token', token);
              const { userid, name, avatar, report, organizeId,defaulturl } = data;
              //全局记录用户id,name,src头像
              localStorage.setItem('userid', userid);
              localStorage.setItem('name', name);
              // localStorage.setItem('usercode', usercode);
              localStorage.setItem('avatar', avatar);
              localStorage.setItem('organizeId', organizeId);//机构id
              localStorage.setItem('report', report);//服务端地址  
              // localStorage.setItem('unreadCount', unreadCount);//待办数量  

              dispatch!({ type: 'user/setCurrent', payload: data });
              await dispatch!({ type: 'auth/fetch' });
              // router.push('/dashboard'); 
              router.push(defaulturl); 
            } 
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
        {/* <FormItem label="产品编号" colon={false} required>
          {getFieldDecorator('usercode', {
            initialValue:localStorage.getItem('usercode'),
            rules: [{ required: true, message: '请输入产品编号' }],
          })(<Input size="large" placeholder="产品编号" allowClear />)}
        </FormItem>  */}
        <FormItem label="账号" colon={false} required>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(<Input size="large" placeholder="账号" allowClear />)}
        </FormItem>
        <FormItem label="密码" colon={false} required style={{ marginBottom: '25px' }}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(<Input.Password size="large" placeholder="密码" allowClear />)}
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
        
        {/* <Link className={styles.register} to="/register">
          注册账户
        </Link> */}

      </Form>
    </div>
  );
}

export default connect(({ UserModel }) => ({ UserModel }))(Form.create()(Login));
