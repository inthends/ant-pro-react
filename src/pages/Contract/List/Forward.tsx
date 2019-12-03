//结转
import { Card,Tag, Divider, PageHeader, DatePicker,   Button, Col, Drawer, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { 
  LeaseContractDTO,
  ChargeDetailDTO
} from '@/model/models';
import React, { useEffect, useState } from 'react';
import ResultList from './ResultList';
import { GetCharge, GetFormJson } from './Main.service'; 
import moment from 'moment';
import styles from './style.less';
interface ForwardProps {
  visible: boolean;
  id?: string;//合同id
  chargeId?: string;//合同条款id
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
}

const Forward = (props: ForwardProps) => {
  const { visible, closeDrawer, id, form, chargeId } = props;
  const title = '合同结转';
  const { getFieldDecorator } = form;
  //const [industryType, setIndustryType] = useState<any[]>([]); //行业  
  //const [feeitems, setFeeitems] = useState<TreeEntity[]>([]);
  const [infoDetail, setInfoDetail] = useState<LeaseContractDTO>({}); 
  const [depositData, setDepositData] = useState<any[]>([]);//保证金
  const [chargeData, setChargeData] = useState<any[]>([]);//租金

  // const close = () => {
  //   closeDrawer();
  // };

  //打开抽屉时初始化
  // useEffect(() => {
  //   // getCommonItems('IndustryType').then(res => {
  //   //   setIndustryType(res || []);
  //   // });
  //   //加载关联收费项目
  //   // GetAllFeeItems().then(res => {
  //   //   setFeeitems(res || []);
  //   // });
  // }, []);


  // 打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (id) {
        GetFormJson(id).then((tempInfo: LeaseContractDTO) => {
          setInfoDetail(tempInfo);
          //获取条款
          GetCharge(chargeId).then((charge: ChargeDetailDTO) => { 
            setDepositData(charge.depositFeeResultList || []);//保证金明细
            setChargeData(charge.chargeFeeResultList || []);//租金明细   

          })
          form.resetFields();
        });
      } else {
        form.resetFields();
      }
    } else {
      form.setFieldsValue({});
    }
  }, [visible]);

  //转换状态
  const GetStatus = (status) => {
    switch (status) {
      case 0:
        return <Tag color="#e4aa5b">新建</Tag>;
      case 1:
        return <Tag color="#e4aa4b">待审核</Tag>;
      case 2:
        return <Tag color="#19d54e">已审核</Tag>;
      case -1:
        return <Tag color="#d82d2d">已作废</Tag>
      default:
        return '';
    }
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={1000}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <PageHeader title={GetStatus(infoDetail.status)}
      // extra={[
      //   <Button key="1">附件</Button>, 
      //   <Button key="2">打印</Button>,
      // ]}
      />
      <Divider dashed />
      <Form layout="vertical" hideRequiredMark>
      <Card  className={styles.card}>
        <Row gutter={24}>
          <Col lg={8}>
            <Form.Item label="结转日期">
              {getFieldDecorator('billingDate', {
                initialValue: moment(new Date()),
                rules: [{ required: true, message: '请选择结转日期' }],
              })(<DatePicker placeholder="请选择结转日期" 
                 />)}
            </Form.Item>
          </Col> 
        </Row> 
        </Card>
        <ResultList
          depositData={depositData}
          chargeData={chargeData}
        ></ResultList>
      </Form>
      <div
        style={{
          position: 'absolute',
          zIndex: 999,
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
          取消
          </Button>
        <Button type="primary">
          确定
          </Button>
      </div>
    </Drawer>
  );

};

export default Form.create<ForwardProps>()(Forward);

