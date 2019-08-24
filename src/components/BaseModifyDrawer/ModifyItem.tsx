import { Col, Form, Select, Input, Radio } from 'antd';
import React from 'react';
import { WrappedFormUtils, ValidationRule } from 'antd/lib/form/Form';
const { TextArea, Password } = Input;
const { Option } = Select;
interface ModifyItemProps {
  type?: 'select' | 'textarea' | 'password' | 'radio';
  field: string;
  label: React.ReactNode;
  initData?: any;
  wholeLine?: boolean;
  form: WrappedFormUtils;
  rules?: ValidationRule[];
  items?: SelectItem[];
  onChange?(value): void;
}
const ModifyItem = (props: ModifyItemProps) => {
  const { type, field, label, initData, wholeLine, form, rules, onChange, items } = props;
  const { getFieldDecorator } = form;

  const getFormItem = () => {
    switch (type) {
      case 'textarea':
        return (
          <TextArea
            rows={4}
            placeholder={`请输入${label as string}`}
            onChange={onChange}
          ></TextArea>
        );
      case 'select':
        return (
          <Select placeholder={`请选择${label as string}`} onChange={onChange}>
            {(items || []).map((item: SelectItem) => (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        );
      case 'password':
        return <Password placeholder={`请输入${label as string}`} onChange={onChange}></Password>;
      case 'radio':
        return (
          <Radio.Group>
            {(items || []).map((item: SelectItem) => (
              <Radio value={item.value} key={item.value}>
                {item.label}
              </Radio>
            ))}
          </Radio.Group>
        );
      default:
        return <Input placeholder={`请输入${label as string}`} onChange={onChange}></Input>;
    }
  };
  return (
    <Col lg={wholeLine ? 24 : 12}>
      <Form.Item label={label} required>
        {getFieldDecorator(field, {
          initialValue: initData ? initData[field] : undefined,
          rules,
        })(getFormItem())}
      </Form.Item>
    </Col>
  );
};
export default ModifyItem;
interface SelectItem {
  label;
  value;
}
export { SelectItem };
