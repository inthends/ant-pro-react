//新增抄表单
import { TreeSelect, Select, Modal, message, Card, Button, Col, DatePicker, Drawer, Tabs, Form, Row, Icon, Spin, Input, Table } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import {
  SaveMainForm, GetVirtualReadPageList, SaveReadPublicForm, SaveReadUnitForm, RemoveReadUnitFormAll, RemoveReadingUnitForm, RemoveReadPublicFormAll,
  RemoveReadPublicForm, GetPublicReadPageList, GetUnitReadPageList, GetMeterRead, RemoveReadVirtualFormAll
} from './Meter.service';
import { GetOrgs, GetUserList } from '@/services/commonItem';
import styles from './style.less';
import ChargeFeeItem from './ChargeFeeItem';
import SelectReadingMeterPublic from './SelectReadingMeterPublic';
import SelectReadingMeterHouse from './SelectReadingMeterHouse';
import SelectReadingMeterVirtual from './SelectReadingMeterVirtual';
import moment from 'moment';
const Search = Input.Search;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

interface ReadingMeterModifyProps {
  modifyVisible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  // organizeId?: string;
  reload(): void;
  treeData: any[];
};

const ReadingMeterModify = (props: ReadingMeterModifyProps) => {
  const { reload, treeData, modifyVisible, closeDrawer, form, id } = props;
  const title = id == undefined ? '新增抄表单' : '修改抄表单';

  const getGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [chargeFeeItemVisible, setChargeFeeItemVisible] = useState<boolean>(false);
  const [unitFeeVisible, setUnitFeeVisible] = useState<boolean>(false);
  const [virtualFeeVisible, setVirtualFeeVisible] = useState<boolean>(false);
  const [publicFeeVisible, setPublicFeeVisible] = useState<boolean>(false);

  const [houseSearch, setHouseSearch] = useState<string>('');//查询关键字
  const [houseLoading, setHouseLoading] = useState<boolean>(false);
  const [houseData, setHouseData] = useState<any[]>([]);
  const [housePagination, setHousePagination] = useState<DefaultPagination>(new DefaultPagination());

  const [publicSearch, setPublicSearch] = useState<string>('');
  const [publicLoading, setPublicLoading] = useState<boolean>(false);
  const [publicData, setPublicData] = useState<any>();
  const [publicPagination, setPublicPagination] = useState<DefaultPagination>(new DefaultPagination());

  const [virtualSearch, setVirtualSearch] = useState<string>('');
  const [virtualLoading, setVirtualLoading] = useState<boolean>(false);
  const [virtualData, setVirtualData] = useState<any>();
  const [virtualPagination, setVirtualPagination] = useState<DefaultPagination>(new DefaultPagination());

  // const [addFormulaVisible, setAddFormulaVisible] = useState<boolean>(false);
  // const [houseFeeItemRowId, setHouseFeeItemRowId] = useState<string>('');
  // const [publicFeeItemRowId, setPublicFeeItemRowId] = useState<string>('');

  const [orgTreeData, setOrgTreeData] = useState<any>({});

  const [keyvalue, setKeyValue] = useState<string>('');

  useEffect(() => {
    if (modifyVisible) {

      GetUserList('', '员工').then(res => {
        setUserSource(res || []);
      });

      GetOrgs().then(res => {
        setOrgTreeData(res);
      });

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
        setKeyValue(id);
        setLoading(true);
        GetMeterRead(id).then(res => {
          setInfoDetail(res);
          //明细数据初始化
          initHouseLoadData(houseSearch);
          initPublicLoadData(publicSearch);
          initVirtualLoadData(virtualSearch);
          setLoading(false);
        });
      } else {
        setKeyValue(getGuid());
        form.resetFields();
        //数据重置
        setInfoDetail({});
        setHouseData([]);
        setPublicData([]);
        setVirtualData([]);
        setLoading(false);
      }
    }
  }, [modifyVisible]);

  //初始化
  const initHouseLoadData = (search) => {
    const queryJson = {
      keyword: search,
      keyvalue: keyvalue
    }
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = housePagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //刷新
  const loadHouseData = (searchText, paginationConfig?: PaginationConfig, sorter?) => {
    setHouseSearch(searchText);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: housePagination.pageSize,
      total: 0,
    };
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: searchText,
        keyvalue: keyvalue
      },
    };
    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'id';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  //加载数据
  const load = data => {
    setHouseLoading(true);
    data.sidx = data.sidx || 'id';
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
      setHouseLoading(false);
      return res;
    });
  };

  //公共
  const initPublicLoadData = (search) => {
    const queryJson = {
      keyword: search,
      keyvalue: keyvalue
    }
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = publicPagination;
    return publicload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //刷新
  const loadPublicData = (searchText, paginationConfig?: PaginationConfig, sorter?) => {
    setPublicSearch(searchText);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: publicPagination.pageSize,
      total: 0,
    };
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: searchText,
        keyvalue: keyvalue
      },
    };
    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    }
    return publicload(searchCondition).then(res => {
      return res;
    });
  };

  const publicload = data => {
    setPublicLoading(true);
    data.sidx = data.sidx || 'id';
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
      setPublicLoading(false);
      return res;
    });
  };

  //虚拟表
  const initVirtualLoadData = (search) => {
    const queryJson = {
      keyword: search,
      keyvalue: keyvalue
    }
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = virtualPagination;
    return virtualload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //刷新
  const loadVirtualData = (searchText, paginationConfig?: PaginationConfig, sorter?) => {
    setVirtualSearch(searchText);//查询的时候，必须赋值，否则查询条件会不起作用 
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: virtualPagination.pageSize,
      total: 0,
    };
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: searchText,
        keyvalue: keyvalue
      },
    };
    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'id';
    }
    return virtualload(searchCondition).then(res => {
      return res;
    });
  };

  const virtualload = data => {
    setVirtualLoading(true);
    data.sidx = data.sidx || 'id';
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
      setVirtualLoading(false);
      return res;
    });
  };

  //关闭
  const close = () => {
    closeDrawer();
    reload();
  };

  const [readingDetail, setReadingDetail] = useState<any>({});
  const closeChargeFeeItem = () => {
    setChargeFeeItemVisible(false);
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
        // let newData = {
        //   payBeginDate: values.payBeginDate.format('YYYY-MM-DD HH:mm:ss'),
        //   payEndDate: values.payEndDate.format('YYYY-MM-DD HH:mm:ss'),
        //   beginDate: values.beginDate.format('YYYY-MM-DD HH:mm:ss'),
        //   endDate: values.endDate.format('YYYY-MM-DD HH:mm:ss')
        // }; 
        const newData = infoDetail ? { ...infoDetail, ...values } : values;
        newData.keyvalue = keyvalue;
        newData.isAdd = false;//houseData.length == 0 ? true: false; 
        newData.billDate = newData.billDate.format('YYYY-MM-DD');
        newData.belongDate = newData.belongDate.format('YYYY-MM-DD');
        newData.endReadDate = newData.endReadDate.format('YYYY-MM-DD');
        //newData.meterCode = newData.meterCode.format('YYYYMM');
        newData.IfVerify = false;
        SaveMainForm(newData).then((res) => {
          close();
          message.success('保存成功！');
          reload();
        });
      }
    });
  };

  /*详情可编辑单元格*/
  const EditableContext = React.createContext('');
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
                message: `${title}不能为空`,
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
  };

  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };

  const publicFeeColumns = [
    {
      title: '种类',
      dataIndex: 'meterkind',
      key: 'meterkind',
      width: 60,
      sorter: false
    },
    {
      title: '表名称',
      dataIndex: 'metername',
      key: 'metername',
      width: 120,
      sorter: false
    },
    {
      title: '表编号',
      dataIndex: 'metercode',
      key: 'metercode',
      width: 150,
      sorter: false,
    },
    {
      title: '上次读数',
      dataIndex: 'lastreading',
      key: 'lastreading',
      width: 100,
      sorter: false,
    },
    {
      title: '本次读数',
      dataIndex: 'nowreading',
      key: 'nowreading',
      sorter: false,
      width: 100,
      editable: true
    },
    {
      title: '倍率',
      dataIndex: 'meterzoom',
      key: 'meterzoom',
      sorter: false,
      width: 60
    },
    {
      title: '用量',
      dataIndex: 'baseusage',
      key: 'baseusage',
      sorter: false,
      width: 100
    },
    {
      title: '单价',
      dataIndex: 'meterprice',
      key: 'meterprice',
      sorter: false,
      width: 100
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      sorter: false,
      width: 100
    },
    {
      title: '录入人',
      dataIndex: 'createusername',
      key: 'createusername',
      sorter: false,
      width: 80
    },
    {
      title: '录入时间',
      dataIndex: 'createdate',
      key: 'createdate',
      sorter: false,
      width: 120
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      sorter: false,
      width: 100,
      editable: true
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 75,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => {
              RemoveReadPublicForm(record.id).then(res => {
                initPublicLoadData(publicSearch);
              })
            }} key="delete">删除</a>
          </span>

        ];
      },
    }
  ];// as ColumnProps<any>[];

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
  }) as ColumnProps<any>[];

  const houseFeeColumns = [
    {
      title: '种类',
      dataIndex: 'meterType',
      key: 'meterType',
      width: 60,
      sorter: false
    },
    {
      title: '表名称',
      dataIndex: 'meterName',
      key: 'meterName',
      width: 80,
      sorter: false
    },
    {
      title: '表编号',
      dataIndex: 'meterCode',
      key: 'meterCode',
      width: 140,
      sorter: false,
    },
    {
      title: '上次读数',
      dataIndex: 'lastReading',
      key: 'lastReading',
      width: 80,
      sorter: false,
    },
    {
      title: '本次读数',
      dataIndex: 'nowReading',
      key: 'nowReading',
      sorter: false,
      width: 100,
      editable: true
    },
    {
      title: '倍率',
      dataIndex: 'meterZoom',
      key: 'meterZoom',
      sorter: false,
      width: 60
    },
    {
      title: '用量',
      dataIndex: 'baseUsage',
      key: 'baseUsage',
      sorter: false,
      width: 80
    },
    {
      title: '单价',
      dataIndex: 'meterPrice',
      key: 'meterPrice',
      sorter: false,
      width: 80
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      sorter: false,
      width: 80
    },
    {
      title: '录入人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      sorter: false,
      width: 60
    },
    {
      title: '录入时间',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: false,
      width: 130
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      sorter: false,
      width: 100,
      editable: true
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 60,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => {
              Modal.confirm({
                title: '请确认',
                content: `您是否要删除？`,
                cancelText: '取消',
                okText: '确定',
                onOk: () => {
                  RemoveReadingUnitForm(record.id).then(res => {
                    initHouseLoadData(houseSearch);
                  });
                }
              })
            }} key="delete">删除</a>
          </span >

        ];
      },
    }
  ]; //as ColumnProps<any>[];

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
  }) as ColumnProps<any>[];

  const handleHouseSave = row => {
    row.baseUsage = (row.nowReading - row.lastReading);
    row.amount = (row.nowReading - row.lastReading) * row.meterPrice;
    form.validateFields((errors, values) => {
      if (!errors) {
        // let guid = getGuid();
        // if (id == null || id == '') {
        //   var info = Object.assign({}, infoDetail, {
        //     BillId: guid
        //   })
        //   setInfoDetail(info)
        // }

        var newHouseData = {
          id: row.id,//id == null || id == '' ? guid : id,
          nowReading: row.nowReading,
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

  const [userSource, setUserSource] = useState<any[]>([]);

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
  // const [isFormula, setIsFormula] = useState<boolean>(false);
  return (
    <Drawer
      title={title}
      placement="right"
      width={800}
      onClose={close}
      visible={modifyVisible}
      style={{ height: 'calc(100vh-50px)' }}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -50px)' }}
    >
      <Card className={styles.card}>
        <Form layout="vertical" hideRequiredMark>
          <Spin tip="数据处理中..." spinning={loading}>
            <Row gutter={12}>
              <Col span={6}>
                <Form.Item required label="抄表单号"  >
                  {getFieldDecorator('billCode', {
                    initialValue: infoDetail.billCode,
                  })(
                    <Input placeholder="自动获取单号" readOnly style={{ width: '100%' }} ></Input>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item required label="单据日期">
                  {getFieldDecorator('billDate', {
                    initialValue: infoDetail.billDate == null ? moment(new Date()) : moment(infoDetail.billDate),
                    rules: [{ required: true, message: '请选择单据日期' }],
                  })(
                    <DatePicker style={{ width: '100%' }} ></DatePicker>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item required label="抄表年月" >
                  {getFieldDecorator('belongDate', {
                    initialValue: infoDetail.belongDate == null ? moment(new Date()) : moment(infoDetail.belongDate),
                    rules: [{ required: true, message: '请选择抄表年月' }],
                  })(
                    <DatePicker.MonthPicker style={{ width: '100%' }}  ></DatePicker.MonthPicker>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item required label="抄表人">
                  {getFieldDecorator('meterReader', {
                    initialValue: infoDetail.meterReader,
                    rules: [{ required: true, message: '请选择抄表人' }]
                  })(
                    // <Input style={{ width: '100%' }} placeholder="自动获取当前用户" readOnly ></Input> 
                    <Select
                      showSearch
                      placeholder="请选择抄表人"
                    >
                      {userSource.map(item => (
                        <Option key={item.id} value={item.name}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item required label="所属机构"  >
                  {getFieldDecorator('organizeId', {
                    initialValue: infoDetail.organizeId,
                    rules: [{ required: true, message: '请选择所属机构' }],
                  })(
                    <TreeSelect
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 310, overflow: 'auto' }}
                      treeData={orgTreeData}
                      placeholder="=请选择="
                      treeDefaultExpandAll
                      disabled={id ? true : false}
                    // onChange={(value => {
                    //   var info = Object.assign({}, infoDetail, { organizeId: value }); 
                    //   setInfoDetail(info);
                    // })}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item required label="结束抄表日期">
                  {getFieldDecorator('endReadDate', {
                    initialValue: infoDetail.endReadDate == null ? moment(new Date()) : moment(infoDetail.endReadDate),
                    rules: [{ required: true, message: '请选择结束抄表日期' }],
                  })(
                    <DatePicker style={{ width: '100%' }} ></DatePicker>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item  label="结束标识">
                  {getFieldDecorator('endMark', {
                    initialValue: infoDetail.endMark == null ? "" : infoDetail.endMark,
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
                    <TextArea rows={3} style={{ width: '100%' }} />
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
                      style={{ width: 200 }}
                      onSearch={value => loadHouseData(value)}
                    />
                    <Button type="link" style={{ float: 'right' }}
                      onClick={() => {
                        /*var ids=[];
                        houseData.map(item=>{
                          ids.push(item.id);
                        });*/

                        RemoveReadUnitFormAll(id).then(res => {
                          message.success('删除成功');
                          initHouseLoadData(houseSearch);
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
                            // let guid = getGuid();
                            var meterEntity = {
                              keyvalue: keyvalue,//== null || id == '' ? guid : id,
                              BillId: keyvalue,//== null || id == '' ? guid : id,
                              BatchCode: values.batchCode,
                              //MeterCode: moment(values.meterCode).format('YYYYMM'),
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
                  <div style={{ color: 'rgb(255,0,0)' }}> 请核对抄表度数，度数错误会影响计费，点击本次读数列和备注列可以编辑，按回车保存。</div>
                  <Table
                    components={components}
                    onChange={(paginationConfig, filters, sorter) => {
                      loadHouseData(houseSearch, paginationConfig, sorter)
                    }}
                    bordered={false}
                    size="middle"
                    columns={houseDataColumns}
                    dataSource={houseData}
                    rowKey="id"
                    pagination={housePagination}
                    scroll={{ y: 500, x: 1300 }}
                    loading={houseLoading}
                  />
                </TabPane>
                <TabPane tab="公用费表" key="2">
                  <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
                    <Search
                      className="search-input"
                      placeholder="请输入要查询的费表编号"
                      style={{ width: 200 }}
                      onSearch={value => loadPublicData(value)}
                    />
                    <Button type="link" style={{ float: 'right', marginLeft: '10px' }}
                      onClick={() => {
                        /*var ids=[];
                        publicData.map(item=>{
                          ids.push(item.id);
                        });*/
                        RemoveReadPublicFormAll(id).then(res => {
                          message.success('删除成功！');
                          initPublicLoadData(publicSearch);
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
                            // let guid = getGuid();
                            var meterEntity = {
                              keyvalue: keyvalue,//== null || id == '' ? guid : id,
                              BillId: keyvalue,//== null || id == '' ? guid : id,
                              BatchCode: values.batchCode,
                              //MeterCode: moment(values.meterCode).format('YYYYMM'),
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
                  <div style={{ color: 'rgb(255,0,0)' }}>点击本次读数列和备注列可以编辑，按回车保存。</div>
                  <Table
                    components={components}
                    onChange={(paginationConfig, filters, sorter) => {
                      loadPublicData(publicSearch, paginationConfig, sorter)
                    }}
                    bordered={false}
                    size="middle"
                    columns={publicDataColumns}
                    dataSource={publicData}
                    rowKey="id"
                    pagination={publicPagination}
                    scroll={{ y: 500, x: 1620 }}
                    loading={publicLoading}
                  />
                </TabPane>
                <TabPane tab="虚拟费表" key="3">
                  <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
                    <Search
                      className="search-input"
                      placeholder="请输入要查询的费表编号"
                      style={{ width: 200 }}
                      onSearch={value => loadVirtualData(value)}
                    />
                    <Button type="link" style={{ float: 'right', marginLeft: '10px' }}
                      onClick={() => {
                        let ids: any[] = [];
                        virtualData.map(item => {
                          ids.push(item.id);
                        });
                        RemoveReadVirtualFormAll(JSON.stringify(ids)).then(res => {
                          // if (res.code != 0) { initVirtualLoadData(); }
                          message.success('删除成功！');
                          initVirtualLoadData(virtualSearch);
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
                            // let guid = getGuid();
                            var meterEntity = {
                              keyvalue: keyvalue,//== null || id == '' ? guid : id,
                              BillId: keyvalue,//== null || id == '' ? guid : id,
                              BatchCode: values.batchCode,
                              //MeterCode: moment(values.meterCode).format('YYYYMM'),
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
                      loadVirtualData(virtualSearch, paginationConfig, sorter)
                    }}
                    bordered={false}
                    size="middle"
                    columns={virtualFeeColumns}
                    dataSource={virtualData}
                    rowKey="id"
                    pagination={virtualPagination}
                    scroll={{ y: 500, x: 1620 }}
                    loading={virtualLoading}
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
          initHouseLoadData(houseSearch);
        }}
        // id={houseFeeItemRowId}
        treeData={treeData}
      />
      <SelectReadingMeterPublic
        visible={publicFeeVisible}
        closeModal={() => {
          setPublicFeeVisible(false);
        }}
        readingDetail={readingDetail}
        reload={() => {
          initPublicLoadData(publicSearch);
        }}
      // id={publicFeeItemRowId}
      />
      <SelectReadingMeterVirtual
        visible={virtualFeeVisible}
        closeModal={() => {
          setVirtualFeeVisible(false);
        }}
        readingDetail={readingDetail}
        reload={() => {
          initVirtualLoadData(virtualSearch);
        }}
      // id={publicFeeItemRowId}
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
          onClick={() => { closeDrawer(); reload(); }}
        >
          取消
        </Button>
        <Button type="primary"
          onClick={() => onSave()}
        >
          提交
        </Button>
      </div>

    </Drawer >
  );
};

export default Form.create<ReadingMeterModifyProps>()(ReadingMeterModify);

