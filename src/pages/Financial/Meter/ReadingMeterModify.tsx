//新增抄表单
import { Card, Button, Col, DatePicker, Drawer, Tabs, Form, Row, Icon, Spin, Input, Table } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetVirtualReadPageList, SaveReadPublicForm, SaveReadUnitForm, RemoveFormAll, RemoveUnitForm, RemoveReadPublicFormAll, RemoveReadPublicForm, GetPublicReadPageList, GetUnitReadPageList, GetMeterRead, RemoveReadVirtualFormAll } from './Meter.service';
import './style.less';
import ChargeFeeItem from './ChargeFeeItem';
import SelectReadingMeterPublic from './SelectReadingMeterPublic';
import SelectReadingMeterHouse from './SelectReadingMeterHouse';
import SelectReadingMeterVirtual from './SelectReadingMeterVirtual';
import moment from 'moment';
const Search = Input.Search;
const { TabPane } = Tabs;
const { TextArea } = Input;

/*详情可编辑单元格*/
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    var _this = this;
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={_this.toggleEdit}
        >
          {children}
        </div>
      );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
            children
          )}
      </td>
    );
  }
}
interface ReadingMeterModifyProps {
  modifyVisible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  organizeId?: string;
  reload(): void;
}

const ReadingMeterModify = (props: ReadingMeterModifyProps) => {
  const { modifyVisible, closeDrawer, form, id } = props;
  const title = id == undefined ? '新增抄表单' : '修改抄表单';
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  // const [units, setUnits] = useState<string>('');
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [noticeData, setNoticeData] = useState<any>([]);
  const [pagination, setPagination] = useState<DefaultPagination>(new DefaultPagination());

  // const [meterKinds, setMeterKinds] = useState<any>([]);
  // const [meterTypes, setMeterTypes] = useState<any>([]);
  // const [orgTreeData, setOrgTreeData] = useState<any>({});
  const [chargeFeeItemVisible, setChargeFeeItemVisible] = useState<boolean>(false);
  // const [selectHouseVisible, setSelectHouseVisible] = useState<boolean>(false);

  const [unitFeeVisible, setUnitFeeVisible] = useState<boolean>(false);
  const [virtualFeeVisible, setVirtualFeeVisible] = useState<boolean>(false);
  const [publicFeeVisible, setPublicFeeVisible] = useState<boolean>(false);

  const [houseSearchParams, setHouseSearchParams] = useState<any>({});
  // const [houseLoading, setHouseLoading] = useState<boolean>(false);
  const [houseData, setHouseData] = useState<any>();
  const [housePagination, setHousePagination] = useState<DefaultPagination>(new DefaultPagination());

  const [publicSearchParams, setPublicSearchParams] = useState<any>({});
  // const [publicLoading, setPublicLoading] = useState<boolean>(false);
  const [publicData, setPublicData] = useState<any>();
  const [publicPagination, setPublicPagination] = useState<DefaultPagination>(new DefaultPagination());

  const [virtualSearchParams, setVirtualSearchParams] = useState<any>({});
  // const [virtualLoading, setVirtualLoading] = useState<boolean>(false);
  const [virtualData, setVirtualData] = useState<any>();
  const [virtualPagination, setVirtualPagination] = useState<DefaultPagination>(new DefaultPagination());

  // const [addFormulaVisible, setAddFormulaVisible] = useState<boolean>(false);
  const [houseFeeItemRowId, setHouseFeeItemRowId] = useState<string>('');
  const [publicFeeItemRowId, setPublicFeeItemRowId] = useState<string>('');
  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };

  useEffect(() => {
    if (modifyVisible) {
      // //获取费表类型
      // GetDataItemTreeJson('EnergyMeterKind').then(res => {
      //   setMeterKinds(res);
      // })
      // //获取费表种类
      // GetDataItemTreeJson('EnergyMeterType').then(res => {
      //   setMeterTypes(res);
      // });
      // GetOrgTree().then(res => {
      //   setOrgTreeData(res);
      // })
      if (id) {
        //setIsAdd(false);
        setLoading(true);
        GetMeterRead(id).then(res => {
          setInfoDetail(res);
          setLoading(false);
          initHouseLoadData();
          initPublicLoadData();
          initVirtualLoadData();
        });
      } else {
        form.resetFields();
        setInfoDetail({});
        //setMeterData([]);
        setLoading(false);
      }
    }
  }, [modifyVisible]);


  const initHouseLoadData = (paginationConfig?: PaginationConfig, sorter?) => {
    //setMeterSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: housePagination.pageSize,
      total: 0,
    };
    var keyvalue = "";
    if (id != null || id != '') {
      keyvalue = id;
    }
    if (infoDetail != null && infoDetail.BillId != null) {
      keyvalue = infoDetail.BillId;
    }
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: houseSearchParams.search == null ? '' : houseSearchParams.search, keyValue: keyvalue }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billcode';
    }

    return houseload(searchCondition).then(res => {
      return res;
    });
  }

  const houseload = data => {

    data.sidx = data.sidx || 'billcode';
    data.sord = data.sord || 'asc';
    return GetUnitReadPageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setHousePagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setHouseData(res.data);
      return res;
    });
  };


  const initPublicLoadData = (paginationConfig?: PaginationConfig, sorter?) => {
    //setMeterSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: publicPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: publicSearchParams.search == null ? '' : publicSearchParams.search, keyValue: id }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billcode';
    }

    return publicload(searchCondition).then(res => {
      return res;
    });
  }

  const publicload = data => {
    //setPublicLoading(true);
    data.sidx = data.sidx || 'billcode';
    data.sord = data.sord || 'asc';
    return GetPublicReadPageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPublicPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setPublicData(res.data);
      // setMeterLoading(false);
      return res;
    });
  };

  const initVirtualLoadData = (paginationConfig?: PaginationConfig, sorter?) => {
    //setMeterSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: virtualPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: virtualSearchParams.search == null ? '' : virtualSearchParams.search, keyValue: id }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billcode';
    }

    return virtualload(searchCondition).then(res => {
      return res;
    });
  }

  const virtualload = data => {
    //setMeterLoading(true);
    data.sidx = data.sidx || 'billcode';
    data.sord = data.sord || 'asc';
    return GetVirtualReadPageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setVirtualPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setVirtualData(res.data);
      //setMeterLoading(false);
      return res;
    });
  };

  const close = () => {
    closeDrawer();
  };

  // const guid=()=> {
  //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  //       var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
  //       return v.toString(16);
  //   });
  // }

  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        let newData = {
          payBeginDate: values.payBeginDate.format('YYYY-MM-DD HH:mm:ss'),
          payEndDate: values.payEndDate.format('YYYY-MM-DD HH:mm:ss'),
          beginDate: values.beginDate.format('YYYY-MM-DD HH:mm:ss'),
          endDate: values.endDate.format('YYYY-MM-DD HH:mm:ss')
        };

        /*SaveForm(infoDetail.organizeId,newData).then((res)=>{
          close();
        });*/
      }
    });
  };

  const publicFeeColumns = [
    {
      title: '种类',
      dataIndex: 'meterkind',
      key: 'meterkind',
      width: 200,
      sorter: false
    },
    {
      title: '表名称',
      dataIndex: 'metername',
      key: 'metername',
      width: 200,
      sorter: false
    },
    {
      title: '表编号',
      dataIndex: 'metercode',
      key: 'metercode',
      width: 200,
      sorter: false,
    },
    {
      title: '上次读数',
      dataIndex: 'lastreading',
      key: 'lastreading',
      width: 200,
      sorter: false,
    },
    {
      title: '本次读数',
      dataIndex: 'nowreading',
      key: 'nowreading',
      sorter: false,
      width: 200,
      editable: true
    },
    {
      title: '倍率',
      dataIndex: 'meterzoom',
      key: 'meterzoom',
      sorter: false,
      width: 200
    },
    {
      title: '用量',
      dataIndex: 'baseusage',
      key: 'baseusage',
      sorter: false,
      width: 200
    },
    {
      title: '单价',
      dataIndex: 'meterprice',
      key: 'meterprice',
      sorter: false,
      width: 200
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      sorter: false,
      width: 200
    },
    {
      title: '录入人',
      dataIndex: 'createusername',
      key: 'createusername',
      sorter: false,
      width: 200
    },
    {
      title: '录入时间',
      dataIndex: 'createdate',
      key: 'createdate',
      sorter: false,
      width: 200
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      sorter: false,
      width: 200,
      editable: true
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 95,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => {
              RemoveReadPublicForm(record.id).then(res => {
                if (res.code != 0) { initPublicLoadData(); }
              })
            }} key="delete">删除</a>
          </span>

        ];
      },
    }
  ] as ColumnProps<any>[];

  const publicDataColumns = publicFeeColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handlePublicSave,
      }),
    };
  });

  const houseFeeColumns = [
    {
      title: '种类',
      dataIndex: 'meterType',
      key: 'meterType',
      width: 120,
      sorter: false
    },
    {
      title: '表名称',
      dataIndex: 'meterName',
      key: 'meterName',
      width: 120,
      sorter: false
    },
    {
      title: '表编号',
      dataIndex: 'meterCode',
      key: 'meterCode',
      width: 250,
      sorter: false,
    },
    {
      title: '上次读数',
      dataIndex: 'lastReading',
      key: 'lastReading',
      width: 120,
      sorter: false,
    },
    {
      title: '本次读数',
      dataIndex: 'nowReading',
      key: 'nowReading',
      sorter: false,
      width: 120,
      editable: true
    },
    {
      title: '倍率',
      dataIndex: 'meterZoom',
      key: 'meterZoom',
      sorter: false,
      width: 100
    },
    {
      title: '用量',
      dataIndex: 'baseUsage',
      key: 'baseUsage',
      sorter: false,
      width: 100
    },
    {
      title: '单价',
      dataIndex: 'meterPrice',
      key: 'meterPrice',
      sorter: false,
      width: 100
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      sorter: false,
      width: 120
    },
    {
      title: '录入人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      sorter: false,
      width: 100
    },
    {
      title: '录入时间',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: false,
      width: 150
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      sorter: false,
      width: 200,
      editable: true
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 95,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => {
              RemoveUnitForm(record.id).then(res => {
                if (res.code != 0) { initHouseLoadData(); }
              });
            }} key="delete">删除</a>
          </span>

        ];
      },
    }
  ] as ColumnProps<any>[];

  const houseDataColumns = houseFeeColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleHouseSave,
      }),
    };
  });

  const handleHouseSave = row => {
    row.baseusage = (row.nowreading - row.lastreading);
    row.amount = (row.nowreading - row.lastreading) * row.meterprice;

    form.validateFields((errors, values) => {
      if (!errors) {
        let guid = getGuid();
        if (id == null || id == '') {
          var info = Object.assign({}, infoDetail, {
            BillId: guid
          })
          setInfoDetail(info)
        }
        var newHouseData = {
          id: id == null || id == '' ? guid : id,
          nowreading: row.nowreading,
          memo: row.memo
        };
        //SaveReadPublicForm ,
        SaveReadUnitForm(newHouseData).then((res) => {
          const newData = [...houseData];
          const index = newData.findIndex(item => row.id === item.id);
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setHouseData(newData);
        });
      }
    });


  };

  const handlePublicSave = row => {
    row.baseusage = (row.nowreading - row.lastreading);
    row.amount = (row.nowreading - row.lastreading) * row.meterprice;
    form.validateFields((errors, values) => {
      if (!errors) {
        let guid = getGuid();
        if (id == null || id == '') {
          var info = Object.assign({}, infoDetail, {
            BillId: guid
          })
          setInfoDetail(info)
        }
        var newHouseData = {
          id: id == null || id == '' ? guid : id,
          nowreading: row.nowreading,
          memo: row.memo
        };
        SaveReadPublicForm(newHouseData).then((res) => {
          const newData = [...publicData];
          const index = newData.findIndex(item => row.id === item.id);
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setPublicData(newData);
        });
      }
    });


  };

  const virtualFeeColumns = [
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
      dataIndex: 'metercode',
      key: 'metercode',
      width: 200,
      sorter: true,
    },
    {
      title: '计算公式',
      dataIndex: 'formula',
      key: 'formula',
      sorter: true,
      width: 200
    },
    {
      title: '录入人',
      dataIndex: 'createusername',
      key: 'createusername',
      sorter: true,
      width: 200
    },
    {
      title: '录入时间',
      dataIndex: 'createdate',
      key: 'createdate',
      sorter: true,
      width: 200
    }
  ] as ColumnProps<any>[];
  const closeChargeFeeItem = () => {
    setChargeFeeItemVisible(false);
  }
  const getGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const [readingDetail, setReadingDetail] = useState<any>({});
  // const [isFormula, setIsFormula] = useState<boolean>(false);
  return (
    <Drawer
      title={title}
      placement="right"
      width={880}
      onClose={close}
      visible={modifyVisible}
      style={{ height: 'calc(100vh-50px)' }}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -50px)' }}
    >
      <Card>
        <Form layout="vertical" hideRequiredMark>
          <Spin tip="数据加载中..." spinning={loading}>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item required={true} label="单据编号"  >
                  {getFieldDecorator('billCode', {
                    initialValue: infoDetail.billCode,
                  })(
                    <Input placeholder="自动获取编号" readOnly style={{ width: '100%' }} ></Input>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required={true} label="单据日期">
                  {getFieldDecorator('readDate', {
                    initialValue: infoDetail.readDate == null ? moment(new Date()) : moment(infoDetail.readDate),
                    rules: [{ required: true, message: '请选择单据日期' }],
                  })(
                    <DatePicker style={{ width: '100%' }} ></DatePicker>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required={true} label="抄表日期" >
                  {getFieldDecorator('meterCode', {
                    initialValue: infoDetail.meterCode == null ? moment(new Date()) : moment(infoDetail.readDate),
                    rules: [{ required: true, message: '请选择抄表时间' }],
                  })(
                    <DatePicker.MonthPicker style={{ width: '100%' }}  ></DatePicker.MonthPicker>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item required={true} label="抄表人">
                  {getFieldDecorator('meterReader', {
                    initialValue: infoDetail.meterReader,
                  })(
                    <Input style={{ width: '100%' }} placeholder="自动获取当前用户" readOnly ></Input>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required={true} label="结束抄表日期"  >
                  {getFieldDecorator('endReadDate', {
                    initialValue: infoDetail.endReadDate == null ? moment(new Date()) : moment(infoDetail.endReadDate),
                    rules: [{ required: true, message: '请选择结束抄表日期' }],
                  })(
                    <DatePicker style={{ width: '100%' }} ></DatePicker>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required={true} label="结束标识"  >
                  {getFieldDecorator('batchCode', {
                    initialValue: infoDetail.batchCode == null ? "" : infoDetail.batchCode,
                  })(
                    <Input style={{ width: '100%' }} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            {/* <Row gutter={12}>
              <Col span={8}>
                <Form.Item  required={true} label="状态"  >
                  {getFieldDecorator('ifVerifyName', {
                      initialValue:infoDetail.ifVerify?'已审核':'未审核',
                  })(
                    <Input style={{width:'100%'}} disabled={true} />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item  required={true} label="审核人" >
                  {getFieldDecorator('verifyPerson', {
                      initialValue:infoDetail.verifyPerson,
                  })(
                    <Input  style={{width:'100%'}}  placeholder="自动获取当前用户" disabled={true}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item  required={true} label="审核时间">
                  {getFieldDecorator('feeItemId', {
                      initialValue:infoDetail.verifyDate
                  })(
                    <Input style={{width:'100%'}}   placeholder="自动获取时间" disabled={true}/>
                  )}
                </Form.Item>
              </Col>
          </Row> */}
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item required={true} label="抄表说明">
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo == null ? '' : infoDetail.memo,
                  })(
                    <TextArea rows={4} style={{ width: '100%' }} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Tabs >
                <TabPane tab="房屋费表" key="1">
                  <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
                    <Search
                      className="search-input"
                      placeholder="请输入要查询的费表编号"
                      style={{ width: 280 }}
                    />

                    <Button type="link" style={{ float: 'right' }}
                      onClick={() => {
                        /*var ids=[];
                        houseData.map(item=>{
                          ids.push(item.id);
                        });*/
                        RemoveFormAll(id).then(res => {
                          initHouseLoadData();
                        });
                      }}
                    >
                      <Icon type="delete" />
                      全部删除
                </Button>
                    <Button type="link" style={{ float: 'right', marginLeft: '1px' }}
                      onClick={() => {
                        form.validateFields((errors, values) => {
                          if (!errors) {
                            let guid = getGuid();
                            var meterEntity = {
                              keyValue: id == null || id == '' ? guid : id,
                              BillId: id == null || id == '' ? guid : id,
                              BatchCode: values.batchCode,
                              MeterCode: moment(values.meterCode).format('YYYYMM'),
                              ReadDate: moment(values.readDate).format('YYYY-MM-DD'),
                              EndReadDate: moment(values.endReadDate).format('YYYY-MM-DD'),
                              IfVerify: false,
                              Memo: values.memo,
                              //MeterReader:values.meterReader
                            }
                            setReadingDetail(
                              meterEntity
                            );
                            setUnitFeeVisible(true);
                          }
                        });
                      }}
                    >
                      <Icon type="plus" />
                      选择房屋
                </Button>
                  </div>
                  <div style={{ color: 'rgb(255,0,0)' }}> 请仔细核对抄表度数，度数错误会影响公摊计费，点击本次读数列和备注列可以编辑，编辑完按回车保存。</div>
                  <Table<any>
                    components={components}
                    onChange={(paginationConfig, filters, sorter) => {
                      initHouseLoadData(paginationConfig, sorter)
                    }}
                    bordered={false}
                    size="middle"
                    columns={houseDataColumns}
                    dataSource={houseData}
                    rowKey="id"
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
                    <Button type="link" style={{ float: 'right', marginLeft: '10px' }}
                      onClick={() => {
                        /*var ids=[];
                        publicData.map(item=>{
                          ids.push(item.id);
                        });*/
                        RemoveReadPublicFormAll(id).then(res => {
                          initPublicLoadData();
                        });
                      }}
                    >
                      <Icon type="delete" />
                      全部删除
                </Button>
                    <Button type="link" style={{ float: 'right', marginLeft: '10px' }}
                      onClick={() => {
                        form.validateFields((errors, values) => {
                          if (!errors) {
                            let guid = getGuid();
                            var meterEntity = {
                              keyValue: id == null || id == '' ? guid : id,
                              BillId: id == null || id == '' ? guid : id,
                              BatchCode: values.batchCode,
                              MeterCode: moment(values.meterCode).format('YYYYMM'),
                              ReadDate: moment(values.readDate).format('YYYY-MM-DD'),
                              EndReadDate: moment(values.endReadDate).format('YYYY-MM-DD'),
                              IfVerify: false,
                              Memo: values.memo,
                            }
                            setReadingDetail(meterEntity);
                            setPublicFeeVisible(true);
                          }
                        })
                      }
                      }
                    >
                      <Icon type="plus" />
                      添加公用费表
                </Button>
                  </div>
                  <div style={{ color: 'rgb(255,0,0)' }}>点击本次读数列和备注列可以编辑，编辑完按回车保存。</div>
                  <Table<any>
                    components={components}
                    onChange={(paginationConfig, filters, sorter) => {
                      initPublicLoadData(paginationConfig, sorter)
                    }}
                    bordered={false}
                    size="middle"
                    columns={publicDataColumns}
                    dataSource={publicData}
                    rowKey="id"
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
                    <Button type="link" style={{ float: 'right', marginLeft: '10px' }}
                      onClick={() => {
                        let ids: any[] = [];
                        virtualData.map(item => {
                          ids.push(item.id);
                        });
                        RemoveReadVirtualFormAll(JSON.stringify(ids)).then(res => {
                          if (res.code != 0) { initVirtualLoadData(); }
                        });
                      }}
                    >
                      <Icon type="delete" />
                      全部删除
                </Button>
                    <Button type="link" style={{ float: 'right', marginLeft: '10px' }}
                      onClick={() => {
                        form.validateFields((errors, values) => {
                          if (!errors) {
                            let guid = getGuid();
                            var meterEntity = {
                              keyValue: id == null || id == '' ? guid : id,
                              BillId: id == null || id == '' ? guid : id,
                              BatchCode: values.batchCode,
                              MeterCode: moment(values.meterCode).format('YYYYMM'),
                              ReadDate: moment(values.readDate).format('YYYY-MM-DD'),
                              EndReadDate: moment(values.endReadDate).format('YYYY-MM-DD'),
                              IfVerify: false,
                              Memo: values.memo,
                            }
                            setReadingDetail(meterEntity);
                            setVirtualFeeVisible(true);
                          }
                        })
                      }}
                    >
                      <Icon type="plus" />
                      添加虚拟费表
                </Button>
                  </div>
                  <Table<any>
                    onChange={(paginationConfig, filters, sorter) => {
                      initVirtualLoadData(paginationConfig, sorter)
                    }}
                    bordered={false}
                    size="middle"
                    columns={virtualFeeColumns}
                    dataSource={virtualData}
                    rowKey="id"
                    pagination={pagination}
                    scroll={{ y: 500, x: 1620 }}
                    loading={loading}
                  />
                </TabPane>
              </Tabs>
            </Row>
          </Spin>

        </Form>

      </Card>
      <ChargeFeeItem
        visible={chargeFeeItemVisible}
        closeModal={closeChargeFeeItem}
        getSelectTree={(id) => {
          var info = Object.assign({}, infoDetail, { feeItemName: id });
          setInfoDetail(info);
        }}
      />
      <SelectReadingMeterHouse
        visible={unitFeeVisible}
        closeModal={() => {
          setUnitFeeVisible(false);
        }}
        readingDetail={readingDetail}
        reload={() => {
          initHouseLoadData();
        }}
        id={houseFeeItemRowId}
      />
      <SelectReadingMeterPublic
        visible={publicFeeVisible}
        closeModal={() => {
          setPublicFeeVisible(false);
        }}
        readingDetail={readingDetail}
        reload={() => {

        }}
        id={publicFeeItemRowId}
      />
      <SelectReadingMeterVirtual
        visible={virtualFeeVisible}
        closeModal={() => {
          setVirtualFeeVisible(false);
        }}
        readingDetail={readingDetail}
        reload={() => {

        }}
        id={publicFeeItemRowId}
      />


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
          zIndex: 999
        }}
      >
        <Button style={{ marginRight: 8 }}
          onClick={() => closeDrawer()}
        >
          取消
        </Button>
        <Button type="primary"
          onClick={() => onSave()}
        >
          提交
        </Button>
      </div>

    </Drawer>
  );
};

export default Form.create<ReadingMeterModifyProps>()(ReadingMeterModify);

