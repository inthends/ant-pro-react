import { TreeEntity } from '@/model/models';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Tree,
  TreeSelect,
  message,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetFormInfoJson, GetProjectType, GetTreeAreaJson, SaveForm } from './House.service';
import styles from './style.less';

import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = Tree;

interface ModifyProps {
  modifyVisible: boolean;
  data?: any;
  form: WrappedFormUtils;
  organizeId: string;
  treeData: TreeEntity[];
  id?: string;
  closeDrawer(): void;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { treeData, modifyVisible, closeDrawer, form, organizeId, id, reload } = props;
  const { getFieldDecorator } = form;
  const title = id === undefined ? '添加项目' : '修改项目';
  const [pro, setPro] = useState<TreeEntity[]>([]);
  const [city, setCity] = useState<TreeEntity[]>([]);
  const [area, setArea] = useState<TreeEntity[]>([]);
  const [project, setProject] = useState<TreeEntity[]>([]);

  const [infoDetail, setInfoDetail] = useState<any>({});

  // 打开抽屉时初始化
  useEffect(() => {
    GetTreeAreaJson('100000').then(res => {
      setPro(res || []);
    });
    GetProjectType().then(res => {
      setProject(res || []);
    });
  }, []);

  const getCity = (areaId: string, init = false) => {
    GetTreeAreaJson(areaId).then(res => {
      setCity(res || []);
      if (!init) {
        form.setFieldsValue({ city: undefined });
      }
    });
  };
  const getArea = (areaId: string, init = false) => {
    GetTreeAreaJson(areaId).then(res => {
      setArea(res || []);
      if (!init) {
        form.setFieldsValue({ region: undefined });
      }
    });
  };

  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {
      if (id) {
        getInfo(id).then((tempInfo: any) => {
          if (tempInfo.province) {
            getCity(tempInfo.province, true);
          }
          if (tempInfo.city) {
            getArea(tempInfo.city, true);
          }
          setInfoDetail(tempInfo);
          form.resetFields();
        });
      } else {
        setInfoDetail({ organizeId });
        form.resetFields();
      }
    } else {
      form.setFieldsValue({});
    }
  }, [modifyVisible]);

  const close = () => {
    closeDrawer();
  };
  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        getInfo(id).then(tempInfo => {
          const newvalue = { ...values, date: values.date.format('YYYY-MM-DD') };
          SaveForm({ ...tempInfo, ...newvalue, keyValue: tempInfo.pStructId }).then(res => {
            message.success('保存成功');
            closeDrawer();
            reload();
          });
        });
      }
    });
  };
  const getInfo = orgId => {
    if (orgId) {
      return GetFormInfoJson(orgId).then(res => {
        const { baseInfo, pProperty } = res || ({} as any);
        const info: any = {
          ...pProperty,
          ...baseInfo,
        };
        info.id = pProperty && pProperty.id;
        info.pStructId = baseInfo && baseInfo.id;
        info.area = pProperty!.area;
        return info;
      });
    } else {
      return Promise.resolve({
        parentId: 0,
        type: 1,
      });
    }
  };
  return (
    <Drawer
      title={title}
      placement="right"
      width={600}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Card className={styles.card} >
        {modifyVisible ? (
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={24}>
              <Col lg={24}>
                <Form.Item label="隶属机构" required>
                  {getFieldDecorator('organizeId', {
                    initialValue: infoDetail.organizeId,
                    rules: [{ required: true, message: '请选择隶属机构' }],
                  })(
                    <TreeSelect placeholder="请选择隶属机构"
                      dropdownStyle={{ maxHeight: 400 }}
                      allowClear
                      treeDefaultExpandAll>
                      {renderTree(treeData, '0')}
                    </TreeSelect>,
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="小区编号" required>
                  {getFieldDecorator('code', {
                    initialValue: infoDetail.code,
                    rules: [{ required: true, message: '请输入小区编号' }],
                  })(<Input placeholder="请输入小区编号" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="小区名称" required>
                  {getFieldDecorator('name', {
                    initialValue: infoDetail.name,
                    rules: [{ required: true, message: '请输入小区名称' }],
                  })(<Input placeholder="请输入小区名称" />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col lg={24}>
                <Row gutter={24}>
                  <Col lg={8}>
                    <Form.Item label="所属省">
                      {getFieldDecorator('province', {
                        initialValue: infoDetail.province,
                      })(
                        <Select
                          showSearch
                          onChange={getCity}
                          filterOption={(input, option) =>
                            option.props.children.indexOf(input) >= 0
                          }
                        >
                          {pro.map(item => (
                            <Option key={item.value} value={item.value}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="所属市">
                      {getFieldDecorator('city', {
                        initialValue: infoDetail.city,
                      })(
                        <Select
                          showSearch
                          onChange={getArea}
                          filterOption={(input, option) =>
                            option.props.children.indexOf(input) >= 0
                          }
                        >
                          {city.map(item => (
                            <Option key={item.value} value={item.value}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="所属区/县">
                      {getFieldDecorator('region', {
                        initialValue: infoDetail.region,
                      })(
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.props.children.indexOf(input) >= 0
                          }
                        >
                          {area.map(item => (
                            <Option key={item.value} value={item.value}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={24}>
                <Form.Item label="详细地址">
                  {getFieldDecorator('address', {
                    initialValue: infoDetail.address,
                  })(<Input placeholder="请输入详细地址" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="环线">
                  {getFieldDecorator('cicleLine', {
                    initialValue: infoDetail.cicleLine,
                  })(<Input placeholder="请输入环线" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="地铁">
                  {getFieldDecorator('metro', {
                    initialValue: infoDetail.metro,
                  })(<Input placeholder="请输入地铁" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="经度">
                  {getFieldDecorator('lat', {
                    initialValue: infoDetail.lat,
                  })(<Input placeholder="请输入经度" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="纬度">
                  {getFieldDecorator('lng', {
                    initialValue: infoDetail.lng,
                  })(<Input placeholder="请输入纬度" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="总建筑面积(㎡)">
                  {console.log(infoDetail.area)}
                  {getFieldDecorator('area', {
                    initialValue: infoDetail.area || 0,
                  })(<Input placeholder="请输入总建筑面积" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="占地面积(㎡)">
                  {getFieldDecorator('coverArea', {
                    initialValue: infoDetail.coverArea || 0,
                  })(<Input placeholder="请输入占地面积" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="容积率">
                  {getFieldDecorator('volumeRate', {
                    initialValue: infoDetail.volumeRate || 0,
                  })(<Input placeholder="请输入容积率" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="绿化面积(㎡)">
                  {getFieldDecorator('greenRate', {
                    initialValue: infoDetail.greenRate || 0,
                  })(<Input placeholder="请输入绿化面积" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="项目类型">
                  {getFieldDecorator('propertyType', {
                    initialValue: infoDetail.propertyType,
                  })(
                    <Select placeholder="请选择项目类型">
                      {project.map(item => (
                        <Option key={item.key} >
                          {item.title}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col lg={12}>
                <Form.Item label="接盘日期">
                  {getFieldDecorator('date', {
                    initialValue: infoDetail.date
                      ? moment(new Date(infoDetail.date))
                      : moment(new Date()),
                  })(<DatePicker />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="开发商">
                  {getFieldDecorator('developerName', {
                    initialValue: infoDetail.developerName,
                  })(<Input placeholder="请输入开发商" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="建成年份">
                  {getFieldDecorator('createYear', { initialValue: infoDetail.createYear })(
                    <Input placeholder="请输入建成年份" />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="物业公司">
                  {getFieldDecorator('propertyCompany', {
                    initialValue: infoDetail.propertyCompany,
                  })(<Input placeholder="请输入物业公司" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="物业标准费">
                  {getFieldDecorator('feeItemRule', {
                    initialValue: infoDetail.feeItemRule,
                  })(<Input placeholder="请输入物业标准费" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={24}>
                <Form.Item label="附加说明">
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo,
                  })(<TextArea rows={4} placeholder="请输入附加说明" />)}
                </Form.Item>
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

export default Form.create<ModifyProps>()(Modify);

const renderTree = (treeData: TreeEntity[], parentId) => {
  return treeData
    .filter(item => item.parentId === parentId)
    .map(filteditem => {
      return (
        <TreeNode title={filteditem.title} key={filteditem.key} value={filteditem.value} >
          {renderTree(treeData, filteditem.key)}
        </TreeNode>
      );
    });
};
