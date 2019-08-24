import { Col, Form, Select, Input, Radio, AutoComplete, DatePicker } from 'antd';
import React from 'react';
import { WrappedFormUtils, ValidationRule } from 'antd/lib/form/Form';
import moment from 'moment';
const { TextArea, Password } = Input;
const { Option } = Select;
interface ModifyItemProps {
  type?: 'select' | 'textarea' | 'password' | 'radio' | 'autoComplete' | 'date';
  field: string;
  label: React.ReactNode;
  initData?: any;
  wholeLine?: boolean;
  form: WrappedFormUtils;
  rules?: ValidationRule[];
  items?: SelectItem[];
  onChange?(value): void;
  onSearch?(value): void;
}
const ModifyItem = (props: ModifyItemProps) => {
  const { type, field, label, initData, wholeLine, form, rules, onChange, items, onSearch } = props;
  const { getFieldDecorator } = form;

  const getFormItem = () => {
    switch (type) {
      case 'date':
        return <DatePicker style={{ width: '100%' }} />;
      case 'autoComplete':
        return (
          <AutoComplete
            dataSource={(items || []).map((item: SelectItem) => (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            ))}
            style={{ width: '100%' }}
            onSearch={onSearch}
            placeholder={`请输入${label as string}`}
            // onSelect={onOwnerSelect}
          />
        );
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
  const getInitValue = () => {
    if (initData) {
      if (type === 'date') {
        return moment(new Date(initData[field]));
      } else {
        return initData[field];
      }
    } else {
      return undefined;
    }
  };
  return (
    <Col lg={wholeLine ? 24 : 12}>
      <Form.Item label={label} required>
        {getFieldDecorator(field, {
          initialValue: getInitValue(),
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
import { Col, Form, Select, Input, Radio } from 'antd';
import React from 'react';
import { WrappedFormUtils, ValidationRule } from 'antd/lib/form/Form';
const { TextArea, Password } = Input;
const { Option } = Select;
interface ModifyItemProps {
  type?: 'select' | 'textarea' | 'password' | 'radio';
  field: string;
  label: React.ReactNode;
  data: any;
  wholeLine?: boolean;
  form: WrappedFormUtils;
  rules?: ValidationRule[];
  items?: SelectItem[];
  onChange?(value): void;
}
const ModifyItem = (props: ModifyItemProps) => {
  const { type, field, label, data, wholeLine, form, rules, onChange, items } = props;
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
          initialValue: data[field],
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
