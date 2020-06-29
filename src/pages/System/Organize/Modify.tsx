import { BaseModifyProvider } from '@/components/BaseModifyDrawer/BaseModifyDrawer';
import ModifyItem, { SelectItem } from '@/components/BaseModifyDrawer/ModifyItem';
import { Icon, Upload, Col, Tabs, Card, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useState, useEffect } from 'react';
import { GetRoleListJson, SaveForm, searchUser, ExistEnCode } from './Organize.service';
import { GetOrgsWithNoGLC } from '@/services/commonItem';
import { TreeNode } from 'antd/lib/tree-select';
import styles from './style.less';
const { TabPane } = Tabs;

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { data, form, visible } = props;
  const { getFieldDecorator } = form;
  const [managers, setManagers] = useState<SelectItem[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  // const [types, setTypes] = useState<SelectItem[]>([
  //   {
  //     label: '集团',
  //     value: 'A',
  //   },
  //   {
  //     label: '区域',
  //     value: 'B',
  //   },
  //   {
  //     label: '公司',
  //     value: 'C',
  //   },
  //   {
  //     label: '管理处',
  //     value: 'D',
  //   },
  // ]);
  const [orgs, setOrgs] = useState<TreeNode[]>();
  let initData = data ? data : { enabledMark: 1 };
  const [fileList, setFileList] = useState<any[]>([]);

  // initData.expDate = initData.expDate ? initData.expDate : new Date();
  const baseFormProps = { form, initData };
  useEffect(() => {
    // getTypes();
    searchManager('');
    // getOrgs(); 
    GetOrgsWithNoGLC().then(res => {
      setOrgs(res);
    });

    //角色
    GetRoleListJson().then(res => {
      setRoles(res || []);
    });

    //加载图片
    let files: any[]; files = [];
    if (initData != null && initData.stampUrl != null) {
      const filedate = {
        url: data.stampUrl,
        uid: data.organizeId//必须
      }
      files.push(filedate);
    }
    setFileList(files);

  }, [visible]);


  const [posType, setPosType] = useState<string>('拉卡拉');

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyvalue: initData.organizeId };
    if (modifyData.foundedTime != null)
      modifyData.foundedTime = modifyData.foundedTime.format('YYYY-MM-DD');
    //return SaveForm(modifyData);

    return SaveForm(modifyData).then(() => {
      GetOrgsWithNoGLC().then(res => {
        setOrgs(res);
      });
    })
  };

  const searchManager = value => {
    searchUser(value).then(res => {
      const users = res.map(item => {
        return {
          label: item.name,
          value: item.name,
        };
      });
      setManagers(users);
    });
  };

  // const getTypes = () => {
  //   searchTypes().then(res => {
  //     const temp = res.map(item => {
  //       return {
  //         label: item.title,
  //         value: item.key,
  //       };
  //     });
  //     setTypes(temp);
  //   });
  // };

  // const getOrgs = () => {
  //   GetOrgs().then(res => {
  //     setOrgs(res);
  //   });
  // };

  const checkExist = (rule, value, callback) => {
    if (value == undefined) {
      callback();
    }
    else {
      const keyvalue = initData.organizeId == undefined ? '' : initData.organizeId;
      ExistEnCode(keyvalue, value).then(res => {
        if (res)
          callback('机构编号重复');
        else
          callback();
      })
    }
  };

  //设置负责人
  const onSelect = (value, option) => {
    form.setFieldsValue({ chargeLeaderId: option.key });
  };


  //图片上传
  const handleRemove = (file) => {
    // const fileid = file.fileid || file.response.fileid;
    // RemoveFile(fileid).then(res => {
    // }); 
    //清空
    form.setFieldsValue({ stampUrl: '' });
  };

  //重新设置state
  const handleChange = ({ fileList }) => {
    setFileList([...fileList]);
    let url = '';
    if (fileList.length > 0)
      url = fileList[0].response;
    //设置
    form.setFieldsValue({ stampUrl: url });
  };

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">点击上传印章<br />小于400像素</div>
    </div>
  );

  return (
    <BaseModifyProvider {...props} name="机构" save={doSave} width={800} >
      <Form layout="vertical" hideRequiredMark >
        <Tabs defaultActiveKey="1" >
          <TabPane tab="基本信息" key="1">
            <Card hoverable className={styles.card}  >
              <Row gutter={24} hidden={initData.parentId == 0 ? true : false} >
                <ModifyItem
                  {...baseFormProps}
                  field="parentId"
                  label="隶属上级"
                  type="tree"
                  treeData={orgs}
                  disabled={initData.organizeId != undefined}
                  rules={[{ required: true, message: '请选择隶属上级' }]}
                ></ModifyItem>
                <ModifyItem
                  {...baseFormProps}
                  field="category"
                  label="类型"
                  type="select"
                  disabled={initData.parentId === '0'}
                  items={[
                    {
                      title: '集团',
                      label: '集团',
                      value: 'A',
                    },
                    {
                      title: '区域',
                      label: '区域',
                      value: 'B',
                    },
                    {
                      title: '公司',
                      label: '公司',
                      value: 'C',
                    },
                    {
                      title: '管理处',
                      label: '管理处',
                      value: 'D',
                    },
                  ]}
                  rules={[{ required: true, message: '请选择类型' }]}
                ></ModifyItem>
              </Row>

              <Row gutter={24}>
                <ModifyItem
                  {...baseFormProps}
                  field="fullName"
                  label="机构名称"
                  rules={[{ required: true, message: '请输入机构名称' }]}
                ></ModifyItem>
                <ModifyItem
                  {...baseFormProps}
                  field="enCode"
                  label="机构编号"
                  rules={[{ required: true, message: '请输入机构编号' },
                  {
                    validator: checkExist
                  }
                  ]}
                ></ModifyItem>
              </Row>

              <Row gutter={24}>
                <ModifyItem
                  {...baseFormProps}
                  field="chargeLeader"
                  label="负责人"
                  type="autoComplete"
                  onSearch={searchManager}
                  items={managers}
                  onSelect={onSelect}
                ></ModifyItem>

                {getFieldDecorator('chargeLeaderId', {
                  initialValue: initData.chargeLeaderId,
                })(
                  <input type='hidden' />
                )}
                <ModifyItem
                  {...baseFormProps}
                  field="foundedTime"
                  label="成立时间"
                  type="date"
                ></ModifyItem>
              </Row>
              <Row gutter={24}>
                <ModifyItem {...baseFormProps} field="phoneNum" label="联系电话"></ModifyItem>
                <ModifyItem {...baseFormProps} field="fax" label="传真"></ModifyItem>
              </Row>

              <Row gutter={24}>
                <ModifyItem
                  {...baseFormProps}
                  // wholeLine={true}
                  lg={24}
                  type="textarea"
                  field="description"
                  label="备注"
                ></ModifyItem>
              </Row>

              <Row gutter={24}>
                <Col lg={24}>
                  <div className="clearfix">
                    <Upload
                      accept='image/*'
                      action={process.env.basePath + '/Organize/Upload'}
                      fileList={fileList}
                      listType="picture-card"
                      onChange={handleChange}
                      onRemove={handleRemove}
                    >
                      {fileList.length > 0 ? null : uploadButton}
                    </Upload>
                  </div>
                  {getFieldDecorator('stampUrl', {
                    initialValue: initData.stampUrl,
                  })(
                    <input type='hidden' />
                  )}
                </Col>
              </Row>
            </Card>
          </TabPane>

          <TabPane tab="支付设置" key="2">
            <Card hoverable>
              <Row gutter={24}>
                <ModifyItem  {...baseFormProps}
                  field="posType"
                  label="POS机类型"
                  type="select"
                  rules={[{ required: true, message: '请选择POS机类型' }]}
                  items={
                    [
                      {
                        title: '拉卡拉',
                        label: '拉卡拉',
                        value: '拉卡拉',
                      },
                      {
                        title: '银盛',
                        label: '银盛',
                        value: '银盛',
                      }
                    ]}
                  onChange={(value, option) => {
                    setPosType(value);
                  }}
                ></ModifyItem>
              </Row>
              {posType == '拉卡拉' ?
                (<>
                  <Row gutter={24}>
                    <ModifyItem  {...baseFormProps} field="lklMchId" label="拉卡拉商户号"></ModifyItem>
                    <ModifyItem  {...baseFormProps} field="lklMchName" label="拉卡拉商户名称"></ModifyItem>
                  </Row>
                  <Row gutter={24}>
                    <ModifyItem  {...baseFormProps} field="swiftMchId" label="威富通商户号"></ModifyItem>
                    <ModifyItem  {...baseFormProps} field="swiftMchName" label="威富通商户名称"></ModifyItem>
                  </Row>
                  <Row gutter={24}>
                    <ModifyItem {...baseFormProps} field="swiftPlatPublicKey" label="威富通平台公钥"></ModifyItem>
                    <ModifyItem {...baseFormProps} field="swiftMchPrivateKey" label="威富通私钥"></ModifyItem>
                  </Row>
                </>
                )
                : (<><Row gutter={24}>
                  <ModifyItem  {...baseFormProps} field="yseMchId" label="银盛商户号"></ModifyItem>
                  <ModifyItem  {...baseFormProps} field="yseMchName" label="银盛商户名称"></ModifyItem>
                </Row>
                </>
                )}
              {/* <Row gutter={24}> 
           <ModifyItem {...baseFormProps} field="lklPlatPublicKey" label="拉卡拉公钥"></ModifyItem> 
            <ModifyItem {...baseFormProps} field="lklMchPrivateKey" label="拉卡拉私钥"></ModifyItem>
          </Row>*/}
            </Card>
          </TabPane>

          <TabPane tab="服务单设置" key="3">
            <Card

              title='派单逾期设置'
              hoverable className={styles.cardsmall}>


              <Row gutter={24}>
                <ModifyItem
                  {...baseFormProps}
                  field="dispatchTime"
                  label="派单逾期(分)"
                  type='inputNumber'
                  lg={6}
                ></ModifyItem>
                <ModifyItem
                  {...baseFormProps}
                  field="dispatchRoleA"
                  label="派单逾期一级上报"
                  type="select"
                  lg={6}
                  items={roles}
                ></ModifyItem>
                <ModifyItem
                  {...baseFormProps}
                  field="dispatchRoleB"
                  label="派单逾期二级上报"
                  type="select"
                  lg={6}
                  items={roles}
                ></ModifyItem>

                <ModifyItem
                  {...baseFormProps}
                  field="dispatchRoleC"
                  label="派单逾期三级上报"
                  type="select"
                  lg={6}
                  items={roles}
                ></ModifyItem>
              </Row>
            </Card>
            <Card

              title='接单逾期设置'
              hoverable className={styles.cardsmall}>

              <Row gutter={24}>
                <ModifyItem
                  {...baseFormProps}
                  field="receiveTime"
                  label="接单逾期(分)"
                  type="inputNumber"
                  lg={6}
                ></ModifyItem>
                <ModifyItem
                  {...baseFormProps}
                  field="receiveRoleA"
                  label="接单逾期一级上报"
                  type="select"
                  lg={6}
                  items={roles}
                ></ModifyItem>
                <ModifyItem
                  {...baseFormProps}
                  field="receiveRoleB"
                  label="接单逾期二级上报"
                  type="select"
                  lg={6}
                  items={roles}
                ></ModifyItem>

                <ModifyItem
                  {...baseFormProps}
                  field="receiveRoleC"
                  label="接单逾期三级上报"
                  type="select"
                  lg={6}
                  items={roles}
                ></ModifyItem>
              </Row>
            </Card>
            <Card
              title='完成逾期设置'
              hoverable className={styles.card}>

              <Row gutter={24}>
                <ModifyItem
                  {...baseFormProps}
                  field="handleTime"
                  label="完成逾期(分)"
                  type="inputNumber"
                  lg={8}
                ></ModifyItem>
                <ModifyItem
                  {...baseFormProps}
                  field="handleRoleA"
                  label="完成逾期一级上报"
                  type="select"
                  lg={8}
                  items={roles}
                ></ModifyItem>
                <ModifyItem
                  {...baseFormProps}
                  field="handleRoleB"
                  label="完成逾期二级上报"
                  type="select"
                  lg={8}
                  items={roles}
                ></ModifyItem>
              </Row>

              <Row gutter={24}>
                <ModifyItem
                  {...baseFormProps}
                  field="handleRoleC"
                  label="完成逾期三级上报"
                  type="select"
                  lg={8}
                  items={roles}
                ></ModifyItem>
                <ModifyItem
                  {...baseFormProps}
                  field="handleRoleD"
                  label="完成逾期四级上报"
                  type="select"
                  lg={8}
                  items={roles}
                ></ModifyItem>
                <ModifyItem
                  {...baseFormProps}
                  field="handleRoleE"
                  label="完成逾期五级上报"
                  type="select"
                  lg={8}
                  items={roles}
                ></ModifyItem>

              </Row>
            </Card>
          </TabPane>

        </Tabs>
      </Form>

    </BaseModifyProvider >
  );
};

export default Form.create<ModifyProps>()(Modify);