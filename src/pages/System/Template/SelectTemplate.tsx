//通用打印选择模板
import { Tree, Spin, Form, Row, Col, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import Page from '@/components/Common/Page';
// import { WrappedFormUtils } from 'antd/lib/form/Form';
import { GetTemplates, Print } from './Main.service';

interface SelectTemplateProps {
  visible: boolean;
  closeModal(): void;
  // form: WrappedFormUtils;
  // rowSelect(rowSelectedKeys): void;
  id?: string;
  unitId?: string;
}

const SelectTemplate = (props: SelectTemplateProps) => {
  const { visible, closeModal, id, unitId } = props;
  const [loading, setLoading] = useState<boolean>(false);
  // const { getFieldDecorator } = form;
  const [tempListData, setTempListData] = useState<any[]>([]);
  const [templateId, setTemplateId] = useState<string>('');

  useEffect(() => {
    if (visible) {
      //加载打印模板
      GetTemplates(unitId).then((res) => {
        setTempListData(res || []);
      })
    }
  }, [visible])

  const onOk = () => {
    // form.validateFields((errors, values) => {
    //   if (!errors) {
    //打印
    // Modal.confirm({
    //   title: '请确认',
    //   content: `您要打印吗？`, 
    //   onOk: () => {

    if (templateId == '') {
      message.warn('请选择模板');
      return;
    }

    setLoading(true);
    Print(id, templateId).then(res => {
      //window.location.href = res;
      window.open(res);
      //setLoading(false);
    }).catch(e => {
      message.warn(e);
    })
      .finally(() => {
        setLoading(false);
      });
    //   },
    // });
    // }
    // }); 
  };

  const onSelect = (selectedKeys) => {
    setTemplateId(selectedKeys[0]);
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
        <Row style={{ height: '400px', overflow: 'auto', backgroundColor: 'rgb(255,255,255)' }}>
          <Col>
            <Page
              style={{
                padding: '6px',
                borderLeft: 'none',
                borderBottom: 'none',
                height: '400px',
                overflowY: 'auto',
              }}>
              {/* <Form.Item required label="打印模板"  >
                {getFieldDecorator('templateId', {
                  rules: [{ required: true, message: '请选择打印模板' }]
                })(
 
                  // <Select placeholder="==请选择==" style={{ width: '100%' }}  >
                  //   {
                  //     tempListData.map(item => {
                  //       return <Select.Option value={item.value}>{item.title}</Select.Option>
                  //     })
                  //   }
                  // </Select>

                  <TreeSelect
                    placeholder="请选择打印模板"
                    allowClear
                    dropdownStyle={{ maxHeight: 400 }}
                    treeData={tempListData}
                    treeDataSimpleMode={true} >
                  </TreeSelect> 

                )}
              </Form.Item> */}

              <Tree
                treeData={tempListData}
                onSelect={onSelect}
                showLine>
              </Tree>

            </Page>
          </Col>
        </Row>
      </Spin>
    </Modal >
  );
};

export default Form.create<SelectTemplateProps>()(SelectTemplate);
