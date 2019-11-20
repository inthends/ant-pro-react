//编辑优惠政策
import { Card, Col, Form, Input, Row, Modal, InputNumber  } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetOrgTaxTateFormJson, OrganizeEditForm } from './Main.service';
import './style.less';
interface EditRebateOrganizeProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  orgItemId?: string;
  reload(): void;
}

const EditRebateOrganize = (props: EditRebateOrganizeProps) => {
  const { visible, closeModal, orgItemId, form, reload } = props;
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [orgTreeData,setOrgTreeData]=useState<any[]>([]);
  // const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
  useEffect(() => {
    if (visible) {
      if (orgItemId != null) {
        // GetAllFeeItems().then(res => {
        //   setInvoiceItems(res);
        // });
        GetOrgTaxTateFormJson(orgItemId).then(res => {
          setInfoDetail(res);
        })
      }
    }
  }, [visible]);


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
              InvoiceName: values.invoiceName,
              InvoiceCode: values.invoiceCode,
              PStructId: infoDetail.pStructId,
              TaxRate: values.taxRate,
              AllCode: infoDetail.allCode,
              FeeItemId: infoDetail.feeItemId,
            }
            OrganizeEditForm(newData).then((res) => {
              closeModal();
              reload();
            });
          }
        });
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='400px'
    >
      <Card> 
        <Form layout="vertical" hideRequiredMark>
          <Row  >
            <Col span={24}>
              {/* <Form.Item label="税控项目" required>
                {getFieldDecorator('invoiceId', {
                  initialValue: infoDetail.invoiceId,
                  rules: [{ required: true, message: '请选择税控项目' }],
                })(<Select placeholder="请选择税控项目"              >
                  {invoiceItems.map(item => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.title}
                    </Select.Option>
                  ))}
                </Select>
                )}
              </Form.Item> */}

              <Form.Item label="税控项目" required>
                {getFieldDecorator('invoiceName', {
                  initialValue: infoDetail.invoiceName,
                  rules: [{ required: true, message: '请输入税控项目' }],
                })(
                  <Input />
                )}
              </Form.Item>

            </Col>
          </Row>

          <Row  >
            <Col span={24}>
              <Form.Item label="税控项目编号" required>
                {getFieldDecorator('invoiceCode', {
                  initialValue: infoDetail.invoiceCode,
                  rules: [{ required: true, message: '请输入税控项目编号' }],
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row  >
            <Col span={24}>
              <Form.Item label="税率" required>
                {getFieldDecorator('taxRate', {
                  initialValue: infoDetail.taxRate ? infoDetail.taxRate : 0,
                  rules: [{ required: true, message: '请输入税率' }],
                })(<InputNumber style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Modal>
  );
};

export default Form.create<EditRebateOrganizeProps>()(EditRebateOrganize);

