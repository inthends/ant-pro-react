//废弃
import { Upload, Icon, DatePicker, Row, Col, Button, Form, Input, message, Select } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import React, { Component } from 'react';
// import Link from 'umi/link';
import router from 'umi/router';
import styles from './Register.less';
import { SaveForm } from './Register.service';
import moment from 'moment';
// const FormItem = Form.Item;
const { Option } = Select;
// const InputGroup = Input.Group;
const { TextArea } = Input;

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

interface RegisteroldStates {
  //confirmDirty: boolean;
  //visible: boolean;
  submitting: boolean;
  // help: string;
  fileList: any[];
  keyvalue: string;
}

interface RegisteroldProps {
  form: WrappedFormUtils;
}

class Registerold extends Component<RegisteroldProps, RegisteroldStates> {
  state = {
    //confirmDirty: false,
    //visible: false,
    submitting: false,
    // help: '',
    //add new
    fileList: [],
    keyvalue: ''
  };


  componentDidMount() {
    //初始化guid
    this.setState({ keyvalue: this.guid() });
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

  guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };


  handleSubmit = e => { 


    //router.push({ pathname: '/View', query: { keyvalue: this.state.keyvalue } });

    e.preventDefault();
    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        values.keyvalue = this.state.keyvalue;
        values.appDate = values.appDate.format('YYYY-MM-DD');
        SaveForm(values).then(res => {
          // if (res.code === '0') {
          message.success('注册成功');
          //查看结果
          router.push({ pathname: '/View', query: { keyvalue: this.state.keyvalue } });
          // }
        });
      }
    });
  };

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

    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { keyvalue, submitting, fileList } = this.state;

    const handleChange = ({ fileList }) => this.setState({ ...fileList });

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );




    return (

      <div className={styles.main} >
        <Row gutter={24}>
          <Col lg={1}></Col>
          <Col lg={5}>
            <div >
              <h3 style={{ color: 'green' }}>申请单位资质审核需要提供材料：</h3>
              <h4 style={{ color: 'green' }}>1、申请企业营业执照扫描件</h4>
              {/* <h4 style={{ color: 'green' }}>2、企业法人身份证</h4> */}
              <h4 style={{ color: 'green' }}>2、其他相关资料</h4>
              <br />
              <h3 style={{ color: 'green' }}>入住人员资质审核需要提供材料：</h3>
              <h4 style={{ color: 'green' }}>1、入住人员身份证</h4>
              <h4 style={{ color: 'green' }}>2、学历证明</h4>
              <h4 style={{ color: 'green' }}>3、劳动合同</h4>
              <h4 style={{ color: 'green' }}>4、获奖证书、荣誉证书</h4>
              <h4 style={{ color: 'green' }}>5、其他相关资料</h4>
              <br />
              <h3 style={{ color: 'green' }}>如果申请通过，下载打印两份合同，单位版需盖章。</h3>
              <h3 style={{ color: 'green' }}> 签约需携带材料：</h3>
              <h4 style={{ color: 'green' }}>  1、主申请人身份证原件；</h4>
              <h4 style={{ color: 'green' }}>  2、银行卡缴纳费用，押金（必须主申请人借记卡）</h4>
              <h4 style={{ color: 'green' }}>  3、注册时的手机绑定微信公众号；</h4>
              <h4 style={{ color: 'green' }}>  4、委托签约需提供委托书、双方身份证复印件（受委托人出示身份证原件）</h4>
            </div>
          </Col>

          <Col lg={12}>
            <h3 style={{ color: 'red' }} >请选择个人/单位，并填好相应的申请人信息</h3>
            <Form onSubmit={this.handleSubmit} layout="vertical" hideRequiredMark>

              <Row gutter={50}>
                <Col lg={12} >
                  <Form.Item required >
                    {getFieldDecorator('userType', {
                      rules: [{ required: true, message: '请选择类别' }]
                    })(
                      <Select placeholder="请选择类别"
                      >
                        <Option value="个人" key="1">
                          个人
                      </Option>
                        <Option value="单位" key="2">
                          单位
                      </Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>

                <Col lg={12}>
                  <Form.Item required>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入名称' }]
                    })(<Input placeholder="请输入名称" maxLength={50} />)}
                  </Form.Item>
                </Col>
              </Row>

              {form.getFieldValue('userType') === '个人' ?
                <>
                  <Row gutter={50}>
                    <Col lg={24}>
                      <Form.Item required>
                        {getFieldDecorator('workUnit', {
                          rules: [
                            {
                              required: true,
                              message: '请输入工作单位'
                            }
                          ]
                        })(<Input placeholder="请输入工作单位" maxLength={100} />)}
                      </Form.Item >
                    </Col>
                  </Row>
                  <Row gutter={50}>
                    <Col lg={12}>
                      <Form.Item required >
                        {getFieldDecorator('certificateType', {
                          rules: [{ required: true, message: '请选择证件类别' }]
                        })(
                          <Select placeholder="请选择证件类别">
                            <Option value="身份证" key="1">
                              身份证
                          </Option>
                            <Option value="护照" key="2">
                              护照
                          </Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item required>
                        {getFieldDecorator('certificateNO', {
                          rules: [{ required: true, message: '请输入证件号码' }]
                        })(<Input placeholder="请输入证件号码" maxLength={50} />)}
                      </Form.Item>
                    </Col>
                  </Row> </> :

                <Row gutter={50}>
                  <Col lg={12}>
                    <Form.Item required >
                      {getFieldDecorator('taxCode', {
                        rules: [{ required: true, message: '请输入组织机构代码' }]
                      })(
                        <Input placeholder="请输入组织机构代码" maxLength={50} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item required >
                      {getFieldDecorator('legal', {
                        rules: [{ required: true, message: '请输入法人代表' }]
                      })(<Input placeholder="请输入法人代表" maxLength={50} />)}
                    </Form.Item>
                  </Col>
                </Row>}

              <Row gutter={50}>
                <Col lg={12}>
                  <Form.Item required >
                    {getFieldDecorator('phoneNum', {
                      rules: [{ required: true, message: '请输入手机号码' }]
                    })(<Input placeholder="请输入手机号码" maxLength={11} />)}
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item required >
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
                    })(<Input placeholder="请输入电子邮箱" maxLength={50} />)}
                  </Form.Item >
                </Col>
              </Row>

              <Row gutter={50}>
                <Col lg={12}>
                  <Form.Item required >
                    {getFieldDecorator('appDate', {
                      initialValue: moment(new Date()),
                      rules: [{ required: true, message: '请选择申请日期' }]
                    })(<DatePicker style={{ width: '100%' }} placeholder="请选择申请日期" />)}
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item  >
                    {getFieldDecorator('fax', {
                    })(<Input placeholder="请输入传真号码" maxLength={50} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={50}>
                <Col lg={24}>
                  <Form.Item required>
                    {getFieldDecorator('address', {
                      rules: [
                        {
                          required: true,
                          message: '请输入联系地址',
                        }
                      ]
                    })(<Input placeholder="请输入联系地址" maxLength={500} />)}
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
                  <Form.Item >
                    {getFieldDecorator('memo', {
                    })(<TextArea rows={4} placeholder="请输入说明" />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col lg={24}>
                  <div className="clearfix">
                    <Upload
                      accept='image/*'
                      action={process.env.basePath + '/Apartment/Upload?keyvalue=' + keyvalue}
                      listType="picture-card"
                      fileList={fileList}
                      // onPreview={handlePreview}
                      onChange={handleChange}
                    // onRemove={handleRemove} 
                    >
                      {uploadButton}
                    </Upload>
                    {/* <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal> */}
                  </div>
                </Col>
              </Row>

              <Form.Item >
                <Button
                  size="large"
                  loading={submitting}
                  className={styles.submit}
                  type="primary"
                  htmlType="submit"
                >
                  注册
            </Button>
                {/* <Link className={styles.login} to="/login">
              使用已有账户登录
            </Link> */}
              </Form.Item >
            </Form >

          </Col>

          <Col lg={6}>
          </Col >
        </Row >
      </div >
    );
  }
}

export default Form.create()(Registerold);
