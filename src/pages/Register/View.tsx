//注册成功之后查看
import { Upload, Row, Col, Form } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import React, { Component } from 'react';
// import Link from 'umi/link';
// import router from 'umi/router';
import styles from './Register.less';
import { GetFormInfoJson } from './Register.service';
// import moment from 'moment';
// const FormItem = Form.Item;
// const { Option } = Select;
// const InputGroup = Input.Group;
// const { TextArea } = Input;

// const passwordStatusMap = {
//   ok: <div className={styles.success}>强度：强</div>,
//   pass: <div className={styles.warning}>强度：中</div>,
//   poor: <div className={styles.error}>强度：太短</div>,
// };

// const passwordProgressMap = {
//   ok: 'success' as 'success',
//   pass: 'normal' as 'normal',
//   poor: 'exception' as 'exception',
// };

// @connect(({ register, loading }) => ({
//   register,
//   submitting: loading.effects['register/submit'],
// }))

interface ViewStates {
  //confirmDirty: boolean;
  //visible: boolean;
  //submitting: boolean;
  // help: string;
  fileList: any[];
  //keyvalue: string;
  infoDetail: any;
}

interface RegisterProps {
  form: WrappedFormUtils;
}

class View extends Component<RegisterProps, ViewStates> {
  state = {
    //confirmDirty: false,
    //visible: false,
    //submitting: false,
    // help: '',
    //add new
    fileList: [],
    //keyvalue: ''
    infoDetail: {}
  };

  componentDidMount() {
    //获取keyvalue
    //this.setState({ keyvalue: this.props.location.query.keyvalue });
    //get data
    var id = this.props.location.query.keyvalue;
    if (id) {
      GetFormInfoJson(id).then((res) => {
        //加载图片 
        if (res.info) {
          this.setState({ infoDetail: res.info, fileList: res.files });
        }
      });
    }
  }

  componentDidUpdate() {
  }

  componentWillUnmount() { }

  // getPasswordStatus = () => {
  //   const { form } = this.props;
  //   const value = form.getFieldValue('password');
  //   if (value && value.length > 9) {
  //     return 'ok';
  //   }
  //   if (value && value.length > 5) {
  //     return 'pass';
  //   }
  //   return 'poor';
  // };

  // guid = () => {
  //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  //     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  //     return v.toString(16);
  //   });
  // };


  // handleSubmit = e => {
  //   e.preventDefault();
  //   const { form } = this.props;
  //   form.validateFields({ force: true }, (err, values) => {
  //     if (!err) {
  //       values.keyvalue = this.state.keyvalue;
  //       values.appDate = values.appDate.format('YYYY-MM-DD'); 
  //       SaveForm(values).then(res => {
  //         // if (res.code === '0') {
  //         message.success('注册成功');
  //         router.push('/login');
  //         // }
  //       });
  //     }
  //   });
  //};

  // handleConfirmBlur = e => {
  //   const { value } = e.target;
  //   const { confirmDirty } = this.state;
  //   this.setState({ confirmDirty: confirmDirty || !!value });
  // };

  // checkConfirm = (rule, value, callback) => {
  //   const { form } = this.props;
  //   if (value && value !== form.getFieldValue('password')) {
  //     callback('两次输入的密码不匹配！');
  //   } else {
  //     callback();
  //   }
  // };

  // checkPassword = (rule, value, callback) => {
  //   const { visible, confirmDirty } = this.state;
  //   if (!value) {
  //     this.setState({
  //       help: '请输入密码！',
  //       visible: !!value,
  //     });
  //     callback('error');
  //   } else {
  //     this.setState({
  //       help: '',
  //     });
  //     if (!visible) {
  //       this.setState({
  //         visible: !!value,
  //       });
  //     }
  //     if (value.length < 6) {
  //       callback('error');
  //     } else {
  //       const { form } = this.props;
  //       if (value && confirmDirty) {
  //         form.validateFields(['confirm'], { force: true });
  //       }
  //       callback();
  //     }
  //   }
  // };

