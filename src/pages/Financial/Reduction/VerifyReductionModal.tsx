import {  Input, Row,Col,Card,Form,Select, DatePicker, Modal} from 'antd';
import React, { useEffect, useState } from 'react';
import LeftTree from '../LeftTree';
import { TreeEntity } from '@/model/models';
import { GetTreeListExpand,GetFeeTreeListExpand,GetFormJson,GetReductionItem,GetUseInfo ,AuditBill,CheckBill} from './Main.service';
import { getResult } from '@/utils/networkUtils';
import TextArea from 'antd/es/input/TextArea';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { getFileInfo } from 'prettier';
import  moment from 'moment';

interface VerifyReductionProps {
  modalVisible:boolean,
  form: WrappedFormUtils;
  id?: string;
  closeModal:any,
  ifVerifyModal:boolean
}

const { Option } = Select;

const VerifyReductionModal = (props:VerifyReductionProps)=> {
  const { modalVisible, closeModal, form, id,ifVerifyModal} = props;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const { getFieldDecorator } = form;
  const [reductionItem, setReductionItem] = useState<any[]>([]);

  useEffect(() => {
    if (modalVisible) {
      GetReductionItem().then(res => {
        setReductionItem(res);
      });
      if (id) {
        getInfo(id).then((tempInfo: any) => {
          setInfoDetail(tempInfo);
          form.resetFields();
        });
      }else {
        //重置之前选择加载的费项类别
        setInfoDetail({  });
        form.resetFields();
      }
    }else{
      setReductionItem([]);
    }
  }, [modalVisible]);


  const getInfo=(id)=>{
    if (id) {
      return GetFormJson(id).then(res => {
        const {
          billCode,
          billDate,
          billID,
          createDate,
          createUserId,
          createUserName,
          ifVerify,
          memo,
          modifyDate,
          modifyUserId,
          modifyUserName,
          organizeID,
          rebate,
          reductionAmount,
          reductionFeeItemID,
          status,
          verifyDate,
          verifyMemo,
          verifyPerson
        } = res || ({} as any);
        let info = {
          billCode,
          billDate,
          billID,
          createDate,
          createUserId,
          createUserName,
          ifVerify,
          memo,
          modifyDate,
          modifyUserId,
          modifyUserName,
          organizeID,
          rebate,
          reductionAmount,
          reductionFeeItemID,
          status,
          verifyDate,
          verifyMemo,
          verifyPerson
        };
        return info;
      });
    } else {
      return Promise.resolve({
        parentId: 0,
        type: 1,
      });
    }
  }

  const buildOption=(item:any)=>{
    const children = [];
    for ( let i = 0; i < item.length; i++) {
        children.push(<Option key={item[i].id}>{item[i].title}</Option>);
    }
    return children;
  }

  const saveVertify=()=>{
      //如果是审核减免单
      if(ifVerifyModal)
      {
        //验证是否可以取消审核
        return CheckBill(infoDetail.billID).then(res=>{
          if(res)
          {
            GetUseInfo(localStorage.getItem('userid')).then(res=>{
              return {
                ...infoDetail,
                ifVerify: ifVerifyModal
              }
            }).then(data=>{
              return AuditBill(data);
            }).then(()=>{
              closeModal();
            })
          }
        })
      }else{
        GetUseInfo(localStorage.getItem('userid')).then(res=>{
          return {
            ...infoDetail,
            ifVerify: ifVerifyModal
          }
        }).then(data=>{
          return AuditBill(data);
        })
      }
  }

  return (
    <Modal
      title="减免单审核"
      visible={modalVisible}
      okText="确认"
      cancelText="关闭"
      onCancel={closeModal}
      onOk={()=>saveVertify()}
      destroyOnClose={true}
      width='860px'
    >
      <Card>
        <Row gutter={16}>
          <Col span={8}>
          <Form.Item label="单据编号">
            {getFieldDecorator('billCode', {
              initialValue: infoDetail.billCode,
              rules: [{ required: true, message: '自动获取编号' }],
            })(
            <Input disabled={true}></Input>
            )}
          </Form.Item>
          </Col>
          <Col span={8}>
          <Form.Item label="单据日期">
            {getFieldDecorator('billDate', {
              initialValue:infoDetail.billDate
              ? moment(new Date(infoDetail.billDate))
              : moment(new Date()),
              rules: [{ required: true}],
            })(
            <DatePicker  disabled={true}></DatePicker>
            )}
          </Form.Item>
          </Col>
          <Col span={8}>
          <Form.Item label="经办人">
            {getFieldDecorator('createUserName', {
              initialValue: infoDetail.createUserName,
              rules: [{ required: true }],
            })(
            <Input  disabled={true}></Input>
            )}
          </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} >
        <Col span={8}>
        <Form.Item label="减免费项">
            {getFieldDecorator('reductionFeeItemID', {
              initialValue: infoDetail.reductionFeeItemID,
              rules: [{ required: true }],
            })(
              <Select placeholder="==请选择减免项目==" style={{width:'100%'}}  disabled={true}>
                {buildOption(reductionItem)}
              </Select>
            )}
          </Form.Item>
          </Col>
          <Col span={8}>
          <Form.Item label="审核日期">
            {getFieldDecorator('verifyDate', {
              initialValue:infoDetail.verifyDate
              ? moment(new Date(infoDetail.verifyDate))
              : moment(new Date()),
              rules: [{ required: true}],
            })(
            <DatePicker  disabled={true}></DatePicker>
            )}
          </Form.Item>
          </Col>
          <Col span={8}>
          <Form.Item label="审核人">
            {getFieldDecorator('verifyPerson', {
              initialValue: infoDetail.verifyPerson,
              rules: [{ required: true}],
            })(
            <Input disabled={true} ></Input>
            )}
          </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} >
          <Col>
          <Form.Item label="审核情况">
            {getFieldDecorator('verifyMemo', {
              initialValue: infoDetail.verifyMemo,
              //rules: [{ required: true}],
            })(
            <Input ></Input>
            )}
          </Form.Item>
          </Col>
        </Row>
      </Card>
    </Modal>
  );
};

export default Form.create<VerifyReductionProps>()(VerifyReductionModal);
