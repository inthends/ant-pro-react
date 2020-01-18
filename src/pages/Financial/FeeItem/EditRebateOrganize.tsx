//编辑优惠政策，废弃
import { Select, Card, Col, Form, DatePicker, Row, Modal, Input } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetRebateFormJson, RebateEditForm } from './Main.service';
// import './style.less';
const Option = Select.Option;
const { TextArea } = Input;
import moment from 'moment';
interface EditRebateOrganizeProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
};

const EditRebateOrganize = (props: EditRebateOrganizeProps) => {
  const { visible, closeModal, id, form, reload } = props;
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  
  useEffect(() => {
    if (visible) {
      if (id != null) {
        GetRebateFormJson(id).then(res => {
          setInfoDetail(res);
        })
      }
    }
  }, [visible]);

  //选择优惠政策
  const change = (value, option) => {
    form.setFieldsValue({ rebateName: option.props.children });
  };

  return (
    <Modal
      title="编辑优惠政策"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        form.validateFields((errors, values) => {
          if (!errors) {
            let newData = {
              keyValue: infoDetail.id,
              Id: infoDetail.id,
              PStructId: infoDetail.pStructId,
              FeeItemId: infoDetail.feeItemId,
              RebateName: values.rebateName,
              RebateCode: values.rebateCode,
              BeginDate: values.beginDate.format('YYYY-MM-DD'),
              EndDate: values.endDate.format('YYYY-MM-DD'),
              Memo: values.memo
            }
            RebateEditForm(newData).then((res) => {
              closeModal();
              reload();
            });
          }
        });
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='450px'
    >
      <Card>
        <Form layout="vertical" hideRequiredMark>
          <Form.Item label="优惠政策" required>
            {getFieldDecorator('rebateCode', {
              initialValue: infoDetail.rebateCode,
              rules: [{ required: true, message: '请选择优惠政策' }]
            })(
              <Select placeholder="==请选择优惠政策=="
                onChange={change} >
                <Option value='1'>预缴一年赠送一个月</Option>
                <Option value='2'>预缴一年减免一个月</Option>
              </Select>
            )}
            {getFieldDecorator('rebateName', {
              initialValue: infoDetail.rebateName,
            })(
              <input type='hidden' />
            )}
          </Form.Item>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="起始日期" required>
                {getFieldDecorator('beginDate', {
                  initialValue: infoDetail.beginDate ? moment(infoDetail.beginDate) : moment(new Date()),
                  rules: [{ required: true, message: '请选择起始日期' }]
                })(
                  <DatePicker placeholder="请选择起始日期" style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              < Form.Item label="结束日期" required >
                {getFieldDecorator('endDate', {
                  initialValue: infoDetail.endDate ? moment(infoDetail.endDate) : moment(new Date()),
                  rules: [{ required: true, message: '请选择结束日期' }]
                })(
                  <DatePicker placeholder="请选择结束日期" style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="附加说明">
            {getFieldDecorator('memo', {
              initialValue: infoDetail.memo,
            })(
              <TextArea rows={4} placeholder="请输入附加说明" />
            )}
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default Form.create<EditRebateOrganizeProps>()(EditRebateOrganize);

