// 费项编辑页面
import { CwFeeitem, TreeEntity } from '@/model/models';
import { DefaultPagination } from '@/utils/defaultSetting';
import { Spin, message, Modal, Checkbox, Tabs, Select, Table, Button, Card, Icon, Divider, Col, DatePicker, Drawer, Form, Input, Row, InputNumber } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import {
  HouseRemoveForm, HouseAllRemoveForm, OrganizeRemoveForm,
  GetFormJson, GetAllFeeItems, GetOrganizePageList,
  GetUnitFeeItemData, SaveForm, GetFeeItemNames
} from './Main.service';

import { GetFeeType } from '@/services/commonItem';

import styles from './style.less';
import moment from 'moment';
import AddFormula from './AddFormula';
import AddOrginize from './AddOrganize';
import EditOrginize from './EditOrganize';
import AddHouseFee from './AddHouseFee';
import EditHouseFee from './EditHouseFee';
//优惠政策
// import AddRebateOrginize from './AddRebateOrganize';
// import EditRebateOrginize from './EditRebateOrganize';

const Option = Select.Option;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface ModifyProps {
  modifyVisible: boolean;
  // data?: any;
  selectTreeItem: any;
  closeDrawer(): void;
  form: WrappedFormUtils;
  treeData: TreeEntity[];
  id?: string;
  reload(): void;
  isInit: boolean;
}
const Modify = (props: ModifyProps) => {
  const { treeData, modifyVisible, closeDrawer, form, id, reload, selectTreeItem, isInit } = props;
  const { getFieldDecorator } = form;
  const title = id === undefined ? '新增费项' : '修改费项';
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [feetypes, setFeetype] = useState<TreeEntity[]>([]);
  const [feeItems, setFeeItems] = useState<TreeEntity[]>([]);
  const [feeItemNames, setFeeItemNames] = useState<TreeEntity[]>([]);
  const [isFormula, setIsFormula] = useState<boolean>(false);
  const [addFormulaVisible, setAddFormulaVisible] = useState<boolean>(false);
  const [selectOrgVisible, setSelectOrgVisible] = useState<boolean>(false);
  const [selectHouseVisible, setSelectHouseVisible] = useState<boolean>(false);
  const [editOrgVisible, setEditOrgVisible] = useState<boolean>(false);
  const [editHouseVisible, setEditHouseVisible] = useState<boolean>(false);
  const [linkFeeDisable, setLinkFeeDisable] = useState<boolean>(true);
  //优惠政策
  // const [selectRebateOrgVisible, setSelectRebateOrgVisible] = useState<boolean>(false);
  // const [editRebateVisible, setEditRebateVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  //打开抽屉时初始化
  useEffect(() => {
    //加载关联收费项目
    GetAllFeeItems().then(res => {
      setFeeItems(res || []);
    });
    GetFeeItemNames().then(res => {
      setFeeItemNames(res || []);
    })
  }, []);

  // const getInfo = id => {
  //   if (id) {
  //     return GetFormJson(id).then(res => {
  //       // const { feeItem, feeItemDetail } = res || ({} as any);
  //       // let info = {
  //       //   ...feeItem,
  //       //   ...feeItemDetail,
  //       // };
  //       //info.id = feeItem && feeItem.feeItemId;
  //       return res;
  //     });
  //   } else { 
  //     return Promise.resolve({
  //       parentId: 0,
  //       type: 1,
  //     }); 
  //   }
  // };

  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {

      if (id) {
        setLoading(true);
        GetFormJson(id).then((tempInfo: CwFeeitem) => {
          //加载费项类别
          // if (tempInfo.feeKind) {
          //   // var kind = tempInfo.feeKind == "收款费项" ? "ReceivablesItem" : "PaymentItem";
          //   changeFeeType(tempInfo.feeKind);
          //   setIsInit(false);
          // }

          //加载费项类别
          var newvalue = tempInfo.feeKind == "收款费项" ? "ReceivablesItem" : "PaymentItem";
          GetFeeType(newvalue).then(res => {
            setFeetype(res || []);
          });

          setInfoDetail(tempInfo);
          //设置状态
          tempInfo.accBillDateUnit == 2 ? setAccFixedDisabled(false) : setAccFixedDisabled(true);
          tempInfo.payDeadlineUnit == 2 ? setPayFixedDisabled(false) : setPayFixedDisabled(true);
          tempInfo.lateStartDateUnit == 2 ? setLateFixedDisabled(false) : setLateFixedDisabled(true);

          //如果是减免费用，则关联收费项目可用
          if (tempInfo.isCancel) {
            setLinkFeeDisable(false);
          } else {
            setLinkFeeDisable(true);
          }

          //if (id !== undefined) {
          //加载所属机构
          initOrgLoadData('');
          //加载优惠政策
          // initRebateLoadData('');
          //加载房屋费项
          initHouseLoadData('');
          form.resetFields();
          setLoading(false);

        });

        //}
      } else {
        form.resetFields();
        //设置checkbox默认值 
        var info = Object.assign({}, { isEnable: true, isInContract: true, isTax: true });
        if (isInit && selectTreeItem != null && selectTreeItem.feeKind) {
          info = Object.assign({}, info, { feeKind: selectTreeItem.feeKind });
          form.setFieldsValue({ feeKind: selectTreeItem.feeKind });
          changeFeeType(selectTreeItem.feeKind, info);
        } else {
          //清空类别
          setFeetype([]);
        }
        setInfoDetail(info);
      }
    } else {
      // form.setFieldsValue({});
      // form.resetFields([]); 
      form.resetFields();
    }
  }, [modifyVisible]);

  // const close = () => {
  //   closeDrawer();
  // };

  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true);
        const newData = infoDetail ? { ...infoDetail, ...values } : values;
        newData.keyValue = id == null || id == "" ? "" : id;
        if (!newData.isNullDate) {
          newData.beginDate = newData.beginDate.format('YYYY-MM-DD');
          newData.endDate = newData.endDate.format('YYYY-MM-DD');
        }
        else {
          //存在日期输入的情况 
          newData.beginDate = newData.beginDate ? newData.beginDate.format('YYYY-MM-DD') : null;
          newData.endDate = newData.endDate ? newData.endDate.format('YYYY-MM-DD') : null;
        }
        SaveForm(newData).then(res => {
          setLoading(false);
          message.success('保存成功');
          reload();
          closeDrawer();
        });
      }
    });
  };

  const closeAddFormula = () => {
    setAddFormulaVisible(false);
  };

  const closeOrgVisible = () => {
    setSelectOrgVisible(false);
  };
  const closeHouseVisible = () => {
    setSelectHouseVisible(false);
  };
  const closeEditHouseVisible = () => {
    setEditHouseVisible(false);
  };

  const closeEditOrgVisible = () => {
    setEditOrgVisible(false);
  };

  // const closeRebateOrgVisible = () => {
  //   setSelectRebateOrgVisible(false);
  // };

  // const closeEditRebateVisible = () => {
  //   setEditRebateVisible(false);
  // };

  const changeFeeType = (value, info?) => {
    var newvalue = value == "收款费项" ? "ReceivablesItem" : "PaymentItem";
    GetFeeType(newvalue).then(res => {
      setFeetype(res || []);
      //清除选择的值
      form.setFieldsValue({ feeType: '' });
      if (isInit && selectTreeItem != null && selectTreeItem.feeType != '') {
        var newInfo = Object.assign({}, info, { feeType: selectTreeItem.feeType });
        setInfoDetail(newInfo);
        form.setFieldsValue({ feeType: selectTreeItem.feeType });
      }
    });
  };

  //费项房屋
  const [houseData, setHouseData] = useState<any[]>([]);
  const [houseSearch, setHouseSearch] = useState<string>();
  const [houseLoading, setHouseLoading] = useState<boolean>(false);
  const [housePagination, setHousePagination] = useState<PaginationConfig>(new DefaultPagination());
  const houseLoadData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setHouseSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: housePagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: search, feeItemId: id },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'code';
    }

    return houseLoad(searchCondition).then(res => {
      return res;
    });
  };

  const houseLoad = data => {
    setHouseLoading(true);
    data.sidx = data.sidx || 'unitfeeId';
    data.sord = data.sord || 'asc';
    return GetUnitFeeItemData(data).then(res => {
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
    }).catch(() => {
      setHouseLoading(false);
    });
  };

  const initHouseLoadData = (search) => {
    setHouseSearch(search);
    const queryJson = { keyword: search, feeItemId: id };
    const sidx = 'unitfeeId';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = housePagination;
    return houseLoad({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const housecolumns = [
    {
      title: '房产编号',
      dataIndex: 'code',
      key: 'code',
      width: 160,
      sorter: true,
    },
    {
      title: '单价',
      dataIndex: 'feePrice',
      key: 'feePrice',
      width: 80,
      sorter: true,
    },
    {
      title: '周期数',
      dataIndex: 'cycleValue',
      key: 'cycleValue',
      width: 80,
      sorter: true,
    },
    {
      title: '周期单位',
      dataIndex: 'cycleType',
      key: 'cycleType',
      width: 100,
      sorter: true,
    },
    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 120,
      sorter: true,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    }, {
      title: '计费截止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      sorter: true,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    }, {
      title: '单元全称',
      dataIndex: 'allName',
      key: 'allName',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      key: 'operation',
      fixed: 'right',
      width: 75,
      render: (text, record) => {
        return [
          <span key='buttons'>
            <a onClick={() => {
              setHouseItemId(record.unitFeeId);
              setEditHouseVisible(true);
            }} key="modify">修改</a>
            {/* <Divider type="vertical" key='divider' />
            <a onClick={() => {
              Modal.confirm({
                title: '请确认',
                content: `您是否要删除吗`,
                cancelText: '取消',
                okText: '确认',
                onOk: () => {
                  HouseRemoveForm(record.unitFeeId)
                    .then(() => {
                      message.success('删除成功');
                      initOrgLoadData();
                    })
                    .catch(e => {
                      message.error('删除失败');
                    });
                },
              });
            }} key="delete">删除</a> */}
          </span>
        ];
      },
    },
  ] as ColumnProps<any>[];

  //费项组织
  const [orgData, setOrgData] = useState<any[]>([]);
  const [orgSearch, setOrgSearch] = useState<string>();
  const [orgLoading, setOrgLoading] = useState<boolean>(false);
  const [orgPagination, setOrgPagination] = useState<PaginationConfig>(new DefaultPagination());

  const orgLoadData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setOrgSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: orgPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: search, feeItemId: id },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'orgName';
    }

    return orgLoad(searchCondition).then(res => {
      return res;
    });
  };

  const orgLoad = data => {
    setOrgLoading(true);
    data.sidx = data.sidx || 'orgName';
    data.sord = data.sord || 'asc';
    return GetOrganizePageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setOrgPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setOrgData(res.data);
      setOrgLoading(false);
      return res;
    }).catch(() => {
      setOrgLoading(false);
    });
  };

  const initOrgLoadData = (search) => {
    setOrgSearch(search);
    const queryJson = { feeItemId: id };
    const sidx = 'orgName';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = orgPagination;
    return orgLoad({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const orgcolumns = [
    {
      title: '管理处',
      dataIndex: 'orgName',
      key: 'orgName',
      width: 100,
      sorter: true,
    },
    {
      title: '楼盘名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      sorter: true,
    },
    {
      title: '税率',
      dataIndex: 'taxRate',
      key: 'taxRate',
      width: 60,
      sorter: true,
    },
    {
      title: '开票项目',
      dataIndex: 'invoiceName',
      key: 'invoiceName',
      width: 120,
      sorter: true,
    },
    {
      title: '开票项目编号',
      dataIndex: 'invoiceCode',
      key: 'invoiceCode',
      width: 100,
      sorter: true,
    },

    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      key: 'operation',
      width: 80,
      render: (text, record) => {
        return [
          <span key='buttons'>
            <a onClick={() => {
              setOrgItemId(record.id);
              setEditOrgVisible(true);
            }} key="modify">修改</a>
            <Divider type="vertical" key='divider' />
            <a onClick={() => {
              Modal.confirm({
                title: '请确认',
                content: `您是否要删除吗？`,
                cancelText: '取消',
                okText: '确认',
                onOk: () => {
                  OrganizeRemoveForm(record.id)
                    .then(() => {
                      message.success('删除成功！');
                      initOrgLoadData('');
                    })
                    .catch(e => {
                      message.error('删除失败！');
                    });
                },
              });
            }} key="delete">删除</a>
          </span>
        ];
      },
    },
  ] as ColumnProps<any>[];

  const [orgItemId, setOrgItemId] = useState<string>('');
  const [houseItemId, setHouseItemId] = useState<string>('');
  // const [rebateItemId, setRebateItemId] = useState<string>('');

  //优惠政策
  // const [rebateData, setRebateData] = useState<any[]>([]);
  // const [rebateSearch, setRebateSearch] = useState<string>();
  // const [rebateLoading, setRebateLoading] = useState<boolean>(false);
  // const [rebatePagination, setRebatePagination] = useState<PaginationConfig>(new DefaultPagination());
  // const rebateLoadData = (search, paginationConfig?: PaginationConfig, sorter?) => {
  //   setRebateSearch(search);
  //   const { current: pageIndex, pageSize, total } = paginationConfig || {
  //     current: 1,
  //     pageSize: rebatePagination.pageSize,
  //     total: 0,
  //   };
  //   let searchCondition: any = {
  //     pageIndex,
  //     pageSize,
  //     total,
  //     queryJson: { keyword: search, feeItemId: id },
  //   };

  //   if (sorter) {
  //     let { field, order } = sorter;
  //     searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
  //     searchCondition.sidx = field ? field : 'id';
  //   }

  //   return rebateLoad(searchCondition).then(res => {
  //     return res;
  //   });
  // };

  // const rebateLoad = data => {
  //   setRebateLoading(true);
  //   data.sidx = data.sidx || 'id';
  //   data.sord = data.sord || 'asc';
  //   return GetRebatePageList(data).then(res => {
  //     const { pageIndex: current, total, pageSize } = res;
  //     setRebatePagination(pagesetting => {
  //       return {
  //         ...pagesetting,
  //         current,
  //         total,
  //         pageSize,
  //       };
  //     });
  //     setRebateData(res.data);
  //     setRebateLoading(false);
  //     return res;
  //   }).catch(() => {
  //     setRebateLoading(false);
  //   });
  // };

  // const initRebateLoadData = (search) => {
  //   setRebateSearch(search);
  //   const queryJson = { feeItemId: id };
  //   const sidx = 'id';
  //   const sord = 'asc';
  //   const { current: pageIndex, pageSize, total } = rebatePagination;
  //   return rebateLoad({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
  //     return res;
  //   });
  // };

  // //优惠政策列表
  // const rebatecolumns = [
  //   {
  //     title: '管理处',
  //     dataIndex: 'orgName',
  //     key: 'orgName',
  //     width: 120,
  //     sorter: true,
  //   },
  //   {
  //     title: '房产名称',
  //     dataIndex: 'name',
  //     key: 'name',
  //     width: 100,
  //     sorter: true,
  //   },
  //   {
  //     title: '优惠政策',
  //     dataIndex: 'rebateName',
  //     key: 'rebateName',
  //     width: 120,
  //     sorter: true,
  //   },
  //   {
  //     title: '起始日期',
  //     dataIndex: 'beginDate',
  //     key: 'beginDate',
  //     width: 80,
  //     sorter: true,
  //     render: val => moment(val).format('YYYY-MM-DD')
  //   },
  //   {
  //     title: '结束日期',
  //     dataIndex: 'endDate',
  //     key: 'endDate',
  //     width: 80,
  //     sorter: true,
  //     render: val => moment(val).format('YYYY-MM-DD')
  //   },

  //   {
  //     title: '操作',
  //     dataIndex: 'operation',
  //     align: 'center',
  //     key: 'operation',
  //     width: 80,
  //     render: (text, record) => {
  //       return [
  //         <span key='buttons'>
  //           <a onClick={() => {
  //             setRebateItemId(record.id);
  //             setEditRebateVisible(true);
  //           }} key="modify">修改</a>
  //           <Divider type="vertical" key='divider' />
  //           <a onClick={() => {
  //             Modal.confirm({
  //               title: '请确认',
  //               content: `您是否要删除吗？`,
  //               cancelText: '取消',
  //               okText: '确认',
  //               onOk: () => {
  //                 RebateRemoveForm(record.id)
  //                   .then(() => {
  //                     message.success('删除成功！');
  //                     initRebateLoadData('');
  //                   })
  //                   .catch(e => {
  //                     message.error('删除失败！');
  //                   });
  //               },
  //             });
  //           }} key="delete">删除</a>
  //         </span>
  //       ];
  //     },
  //   },
  // ] as ColumnProps<any>[];

  const [showFeeField, setShowFeeField] = useState<boolean>(false);
  const [accFixedDisabled, setAccFixedDisabled] = useState<boolean>(true);
  const [payFixedDisabled, setPayFixedDisabled] = useState<boolean>(true);
  const [lateFixedDisabled, setLateFixedDisabled] = useState<boolean>(true);

  const setEndDate = (beginDate: string, cycleValue?: number, cycleType?: string) => {
    var startDate = moment(beginDate);
    var endDate = "";
    if (cycleType == '日') {
      endDate = startDate.add(cycleValue, 'days').add(-1, 'days').format('YYYY-MM-DD');
    } else if (cycleType == '月') {
      endDate = startDate.add(cycleValue, 'month').add(-1, 'days').format('YYYY-MM-DD');
    } else {
      endDate = startDate.add(cycleValue, 'years').add(-1, 'days').format('YYYY-MM-DD');
    }
    var info = Object.assign({}, infoDetail, { endDate: endDate, cycleValue: cycleValue, cycleType: cycleType });
    setInfoDetail(info);
  }

  //求自然月日期
  const getMonthBeforeFormatAndDay = (num, format, date) => {
    let day = date.get('date');
    let month = date.get('month');
    date.set('month', month + num * 1, 'date', 1); //周期月一号
    //读取日期自动会减一，所以要加一
    let mo = date.get('month') + 1;
    //小月
    if (mo == 4 || mo == 6 || mo == 9 || mo == 11) {
      if (day > 30) {
        day = 30;
      }
    }
    //2月
    else if (mo == 2) {
      //闰年
      if (date.isLeapYear()) {
        if (day > 29) {
          day = 29;
        } else {
          day = 28;
        }
      }
      if (day > 28) {
        day = 28;
      }
    }
    //大月
    else {
      if (day > 31) {
        day = 31;
      }
    }
    date.set('date', day);
    return date;
  };

  //设置结束日期
  const getEndDate = () => {
    const cycle = form.getFieldValue('cycleValue');
    const cycletype = form.getFieldValue('cycleType')
    let d = form.getFieldValue('beginDate');
    if (d != "") {
      let endDate = moment(d);
      if (cycletype == "日") {
        //日
        endDate.set('date', endDate.get('date') + cycle);
      } else if (cycletype == "月") {
        // 月
        endDate = getMonthBeforeFormatAndDay(cycle, "-", endDate);
      } else {
        //年
        endDate.set('year', endDate.get('year') + cycle);
      }
      endDate.set('date', endDate.get('date') - 1);
      return endDate;
    }
    return '';
  };

  const [selectedHouseRowKeys, setSelectedHouseRowKeys] = useState<string[]>([]);
  //费项房屋选择
  const houseRowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let str: any[]; str = [];
      for (var i = 0; i < selectedRows.length; i++) {
        str.push(selectedRows[i].unitFeeId + '');
      }
      setSelectedHouseRowKeys(str);
      //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }
  };

  //删除
  const deleteHouse = () => {
    if (selectedHouseRowKeys.length == 0) {
      message.warning('请选择要删除的房屋');
    } else {
      Modal.confirm({
        title: '请确认',
        content: `您是否要删除？删除后无法恢复！`,
        onOk: () => {
          HouseRemoveForm({ feeitemid: id, keyValues: JSON.stringify(selectedHouseRowKeys) }).then(() => {
            message.success('删除成功');
            houseLoadData('');
          });
        },
      });
    }
  };

  //全部删除
  const deleteAllHouse = () => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要全部删除？删除后无法恢复！`,
      onOk: () => {
        HouseAllRemoveForm({ feeitemId: id }).then(() => {
          message.success('删除成功！');
          houseLoadData('');
        });
      },
    });
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={780}
      onClose={closeDrawer}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Form layout="vertical" hideRequiredMark>
        <Spin tip="数据处理中..." spinning={loading}>
          <Tabs defaultActiveKey="1" >
            <TabPane tab="基本信息" key="1">
              <Card className={styles.card} >
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="费项种类" required>
                      {getFieldDecorator('feeKind', {
                        initialValue: infoDetail.feeKind,
                        rules: [{ required: true, message: '请选择费项种类' }],
                      })(<Select placeholder="请选择费项种类"
                        disabled={infoDetail.feeKind ? true : false}
                        onChange={value => { changeFeeType(value) }}
                      >
                        <Option value="收款费项">收款费项</Option>
                        <Option value="付款费项" >付款费项</Option>
                      </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="费项类别" required>
                      {getFieldDecorator('feeType', {
                        initialValue: infoDetail.feeType,
                        rules: [{ required: true, message: '请选择费项类别' }]
                      })(
                        <Select placeholder="请选择费项类别" >
                          {feetypes.map(item => (
                            <Option key={item.key} value={item.value}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="费项名称" required>
                      {getFieldDecorator('feeName', {
                        initialValue: infoDetail.feeName,
                        rules: [{ required: true, message: '请输入费项名称' }],
                      })(<Input placeholder="请输入费项名称" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="费项编号">
                      {getFieldDecorator('feeCode', {
                        initialValue: infoDetail.feeCode,
                        rules: [{ required: true, message: '请输入费项编号' }],
                      })(<Input placeholder="请输入费项编号" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="单价">
                      {getFieldDecorator('feePrice', {
                        initialValue: infoDetail.feePrice,
                        rules: [{ required: true, message: '请输入单价' }],
                      })(<InputNumber placeholder="请输入单价" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={24}>
                    {/* <Form.Item  >
                    <Checkbox
                      checked={infoDetail.isNullDate ? true : false}
                      onChange={(e) => {
                        var info = Object.assign({}, infoDetail, { isNullDate: e.target.checked });
                        setInfoDetail(info);
                      }}>起止日期不允许为空</Checkbox>
                    <Checkbox checked={infoDetail.isModifyDate ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isModifyDate: e.target.checked });
                      setInfoDetail(info);
                    }} >允许修改起止日期</Checkbox>
                    <Checkbox checked={infoDetail.isInContract ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isInContract: e.target.checked });
                      setInfoDetail(info);
                    }}>允许在合同中添加</Checkbox>
                    <Checkbox checked={infoDetail.isTax ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isTax: e.target.checked });
                      setInfoDetail(info);
                    }}>含税单价</Checkbox>
                    <Checkbox checked={infoDetail.isCancel ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isCancel: e.target.checked });
                      setInfoDetail(info);
                    }}>减免费项</Checkbox>
                  </Form.Item> */}

                    <Form.Item>
                      {getFieldDecorator('isNullDate', {
                        initialValue: infoDetail.isNullDate ? true : false,
                      })(<Checkbox checked={form.getFieldValue('isNullDate')}>
                        起止日期允许为空
                      </Checkbox>
                      )}
                      {getFieldDecorator('isModifyDate', {
                        initialValue: infoDetail.isModifyDate ? true : false,
                      })(<Checkbox checked={form.getFieldValue('isModifyDate')}>
                        允许修改起止日期
                      </Checkbox>
                      )}
                      {getFieldDecorator('isCustomizeDate', {
                        initialValue: infoDetail.isCustomizeDate ? true : false,
                      })(<Checkbox checked={form.getFieldValue('isCustomizeDate')}>
                        自定义起止日期
                      </Checkbox>
                      )}
                      {getFieldDecorator('isTax', {
                        initialValue: infoDetail.isTax ? true : false,
                      })(<Checkbox checked={form.getFieldValue('isTax')}>
                        含税单价
                      </Checkbox>
                      )}
                      {getFieldDecorator('isCancel', {
                        initialValue: infoDetail.isCancel ? true : false,
                      })(<Checkbox checked={form.getFieldValue('isCancel')} onChange={(e) => {
                        if (e.target.checked) {
                          setLinkFeeDisable(false);
                        } else {
                          setLinkFeeDisable(true);
                        }
                      }}>
                        减免费项
                      </Checkbox>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={24}>
                    {/* <Form.Item  >
                    <Checkbox checked={infoDetail.isTemp ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isTemp: e.target.checked });
                      setInfoDetail(info);
                    }}>不允许临时加费</Checkbox>
                    <Checkbox checked={infoDetail.isEditTemp ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isEditTemp: e.target.checked });
                      setInfoDetail(info);
                    }}>临时加费不允许修改单价</Checkbox>
                    <Checkbox checked={infoDetail.isCustomizeDate ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isCustomizeDate: e.target.checked });
                      setInfoDetail(info);
                    }}>自定义起止日期</Checkbox>
                    <Checkbox checked={infoDetail.isEnable ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isEnable: e.target.checked });
                      setInfoDetail(info);
                    }}>是否停用</Checkbox>
                  </Form.Item> */}
                    <Form.Item  >
                      {getFieldDecorator('isInContract', {
                        initialValue: infoDetail.isInContract ? true : false,
                      })(<Checkbox checked={form.getFieldValue('isInContract')}>
                        允许在合同中添加
                      </Checkbox>
                      )}
                      {getFieldDecorator('isTemp', {
                        initialValue: infoDetail.isTemp ? true : false,
                      })(<Checkbox checked={form.getFieldValue('isTemp')}>
                        允许临时加费
                      </Checkbox>
                      )}
                      {getFieldDecorator('isEditTemp', {
                        initialValue: infoDetail.isEditTemp ? true : false,
                      })(<Checkbox checked={form.getFieldValue('isEditTemp')}>
                        临时加费允许修改单价
                      </Checkbox>
                      )}
                      {getFieldDecorator('isEnable', {
                        initialValue: infoDetail.isEnable ? true : false,
                      })(<Checkbox checked={form.getFieldValue('isEnable')}>
                        是否启用
                      </Checkbox>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="关联收费项目" >
                      {getFieldDecorator('linkFee', {
                        initialValue: infoDetail.linkFee,
                      })(
                        <Select placeholder="请选择关联收费项目" disabled={linkFeeDisable} >
                          {feeItems.map(item => (
                            <Option key={item.key} value={item.value}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={7}>
                    <Form.Item label="计费周期">
                      {getFieldDecorator('cycleValue', {
                        initialValue: infoDetail.cycleValue ? infoDetail.cycleValue : 1,
                        rules: [{ required: true, message: '请输入计费周期' }],
                      })(<InputNumber placeholder="请输入计费周期" min={1} style={{ width: '100%' }}
                        onChange={value => {
                          setEndDate(infoDetail.beginDate, value, infoDetail.cycleType);
                        }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="单位">
                      {getFieldDecorator('cycleType', {
                        initialValue: infoDetail.cycleType ? infoDetail.cycleType : '月',
                        rules: [{ required: true, message: '请选择单位' }],
                      })(<Select placeholder="请选择单位" onChange={(value: string) => {
                        setEndDate(infoDetail.beginDate, infoDetail.cycleValue, value);
                      }}>
                        <Option value="日">日</Option>
                        <Option value="月" >月</Option>
                        <Option value="年">年</Option>
                      </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="计费起始日期">
                      {getFieldDecorator('beginDate', {
                        // initialValue: form.getFieldValue('isNullDate') ? null : infoDetail.beginDate ? moment(infoDetail.beginDate) : moment(new Date()),
                        initialValue: infoDetail.isNullDate ? null : (infoDetail.beginDate ? moment(infoDetail.beginDate) : moment(new Date())),
                        rules: [{ required: !form.getFieldValue('isNullDate'), message: '请选择计费起始日期' }],
                      })(<DatePicker placeholder="请选择计费起始日期" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="计费截止日期">
                      {getFieldDecorator('endDate', {
                        initialValue: form.getFieldValue('beginDate') ? getEndDate() : null,
                        // initialValue: form.getFieldValue('beginDate') ? getEndDate() : null,
                        // initialValue: form.getFieldValue('isNullDate') ? null : getEndDate(),
                        // infoDetail.endDate ? moment(new Date(infoDetail.endDate)) : moment(getEndDate()),
                        rules: [{ required: !form.getFieldValue('isNullDate'), message: '计费截止日期' }],
                      })(<DatePicker disabled placeholder="计费截止日期" style={{ width: '100%' }} onChange={(date, dateString) => {
                        setEndDate(dateString, infoDetail.cycleValue, infoDetail.cycleType);
                      }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={21}>
                    <Form.Item label="用量公式">
                      {getFieldDecorator('feeFormulaOne', {
                        initialValue: infoDetail.feeFormulaOne ? infoDetail.feeFormulaOne : '1',
                        rules: [{ required: true, message: '请设置用量公式' }],
                      })(<Input placeholder="请设置用量公式" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
                    <Form.Item label="&nbsp;">
                      <Button type="primary" onClick={() => {
                        setAddFormulaVisible(true);
                        setIsFormula(true);
                      }}>设置</Button>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={21}>
                    <Form.Item label="系数公式">
                      {getFieldDecorator('feeApportion', {
                        initialValue: infoDetail.feeApportion ? infoDetail.feeApportion : '1',
                        rules: [{ required: true, message: '请设置系数公式' }],
                      })(<Input placeholder="请设置系数公式" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
                    <Form.Item label="&nbsp;">
                      <Button type="primary" onClick={() => {
                        setAddFormulaVisible(true);
                        setIsFormula(false);
                      }}>设置</Button>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="滞纳金比例(%)">
                      {getFieldDecorator('delayRate', {
                        initialValue: infoDetail.delayRate ? infoDetail.delayRate : 0,
                        // rules: [{ required: true, message: '请输入滞纳金比例' }],
                      })(<InputNumber placeholder="请输入滞纳金比例" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="计算方法">
                      {getFieldDecorator('delayType', {
                        initialValue: infoDetail.delayType ? infoDetail.delayType : 1,
                        // rules: [{ required: true, message: '请选择滞纳金计算方式' }],
                      })(
                        <Select placeholder="选择滞纳金计算方式">
                          <Option value={1}>按天计算（固定滞纳率）</Option>
                          <Option value={2}>按月计算（固定滞纳率）</Option>
                          <Option value={3}>按季计算（固定滞纳率）</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="附加说明">
                      {getFieldDecorator('memo', {
                        initialValue: infoDetail.memo,
                      })(<TextArea rows={6} placeholder="请输入附加说明" />)}
                    </Form.Item>
                  </Col>
                </Row>

              </Card>
            </TabPane>
            <TabPane tab="高级" key="2">
              <Card title="小数精度" className={styles.card2} hoverable >
                <Row gutter={24}>
                  <Col lg={7}>
                    <Form.Item label="中间每一步计算结果保留">
                      {getFieldDecorator('midResultScale', {
                        initialValue: infoDetail.midResultScale || infoDetail.midResultScale == 0 ? infoDetail.midResultScale : 2,
                        rules: [{ required: true, message: '请选择小数位数' }],
                      })(
                        <Select placeholder="请选择小数位数">
                          <Option value={0}>0</Option>
                          <Option value={1}>1</Option>
                          <Option value={2}>2</Option>
                          <Option value={3}>3</Option>
                          <Option value={4}>4</Option>
                          <Option value={5}>5</Option>
                          <Option value={6}>6</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="对最后一位">
                      {getFieldDecorator('midScaleDispose', {
                        initialValue: infoDetail.midScaleDispose ? infoDetail.midScaleDispose : 1,
                        rules: [{ required: true, message: '请选择小数处理方法' }],
                      })(
                        <Select placeholder="请选择小数处理方法">
                          <Option value={1}>四舍五入</Option>
                          <Option value={2}>直接舍去</Option>
                          <Option value={3}>有数进一</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col> 
                  <Col lg={7}>
                    <Form.Item label="最终结果保留小数位数">
                      {getFieldDecorator('lastResultScale', {
                        initialValue: infoDetail.lastResultScale || infoDetail.lastResultScale == 0 ? infoDetail.lastResultScale : 2,
                        rules: [{ required: true, message: '请选择小数位数' }],
                      })(
                        <Select placeholder="请选择小数位数">
                          <Option value={0}>0</Option>
                          <Option value={1}>1</Option>
                          <Option value={2}>2</Option>
                          {/* <Option value={3}>3</Option>
                        <Option value={4}>4</Option> */}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="对最后一位">
                      {getFieldDecorator('lastScaleDispose', {
                        initialValue: infoDetail.lastScaleDispose ? infoDetail.lastScaleDispose : 1,
                        rules: [{ required: true, message: '请选择小数处理方法' }],
                      })(
                        <Select placeholder="请选择小数处理方法">
                          <Option value={1}>四舍五入</Option>
                          <Option value={2}>直接舍去</Option>
                          <Option value={3}>有数进一</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                {/* <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="单价保留小数点">
                      {getFieldDecorator('calcPrecision', {
                        initialValue: infoDetail.calcPrecision ? infoDetail.calcPrecision : 2,
                        rules: [{ required: true, message: '请填写保留几位' }],
                      })(<InputNumber placeholder="请填写保留几位" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="计算精度">
                      {getFieldDecorator('calcPrecisionMode', {
                        initialValue: infoDetail.calcPrecisionMode ? infoDetail.calcPrecisionMode : "最终计算结果保留2位",
                      })(<Select>
                        <Option value="每步计算结果保留2位">每步计算结果保留2位</Option>
                        <Option value="最终计算结果保留2位">最终计算结果保留2位</Option> 
                      </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row> */}

              </Card>
              <Card title="账单日设置" className={styles.card2} hoverable>
                <Row gutter={8}>
                  <Col span={6}>
                    <Form.Item label="应收期间 距">
                      {getFieldDecorator('accPeriodBase', {
                        initialValue: infoDetail.accPeriodBase ? infoDetail.accPeriodBase : 2,
                        rules: [{ required: true, message: '请选择应收期间' }],
                      })(
                        <Select placeholder="==选择应收期间==">
                          <Option value={1}>同一季度费用,每季度首月为应收期间</Option>
                          <Option value={2} >计费起始日期</Option>
                          <Option value={3}>计费截止日期</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('accPeriodBaseNum', {
                        initialValue: infoDetail.accPeriodBaseNum ? infoDetail.accPeriodBaseNum : 0,
                        rules: [{ required: true, message: '请输入数量' }],
                      })(
                        <InputNumber style={{ width: '100%' }} precision={0} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('accPeriodBaseUnit', {
                        initialValue: infoDetail.accPeriodBaseUnit ? infoDetail.accPeriodBaseUnit : 2,
                        rules: [{ required: true, message: '请选择单位' }],
                      })(
                        <Select placeholder="==选择单位==">
                          <Option value={1}>天</Option>
                          <Option value={2} >月</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={6}>
                    <Form.Item label="账单日 距">
                      {getFieldDecorator('accBillDateBase', {
                        initialValue: infoDetail.accBillDateBase ? infoDetail.accBillDateBase : 2,
                        rules: [{ required: true, message: '请选择账单日' }],
                      })(
                        <Select placeholder="==选择账单日==">
                          <Option value={1}>同一季度费用,每季度首月为账单期间</Option>
                          <Option value={2} >计费起始日期</Option>
                          <Option value={3}>计费截止日期</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('accBillDateNum', {
                        initialValue: infoDetail.accBillDateNum ? infoDetail.accBillDateNum : 0,
                        rules: [{ required: true, message: '请输入数量' }],
                      })(
                        <InputNumber style={{ width: '100%' }} precision={0} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('accBillDateUnit', {
                        initialValue: infoDetail.accBillDateUnit ? infoDetail.accBillDateUnit : 1,
                        rules: [{ required: true, message: '请选择单位' }],
                      })(
                        <Select placeholder="==选择单位==" onChange={value => {
                          if (value == 1) {
                            setAccFixedDisabled(true);
                          } else {
                            setAccFixedDisabled(false);
                          }
                        }}>
                          <Option value={1}>天</Option>
                          <Option value={2}>月</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('accBillDateFixed', {
                        initialValue: infoDetail.accBillDateFixed,
                      })(
                        <Select disabled={accFixedDisabled}>
                          <Option value="1">1日</Option>
                          <Option value="2">2日</Option>
                          <Option value="3">3日</Option>
                          <Option value="4">4日</Option>
                          <Option value="5">5日</Option>
                          <Option value="6">6日</Option>
                          <Option value="7">7日</Option>
                          <Option value="8">8日</Option>
                          <Option value="9">9日</Option>
                          <Option value="10">10日</Option>
                          <Option value="11">11日</Option>
                          <Option value="12">12日</Option>
                          <Option value="13">13日</Option>
                          <Option value="14">14日</Option>
                          <Option value="15">15日</Option>
                          <Option value="16">16日</Option>
                          <Option value="17">17日</Option>
                          <Option value="18">18日</Option>
                          <Option value="19">19日</Option>
                          <Option value="20">20日</Option>
                          <Option value="21">21日</Option>
                          <Option value="22">22日</Option>
                          <Option value="23">23日</Option>
                          <Option value="24">24日</Option>
                          <Option value="25">25日</Option>
                          <Option value="26">26日</Option>
                          <Option value="27">27日</Option>
                          <Option value="28">28日</Option>
                          <Option value="29">29日</Option>
                          <Option value="30">30日</Option>
                          <Option value="31">31日</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={6}>
                    <Form.Item label="收款截止日 距">
                      {getFieldDecorator('payDeadlineBase', {
                        initialValue: infoDetail.payDeadlineBase ? infoDetail.payDeadlineBase : 3,
                        rules: [{ required: true, message: '请选择收款截止日' }],
                      })(
                        <Select placeholder="==选择收款截止日==">
                          <Option value={1}>同一季度费用,每季度首月</Option>
                          <Option value={2}>计费起始日期</Option>
                          <Option value={3}>计费截止日期</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('payDeadlineNum', {
                        initialValue: infoDetail.payDeadlineNum ? infoDetail.payDeadlineNum : 0,
                        rules: [{ required: true, message: '请输入数量' }],
                      })(
                        <InputNumber style={{ width: '100%' }} precision={0} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('payDeadlineUnit', {
                        initialValue: infoDetail.payDeadlineUnit ? infoDetail.payDeadlineUnit : 1,
                        rules: [{ required: true, message: '请选择单位' }],
                      })(
                        <Select placeholder="==选择单位==" onChange={value => {
                          if (value == 1) {
                            setPayFixedDisabled(true);
                          } else {
                            setPayFixedDisabled(false);
                          }
                        }}>
                          <Option value={1}>天</Option>
                          <Option value={2} >月</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('payDeadlineFixed', {
                        initialValue: infoDetail.payDeadlineFixed,
                      })(
                        <Select disabled={payFixedDisabled}>
                          <Option key="1"> 1日</Option>
                          <Option key="2"> 2日</Option>
                          <Option key="3"> 3日</Option>
                          <Option key="4"> 4日</Option>
                          <Option key="5"> 5日</Option>
                          <Option key="6"> 6日</Option>
                          <Option key="7"> 7日</Option>
                          <Option key="8"> 8日</Option>
                          <Option key="9"> 9日</Option>
                          <Option key="10"> 10日</Option>
                          <Option key="11"> 11日</Option>
                          <Option key="12"> 12日</Option>
                          <Option key="13"> 13日</Option>
                          <Option key="14"> 14日</Option>
                          <Option key="15"> 15日</Option>
                          <Option key="16"> 16日</Option>
                          <Option key="17"> 17日</Option>
                          <Option key="18"> 18日</Option>
                          <Option key="19"> 19日</Option>
                          <Option key="20"> 20日</Option>
                          <Option key="21"> 21日</Option>
                          <Option key="22"> 22日</Option>
                          <Option key="23"> 23日</Option>
                          <Option key="24"> 24日</Option>
                          <Option key="25"> 25日</Option>
                          <Option key="26"> 26日</Option>
                          <Option key="27"> 27日</Option>
                          <Option key="28"> 28日</Option>
                          <Option key="29"> 29日</Option>
                          <Option key="30"> 30日</Option>
                          <Option key="31"> 31日</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={6}>
                    <Form.Item label="滞纳金起算日 距">
                      {getFieldDecorator('lateStartDateBase', {
                        initialValue: infoDetail.lateStartDateBase ? infoDetail.lateStartDateBase : 3,
                        rules: [{ required: true, message: '请选择滞纳金起算日' }],
                      })(
                        <Select placeholder="==选择滞纳金起算日==">
                          <Option value={1}>同一季度费用,每季度首月</Option>
                          <Option value={2}>计费起始日期</Option>
                          <Option value={3}>计费截止日期</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('lateStartDateNum', {
                        initialValue: infoDetail.lateStartDateNum ? infoDetail.lateStartDateNum : 1,
                        rules: [{ required: true, message: '请输入数量' }],
                      })(
                        <InputNumber style={{ width: '100%' }} precision={0} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('lateStartDateUnit', {
                        initialValue: infoDetail.lateStartDateUnit ? infoDetail.lateStartDateUnit : 1,
                        rules: [{ required: true, message: '请选择单位' }],
                      })(
                        <Select placeholder="==选择单位==" onChange={value => {
                          if (value == 1) {
                            setLateFixedDisabled(true);
                          } else {
                            setLateFixedDisabled(false);
                          }
                        }}>
                          <Option value={1}>天</Option>
                          <Option value={2} >月</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('lateStartDateFixed', {
                        initialValue: infoDetail.lateStartDateFixed,
                      })(
                        <Select disabled={lateFixedDisabled}>
                          <Option key="1"> 1日</Option>
                          <Option key="2"> 2日</Option>
                          <Option key="3"> 3日</Option>
                          <Option key="4"> 4日</Option>
                          <Option key="5"> 5日</Option>
                          <Option key="6"> 6日</Option>
                          <Option key="7"> 7日</Option>
                          <Option key="8"> 8日</Option>
                          <Option key="9"> 9日</Option>
                          <Option key="10">10日</Option>
                          <Option key="11">11日</Option>
                          <Option key="12">12日</Option>
                          <Option key="13">13日</Option>
                          <Option key="14">14日</Option>
                          <Option key="15">15日</Option>
                          <Option key="16">16日</Option>
                          <Option key="17">17日</Option>
                          <Option key="18">18日</Option>
                          <Option key="19">19日</Option>
                          <Option key="20">20日</Option>
                          <Option key="21">21日</Option>
                          <Option key="22">22日</Option>
                          <Option key="23">23日</Option>
                          <Option key="24">24日</Option>
                          <Option key="25">25日</Option>
                          <Option key="26">26日</Option>
                          <Option key="27">27日</Option>
                          <Option key="28">28日</Option>
                          <Option key="29">29日</Option>
                          <Option key="30">30日</Option>
                          <Option key="31">31日</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <Card title="其他" className={styles.card} hoverable>
                <Row gutter={24}>
                  <Col span={6}  >
                    <Form.Item label='&nbsp;'>
                      {getFieldDecorator('payedCreateCope', {
                        initialValue: infoDetail.payedCreateCope ? infoDetail.payedCreateCope : false,
                      })(
                        <Checkbox onChange={(e) => {
                          if (e.target.checked) {
                            setShowFeeField(true);
                            var info = Object.assign({}, infoDetail, { payedCreateCope: e.target.checked })
                            setInfoDetail(info);
                          } else {
                            setShowFeeField(false);
                            var info = Object.assign({}, infoDetail, { payedCreateCope: e.target.checked, payDateUnit: null, payDateNum: null })
                            setInfoDetail(info);
                          }
                        }}>收款后生成付款</Checkbox>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6}  >
                    <Form.Item label='应付款项'>
                      {getFieldDecorator('payFeeItemId', {
                        initialValue: infoDetail.payFeeItemId,
                      })(
                        <Select placeholder="==请选择==">
                          {feeItemNames.map(item => (
                            <Option value={item.value} key={item.key}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} >
                    <Form.Item label="应付比例（100%）">
                      {getFieldDecorator('copeRate', {
                        initialValue: infoDetail.copeRate ? infoDetail.copeRate : 100,
                      })(
                        <InputNumber style={{ width: '100%' }} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6}  >
                    <Form.Item label='付款对象'>
                      {getFieldDecorator('copePersonType', {
                        initialValue: infoDetail.copePersonType ? infoDetail.copePersonType : 2,
                      })(
                        <Select placeholder="==付款对象==">
                          <Option value={1}>业主</Option>
                          <Option value={2}>租户</Option>
                          <Option value={3}>租户，空置时转给业主</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24} style={{ display: showFeeField ? "" : "none" }}>
                  <Col span={6}>
                    <Form.Item label="应付期间距收款日">
                      {getFieldDecorator('payDateNum', {
                        initialValue: infoDetail.payDateNum ? infoDetail.payDateNum : 0,
                      })(
                        <InputNumber style={{ width: '100%' }} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('payDateUnit', {
                        initialValue: infoDetail.payDateUnit ? infoDetail.payDateUnit : 1,
                      })(
                        <Select placeholder="==请选择单位==">
                          <Option value={1}>天</Option>
                          <Option value={2}>月</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </TabPane>
            {
              id ?
                <TabPane tab="所属机构" key="3" style={{ marginBottom: '20px' }}>
                  <div style={{ marginBottom: '5px', padding: '3px 2px' }}>
                    <Input.Search
                      key='orgsearch'
                      className="search-input"
                      placeholder="搜索费项机构"
                      style={{ width: 180 }}
                      onSearch={value => orgLoadData(value)}
                    />
                    <Button type="link" style={{ float: 'right' }}
                      onClick={() => { setSelectOrgVisible(true) }}
                    >
                      <Icon type="plus" />
                      新增
                </Button>
                    {/* <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                  onClick={() => {}}
                >
                  <Icon type="plus" />
                  刷新
                </Button> */}
                  </div>
                  <Table
                    key='list'
                    style={{ border: 'none' }}
                    bordered={false}
                    size="middle"
                    dataSource={orgData}
                    columns={orgcolumns}
                    rowKey={record => record.id}
                    pagination={orgPagination}
                    scroll={{ y: 420 }}
                    onChange={(pagination: PaginationConfig, filters, sorter) =>
                      orgLoadData(orgSearch, pagination, sorter)
                    }
                    loading={orgLoading}
                  />
                </TabPane>
                : null
            }

            {/* {
            id ?
              <TabPane tab="优惠政策" key="4" style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '5px', padding: '3px 2px' }}>
                  <Input.Search
                    key='rebateorgsearch'
                    className="search-input"
                    placeholder="请输入要查询的房产名称"
                    style={{ width: 200 }}
                    onSearch={value => orgLoadData(value)}
                  />
                  <Button type="link" style={{ float: 'right' }}
                    onClick={() => { setSelectRebateOrgVisible(true) }}
                  >
                    <Icon type="plus" />
                    新增
                </Button> 
                </div>
                <Table
                  key='rebatelist'
                  style={{ border: 'none' }}
                  bordered={false}
                  size="middle"
                  dataSource={rebateData}
                  columns={rebatecolumns}
                  rowKey={record => record.id}
                  pagination={rebatePagination}
                  scroll={{ y: 420 }}
                  onChange={(pagination: PaginationConfig, filters, sorter) =>
                    rebateLoadData(rebateSearch, pagination, sorter)
                  }
                  loading={rebateLoading}
                />
              </TabPane>
              : null
          } */}

            {
              id && infoDetail.feeKind == '收款费项' ?
                <TabPane tab="设置房屋费项" key="5" style={{ marginBottom: '20px' }}>
                  <div style={{ marginBottom: '5px', padding: '3px 2px' }}>
                    <Input.Search
                      key='search'
                      className="search-input"
                      placeholder="请输入要查询的房屋编号"
                      style={{ width: 210 }}
                      onSearch={value => houseLoadData(value)}
                    />
                    {/* <Button type="link" style={{ float: 'right' }}
                    onClick={() => { initOrgLoadData() }}
                  >
                    <Icon type="reload" />
                    刷新
                </Button> */}

                    <Button type="link" style={{ float: 'right' }}
                      onClick={deleteAllHouse}
                    >
                      <Icon type="delete" />
                      全部删除
                </Button>

                    <Button type="link" style={{ float: 'right' }}
                      onClick={deleteHouse}
                    >
                      <Icon type="delete" />
                      删除
                </Button>
                    <Button type="link" style={{ float: 'right' }}
                      onClick={() => {
                        //请选择费项所属的组织机构！
                        if (orgData == null || orgData.length == 0) {
                          message.error('请选择费项所属的组织机构！');
                        }
                        else {
                          setSelectHouseVisible(true);
                        }
                      }}
                    >
                      <Icon type="plus" />
                      新增
                </Button>

                  </div>
                  <Table
                    key='list'
                    style={{ border: 'none' }}
                    bordered={false}
                    size="middle"
                    rowSelection={houseRowSelection}
                    dataSource={houseData}
                    columns={housecolumns}
                    rowKey={record => record.unitFeeId}
                    pagination={housePagination}
                    scroll={{ y: 420, x: 1100 }}
                    onChange={(pagination: PaginationConfig, filters, sorter) =>
                      houseLoadData(houseSearch, pagination, sorter)
                    }
                    loading={houseLoading}
                  />
                </TabPane> : null
            }
          </Tabs>
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
            zIndex: 999
          }}
        >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            取消
        </Button>
          <Button onClick={save} type="primary">
            提交
        </Button>
        </div>
      </Form>
      <AddFormula
        visible={addFormulaVisible}
        closeModal={closeAddFormula}
        getFormulaStr={(str, isFormula) => {
          if (isFormula) {
            var info = Object.assign({}, infoDetail, { feeFormulaOne: str });
            setInfoDetail(info);
          } else {
            var info = Object.assign({}, infoDetail, { feeApportion: str });
            setInfoDetail(info);
          }
        }}
        isFormula={isFormula}
      />
      <AddOrginize
        visible={selectOrgVisible}
        closeModal={closeOrgVisible}
        feeId={id}
        // reload={initOrgLoadData}
        reload={() => initOrgLoadData(orgSearch)}
      />
      <EditOrginize
        visible={editOrgVisible}
        closeModal={closeEditOrgVisible}
        orgItemId={orgItemId}
        // reload={initOrgLoadData}
        reload={() => initOrgLoadData(orgSearch)}
      />

      {/* <AddRebateOrginize
        visible={selectRebateOrgVisible}
        closeModal={closeRebateOrgVisible}
        feeId={id}
        reload={() => initRebateLoadData(rebateSearch)}
      />

      <EditRebateOrginize
        visible={editRebateVisible}
        closeModal={closeEditRebateVisible}
        id={rebateItemId}
        reload={() => initRebateLoadData(rebateSearch)}
      /> */}

      <AddHouseFee
        treeData={treeData}
        visible={selectHouseVisible}
        closeModal={closeHouseVisible}
        feeId={id}
        reload={() => initHouseLoadData(houseSearch)}
      />
      <EditHouseFee
        visible={editHouseVisible}
        closeModal={closeEditHouseVisible}
        houseItemId={houseItemId}
        reload={() => initHouseLoadData(houseSearch)}
      />

    </Drawer>
  );
};

export default Form.create<ModifyProps>()(Modify);

