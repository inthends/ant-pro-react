import { Button, Form, Input, message, Popover, Progress } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import React, { Component } from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import styles from './Register.less';
import { register } from './Register.service';
import md5 from 'blueimp-md5';
const FormItem = Form.Item;
// const { Option } = Select;
// const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success' as 'success',
  pass: 'normal' as 'normal',
  poor: 'exception' as 'exception',
};

// @connect(({ register, loading }) => ({
//   register,
//   submitting: loading.effects['register/submit'],
// }))
interface RegisterStates {
  confirmDirty: boolean;
  visible: boolean;
  submitting: boolean;
  help: string;
}
interface RegisterProps {
  form: WrappedFormUtils;
}

class Register extends Component<RegisterProps, RegisterStates> {
  state = {
    confirmDirty: false,
    visible: false,
    submitting: false,
    help: '',
  };

  componentDidUpdate() { }

  componentWillUnmount() { }

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        // console.log(values);
        values.password = md5(values.password);
        register(values).then(res => {
          // if (res.code === '0') {
          message.success('注册成功');
          router.push('/login');
          // }
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配！');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: '请输入密码',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { help, visible, submitting } = this.state;
    return (
      <div className={styles.main}>
        <h3>注册</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输姓名',
                },
              ],
            })(<Input size="large" placeholder="姓名" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('account', {
              rules: [
                {
                  required: true,
                  message: '请输入登录账号',
                },
              ],
            })(<Input size="large" placeholder="登录账号" />)}
          </FormItem> 
          {/* <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: '请输入邮箱地址',
                },
                {
                  type: 'email',
                  message: '邮箱地址格式错误',
                },
              ],
            })(<Input size="large" placeholder="邮箱" />)}
          </FormItem> */}
          <FormItem help={help}>
            <Popover
              getPopupContainer={node => node.parentNode as HTMLElement}
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    请至少输入 6 个字符。请不要使用容易被猜到的密码。
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(<Input size="large" type="password" placeholder="至少6位密码，区分大小写" />)}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认密码',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder="确认密码" />)}
          </FormItem>
          {/* <FormItem>
            <InputGroup compact>
              {getFieldDecorator('telPrefix', {
                initialValue: '+86',
              })(
                <Select size="large" style={{ width: '20%' }}>
                  <Option value="+86">+86</Option>
                  <Option value="+87">+87</Option>
                </Select>,
              )}
              {getFieldDecorator('telephone', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号',
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: '手机号格式错误',
                  },
                ],
              })(<Input size="large" style={{ width: '80%' }} placeholder="手机号" />)}
            </InputGroup>
          </FormItem> */}
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              注册
            </Button>
            <Link className={styles.login} to="/login">
              使用已有账户登录
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Register);