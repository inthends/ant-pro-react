import { Button, Form, Input, Upload, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component, Fragment } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { CurrentUser } from '../data.d';
// import GeographicView from './GeographicView';
// import PhoneView from './PhoneView';
import styles from './BaseView.less';
import { saveCurrent } from './../service';

const FormItem = Form.Item;
// const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
// const AvatarView = ({ avatar }: { avatar: string }) => ( 

// const AvatarView = ({ current }: { current: any }) => ( 
//   <Fragment>
//     <div className={styles.avatar_title}>
//       <FormattedMessage id="account-settings.basic.avatar" defaultMessage="Avatar" />
//     </div>
//     <div className={styles.avatar}>
//       <img src={current.avatar} alt="avatar" />
//     </div>
//     <Upload
//       //fileList={[]} 
//       accept='image/*'
//       showUploadList={false}
//       action={process.env.basePath + '/Account/Upload'}
//       onChange={info => { 
//         if (info.file.status === 'done') {   
//         }
//       }}
//     >
//       <div className={styles.button_view}>
//         <Button icon="upload">
//           <FormattedMessage id="account-settings.basic.change-avatar" defaultMessage="Change avatar" />
//         </Button>
//       </div>
//     </Upload>
//   </Fragment>
// );

// interface SelectItem {
//   label: string;
//   key: string;
// }

// const validatorGeographic = (
//   _: any,
//   value: {
//     province: SelectItem;
//     city: SelectItem;
//   },
//   callback: (message?: string) => void,
// ) => {
//   const { province, city } = value;
//   if (!province.key) {
//     callback('Please input your province!');
//   }
//   if (!city.key) {
//     callback('Please input your city!');
//   }
//   callback();
// };

// const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
//   const values = value.split('-');
//   if (!values[0]) {
//     callback('Please input your area code!');
//   }
//   if (!values[1]) {
//     callback('Please input your phone number!');
//   }
//   callback();
// };

interface BaseViewProps extends FormComponentProps {
  currentUser: CurrentUser;
};

@connect(({ accountSettings }: { accountSettings: { currentUser: CurrentUser } }) => ({
  currentUser: accountSettings.currentUser,
}))

class BaseView extends Component<BaseViewProps> {
  view: HTMLDivElement | undefined = undefined;

  componentDidMount() {
    this.setBaseInfo();
  };

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
    }
  };

  getAvatarURL() {

    // const { currentUser } = this.props;
    // if (currentUser) {
    //   if (currentUser.avatar) {
    //     return currentUser.avatar;
    //   }
    //   //默认头像
    //   // const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    //   // return url;
    //   return '';
    // }
    // return '';
    const { form } = this.props;
    return form.getFieldValue('avatar');

  };

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handlerSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form, currentUser } = this.props;
    form.validateFields((errors, values) => {
      if (!errors) {  
        //save 
        saveCurrent({
          //...values,
          description: values.description,
          headImg: values.avatar,
          keyValue: currentUser.userid
        }
        ).then((res) => {
          message.success(formatMessage({ id: 'account-settings.basic.update.success' }));
        })
      } 
    });
  };

  setAvatar = (avatar) => {
    const { form } = this.props;
    form.setFieldsValue({ avatar: avatar });
  };


  render() {
    const { form: { getFieldDecorator } } = this.props; 
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label='用户名'>
              {getFieldDecorator('account', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'account-settings.basic.email-message' }, {}),
                  },
                ],
              })(<Input readOnly />)}
            </FormItem>
            <FormItem label='姓名'>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'account-settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input readOnly />)}
            </FormItem>
            <FormItem label='备注'>
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'account-settings.basic.profile-message' }, {}),
                  },
                ],
              })(
                <Input.TextArea
                  placeholder='备注'
                  rows={5}
                />,
              )}

              {getFieldDecorator('avatar', {
              })(
                <input type='hidden' />
              )}
            </FormItem>
            {/* <FormItem label={formatMessage({ id: 'account-settings.basic.country' })}>
              {getFieldDecorator('country', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'account-settings.basic.country-message' }, {}),
                  },
                ],
              })(
                <Select style={{ maxWidth: 220 }}>
                  <Option value="China">中国</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'account-settings.basic.geographic' })}>
              {getFieldDecorator('geographic', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'account-settings.basic.geographic-message' }, {}),
                  },
                  {
                    validator: validatorGeographic,
                  },
                ],
              })(<GeographicView />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'account-settings.basic.address' })}>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'account-settings.basic.address-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'account-settings.basic.phone' })}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'account-settings.basic.phone-message' }, {}),
                  },
                  { validator: validatorPhone },
                ],
              })(<PhoneView />)}
            </FormItem> */}
            <Button type="primary" onClick={this.handlerSubmit}>
              <FormattedMessage id="account-settings.basic.update" defaultMessage="Update Information" />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          {/* <AvatarView
            avatar={this.getAvatarURL()}
            current={this.props.currentUser}
          /> */}

          <Fragment>
            <div className={styles.avatar_title}>
              <FormattedMessage id="account-settings.basic.avatar" defaultMessage="Avatar" />
            </div>
            <div className={styles.avatar}>
              <img src={this.getAvatarURL()} alt="avatar" />
            </div>
            <Upload
              //fileList={[]} 
              accept='image/*'
              showUploadList={false}
              action={process.env.basePath + '/Account/Upload'}
              onChange={info => {
                if (info.file.status === 'done') {
                  this.setAvatar(info.file.response);
                }
              }}
            >
              <div className={styles.button_view}>
                <Button icon="upload">
                  <FormattedMessage id="account-settings.basic.change-avatar" defaultMessage="Change avatar" />
                </Button>
              </div>
            </Upload>
          </Fragment>


        </div>
      </div>
    );
  }
}

export default Form.create<BaseViewProps>()(BaseView);
