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

const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = Tree;

interface ModifyProps {
  modifyVisible: boolean;
  data?: any;
  closeDrawer(): void;
  form: WrappedFormUtils;
  organizeId: string;
  treeData: TreeEntity[];
  id?: string;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { treeData, modifyVisible, data, closeDrawer, form, organizeId, id, reload } = props;
  const { getFieldDecorator } = form;
  const title = data === undefined ? '添加小区' : '修改小区';
  const [pro, setPro] = useState<TreeEntity[]>([]);
  const [city, setCity] = useState<TreeEntity[]>([]);
  const [area, setArea] = useState<TreeEntity[]>([]);
  const [project, setProject] = useState<TreeEntity[]>([]);

  // 打开抽屉时初始化
  useEffect(() => {
    GetTreeAreaJson('100000').then(res => {
      setPro(res || []);
    });
    GetProjectType().then(res => {
      setProject(res || []);
    });
  }, []);

  const getCity = (id: string, init = false) => {
    GetTreeAreaJson(id).then(res => {
      setCity(res || []);
      if (!init) {
        form.setFieldsValue({ city: undefined });
      }
    });
  };
  const getArea = (id: string, init = false) => {
    GetTreeAreaJson(id).then(res => {
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
        getInfo(id).then(tempInfo => {
          if (tempInfo.province) {
            getCity(tempInfo.province, true);
          }
          if (tempInfo.city) {
            getArea(tempInfo.city, true);
          }
          form.setFieldsValue(tempInfo);
        });
      } else {
        form.setFieldsValue({ organizeId });
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
        getInfo(id).then(tempInfo => {
          SaveForm({ ...tempInfo, ...values, keyValue: tempInfo.pStructId }).then(res => {
            message.success('保存成功');
            closeDrawer();
            reload();
          });
        });
      }
    });
  };
  const getInfo = id => {
    if (id) {
      return GetFormInfoJson(id).then(res => {
        const { baseInfo, pProperty } = res || {};
        let info = {
          ...pProperty,
          ...baseInfo,
        };
        info.id = pProperty && pProperty.id;
        info.pStructId = baseInfo && baseInfo.id;
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
      maskClosable={false}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Card title="基本信息" className={styles.card} bordered={false}>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="隶属机构" required>
                {getFieldDecorator('organizeId', {
                  rules: [{ required: true, message: '请选择隶属机构' }],
                })(
                  <TreeSelect placeholder="请选择隶属机构" allowClear treeDefaultExpandAll>
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
                  rules: [{ required: true, message: '请输入小区编号' }],
                })(<Input placeholder="请输入小区编号" />)}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="小区名称" required>
                {getFieldDecorator('name', {
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
                    {getFieldDecorator('province', {})(
                      <Select
                        showSearch
                        onChange={getCity}
                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                      >
                        {pro.map(item => (
                          <Option key={item.value} value={item.value}>
                            {item.text}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label="所属市">
                    {getFieldDecorator('city', {})(
                      <Select
                        showSearch
                        onChange={getArea}
                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                      >
                        {city.map(item => (
                          <Option key={item.value} value={item.value}>
                            {item.text}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label="所属区/县">
                    {getFieldDecorator('region', {})(
                      <Select
                        showSearch
                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                      >
                        {area.map(item => (
                          <Option key={item.value} value={item.value}>
                            {item.text}
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
                {getFieldDecorator('address', {})(<Input placeholder="请输入详细地址" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="环线">
                {getFieldDecorator('cicleLine', {})(<Input placeholder="请输入环线" />)}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="地铁">
                {getFieldDecorator('metro', {})(<Input placeholder="请输入地铁" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="经度">
                {getFieldDecorator('lat', {})(<Input placeholder="请输入经度" />)}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="纬度">
                {getFieldDecorator('lng', {})(<Input placeholder="请输入纬度" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="总建筑面积(㎡)">
                {getFieldDecorator('area', {})(<Input placeholder="请输入总建筑面积" />)}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="占地面积(㎡)">
                {getFieldDecorator('coverArea', {})(<Input placeholder="请输入占地面积" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="容积率(㎡)">
                {getFieldDecorator('volumeRate', {})(<Input placeholder="请输入容积率" />)}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="绿化面积(㎡)">
                {getFieldDecorator('greenRate', {})(<Input placeholder="请输入绿化面积" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="项目类型">
                {getFieldDecorator('propertyType', {})(
                  <Select>
                    {project.map(item => (
                      <Option key={item.value} value={item.value}>
                        {item.text}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="建成年份">
                {getFieldDecorator('createYear', {})(<DatePicker placeholder="请输入建成年份" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="开发商">
                {getFieldDecorator('developerName', {})(<Input placeholder="请输入开发商" />)}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="物业公司">
                {getFieldDecorator('propertyCompany', {})(<Input placeholder="请输入物业公司" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={24}>
              <Form.Item label="物业标准费">
                {getFieldDecorator('feeItemRule', {})(<Input placeholder="请输入物业标准费" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={24}>
              <Form.Item label="附加说明">
                {getFieldDecorator('memo', {})(
                  <TextArea rows={4} placeholder="请输入物业标准费" />,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
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

const renderTree = (treeData: TreeEntity[], parentId: string) => {
  return treeData
    .filter(item => item.parentId === parentId)
    .map(filteditem => {
      return (
        <TreeNode title={filteditem.text} key={filteditem.id} value={filteditem.id}>
          {renderTree(treeData, filteditem.id as string)}
        </TreeNode>
      );
    });
};
