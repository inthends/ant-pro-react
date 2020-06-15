import { Switch, InputNumber, Checkbox, AutoComplete, Col, DatePicker, Form, Input, Radio, Select, TreeSelect } from 'antd';
import { ValidationRule, WrappedFormUtils } from 'antd/lib/form/Form';
import moment from 'moment';
import React from 'react';
import { TreeNode } from 'antd/lib/tree-select';
const { TextArea, Password } = Input;
const { Option } = Select;
interface ModifyItemProps {
  type?: 'switch' | 'select' | 'textarea' | 'password' | 'radio' | 'autoComplete' | 'date' | 'tree' | 'checkbox' | 'inputNumber';
  field: string;
  label: React.ReactNode;
  initData?: any;
  dropdownStyle?: any;
  disabled?: boolean;
  readOnly?: boolean;
  visibilityToggle?: boolean;
  // wholeLine?: boolean;
  form: WrappedFormUtils;
  rules?: ValidationRule[];
  items?: SelectItem[];
  treeData?: TreeNode[];
  multiple?: boolean;
  onChange?(value?, label?, extra?): void;
  checked?: boolean;
  onSearch?(value): void;
  onSelect?(value, option): void; //autoComplete
  lg?: any;
  maxLength?: any;
  rows?: any;
}
const ModifyItem = (props: ModifyItemProps) => {
  const {
    type,
    field,
    label,
    initData,
    // wholeLine,
    lg,
    maxLength,
    multiple,
    form,
    rules,
    items,
    treeData,
    disabled,
    readOnly,
    visibilityToggle,
    onSearch,
    onChange,
    onSelect,
    checked,
    dropdownStyle,
    rows 
  } = props;
  const { getFieldDecorator } = form;
  const inner = { disabled };

  const getFormItem = () => {
    switch (type) {
      case 'tree':
        return <TreeSelect {...inner} style={{ width: '100%' }}
          treeData={treeData || []}
          onChange={onChange}
          dropdownStyle={dropdownStyle}
          multiple={multiple}
        />;
      case 'date':
        return <DatePicker {...inner} style={{ width: '100%' }} placeholder={`请选择${label as string}`} />;

      case 'switch':
        return <Switch {...inner}
          onChange={onChange}
          checked={checked}
          checkedChildren="是"
          unCheckedChildren="否" />;

      case 'autoComplete':
        return (
          <AutoComplete
            {...inner}
            dataSource={(items || []).map((item: SelectItem) => (
              <Option value={item.value} key={item.key}>
                {item.label}
              </Option>
            ))}
            style={{ width: '100%' }}
            onSearch={onSearch}
            allowClear={true}
            placeholder={`请输入${label as string}`}
            onSelect={onSelect}
          />
        );
      case 'textarea':
        return (
          <TextArea
            {...inner}
            rows={rows ? rows : 4}
            placeholder={`请输入${label as string}`}
            onChange={onChange}
            maxLength={maxLength}
          ></TextArea>
        );
      case 'select':
        return (
          // <Select {...inner} placeholder={`请选择${label as string}`} onChange={onChange}>
          //   {(items || []).map((item: SelectItem) => (
          //     <Option value={item.value} key={item.value}>
          //       {item.label}
          //     </Option>
          //   ))}
          // </Select>

          <Select {...inner} placeholder={`请选择${label as string}`} onChange={onChange}>
            {(items || []).map((item: SelectItem) => (
              <Option key={item.key} value={item.value} >
                {item.title}
              </Option>
            ))}
          </Select>

        );
      case 'password':
        return (
          <Password
            {...inner}
            placeholder={`请输入${label as string}`}
            onChange={onChange}
            readOnly={readOnly}
            visibilityToggle={visibilityToggle}
          ></Password>
        );
      case 'radio':
        return (
          <Radio.Group {...inner}>
            {(items || []).map((item: SelectItem) => (
              <Radio value={item.value} key={item.value}>
                {item.label}
              </Radio>
            ))}
          </Radio.Group>
        );

      case 'checkbox':
        return (
          <Checkbox
            {...inner}
            onChange={onChange}
            checked={checked}
          ></Checkbox>
        );

      case 'inputNumber':
        return (
          <InputNumber
            {...inner}
            placeholder={`请输入${label as string}`}
            style={{ width: '100%' }}
            onChange={onChange}
          ></InputNumber>
        );

      default:
        return (
          <Input {...inner} placeholder={`请输入${label as string}`}
            readOnly={readOnly}
            onChange={onChange}></Input>
        );
    }
  };

  const getInitValue = () => {
    if (initData) {
      if (type === 'date') {
        if (initData[field]) {
          return moment(new Date(initData[field]));
        } else {
          return undefined;
        }
      } else {
        return initData[field];
      }
    } else {
      return undefined;
    }
  };
  return (
    // <Col lg={wholeLine ? 24 : 12}>
    <Col lg={lg == undefined ? 12 : lg}>
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
  key?;
  title?;
}
export { SelectItem };