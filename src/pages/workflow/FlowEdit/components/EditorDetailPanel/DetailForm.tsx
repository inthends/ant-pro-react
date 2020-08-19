import { Card, Form, Input, Select } from 'antd';
import React, { Fragment } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { withPropsAPI } from 'gg-editor';

const upperFirst = (str: string) =>
  str.toLowerCase().replace(/( |^)[a-z]/g, (l: string) => l.toUpperCase());

const { Item } = Form;
const { Option } = Select;

const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

interface DetailFormProps extends FormComponentProps {
  type: string;
  propsAPI?: any;
  roles?: any;
}

class DetailForm extends React.Component<DetailFormProps> {
  get item() {
    const { propsAPI } = this.props;
    return propsAPI.getSelected()[0];
  }

  handleSubmit = (e: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const { form, propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

    setTimeout(() => {
      form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return;
        }
        const item = getSelected()[0];
        if (!item) {
          return;
        }
        executeCommand(() => {
          update(item, {
            ...values,
          });
        });
      });
    }, 0);
  };

  renderEdgeShapeSelect = () => (
    <Select onChange={this.handleSubmit}>
      <Option value="flow-polyline">折线</Option>
      <Option value="flow-smooth">平滑</Option>
      <Option value="flow-polyline-round">圆折线</Option>
    </Select>
  );

  renderNodeDetail = () => {
    const { form, roles } = this.props;
    const { label, user, shape } = this.item.getModel();
    return (
      <Fragment>
        <Item label="名称" {...inlineFormItemLayout}>
          {form.getFieldDecorator('label', {
            initialValue: label,
          })(<Input onBlur={this.handleSubmit}  style={{width:'150px'}} disabled={shape == 'flow-circle' || shape == 'flow-capsule' ? true : false} />)}
        </Item>
        {shape == 'flow-circle' || shape == 'flow-capsule' ? null :
          <Item label="审批人" {...inlineFormItemLayout}  >
            {form.getFieldDecorator('user', {
              initialValue: user,
            })(<Select onChange={this.handleSubmit} style={{width:'150px'}} >
              {roles.roles.map(item => (
                <Option key={item.roleId} value={item.roleId}>
                  {item.fullName}
                </Option>
              ))}
            </Select>
            )}
          </Item>}
      </Fragment>
    );
  };

  renderEdgeDetail = () => {
    const { form } = this.props;
    // const { label = '', shape = 'flow-smooth' } = this.item.getModel(); 
    const { label = '', shape = 'flow-polyline' } = this.item.getModel();

    return (
      <Fragment>
        <Item label="名称" {...inlineFormItemLayout}>
          {form.getFieldDecorator('label', {
            initialValue: label,
          })(<Input onBlur={this.handleSubmit} />)}
        </Item>
        <Item label="连线" {...inlineFormItemLayout}>
          {form.getFieldDecorator('shape', {
            initialValue: shape,
          })(this.renderEdgeShapeSelect())}
        </Item>
      </Fragment>
    );
  };

  renderGroupDetail = () => {
    const { form } = this.props;
    const { label = '新建分组' } = this.item.getModel();

    return (
      <Item label="名称" {...inlineFormItemLayout}>
        {form.getFieldDecorator('label', {
          initialValue: label,
        })(<Input onBlur={this.handleSubmit} />)}
      </Item>
    );
  };

  render() {
    const { type } = this.props;

    if (!this.item) {
      return null;
    }

    return (
      <Card type="inner" size="small"
      //  title={upperFirst(type)}
       bordered={false}>
        <Form onSubmit={this.handleSubmit}>
          {type === 'node' && this.renderNodeDetail()}
          {type === 'edge' && this.renderEdgeDetail()}
          {type === 'group' && this.renderGroupDetail()}
        </Form>
      </Card>
    );
  }
}

export default Form.create<DetailFormProps>()(withPropsAPI(DetailForm as any));