  // renderPasswordProgress = () => {
  //   const { form } = this.props;
  //   const value = form.getFieldValue('password');
  //   const passwordStatus = this.getPasswordStatus();
  //   return value && value.length ? (
  //     <div className={styles[`progress-${passwordStatus}`]}>
  //       <Progress
  //         status={passwordProgressMap[passwordStatus]}
  //         className={styles.progress}
  //         strokeWidth={6}
  //         percent={value.length * 10 > 100 ? 100 : value.length * 10}
  //         showInfo={false}
  //       />
  //     </div>
  //   ) : null;
  // };

  render() {

    // const { form } = this.props;
    // const { getFieldDecorator } = form;
    const { infoDetail, fileList } = this.state;

    // const handleChange = ({ fileList }) => this.setState({ ...fileList });

    // const uploadButton = (
    //   <div>
    //     <Icon type="plus" />
    //     <div className="ant-upload-text">上传</div>
    //   </div>
    // );

    return (
      <div  >
        <Row >
          <Col lg={8}>
          </Col >
          <Col lg={8}>
            <h3 style={{ color: 'green' }} >注册成功，下面是您的申请信息</h3>
            <Form layout='inline' hideRequiredMark>
              <Row gutter={4}>
              <Col lg={12}>
                  <Form.Item label='名称' >
                    {infoDetail.name}
                  </Form.Item>
                </Col>
                <Col lg={12} >
                  <Form.Item label='类别' >
                    {infoDetail.userType}
                  </Form.Item>
                </Col> 
              </Row>

              {infoDetail.userType === '个人' ?
                <>
                  <Row gutter={4}>
                    <Col lg={24}>
                      <Form.Item label='工作单位'  >
                        {infoDetail.workUnit}
                      </Form.Item >
                    </Col>
                  </Row>
                  <Row gutter={8}>
                    <Col lg={12}>
                      <Form.Item label='证件类别'  >
                        {infoDetail.certificateType}

                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label='证件号码'  >
                        {infoDetail.certificateNO}
                      </Form.Item>
                    </Col>
                  </Row> </> :

                <Row gutter={4}>
                  <Col lg={12}>
                    <Form.Item label='组织机构代码'  >
                      {infoDetail.taxCode}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label='法人代表'   >
                      {infoDetail.legal}

                    </Form.Item>
                  </Col>
                </Row>}

              <Row gutter={4}>
                <Col lg={12}>
                  <Form.Item label='手机号码'  >
                    {infoDetail.phoneNum}

                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item label='电子邮箱'  >
                    {infoDetail.email}

                  </Form.Item >
                </Col>
              </Row>

              <Row gutter={4}>
                <Col lg={12}>
                  <Form.Item label='申请日期'   >
                    {infoDetail.appDate}
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item label='传真号码'  >
                    {infoDetail.fax}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={4}>
                <Col lg={24}>
                  <Form.Item label='联系地址'  >
                    {infoDetail.address}

                  </Form.Item >
                </Col>
              </Row>

              {/* <Form.Item >
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: '请输姓名！',
                },
              ],
            })(<Input size="large" placeholder="姓名" />)}
          </Form.Item >

          <Form.Item  help={help}>
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
          </Form.Item >
          <Form.Item >
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认密码！',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder="确认密码" />)}
          </Form.Item > */}
              {/* <Form.Item >
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
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: '手机号格式错误！',
                  },
                ],
              })(<Input size="large" style={{ width: '80%' }} placeholder="手机号" />)}
            </InputGroup>
          </Form.Item > */}

              <Row >
                <Col lg={24}>
                  <Form.Item label='说明'>
                    {infoDetail.memo}
                  </Form.Item>
                </Col>
              </Row>

              <div className="clearfix">
                <Upload
                  accept='image/*'
                  action={process.env.basePath + '/Apartment/Upload?keyvalue='}
                  listType="picture-card"
                  fileList={fileList}
                  disabled={true}
                // onPreview={handlePreview}
                // onChange={handleChange}
                // onRemove={handleRemove} 
                >
                  {/* {uploadButton} */}
                </Upload>
                {/* <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal> */}
              </div>

            </Form >
          </Col>

          <Col lg={8}>
          </Col >
        </Row >
      </div >
    );
  }
}

export default Form.create()(View);
