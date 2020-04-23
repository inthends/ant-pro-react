//编辑巡检内容
import { TimePicker, Card, message, TreeSelect, InputNumber, Select, Input, Row, Col, Form, Modal } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetTreeRoleJson, GetContents, SavePointContentForm } from "./Main.service";
import moment from 'moment';
const { TextArea } = Input;
const { Option } = Select;
interface PointContentModifyProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  reload(): void;
  lpId: any;
  data?: any;
}

const PointContentModify = (props: PointContentModifyProps) => {
  const { data, reload, visible, closeModal, form, lpId } = props;
  const { getFieldDecorator } = form;
  var title = data === undefined ? '添加巡检内容' : '修改巡检内容';
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
        newData.lpId = lpId;
        newData.planTime = newData.planTime.format('HH:mm');
        newData.beginTime = newData.beginTime.format('HH:mm');
        newData.endTime = newData.endTime.format('HH:mm');
        SavePointContentForm({ ...newData, keyValue: newData.id }).then(res => {
          message.success('保存成功');
          closeModal();
          reload();
        });
      }
    });
  }

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
      <Card>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="巡检内容" required>
                {getFieldDecorator('contentId', {
                  initialValue: infoDetail.contentId,
                  rules: [{ required: true, message: '请选择巡检内容' }],
                })(
                  <TreeSelect placeholder="请选择巡检内容"
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
              <Form.Item label="巡检角色" required>
                {getFieldDecorator('roleId', {
                  initialValue: infoDetail.roleId,
                  rules: [{ required: true, message: "请选择巡检角色" }]
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
          {/* <Row gutter={24}>
            <Col lg={8}>
              <Form.Item label="频次" required>
                {getFieldDecorator('unitNum', {
                  initialValue: infoDetail.unitNum ? infoDetail.unitNum : 1,
                  rules: [{ required: true, message: '请输入频次' }],
                })(<InputNumber
                  placeholder="请输入频次"
                  style={{ width: '100%' }}
                  precision={0}
                  min={1}
                />)}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="单位" required>
                {getFieldDecorator('unit', {
                  initialValue: infoDetail.unit === undefined ? '月' : infoDetail.unit
                })(
                  <Select>
                    <Option value="天">天</Option>  
                    <Option value="周">周</Option>
                    <Option value="月">月</Option> 
                    <Option value="季">季</Option>
                    <Option value="年">年</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="次数" required>
                {getFieldDecorator('frequency', {
                  initialValue: infoDetail.frequency ? infoDetail.frequency : 1,
                  rules: [{ required: true, message: '请输入次数' }],
                })(<InputNumber
                  placeholder="请输入次数"
                  style={{ width: '100%' }}
                  precision={0}
                  min={1}
                />)}
              </Form.Item>
            </Col>
          </Row> */}

          <Row gutter={24}>
            <Col lg={8}>
              <Form.Item label="执行频率" required>
                {getFieldDecorator('frequency', {
                  initialValue: infoDetail.frequency == null ? 1 : infoDetail.frequency
                })(
                  <Select>
                    <Option value={1}>每天执行</Option>
                    <Option value={2}>每1小时执行</Option>
                    <Option value={3}>每2小时执行</Option> 
                    <Option value={4}>每月执行</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col lg={8}>
              <Form.Item label="计划时间" required>
                {getFieldDecorator('planTime', {
                  initialValue: infoDetail.planTime == null ? infoDetail.planTime : moment('9:00', 'HH:mm'),
                  rules: [{ required: true, message: '请输入计划时间' }],
                })(<TimePicker
                  placeholder="请输入计划时间"
                  style={{ width: '100%' }}
                  format='HH:mm'
                />)}
              </Form.Item>
            </Col>

            <Col lg={8}>
              <Form.Item label="偏差（分）" required>
                {getFieldDecorator('deviation', {
                  initialValue: infoDetail.deviation == null ? infoDetail.deviation : 10,
                  rules: [{ required: true, message: '请输入偏差' }],
                })(<InputNumber
                  placeholder="请输入偏差"
                  style={{ width: '100%' }}
                  precision={0}
                  min={1}
                  max={60}
                />)}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col lg={8}>
              <Form.Item label="开始时间" required>
                {getFieldDecorator('beginTime', {
                  initialValue: infoDetail.beginTime == null ? infoDetail.beginTime : moment('8:00', 'HH:mm'),
                  rules: [{ required: true, message: '请输入开始时间' }],
                })(<TimePicker
                  placeholder="请输入开始时间"
                  style={{ width: '100%' }}
                  format='HH:mm'
                />)}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="间隔" required>
                {getFieldDecorator('timeSplit', {
                  initialValue: infoDetail.timeSplit == null ? 1 : infoDetail.timeSplit
                })(
                  <Select>
                    <Option value={1}>当日</Option>
                    <Option value={2}>次日</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="结束时间" required>
                {getFieldDecorator('endTime', {
                  initialValue: infoDetail.endTime == null ? infoDetail.endTime : moment('23:59', 'HH:mm'),
                  rules: [{ required: true, message: '请输入结束时间' }],
                })(<TimePicker
                  placeholder="请输入结束时间"
                  style={{ width: '100%' }}
                  format='HH:mm'
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
export default Form.create<PointContentModifyProps>()(PointContentModify);

