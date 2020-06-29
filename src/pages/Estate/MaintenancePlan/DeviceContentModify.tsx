//编辑维保内容
import {  Card, message, TreeSelect, InputNumber, Select, Input, Row, Col, Form, Modal } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetTreeRoleJson, GetContents, SaveDeviceContentForm } from "./Main.service";
 
const { TextArea } = Input;
const { Option } = Select;
interface DeviceContentModifyProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  reload(): void;
  planDeviceId: any;
  data?: any;
}

const DeviceContentModify = (props: DeviceContentModifyProps) => {
  const { data, reload, visible, closeModal, form, planDeviceId } = props;
  const { getFieldDecorator } = form;
  var title = data === undefined ? '添加维保内容' : '修改维保内容';
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [treeData, setTreeData] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      GetContents().then(res => {
        setTreeData(res || []);
      });

      //巡检角色
      GetTreeRoleJson().then(res => {
        setRoles(res || []);
      });

      if (data) {
        setInfoDetail(data);
        if (data.unit == '月') {
          setIsYear(false);
        }

        form.resetFields();
      } else {
        setInfoDetail({});
        form.resetFields();
      }
    }
    else {
      form.resetFields();
    }
  }, [visible]);

  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = data ? { ...data, ...values } : values;
        newData.planDeviceId = planDeviceId; 
        SaveDeviceContentForm({ ...newData, keyvalue: newData.id }).then(res => {
          message.success('保存成功');
          closeModal();
          reload();
        });
      }
    });
  }

  const [isYear, setIsYear] = useState<boolean>(true);

  return (
    <Modal
      title={title}
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={save}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='580px'
    >
      <Card  hoverable>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="维保内容" required>
                {getFieldDecorator('contentId', {
                  initialValue: infoDetail.contentId,
                  rules: [{ required: true, message: '请选择维保内容' }],
                })(
                  <TreeSelect placeholder="请选择维保内容"
                    treeData={treeData}
                    allowClear
                    treeDefaultExpandAll
                    dropdownStyle={{ maxHeight: 400 }}
                  >
                  </TreeSelect>
                )}
              </Form.Item>
            </Col>

            <Col lg={12}>
              <Form.Item label="维保角色" required>
                {getFieldDecorator('roleId', {
                  initialValue: infoDetail.roleId,
                  rules: [{ required: true, message: "请选择维保角色" }]
                })(
                  <Select>
                    {roles.map(item => (
                      <Option key={item.value} value={item.value}>
                        {item.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col lg={8}>
              <Form.Item label="单位" required>
                {getFieldDecorator('unit', {
                  initialValue: infoDetail.unit == null ? '月' : infoDetail.unit
                })(
                  <Select
                    onChange={(value, option) => {
                      if (value == '年')
                        setIsYear(true);
                      else {
                        setIsYear(false);
                        // form.setFieldsValue({ frequency: 1 });
                      }
                    }}
                  >
                    <Option value='月'>月</Option>
                    <Option value='年'>年</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col lg={8}>
              <Form.Item label="开始" required>
                {getFieldDecorator('validityBegin', {
                  initialValue: infoDetail.validityBegin == null ? 1 : infoDetail.validityBegin,
                  rules: [{ required: true, message: '请输入开始' }],
                })(<InputNumber
                  placeholder="请输入开始"
                  style={{ width: '100%' }}
                  precision={0}
                  min={1} 
                />)}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="结束" required>
                {getFieldDecorator('validityEnd', {
                  initialValue: infoDetail.validityEnd == null ? 2 : infoDetail.validityEnd,
                  rules: [{ required: true, message: '请输入结束' }],
                })(<InputNumber
                  placeholder="请输入结束"
                  style={{ width: '100%' }}
                  precision={0}
                  min={2}
                  max={isYear ? 12 : 31}
                />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={24}>
              <Form.Item label="备注">
                {getFieldDecorator('memo', {
                  initialValue: infoDetail.memo,
                  // rules: [{ required: true, message: '请输入备注' }]
                })(<TextArea rows={5} placeholder="请输入备注" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Modal>
  );
};
export default Form.create<DeviceContentModifyProps>()(DeviceContentModify);

