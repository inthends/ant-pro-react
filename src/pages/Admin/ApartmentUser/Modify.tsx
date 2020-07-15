
import {
  Modal, message, Icon, Upload, Select, Input, Divider, PageHeader,
  Drawer, Col, Button, Card, Form, Row
} from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { RemoveFile, SaveForm, GetFilesData } from "./Apartment.service";
import styles from './style.less';
const { Option } = Select;
const { TextArea } = Input;
interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
};

const Modify = (props: ModifyProps) => {
  const { reload, form, data, closeDrawer, visible } = props;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const { getFieldDecorator } = form;
  //打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (data) {
        //获取明细
        setInfoDetail(data);
        GetFilesData(data.id).then(res => {
          setFileList(res || []);
        });
      }
    }
  }, [visible]);


  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = infoDetail ? { ...infoDetail, ...values } : values;
        //doSave(newData);
        //newData.keyvalue = newData.id;
        SaveForm({ ...newData, keyvalue: newData.id }).then(res => {
          message.success('修改成功');
          closeDrawer();
          reload();
        });
      }
    });
  };

//图片上传
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">上传</div>
    </div>
  );
 
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleCancel = () => setPreviewVisible(false);
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleChange = ({ fileList }) => setFileList([...fileList]);

  const handleRemove = (file) => {
    const fileid = file.fileid || file.response.fileid;
    RemoveFile(fileid).then(res => {
    });
  };

  return (
    <Drawer
      title='企业资料'
      placement="right"
      width={780}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }} >
      <Form layout='vertical' hideRequiredMark >
        <PageHeader
          ghost={false}
          title={null}
          subTitle={
            <div>
              <label style={{ color: '#4494f0', fontSize: '24px' }}>{infoDetail.name}</label>
            </div>
          }
          style={{
            border: '1px solid rgb(235, 237, 240)'
          }}
        // extra={[<img src={infoDetail.headImgUrl}></img>]}
        >

        </PageHeader>
        <Divider dashed />
        <Card className={styles.card} hoverable>
          <Row gutter={24}>
            <Col lg={12} >
              <Form.Item label='类别' required >
                {getFieldDecorator('userType', {
                  initialValue: infoDetail.userType,
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
              <Form.Item label='名称' required>
                {getFieldDecorator('name', {
                  initialValue: infoDetail.name,
                  rules: [{ required: true, message: '请输入名称' }]
                })(<Input placeholder="请输入名称" maxLength={50} />)}
              </Form.Item>
            </Col>
          </Row>

          {form.getFieldValue('userType') === '个人' ?
            <>

              <Row gutter={24}>
                <Col lg={12}>
                  <Form.Item label='证件类别' required >
                    {getFieldDecorator('certificateType', {
                      initialValue: infoDetail.certificateType,
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
                  <Form.Item label='证件号码' required>
                    {getFieldDecorator('certificateNO', {
                      initialValue: infoDetail.certificateNO,
                      rules: [{ required: true, message: '请输入证件号码' }]
                    })(<Input placeholder="请输入证件号码" maxLength={50} />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col lg={24}>
                  <Form.Item label='工作单位' required>
                    {getFieldDecorator('workUnit', {
                      initialValue: infoDetail.workUnit,
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
            </> :

            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label='统一信用代码' required >
                  {getFieldDecorator('taxCode', {
                    initialValue: infoDetail.taxCode,
                    rules: [{ required: true, message: '请输入统一信用代码' }]
                  })(
                    <Input placeholder="请输入统一信用代码" maxLength={50} />
                  )}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label='法人代表' required >
                  {getFieldDecorator('legal', {
                    initialValue: infoDetail.legal,
                    rules: [{ required: true, message: '请输入法人代表' }]
                  })(<Input placeholder="请输入法人代表" maxLength={50} />)}
                </Form.Item>
              </Col>
            </Row>}

          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label='手机号码' required >
                {getFieldDecorator('phoneNum', {
                  initialValue: infoDetail.phoneNum,
                  rules: [{ required: true, message: '请输入手机号码' }]
                })(<Input placeholder="请输入手机号码" maxLength={11} />)}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label='邮箱地址' required >
                {getFieldDecorator('email', {
                  initialValue: infoDetail.email,
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

          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label='联系人'   >
                {getFieldDecorator('linkMan', {
                  initialValue: infoDetail.linkMan,
                  //rules: [{ required: true, message: '请输入联系人' }]
                })(<Input placeholder="请输入联系人" maxLength={11} />)}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label='联系电话'   >
                {getFieldDecorator('linkTel', {
                  initialValue: infoDetail.linkTel,
                  //rules: [ { required: true,  message: '请输入联系电话',  }],
                })(<Input placeholder="请输入联系电话" maxLength={50} />)}
              </Form.Item >
            </Col>
          </Row>

          <Row>
            <Col lg={24}>
              <Form.Item label='联系地址' required>
                {getFieldDecorator('address', {
                  initialValue: infoDetail.address,
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

          <Row>
            <Col lg={24}>
              <Form.Item label='说明' >
                {getFieldDecorator('memo', {
                  initialValue: infoDetail.memo,
                })(<TextArea rows={4} placeholder="请输入说明" />)}
              </Form.Item>
            </Col>
          </Row>

          <div className="clearfix"> 
            <Upload
              accept='image/*'
              action={process.env.basePath + '/Apartment/Upload?keyvalue=' + infoDetail.id}
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              onRemove={handleRemove}
            >
              {uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            请上传证件照片
          </div>
        </Card>
      </Form>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          zIndex: 999,
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button style={{ marginRight: 8 }}
          onClick={closeDrawer}  >
          关闭
        </Button>

        <Button type="primary"
          onClick={onSave}
        >
          提交
        </Button>
      </div>
    </Drawer>

  );
};

export default Form.create<ModifyProps>()(Modify);
