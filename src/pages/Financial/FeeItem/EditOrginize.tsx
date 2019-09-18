//选择所属机构
import { Button,Col, Form,Input,Row,Icon,Modal, message,Tree, InputNumber,Select} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import {GetAllFeeItems, GetOrgTaxTateFormJson,OrganizeEditForm} from './Main.service';
import './style.less';
interface EditOrginizeProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  orgItemId?:string;
  reload():void;
}

const EditOrginize = (props: EditOrginizeProps) => {
  const { visible, closeModal,orgItemId ,form,reload} = props;
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [orgTreeData,setOrgTreeData]=useState<any[]>([]);
  const [invoiceItems,setInvoiceItems]=useState<any[]>([])
  useEffect(() => {
    if(visible){
      if(orgItemId!=null){
        GetAllFeeItems().then(res=>{
          setInvoiceItems(res);
        });
        GetOrgTaxTateFormJson(orgItemId).then(res=>{
          setInfoDetail(res);
        })
      }
    }
  }, [visible]);


  return (
    <Modal
      title="编辑税率"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        form.validateFields((errors, values) => {
          if (!errors) {
            let newData={
              keyValue:infoDetail.id,
              Id:infoDetail.id,
              InvoiceId:values.invoiceId,
              PStructId:infoDetail.pStructId,
              TaxRate:values.taxRate,
              AllCode:infoDetail.allCode,
              FeeItemId:infoDetail.feeItemId,
            }
            OrganizeEditForm(newData).then((res)=>{
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
      <Form layout="vertical" hideRequiredMark>
        <Row style={{marginTop:'5px'}}>
          <Col span={24}>
            <Form.Item label="费项类别" required>
              {getFieldDecorator('invoiceId', {
                initialValue: infoDetail.invoiceId,
                rules: [{ required: true, message: '请选择开票项目' }],
              })(<Select placeholder="请选择开票项目"              >
                {invoiceItems.map(item => (
                  <Select.Option key={item.key} value={item.key}>
                    {item.title}
                  </Select.Option>
                ))}
              </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
          <Row style={{marginTop:'5px'}}>
            <Col span={24}>
              <Form.Item label="税率" required>
                {getFieldDecorator('taxRate', {
                  initialValue: infoDetail.taxRate?infoDetail.taxRate:0,
                  rules: [{ required: true, message: '请输入税率' }],
                })(<InputNumber style={{width:'100%'}}/>
                )}
              </Form.Item>
            </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create<EditOrginizeProps>()(EditOrginize);

