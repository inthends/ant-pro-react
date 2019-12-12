//添加收款单
import { Select, Spin, Form, Row, Col, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { GetTemplates, Print } from './Main.service';

interface SelectTemplateProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  // rowSelect(rowSelectedKeys): void;
  id?: string;
  unitId?: string;
}

const SelectTemplate = (props: SelectTemplateProps) => {
  const { visible, closeModal, id, unitId,form } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [tempListData, setTempListData] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      //加载打印模板
      GetTemplates(unitId).then((res) => {
        setTempListData(res || []);
      })
    }
  }, [visible])

  const onOk = () => {

    form.validateFields((errors, values) => {
      if (!errors) {
        //打印
        // Modal.confirm({
        //   title: '请确认',
        //   content: `您要打印吗？`, 
        //   onOk: () => {
        setLoading(true);
        Print(id, values.templateId).then(res => {
          //window.location.href = res;
          window.open(res);
          setLoading(false);
        });
        //   },
        // });
      }
    });

  };


  return (
    <Modal
      title="选择打印模板"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => onOk()}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='330px'
    >
      <Spin tip="数据处理中..." spinning={loading}>
        <Form layout="vertical" hideRequiredMark>
          <Row>
            <Col lg={24} >
              <Form.Item required label="打印模板"  >
                {getFieldDecorator('templateId', {
                  rules: [{ required: true, message: '请选择打印模板' }]
                })(
                  <Select placeholder="==请选择==" style={{ width: '100%' }}  >
                    {
                      tempListData.map(item => {
                        return <Select.Option value={item.value}>{item.title}</Select.Option>
                      })
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>

      </Spin>
    </Modal >
  );
};

export default Form.create<SelectTemplateProps>()(SelectTemplate);
