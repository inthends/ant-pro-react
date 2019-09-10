//添加编辑费项
import { Card, Divider, Button, DatePicker,Col, Select, Modal, Drawer, Form, Row, Icon, Spin, Input, InputNumber, TreeSelect, message, Table, Checkbox } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import {GetPageDetailListJson , GetBilling, GetDataItemTreeJson, GetOrgTree, GetInfoFormJson, GetPageListWithMeterID, RemoveUnitForm, RemoveUnitFormAll, SaveMain } from './BillingMain.service';
import './style.less';
import  moment from 'moment';
import SelectHouse from './SelectHouse';
const Search = Input.Search;
const Option = Select.Option;
const { TextArea } = Input;

interface  ModifyProps {
  modifyVisible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  organizeId?: string;
  isEdit:boolean;
  reload(): void;
}

const  Modify = (props:  ModifyProps) => {
  const { modifyVisible, closeDrawer, form, id, reload ,isEdit} = props;
  const title = id == undefined ? '新增计费单' : '修改计费单';
  const [newId,setNewId]=useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  // const [units,setUnits] = useState<string>([]);
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [meterKinds, setMeterKinds] = useState<any>([]);
  const [meterTypes, setMeterTypes] = useState<any>([]);
  const [orgTreeData, setOrgTreeData] = useState<any>({});
  const [selectHouseVisible, setSelectHouseVisible] = useState<boolean>(false);

  const [unitMeterSearchParams, setUnitMeterSearchParams] = useState<any>({});
  const [unitMeterLoading, setUnitMeterLoading] = useState<boolean>(false);
  const [unitMeterData, setUnitMeterData] = useState<any>();
  const [unitMeterPagination, setUnitMeterPagination] = useState<DefaultPagination>(new DefaultPagination());

  const [isAdd, setIsAdd] = useState<boolean>(true);
  useEffect(() => {
    if (modifyVisible) {
      form.resetFields();
      if (id!=null&&id!='') {
        setIsAdd(false);
        setLoading(true);
        GetBilling(id).then(res => {
          setInfoDetail(res);
          setLoading(false);
          initUnitMeterLoadData();
        });
      } else {
        form.resetFields();
        setInfoDetail({});
        setUnitMeterData([]);
        setLoading(false);
      }
    }
  }, [modifyVisible]);

  const close = () => {
    closeDrawer();
  };

  const getGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const initUnitMeterLoadData = (org, searchText) => {
    const queryJson = {
      keyValue:id==null||id==''?'':id,
      keyword: searchText,
    };
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = unitMeterPagination;
    return unitMeterload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };

  const unitMeterload = data => {
    setUnitMeterLoading(true);
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'asc';
    return GetPageDetailListJson(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setUnitMeterPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      console.log(res);
      setUnitMeterData(res.data);
      setUnitMeterLoading(false);
      return res;
    });
  };
  const [meterDetail, setMeterDetail] = useState<any>({});
  const checkEntity = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        let guid = getGuid();
        var meterEntity = {
          keyValue:( id == null || id == '' )? guid: id,
         // BillId: id == null || id == '' ? guid : id,
          BillSource:'周期费计算',
          BillDate:moment(values.billDate).format('YYYY-MM-DD'),
          LinkId:'',
          IfVerify:values.ifVerify=="未审核"?false:true,
          Status:0,
          Memo:values.memo
        }
        setMeterDetail(
          meterEntity
        );
        //console.log(meterEntity);
        setSelectHouseVisible(true);
      }
    });
  };
  const columns = [
    {
      title: '计费单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 150,
      sorter: true
    },
    {
      title: '单元编号',
      dataIndex: 'unitId',
      key: 'unitId',
      width: 150,
      sorter: true
    },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 150,
      sorter: true,
    },
    {
      title: '应收期间',
      dataIndex: 'period',
      key: 'period',
      width: 150,
      sorter: true,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 150,
      sorter: true,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      width: 150
    },
    {
      title: '周期',
      key: 'cycleValue',
      dataIndex: 'cycleValue',
      sorter: true,
      width: 150
    },
    {
      title: '周期单位',
      key: 'cycleType',
      dataIndex: 'cycleType',
      sorter: true,
      width: 150
    },
    {
      title: '金额',
      key: 'amount',
      dataIndex: 'amount',
      sorter: true,
      width: 150
    },
    {
      title: '起始日期',
      key: 'beginDate',
      dataIndex: 'beginDate',
      sorter: true,
      width: 200,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    },
    {
      title: '终止日期',
      key: 'endDate',
      dataIndex: 'endDate',
      sorter: true,
      width: 200,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    }, {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      width: 200,
      sorter: true
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align:'center',
      width: 100,
      render: (text, record) => {
        return [
          isEdit?
          <span>
            <a onClick={() => {
              RemoveUnitForm(record.id).then(res => {
                if (res.code != 0) { reload(); }
              })
            }} key="delete">删除</a>
          </span>     :   <span></span>
        ];
      },
    },
  ] as ColumnProps<any>[];

  const [houseFeeItemId, setHouseFeeItemId] = useState<string>('');
  const closeSelectHouse = () => {
    setSelectHouseVisible(false);
  }

  const [isFormula, setIsFormula] = useState<boolean>(false);
  return (
    <Drawer
      title={title}
      placement="right"
      width={700}
      onClose={close}
      visible={modifyVisible}
      style={{ height: 'calc(100vh-50px)' }}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -50px)' }}
    >
      <Card  >
        <Form layout="vertical" hideRequiredMark>
          <Spin tip="数据加载中..." spinning={loading}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item required label="单据编号">
                  {getFieldDecorator('billCode', {
                    initialValue: infoDetail.billCode,
                  })(
                    <Input disabled={true} placeholder="自动获取编号"/>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="单据日期"  >
                  {getFieldDecorator('billDate', {
                    initialValue: infoDetail.billDate==null?moment(new Date()):moment(infoDetail.billDate),
                    rules: [{ required: true, message: '请选择单据日期' }],
                  })(
                    <DatePicker disabled={!isEdit} />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="计费人"  >
                  {getFieldDecorator('createUserName', {
                    initialValue: infoDetail.createUserName,
                  })(
                    <Input  disabled={true}  />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item required label="状态"   >
                  {getFieldDecorator('ifVerify', {
                    initialValue:infoDetail.ifVerify==null|| !infoDetail.ifVerify?'未审核':'已审核',
                  })(
                    <Input  disabled={true}></Input>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="审核人"  >
                  {getFieldDecorator('verifyPerson', {
                    initialValue: infoDetail.verifyPerson,
                  })(
                    <Input  disabled={true}  />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="审核日期"   >
                  {getFieldDecorator('verifyDate', {
                      initialValue: infoDetail.billDate==null?moment(new Date()):moment(infoDetail.billDate),
                  })(
                    <DatePicker disabled={true} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="备注"  >
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo
                  })(
                    <TextArea disabled={!isEdit} rows={3} placeholder="请输入备注" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
                <Search
                  className="search-input"
                  placeholder="请输入要查询的费表编号"
                  style={{ width: 280 }}
                  onSearch={(value) => {
                    var params = Object.assign({}, meterSearchParams, { search: value })
                    setMeterSearchParams(params);
                    initMeterLoadData();
                  }}
                />
                <Button type="danger" style={{ float: 'right', marginLeft: '10px' }} disabled={!isEdit}
                  onClick={() => {
                    Modal.confirm({
                      title: '请确认',
                      content: `您是否确定删除？`,
                      onOk: () => {
                        if (id != null || id != "") {
                          RemoveUnitFormAll(id).then(res => {
                            message.success('删除成功！');
                            initMeterLoadData();
                          });
                        }/*else if(newId != null || newId != ""){
                          RemoveUnitFormAll(newId).then(res => {
                            message.success('删除成功！');
                            initMeterLoadData();
                          });
                        }*/
                      },
                    });
                  }}
                >
                  <Icon type="delete" />
                  全部删除
              </Button>
                <Button type="default" style={{ float: 'right', marginLeft: '10px' }} disabled={!isEdit}
                  onClick={() => {
                    checkEntity();
                  }}
                >
                  <Icon type="plus" />
                  添加
              </Button>
              </div>
              <div style={{color:'rgb(255,0,0)'}}>点击金额列和备注列可以编辑，编辑完按回车保存。</div>
              <Table<any>
                onChange={(paginationConfig, filters, sorter) => {
                  initMeterLoadData(paginationConfig, sorter)
                }
                }
                bordered={false}
                size="middle"
                columns={columns}
                dataSource={unitMeterData}
                rowKey="unitmeterid"
                pagination={unitMeterPagination}
                scroll={{ y: 500, x: 2100 }}
                loading={loading}
              />
            </Row>
          </Spin>
        </Form>
      </Card>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          zIndex: 999,
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button style={{ marginRight: 8 }}
          onClick={() => closeDrawer()}
        >
          取消
        </Button>
        <Button type="primary"
          onClick={() => {
            form.validateFields((errors, values) => {
              if (!errors) {
                let guid = getGuid();
                var meterEntity = {
                  keyValue: id == null || id == '' ? guid : id,
                  //BillId:'',// id == null || id == '' ? guid : id,
                  BillSource:'周期费计算',
                  BillDate:moment(values.billDate).format('YYYY-MM-DD'),
                  LinkId:'',
                  IfVerify:values.ifVerify=="未审核"?false:true,
                  Status:0,
                  type:1,
                  Memo:values.memo
                }
                SaveMain(meterEntity).then(() => {
                  closeDrawer();
                  reload();
                });
              }
            })
          }}
        >
          确定
        </Button>
      </div>
      <SelectHouse
        visible={selectHouseVisible}
        closeModal={closeSelectHouse}
        meterDetail={meterDetail}
        getBillID={(billid)=>{
          setNewId(billid);
          /*GetBilling(billid).then(res => {
            setInfoDetail(res);
            setLoading(false);
            initUnitMeterLoadData();
          });*/
        }}
      />
    </Drawer>
  );
};

export default Form.create< ModifyProps>()( Modify);

