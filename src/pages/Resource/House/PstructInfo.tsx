//房产信息
import { Icon, Upload, Modal, Select, AutoComplete, Button, Card, Col, Drawer, Form, Input, Row, message, InputNumber } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { ExistEnCode, SaveForm, GetCustomerList } from './House.service';
import styles from './style.less';

const { TextArea } = Input;
const { Option } = AutoComplete;

interface PstructInfoProps {
  modifyVisible: boolean;
  data?: any;
  form: WrappedFormUtils;
  organizeId: string;
  parentId: string;
  type?: number;
  closeDrawer(): void;
  reload(parentId, type): void;
};

const PstructInfo = (props: PstructInfoProps) => {
  const { organizeId, parentId, type, modifyVisible, closeDrawer, form, data, reload } = props;
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [userSource, setUserSource] = useState<any[]>([]);
  //图片上传
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const title = data === undefined ? '添加' : '修改';
  let formLabel = '楼栋';
  if (type != undefined) {
    if (type == 1) {
      formLabel = '楼栋';
    }
    else if (type == 2) {
      formLabel = '楼层';
    }
    else {
      formLabel = '房间';
    }
  }

  // 打开抽屉时初始化
  useEffect(() => {
  }, []);


  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {
      if (data) {
        setInfoDetail(data);
        //加载图片
        let files: any[]; files = [];
        if (data.mainPic != null) {
          const filedate = {
            url: data.mainPic,
            uid: data.id//必须
          }
          files.push(filedate);
        }
        setFileList(files);
        //加载图片
        form.resetFields();
      } else {
        setInfoDetail({});
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  }, [modifyVisible]);


  const close = () => {
    closeDrawer();
  };

  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        //const newData = data ? { ...data.vendor, ...values } : values;
        const newData = data ? { ...data, ...values } : values;
        doSave(newData);
      }
    });
  };

  const doSave = dataDetail => {
    dataDetail.keyValue = dataDetail.id;
    dataDetail.organizeId = organizeId;
    dataDetail.parentId = parentId;
    //设置房产类型
    if (type == 1)
      dataDetail.type = 2;
    else if (type == 2)
      dataDetail.type = 4;
    else
      dataDetail.type = 5;
    SaveForm({ ...dataDetail }).then(res => {
      message.success('保存成功');
      closeDrawer();
      reload(parentId, type);
    });
  };

  // const getInfo = orgId => {
  //   if (orgId) {
  //     return GetFormInfoJson(orgId).then(res => {
  //       const { baseInfo, pProperty } = res || ({} as any);
  //       const info: any = {
  //         ...pProperty,
  //         ...baseInfo,
  //       };
  //       info.id = pProperty && pProperty.id;
  //       info.pStructId = baseInfo && baseInfo.id;
  //       info.area = pProperty!.area;
  //       return info;
  //     });
  //   } else {
  //     return Promise.resolve({
  //       parentId: 0,
  //       type: 1,
  //     });
  //   }
  // };

  //用户选择
  const handleSearch = value => {
    if (value == '')
      return;
    GetCustomerList(value, organizeId).then(res => {
      setUserSource(res || []);
    })
  };

  const userList = userSource.map
    (item => <Option key={item.id} value={item.name}>{item.name}</Option>);

  const onOwnerSelect = (value, option) => { 
    form.setFieldsValue({ ownerId: option.key });
  };

  const onTenantSelect = (value, option) => {
    form.setFieldsValue({ tenantId: option.key });
  };

  //验证编码是否重复
  const checkExist = (rule, value, callback) => {
    if (value == undefined) {
      callback();
    }
    else {
      const keyValue = infoDetail.id == undefined ? '' : infoDetail.id;
      ExistEnCode(keyValue, value).then(res => {
        if (res)
          callback('编号重复');
        else
          callback();
      })
    }
  };

  //图片上传begin
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">点击上传图片</div>
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
  const handleRemove = (file) => {
    // const fileid = file.fileid || file.response.fileid;
    // RemoveFile(fileid).then(res => {
    // });

    //清空图片
    form.setFieldsValue({ mainPic: '' });
  };

  //重新设置state
  const handleChange = ({ fileList }) => {
    setFileList([...fileList]);
    let url = '';
    if (fileList.length > 0)
      url = fileList[0].response;
    //设置项目图片 
    form.setFieldsValue({ mainPic: url });
  };
  //图片上传end

  return (
    <Drawer
      title={title + formLabel}
      placement="right"
      width={650}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Card className={styles.card} >
        {modifyVisible ? (
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="名称" required>
                  {getFieldDecorator('name', {
                    initialValue: infoDetail.name,
                    rules: [{ required: true, message: '请输入名称' }],
                  })(<Input placeholder="请输入名称" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="全称"  >
                  {getFieldDecorator('allName', {
                    initialValue: infoDetail.allName,
                  })(<Input readOnly placeholder="自动获取" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="编号" required>
                  {getFieldDecorator('code', {
                    initialValue: infoDetail.code,
                    rules: [
                      {
                        required: true,
                        message: '请输入编号'
                      },
                      {
                        validator: checkExist
                      }
                    ],
                  })(<Input placeholder="请输入编号" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('phoneNum', {
                    initialValue: infoDetail.phoneNum,
                  })(<Input placeholder="请输入联系电话" />)}
                </Form.Item>
              </Col>
            </Row>

            {type == 1 ? (
              <Row gutter={24}>
                <Col lg={8}>
                  <Form.Item label="占地面积(㎡)">
                    {getFieldDecorator('coverArea', {
                      initialValue: infoDetail.coverArea || 0,
                    })(<InputNumber placeholder="请输入占地面积" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label="建筑面积(㎡)">
                    {getFieldDecorator('area', {
                      initialValue: infoDetail.area || 0,
                    })(<InputNumber placeholder="请输入建筑面积" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label="产权面积(㎡)">
                    {getFieldDecorator('propertyArea', {
                      initialValue: infoDetail.propertyArea || 0,
                    })(<InputNumber placeholder="请输入产权面积" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
              </Row>) : type == 2 ?

                (<Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="建筑面积(㎡)">
                      {getFieldDecorator('area', {
                        initialValue: infoDetail.area || 0,
                      })(<InputNumber placeholder="请输入建筑面积" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="产权面积(㎡)">
                      {getFieldDecorator('propertyArea', {
                        initialValue: infoDetail.propertyArea || 0,
                      })(<InputNumber placeholder="请输入产权面积" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                </Row>) :
                (
                  <Row gutter={24}>
                    <Col lg={8}>
                      <Form.Item label="建筑面积(㎡)">
                        {getFieldDecorator('area', {
                          initialValue: infoDetail.area || 0,
                        })(<InputNumber placeholder="请输入建筑面积" style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>
                    <Col lg={8}>
                      <Form.Item label="产权面积(㎡)">
                        {getFieldDecorator('propertyArea', {
                          initialValue: infoDetail.propertyArea || 0,
                        })(<InputNumber placeholder="请输入产权面积" style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>
                    <Col lg={8}>
                      <Form.Item label="计费面积(㎡)">
                        {getFieldDecorator('billArea', {
                          initialValue: infoDetail.billArea || 0,
                        })(<InputNumber placeholder="请输入计费面积" style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                )
            }
            {type == 1 ? (<Row gutter={24}>
              <Col lg={8}>
                <Form.Item label="业态">
                  {getFieldDecorator('buildingFormat', {
                    initialValue: infoDetail.buildingFormat ? '多层' : infoDetail.buildingFormat,
                  })(
                    <Select>
                      <Option value="多层" >多层</Option>
                      <Option value="小高层">小高层</Option>
                      <Option value="高层" >高层</Option>
                      <Option value="超高层" >超高层</Option>
                      <Option value="联排别墅" >联排别墅</Option>
                      <Option value="独栋别墅" >独栋别墅</Option>
                      <Option value="叠加别墅" >叠加别墅</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>

              <Col lg={8}>
                <Form.Item label="经度">
                  {getFieldDecorator('lat', {
                    initialValue: infoDetail.lat,
                  })(<Input placeholder="请输入经度" />)}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="纬度">
                  {getFieldDecorator('lng', {
                    initialValue: infoDetail.lng,
                  })(<Input placeholder="请输入纬度" />)}
                </Form.Item>
              </Col>

            </Row>) : null}

            {type == 4 || type == 5 ? (
              <Row gutter={24}>
                <Col lg={12}>
                  <Form.Item label="业主">
                    {getFieldDecorator('ownerName', {
                      initialValue: infoDetail.ownerName,
                    })(
                      <AutoComplete
                        dataSource={userList}
                        style={{ width: '100%' }}
                        onSearch={handleSearch}
                        placeholder="请输入业主"
                        onSelect={onOwnerSelect}
                      />
                    )}
                    {getFieldDecorator('ownerId', {
                      initialValue: infoDetail.ownerId,
                    })(
                      <input type='hidden' />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item label="租户">
                    {getFieldDecorator('tenantName', {
                      initialValue: infoDetail.tenantName,
                    })(<AutoComplete
                      dataSource={userList}
                      style={{ width: '100%' }}
                      onSearch={handleSearch}
                      placeholder="请输入租户"
                      onSelect={onTenantSelect}
                    />)}
                    {getFieldDecorator('tenantId', {
                      initialValue: infoDetail.tenantId,
                    })(
                      <input type='hidden' />
                    )}
                  </Form.Item>
                </Col>
              </Row>) : null}

            <Row gutter={24}>
              <Col lg={24}>
                <Form.Item label="附加说明">
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo,
                  })(<TextArea rows={4} placeholder="请输入附加说明" />)}

                  {getFieldDecorator('mainPic', {
                    initialValue: infoDetail.mainPic,
                  })(
                    <input type='hidden' />
                  )}

                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col lg={24}>
                <div className="clearfix">
                  <Upload
                    accept='image/*'
                    action={process.env.basePath + '/PStructs/Upload'}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    onRemove={handleRemove}
                  >
                    {fileList.length > 1 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              </Col>
            </Row>

          </Form>
        ) : null}
      </Card>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={close} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={save} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<PstructInfoProps>()(PstructInfo);

// const renderTree = (treeData: TreeEntity[], parentId) => {
//   return treeData
//     .filter(item => item.parentId === parentId)
//     .map(filteditem => {
//       return (
//         <TreeNode title={filteditem.title} key={filteditem.key} value={filteditem.value} >
//           {renderTree(treeData, filteditem.key)}
//         </TreeNode>
//       );
//     });
// };
