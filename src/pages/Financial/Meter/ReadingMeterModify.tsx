//添加编辑费项
import {
  Button,
  Col,
  DatePicker,Select,
  Drawer,Tabs,
  Form,
  Row,Icon,
  Spin,
  Input,InputNumber,TreeSelect,
  Table,Checkbox
} from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig} from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import {GetDataItemTreeJson,GetOrgTree,SaveVirtualForm ,SavePublicForm ,SaveUnitForm ,GetVirtualReadPageList, SaveMainForm } from './Meter.service';
import './style.less';
import ChargeFeeItem from './ChargeFeeItem';
import SelectReadingMeterHouse from './SelectReadingMeterHouse';
import  moment from 'moment';
const Search = Input.Search;
const Option = Select.Option;
const {TabPane}=Tabs;
interface ReadingMeterModifyProps {
  modifyVisible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  organizeId?:string;
  reload(): void;
}

const ReadingMeterModify = (props: ReadingMeterModifyProps) => {
  const { modifyVisible, closeDrawer, form, id } = props;
  const title = id === undefined ? '新增费表资料' : '修改费表资料';
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [units,setUnits] = useState<string>([]);
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [noticeData, setNoticeData] = useState<any>([]);
  const [pagination, setPagination] = useState<DefaultPagination>(new DefaultPagination());

  const [meterKinds, setMeterKinds] = useState<any>([]);
  const [meterTypes, setMeterTypes] = useState<any>([]);
  const [orgTreeData, setOrgTreeData] = useState<any>({});
  const [chargeFeeItemVisible, setChargeFeeItemVisible] = useState<boolean>(false);
  const [selectHouseVisible, setSelectHouseVisible] = useState<boolean>(false);

  const [unitFeeVisible, setUnitFeeVisible] = useState<boolean>(false);
  const [virtualMeterVisible, setVirtualMeterVisible] = useState<boolean>(false);
  const [publicMeterVisible, setPublicMeterVisible] = useState<boolean>(false);


  const [addFormulaVisible, setAddFormulaVisible] = useState<boolean>(false);
  useEffect(() => {
    if(modifyVisible){
      //获取费表类型
      GetDataItemTreeJson('EnergyMeterKind').then(res=>{
        setMeterKinds(res);
      })
      //获取费表种类
      GetDataItemTreeJson('EnergyMeterType').then(res=>{
        setMeterTypes(res);
      });
      GetOrgTree().then(res=>{
        setOrgTreeData(res);
      })
      if(id)
      {
        //setIsAdd(false);
        setLoading(true);
       // GetInfoFormJson(id).then(res=>{
         // setInfoDetail(res);
         // setLoading(false);
         // initMeterLoadData();

        //});
      }else{
        //form.resetFields();
        //setInfoDetail({});
        //setMeterData([]);
        //setLoading(false);
      }
    }
  }, [modifyVisible]);

  const close = () => {
    closeDrawer();
  };

  const guid=()=> {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  }


  const onSave=()=>{
    form.validateFields((errors, values) => {
      if (!errors) {
        let newData={
          payBeginDate: values.payBeginDate.format('YYYY-MM-DD HH:mm:ss'),
          payEndDate: values.payEndDate.format('YYYY-MM-DD HH:mm:ss'),
          beginDate:values.beginDate.format('YYYY-MM-DD HH:mm:ss'),
          endDate: values.endDate.format('YYYY-MM-DD HH:mm:ss')
        };

        /*SaveForm(infoDetail.organizeID,newData).then((res)=>{
          close();
        });*/
      }
    });
  };



  const houseFeeColumns = [
    {
      title: '种类',
      dataIndex: 'meterkind',
      key: 'meterkind',
      width: 200,
      sorter: true
    },
    {
      title: '表名称',
      dataIndex: 'metertype',
      key: 'metertype',
      width: 200,
      sorter: true
    },
    {
      title: '表编号',
      dataIndex: 'meterzoom',
      key: 'meterzoom',
      width: 200,
      sorter: true,
    },
    {
      title: '上次读数',
      dataIndex: 'meterrange',
      key: 'meterrange',
      width: 200,
      sorter: true,
    },
    {
      title: '本次读数',
      dataIndex: 'feeitemname',
      key: 'feeitemname',
      sorter: true,
      width: 200
    },
    {
      title: '倍率',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: true,
      width: 200
    },
    {
      title: '用量',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: true,
      width: 200
    },
    {
      title: '单价',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: true,
      width: 200
    },
    {
      title: '金额',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: true,
      width: 200
    },
    {
      title: '录入人',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: true,
      width: 200
    },
    {
      title: '录入时间',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: true,
      width: 200
    },
    {
      title: '备注',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: true,
      width: 200
    }
  ] as ColumnProps<any>[];


  const virtualFeeColumns=[
    {
      title: '种类',
      dataIndex: 'meterkind',
      key: 'meterkind',
      width: 200,
      sorter: true
    },
    {
      title: '表名称',
      dataIndex: 'metertype',
      key: 'metertype',
      width: 200,
      sorter: true
    },
    {
      title: '表编号',
      dataIndex: 'meterzoom',
      key: 'meterzoom',
      width: 200,
      sorter: true,
    },
    {
      title: '计算公式',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: true,
      width: 200
    },
    {
      title: '录入人',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: true,
      width: 200
    },
    {
      title: '录入时间',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: true,
      width: 200
    }
  ] as ColumnProps<any>[];
const closeChargeFeeItem=()=>{
  setChargeFeeItemVisible(false);
}

const [isFormula,setIsFormula]=useState<boolean>(false);
  return (
    <Drawer
      title={title}
      placement="right"
      width={880}
      onClose={close}
      visible={modifyVisible}
      style={{height:'calc(100vh-50px)'}}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -50px)' }}
    >
      <Form  hideRequiredMark>
        <Spin tip="数据加载中..." spinning={loading}>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item required={true} label="单据编号" labelCol={{span:6}} wrapperCol={{span:18}} >
                {getFieldDecorator('billCode', {
                    initialValue:infoDetail.billCode,
                  rules: [{ required: true ,message:'请输入单据名称名称' }],
                })(
                  <Input placeholder="自动获取编号" disabled={true} style={{width:'100%'}} ></Input>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item required={true}  label="单据日期" labelCol={{span:6}} wrapperCol={{span:18}} >
                {getFieldDecorator('readDate', {
                    initialValue:infoDetail.readDate==null?moment(new Date()):moment(infoDetail.readDate),
                  rules: [{ required: true ,message:'请选择单据日期'}],
                })(
                  <DatePicker  style={{width:'100%'}} ></DatePicker>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item  required={true} label="meterCode" labelCol={{span:6}} wrapperCol={{span:18}} >
                {getFieldDecorator('meterCode', {
                    initialValue:infoDetail.meterCode==null?moment(new Date()):moment(infoDetail.readDate),
                  rules: [{ required: true ,message:'请选择抄表时间'}],
                })(
                  <DatePicker.MonthPicker style={{width:'100%'}}  ></DatePicker.MonthPicker>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item  required={true} label="抄表人" labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('meterReader', {
                      initialValue:infoDetail.meterReader,
                    rules: [{ required: true ,message:'请输入费表编号'}],
                  })(
                    <Input style={{width:'100%'}}  placeholder="自动获取当前用户" disabled={true}></Input>
                  )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item  required={true} label="结束抄表日期" labelCol={{span:6}} wrapperCol={{span:18}} >
                {getFieldDecorator('endReadDate', {
                    initialValue:infoDetail.endReadDate==null?moment(new Date()):moment(infoDetail.endReadDate),
                    rules: [{ required: true ,message:'请选择结束抄表日期'}],
                })(
                  <DatePicker  style={{width:'100%'}} ></DatePicker>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item  required={true} label="结束标识" labelCol={{span:6}} wrapperCol={{span:18}} >
                {getFieldDecorator('batchCode', {
                    initialValue:infoDetail.batchCode,
                })(
                  <Input  style={{width:'100%'}} />
                )}
              </Form.Item>
            </Col>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item  required={true} label="状态" labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('ifVerifyName', {
                      initialValue:infoDetail.ifVerify?'已审核':'未审核',
                  })(
                    <Input style={{width:'100%'}} disabled={true} />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item  required={true} label="审核人" labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('verifyPerson', {
                      initialValue:infoDetail.verifyPerson,
                  })(
                    <Input  style={{width:'100%'}}  placeholder="自动获取当前用户" disabled={true}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item  required={true} label="审核时间" labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('feeItemID', {
                      initialValue:infoDetail.verifyDate
                  })(
                    <Input style={{width:'100%'}}   placeholder="自动获取时间" disabled={true}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Row>
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item required={true}  label="抄表说明" labelCol={{span:3}} wrapperCol={{span:21}} >
                  {getFieldDecorator('memo', {
                      initialValue:infoDetail.memo==null?'':infoDetail.memo,
                  })(
                    <Input style={{width:'100%'}} ></Input>
                  )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
          <Tabs type="card">
            <TabPane tab="房屋费表" key="1">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的费表编号"
                style={{ width: 280 }}
              />

              <Button type="primary" style={{float: 'right',marginLeft: '10px' }}
                onClick={() =>{}}
              >
                <Icon type="delete" />
                全部删除
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() =>{}}
              >
                <Icon type="delete" />
                删除
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() =>{}}
              >
                <Icon type="edit" />
                编辑
              </Button>
              <Button type="default" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  setUnitFeeVisible(true);
                }}
              >
                <Icon type="plus" />
                选择房屋
              </Button>
            </div>
            <div style={{color:'rgb(255,0,0)'}}> 请仔细核对抄表度数，度数错误会影响公摊计费，点击本次读数列和备注列可以编辑，编辑完按回车保存。</div>
            <Table<any>
              bordered={false}
              size="middle"
              columns={houseFeeColumns}
              dataSource={noticeData}
              rowKey="billID"
              pagination={pagination}
              scroll={{ y: 500, x: 1620 }}
              loading={loading}
            />
            </TabPane>
            <TabPane tab="公用费表" key="2">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的费表名称"
                style={{ width: 280 }}
              />
              <Button type="primary" style={{float: 'right',marginLeft: '10px' }}
                onClick={() =>{}}
              >
                <Icon type="delete" />
                全部删除
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() =>{}}
              >
                <Icon type="delete" />
                删除
              </Button>
              <Button type="default" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  setSelectHouseVisible(true);
                }}
              >
                <Icon type="plus" />
                添加公用费表
              </Button>
            </div>
            <div style={{color:'rgb(255,0,0)'}}>点击本次读数列和备注列可以编辑，编辑完按回车保存。</div>
            <Table<any>
              bordered={false}
              size="middle"
              columns={houseFeeColumns}
              dataSource={noticeData}
              rowKey="billID"
              pagination={pagination}
              scroll={{ y: 500, x: 1620 }}
              loading={loading}
            />
            </TabPane>
            <TabPane tab="虚拟费表" key="3">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的费表编号"
                style={{ width: 280 }}
              />
              <Button type="primary" style={{float: 'right',marginLeft: '10px' }}
                onClick={() =>{}}
              >
                <Icon type="delete" />
                全部删除
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() =>{}}
              >
                <Icon type="delete" />
                删除
              </Button>
              <Button type="default" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  setSelectHouseVisible(true);
                }}
              >
                <Icon type="plus" />
                  添加虚拟费表
              </Button>
            </div>
            <Table<any>
              bordered={false}
              size="middle"
              columns={virtualFeeColumns}
              dataSource={noticeData}
              rowKey="billID"
              pagination={pagination}
              scroll={{ y: 500, x: 1620 }}
              loading={loading}
            />
            </TabPane>
          </Tabs>

          </Row>
        </Spin>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button style={{ marginRight: 8 }}
        onClick={()=>closeDrawer()}
        >
          取消
        </Button>
        <Button type="primary"
          onClick={()=>onSave()}
        >
          提交
        </Button>
      </div>
      </Form>
      <ChargeFeeItem
          visible= {chargeFeeItemVisible}
          closeModal={closeChargeFeeItem}
          getSelectTree={(id)=>{
            var info= Object.assign({},infoDetail,{feeItemName:id});
            setInfoDetail(info);
          }}
      />
      <SelectReadingMeterHouse
        visible={unitFeeVisible}
        closeModal={()=>{
          setUnitFeeVisible(false);
        }}
        readingDetail={}
        reload={()=>{}}
        id={}
      />
    </Drawer>
  );
};

export default Form.create<ReadingMeterModifyProps>()(ReadingMeterModify);

