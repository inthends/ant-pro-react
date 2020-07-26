//房态图点击进入，房产信息
import { Icon, Upload, Modal, Select, AutoComplete, Button, Card, Col, Drawer, Form, Input, Row, message, InputNumber } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { ExistEnCode, SaveForm } from './House.service';
import { GetCustomerInfo, CheckCustomer, GetCustomerList } from '../PStructUser/PStructUser.service';
import styles from './style.less';
const { TextArea } = Input;
const { Option } = Select;
import QuickModify from '../PStructUser/QuickModify';

interface RoomProps {
  modifyVisible: boolean;
  data?: any;
  form: WrappedFormUtils;
  organizeId: string;
  parentId: string;
  type?: number;
  closeDrawer(): void;
  reload(parentId, type): void;
};

const Room = (props: RoomProps) => {
  const { organizeId, parentId, type, modifyVisible, closeDrawer, form, data, reload } = props;
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [userSource, setUserSource] = useState<any[]>([]);
  //图片上传
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const title = data === undefined ? '添加' : '修改';
  let formLabel = '房间';
  // if (type != undefined) {
  //   if (type == 1) {
  //     formLabel = '楼栋';
  //   }
  //   else if (type == 2) {
  //     formLabel = '楼层';
  //   }
  //   else {
  //     formLabel = '房间';
  //   }
  // }
  // 打开抽屉时初始化
  // useEffect(() => {
  // }, []);

  const [userList, setUserList] = useState<any[]>([]);
  const [usertype, setUserType] = useState<any>(1);
  const [customerVisible, setCustomerVisible] = useState<boolean>(false);
  const [customer, setCustomer] = useState<any>();

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
        newData.isPublish = true;
        doSave(newData);
      }
    });
  };

  const doSave = dataDetail => {
    dataDetail.keyvalue = dataDetail.id;
    dataDetail.organizeId = organizeId;
    dataDetail.parentId = dataDetail.parentId ? dataDetail.parentId : parentId;
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
  // const handleSearch = value => {
  //   if (value == '')
  //     return;
  //   GetCustomerList(value, organizeId).then(res => {
  //     setUserSource(res || []);
  //   })
  // };

  const closeCustomerDrawer = () => {
    setCustomerVisible(false);
  };

  //业主
  const ownerSearch = value => {
    if (value == '') {
      setUserList([]);
    }
    else {
      setUserList([]);
      GetCustomerList(value, organizeId).then(res => {
        // setUserSource(res || []); 
        const list = res.map(item =>
          <Option key={item.id}
            value={item.name.trim()}>{item.name.trim()}
            <span className={styles.code}>{item.code}</span>
            <br></br>
            {item.phoneNum}
            <span className={styles.allName}>{item.allName}</span>
          </Option>
        ).concat([
          <Option disabled key="all" className={styles.addCustomer}>
            <a onClick={() => showCustomerDrawer('', 1)}>
              新增业主
            </a>
          </Option>]);//新增 
        setUserList(list);
      })
    }
  };

  const showCustomerDrawer = (customerId, type) => {

    if (customerId != '') {
      GetCustomerInfo(customerId).then(res => {
        setCustomer(res);
        setUserType(type);
        setCustomerVisible(true);
      })
    } else {
      setCustomerVisible(true);
    }
  };

  //住户
  const tenantSearch = value => {
    if (value == '') {
      setUserList([]);
    }
    else {
      setUserList([]);
      GetCustomerList(value, organizeId).then(res => {
        // setUserSource(res || []); 
        const list = res.map(item =>
          <Option key={item.id}
            value={item.name.trim()}>{item.name.trim()}
            <span className={styles.code}>{item.code}</span>
            <br></br>
            {item.phoneNum}
            <span className={styles.allName}>{item.allName}</span>
          </Option>
        ).concat([
          <Option disabled key="all" className={styles.addCustomer}>
            <a onClick={() => showCustomerDrawer('', 1)}>
              新增住户
            </a>
          </Option>]);//新增 
        setUserList(list);
      })
    }
  };


  const onOwnerSelect = (value, option) => {
    //props.children[1].props.children
    form.setFieldsValue({ ownerId: option.key });
    if (option.props.children.length == 2) {
      form.setFieldsValue({ ownerPhone: option.props.children[1].props.children });
    }
  };

  const onTenantSelect = (value, option) => {
    form.setFieldsValue({ tenantId: option.key });
    if (option.props.children.length == 2) {
      form.setFieldsValue({ tenantPhone: option.props.children[1].props.children });
    }
  };

  //验证用户
  const checkExist = (rule, value, callback) => {
    if (value == undefined || value == '') {
      callback();
    }
    else {
      CheckCustomer(organizeId, value).then(res => {
        if (res)
          callback('人员信息不存在，请先新增');
        else
          callback();
      })
    }
  };

  // const userList = userSource.map
  //   (item => <Option key={item.id} value={item.name}>{item.name}</Option>);

  // const onOwnerSelect = (value, option) => {
  //   form.setFieldsValue({ ownerId: option.key });
  // };

  // const onTenantSelect = (value, option) => {
  //   form.setFieldsValue({ tenantId: option.key });
  // };

  //验证编码是否重复
  const checkCodeExist = (rule, value, callback) => {
    if (value == undefined) {
      callback();
    }
    else {
      const keyvalue = infoDetail.id == undefined ? '' : infoDetail.id;
      ExistEnCode(keyvalue, value).then(res => {
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
      <Card className={styles.card} hoverable>
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
                        validator: checkCodeExist
                      }
                    ],
                  })(<Input placeholder="请输入编号" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="管家电话">
                  {getFieldDecorator('phoneNum', {
                    initialValue: infoDetail.phoneNum,
                  })(<Input placeholder="请输入管家电话" />)}
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
                      <Option value="多层">多层</Option>
                      <Option value="小高层">小高层</Option>
                      <Option value="高层">高层</Option>
                      <Option value="超高层">超高层</Option>
                      <Option value="联排别墅">联排别墅</Option>
                      <Option value="独栋别墅">独栋别墅</Option>
                      <Option value="叠加别墅">叠加别墅</Option>
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
                  <Form.Item label={infoDetail.ownerName ? <div>业主名称 <a onClick={() => { showCustomerDrawer(infoDetail.ownerId, 1) }}>编辑</a></div> : '业主名称'}>
                    {getFieldDecorator('ownerName', {
                      initialValue: infoDetail.ownerName,
                      rules: [{ required: false, message: '业主不存在，请先新增' }, { validator: checkExist }]
                    })(
                      <AutoComplete
                        dropdownClassName={styles.searchdropdown}
                        optionLabelProp="value"
                        dropdownMatchSelectWidth={false}
                        dataSource={userList}
                        style={{ width: '100%' }}
                        onSearch={ownerSearch}
                        placeholder="请输入业主名称"
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
                  <Form.Item label="业主电话">
                    {getFieldDecorator('ownerPhone', {
                      initialValue: infoDetail.ownerPhone,
                    })(
                      <Input placeholder="自动带出业主电话" readOnly />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            ) : null}

            {type == 4 || type == 5 ? (
              <Row gutter={24}> 
                <Col lg={12}>
                  <Form.Item label={infoDetail.tenantName ? <div>住户名称 <a onClick={() => { showCustomerDrawer(infoDetail.tenantId, 2) }}>编辑</a></div> : '住户名称'}>
                    {getFieldDecorator('tenantName', {
                      initialValue: infoDetail.tenantName,
                      rules: [{ required: false, message: '住户不存在，请先新增' }, { validator: checkExist }]
                    })(<AutoComplete
                      dropdownClassName={styles.searchdropdown}
                      optionLabelProp="value"
                      dropdownMatchSelectWidth={false}
                      dataSource={userList}
                      style={{ width: '100%' }}
                      onSearch={tenantSearch}
                      placeholder="请输入住户名称"
                      onSelect={onTenantSelect}
                    />)}
                    {getFieldDecorator('tenantId', {
                      initialValue: infoDetail.tenantId,
                    })(
                      <input type='hidden' />
                    )}
                  </Form.Item>
                </Col>

                <Col lg={12}>
                  <Form.Item label="住户电话">
                    {getFieldDecorator('tenantPhone', {
                      initialValue: infoDetail.tenantPhone,
                    })(<Input placeholder="自动带出住户电话" readOnly />)}
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
                    onRemove={handleRemove}>
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

      <QuickModify
        modifyVisible={customerVisible}
        closeDrawer={closeCustomerDrawer}
        data={customer}
        organizeId={organizeId}
        // type={usertype}
        reload={(customerId) => {
          GetCustomerInfo(customerId).then(res => {
            //防止旧数据缓存，清空下拉
            setUserList([]);
            if (usertype == 1) {
              //业主
              form.setFieldsValue({ ownerName: res.name });
              form.setFieldsValue({ ownerId: customerId });
              form.setFieldsValue({ ownerPhone: res.phoneNum });
            } else {
              //租户
              form.setFieldsValue({ tenantName: res.name });
              form.setFieldsValue({ tenantId: customerId });
              form.setFieldsValue({ tenantPhone: res.phoneNum });
            }
          });
        }
        }
      />

    </Drawer>
  );
};

export default Form.create<RoomProps>()(Room);

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
