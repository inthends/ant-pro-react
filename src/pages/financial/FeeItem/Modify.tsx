import { TreeEntity } from '@/model/models';
import { DefaultPagination } from '@/utils/defaultSetting';
import { message, Modal, Checkbox, Tabs, Select, Table, Button, Card, Icon, Divider, Col, DatePicker, Drawer, Form, Input, Row, InputNumber } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { HouseRemoveForm, OrganizeRemoveForm, GetFormJson, GetFeeType, GetAllFeeItems, GetOrganizePageList, GetUnitFeeItemData, SaveForm, GetFeeItemName } from './Main.service';
import styles from './style.less';
import moment from 'moment';
import AddFormula from './AddFormula';
import AddOrginize from './AddOrginize';
import EditOrginize from './EditOrginize';
import AddHouseFee from './AddHouseFee';
import EditHouseFee from './EditHouseFee';
const Option = Select.Option;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface ModifyProps {
  modifyVisible: boolean;
  // data?: any;
  closeDrawer(): void;
  form: WrappedFormUtils;
  treeData: TreeEntity[];
  id?: string;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { modifyVisible, closeDrawer, form, id, reload } = props;
  const { getFieldDecorator } = form;
  const title = id === undefined ? '添加费项' : '修改费项';
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [feetypes, setFeetype] = useState<TreeEntity[]>([]);
  const [feeitems, setFeeitems] = useState<TreeEntity[]>([]);
  const [isFormula, setIsFormula] = useState<boolean>(false);
  const [addFormulaVisible, setAddFormulaVisible] = useState<boolean>(false);
  const [selectOrgVisible, setSelectOrgVisible] = useState<boolean>(false);
  const [selectHouseVisible, setSelectHouseVisible] = useState<boolean>(false);
  const [editOrgVisible, setEditOrgVisible] = useState<boolean>(false);
  const [feeItemNames, setFeeItemNames] = useState<any[]>([]);
  const [editHouseVisible, setEditHouseVisible] = useState<boolean>(false);
  const [isInit, setIsInit] = useState<boolean>(true);
  //打开抽屉时初始化
  useEffect(() => {
    //加载关联收费项目
    GetAllFeeItems().then(res => {
      setFeeitems(res || []);
    });
    GetFeeItemName().then(res => {
      setFeeItemNames(res || []);
    })
  }, []);

  const changeFeeType = (value) => {
    var newvalue = value == "收款费项" ? "ReceivablesItem" : "PaymentItem";
    GetFeeType(newvalue).then(res => {
      setFeetype(res || []);
      if (!isInit) {
        var info = Object.assign({}, infoDetail, { feeType: undefined });
        setInfoDetail(info);
        //form.setFieldsValue({ feeType: undefined });
      }
    });
  };

  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {
      if (id) {
        getInfo(id).then((tempInfo: any) => {
          if (tempInfo.feeKind) {
            // var kind = tempInfo.feeKind == "收款费项" ? "ReceivablesItem" : "PaymentItem";
            changeFeeType(tempInfo.feeKind);
            setIsInit(false);
          }
          setInfoDetail(tempInfo);
          form.resetFields();
        });
        if (id !== undefined) {
          initHouseLoadData('');
          initOrgLoadData();
        }
      } else {
        //重置之前选择加载的费项类别
        setFeetype([]);
        setInfoDetail({});
        form.resetFields();
      }
    } else {
      form.setFieldsValue({});
    }
  }, [modifyVisible]);

  const close = () => {
    closeDrawer();
  };

  // const getGuid = () => {
  //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  //     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  //     return v.toString(16);
  //   });
  // };

  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        // var guid = getGuid();
        // let newvalue = {
        //   //SaveForm
        //   keyValue: id == null || id == "" ? "" : id,
        //   //CalScaleDispose:values.CalScaleDispose,
        //   //FeeCode:values.FeeCode,
        //   //FeeNo:values.FeeNo,
        //   IsModifyDate: infoDetail.isModifyDate ? true : false,
        //   MidResultScale: values.midResultScale,
        //   //CreateDate:values.CreateDate,
        //   //FeeEngName:values.FeeEngName,
        //   FeePrice: values.feePrice,
        //   IsNullDate: infoDetail.isNullDate ? true : false,
        //   MidScaleDispose: values.midScaleDispose,
        //   //CreateUserId:values.createUserId,
        //   FeeInvoice: values.feeInvoice,
        //   FeeType: values.feeType,
        //   IsTax: infoDetail.isTax ? true : false,
        //   //ModifyDate:tempInfo.modifyDate,
        //   //CreateUserName:tempInfo.createUserName,
        //   //FeeInvoiceNo:values.feeInvoiceNo,
        //   IsCancel: infoDetail.isCancel ? true : false,
        //   IsTemp: infoDetail.isTemp ? true : false,
        //   //ModifyUserId:values.ModifyUserId,
        //   //Currency:values.currency,
        //   FeeItemId: id == null || id == "" ? guid : id,//values.feeItemId,
        //   IsCustomizeDate: infoDetail.isCustomizeDate ? true : false,
        //   LastResultScale: values.lastResultScale,
        //   //ModifyUserName:tempInfo.id,
        //   CycleType: values.cycleType,
        //   FeeKind: values.feeKind,
        //   IsEditTemp: infoDetail.isEditTemp ? true : false,
        //   LastScaleDispose: values.lastScaleDispose,
        //   //SysType:values.sysType,
        //   BeginDate: moment(values.beginDate).format('YYYY-MM-DD'),
        //   CycleValue: values.cycleValue,
        //   FeeName: values.feeName,
        //   IsEnable: infoDetail.isEnable ? true : false,
        //   LinkFee: values.linkFee,
        //   // TypeCode:values.typeCode,
        //   // CalResultScale:values.calResultScale,
        //   EndDate: moment(values.endDate).format('YYYY-MM-DD'),
        //   //FeeNature:values.feeNature,
        //   IsInContract: infoDetail.isInContract ? true : false,
        //   Memo: values.memo,
        //   AccBillDateNum: values.accBillDateNum,
        //   //BankTransfer:values.bankTransfer,
        //   DelayRate: values.delayRate,
        //   //InMethod:values.inMethod,
        //   PayDeadlineFixed: values.payDeadlineFixed,
        //   //UseInOrOut:values.useInOrOut,
        //   AccBillDateUnit: values.accBillDateUnit,
        //   //CopePersonType:values.copePersonType,
        //   DelayType: values.delayType,
        //   //InOutDate:values.inOutDate,
        //   PayDeadlineNum: values.payDeadlineNum,
        //   //UseStepPrice:values.useStepPrice,
        //   AccPeriodBase: values.accPeriodBase,
        //   CopeRate: values.copeRate,
        //   FeeApportion: values.feeApportion,
        //   //LateDataNotIn:values.lateDataNotIn,
        //   PayDeadlineUnit: values.payDeadlineUnit,
        //   AccPeriodBaseNum: values.accPeriodBaseNum,
        //   //CopeUserId:values.copeUserId,
        //   FeeFormulaOne: values.feeFormulaOne,
        //   LateStartDateBase: values.lateStartDateBase,
        //   //OutFeeMethod:values.outFeeMethod,
        //   PayedCreateCope: values.payedCreateCope ? true : false,
        //   AccPeriodBaseUnit: values.accPeriodBaseUnit,
        //   //CopeUserName:values.copeUserName,
        //   //FeeFormulaTwo:values.feeFormulaTwo,
        //   LateStartDateFixed: values.lateStartDateFixed,
        //   // OutMethod:values.outMethod,
        //   PayFeeItemId: values.payFeeItemId,
        //   //AccRightBase:values.accRightBase,
        //   LateStartDateNum: values.lateStartDateNum,
        //   PayDateNum: values.payDateNum,
        //   //SplitFee:values.splitFee,
        //   AccBillDateBase: values.accBillDateBase,
        //   //AccRightBaseNum:values.accRightBaseNum,
        //   //Id:id==null||id==''?'':id,
        //   LateStartDateUnit: values.lateStartDateUnit,
        //   PayDateUnit: values.payDateUnit,
        //   //StepPriceId:values.stepPriceId,
        //   AccBillDateFixed: values.accBillDateFixed,
        //   // AccRightBaseUnit:valuesaccRightBaseUnit,
        //   //InFeeMethod:values.inFeeMethod,
        //   PayDeadlineBase: values.payDeadlineBase,
        //   //UseFormulaTwo:values.useFormulaTwo
        // };
        const newData = infoDetail ? { ...infoDetail, ...values } : values;
        newData.beginDate = newData.beginDate.format('YYYY-MM-DD');
        newData.endDate = newData.endDate.format('YYYY-MM-DD');
        SaveForm(newData).then(res => {
          reload();
          closeDrawer();
        });
      }
    });
  };
  const getInfo = id => {
    if (id) {
      return GetFormJson(id).then(res => {
        const { feeItem, feeItemDetail } = res || ({} as any);
        let info = {
          ...feeItem,
          ...feeItemDetail,
        };
        //info.id = feeItem && feeItem.feeItemId;
        return info;
      });
    } else {
      return Promise.resolve({
        parentId: 0,
        type: 1,
      });
    }
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
      queryJson: { keyword: search, FeeItemID: id },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'code';
    }

    return houseLoad(searchCondition).then(res => {
      return res;
    });
  };
  const houseLoad = data => {
    setOrgLoading(true);
    data.sidx = data.sidx || 'unitfeeid';
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
    const queryJson = { keyword: search, FeeItemID: id };
    const sidx = 'unitfeeid';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = housePagination;
    return houseLoad({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const [orgData, setOrgData] = useState<any[]>([]);
  // const [orgSearch,setOrgSearch]=useState<string>();
  const [orgLoading, setOrgLoading] = useState<boolean>(false);
  const [orgPagination, setOrgPagination] = useState<PaginationConfig>(new DefaultPagination());

  const orgLoadData = (paginationConfig?: PaginationConfig, sorter?) => {
    //setOrgSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: orgPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { FeeItemID: id },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'allName';
    }

    return orgLoad(searchCondition).then(res => {
      return res;
    });
  };
  const orgLoad = data => {
    setOrgLoading(true);
    data.sidx = data.sidx || 'allName';
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

  const initOrgLoadData = () => {
    //setOrgSearch(search);
    const queryJson = { FeeItemID: id };
    const sidx = 'allName';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = orgPagination;
    return orgLoad({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const orgcolumns = [
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
      dataIndex: 'feeName',
      key: 'feeName',
      width: 120,
      sorter: true,
    },
    {
      title: '开票项目编号',
      dataIndex: 'feeCode',
      key: 'feeCode',
      width: 100,
      sorter: true,
    },
    {
      title: '所属管理处',
      dataIndex: 'orgName',
      key: 'orgName',
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
                content: `您是否要删除吗`,
                cancelText: '取消',
                okText: '确认',
                onOk: () => {
                  OrganizeRemoveForm(record.id)
                    .then(() => {
                      message.success('删除成功');
                      initOrgLoadData();
                    })
                    .catch(e => {
                      message.error('删除失败');
                    });
                },
              });
            }} key="delete">删除</a>
          </span>
        ];
      },
    },
  ] as ColumnProps<any>[];

  const [orgItemId, setOrgItemId] = useState<string>(""); const [houseItemId, setHouseItemId] = useState<string>("");
  const housecolumns = [
    {
      title: '房屋编号',
      dataIndex: 'code',
      key: 'code',
      width: 140,
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
          return <span></span>
        } else {
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    }, {
      title: '计费终止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      sorter: true,
      render: val => {
        if (val == null) {
          return <span></span>
        } else {
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    }, {
      title: '房屋全称',
      dataIndex: 'allName',
      key: 'allName',
      width: 150,
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return [
          <span key='buttons'>
            <a onClick={() => {
              setHouseItemId(record.unitFeeId);
              setEditHouseVisible(true);
            }} key="modify">修改</a>
            <Divider type="vertical" key='divider' />
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
            }} key="delete">删除</a>
          </span>
        ];
      },
    },
  ] as ColumnProps<any>[];


  const [showFeeField, setShowFeeField] = useState<boolean>(false);
  const [accFixedDisabled, setAccFixedDisabled] = useState<boolean>(true);
  const [payFixedDisabled, setPayFixedDisabled] = useState<boolean>(true);
  const [lateFixedDisabled, setLateFixedDisabled] = useState<boolean>(true);
  return (
    <Drawer
      title={title}
      placement="right"
      width={780}
      onClose={close}

      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Form layout="vertical" hideRequiredMark>
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
                      onChange={changeFeeType}
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
                      <Select placeholder="请选择费项类别">
                        {feetypes.map(item => (
                          <Option key={item.title} value={item.title}>
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
                    })(<Input placeholder="请输入单价" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12}>
                  <Form.Item label="关联收费项目" >
                    {getFieldDecorator('linkFee', {
                      initialValue: infoDetail.linkFee,
                    })(
                      <Select
                        placeholder="请选择关联收费项目"
                      >
                        {feeitems.map(item => (
                          <Option key={item.value} value={item.value}>
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
                      initialValue: infoDetail.cycleValue,
                      rules: [{ required: true, message: '请输入计费周期' }],
                    })(<Input placeholder="请输入计费周期" />)}
                  </Form.Item>
                </Col>
                <Col lg={5}>
                  <Form.Item label="&nbsp;">
                    {getFieldDecorator('cycleType', {
                      initialValue: infoDetail.cycleType,
                      rules: [{ required: true, message: '请选择单位' }],
                    })(<Select placeholder="请选择单位">
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
                      initialValue: infoDetail.beginDate
                        ? moment(new Date(infoDetail.beginDate))
                        : moment(new Date()),
                      rules: [{ required: true, message: '请选择计费起始日期' }],
                    })(<DatePicker placeholder="请选择计费起始日期" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item label="计费终止日期">
                    {getFieldDecorator('endDate', {
                      initialValue: infoDetail.endDate
                        ? moment(new Date(infoDetail.endDate))
                        : moment(new Date()),
                      rules: [{ required: true, message: '计费终止日期' }],
                    })(<DatePicker placeholder="计费终止日期" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={24}>
                  <Form.Item  >
                    <Checkbox checked={infoDetail.isNullDate ? true : false} onChange={(e) => {
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
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={24}>
                  <Form.Item  >
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
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col lg={21}>
                  <Form.Item label="用量公式">
                    {getFieldDecorator('feeFormulaOne', {
                      initialValue: infoDetail.feeFormulaOne,
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
                      initialValue: infoDetail.feeApportion,
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
                      initialValue: infoDetail.delayType,
                      // rules: [{ required: true, message: '请选择滞纳金计算方式' }],
                    })(
                      <Select placeholder="选择滞纳金计算方式">
                        <Option value="按天计算（固定滞纳率）">按天计算（固定滞纳率）</Option>
                        <Option value="按月计算（固定滞纳率）" >按月计算（固定滞纳率）</Option>
                        <Option value="按季计算（固定滞纳率）">按季计算（固定滞纳率）</Option>
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
          {
            id == null ? null : <TabPane tab="高级" key="2"> 
              <Card title="小数精度"  className={styles.card}  >
                {/* <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="中间每一步计算结果保留">
                      {getFieldDecorator('midResultScale', {
                        initialValue: infoDetail.midResultScale,
                        rules: [{ required: true, message: '请选择小数位数' }],
                      })(

                        <Select placeholder="请选择单位">
                          <Option value="0">0</Option>
                          <Option value="1" >1</Option>
                          <Option value="2">2</Option>
                          <Option value="3" >3</Option>
                          <Option value="4">4</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="对最后一位">
                      {getFieldDecorator('midScaleDispose', {
                        initialValue: infoDetail.midScaleDispose,
                        rules: [{ required: true, message: '请选择小数处理方法' }],
                      })(
                        <Select placeholder="请选择小数处理方法">
                          <Option value="0">四舍五入</Option>
                          <Option value="1" >直接舍去</Option>
                          <Option value="2">有数进一</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row> */}
                {/* <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="最终结果保留小数位数">
                      {getFieldDecorator('lastResultScale', {
                        initialValue: infoDetail.lastResultScale,
                        rules: [{ required: true, message: '请选择小数位数' }],
                      })(
                        <Select placeholder="请选择单位">
                          <Option value="0">0</Option>
                          <Option value="1" >1</Option>
                          <Option value="2">2</Option>
                          <Option value="3" >3</Option>
                          <Option value="4">4</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="对最后一位">
                      {getFieldDecorator('lastScaleDispose', {
                        initialValue: infoDetail.lastScaleDispose,
                        rules: [{ required: true, message: '请选择小数处理方法' }],
                      })(
                        <Select placeholder="请选择小数处理方法">
                          <Option value="0">四舍五入</Option>
                          <Option value="1" >直接舍去</Option>
                          <Option value="2">有数进一</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row> */}

                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="单价保留小数点">
                      {getFieldDecorator('precision', {
                        initialValue: infoDetail.precision ? infoDetail.precision : 2,
                        rules: [{ required: true, message: '请填写保留几位' }],
                      })(<InputNumber placeholder="请填写保留几位" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="计算精度">
                      {getFieldDecorator('calcPrecisionMode', {
                        initialValue: infoDetail.calcPrecisionMode ? infoDetail.calcPrecisionMode : "最终计算结果保留2位",
                      })(<Select>
                        <Option value="最终计算结果保留2位" >最终计算结果保留2位</Option>
                        <Option value="每步计算结果保留2位" >每步计算结果保留2位</Option>
                      </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>


              </Card>
              <Card title="账单日设置" className={styles.card} >
                <Row gutter={8}>
                  <Col span={6}>
                    <Form.Item label="应收期间 距">
                      {getFieldDecorator('accPeriodBase', {
                        initialValue: infoDetail.accPeriodBase ? infoDetail.accPeriodBase.toString() : "2",
                        rules: [{ required: true, message: '请选择应收期间' }],
                      })(
                        <Select placeholder="==选择应收期间==">
                          <Option value="0">同一季度费用,每季度首月为应收期间</Option>
                          <Option value="1" >计费起始日期</Option>
                          <Option value="2">计费终止日期</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('accPeriodBaseNum', {
                        initialValue: infoDetail.accPeriodBaseNum ? infoDetail.accPeriodBaseNum : 7,
                        rules: [{ required: true, message: '请输入数量' }],
                      })(
                        <Input></Input>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('accPeriodBaseUnit', {
                        initialValue: infoDetail.accPeriodBaseUnit ? infoDetail.accPeriodBaseUnit.toString() : "1",
                        rules: [{ required: true, message: '请选择单位' }],
                      })(
                        <Select placeholder="==选择单位==">
                          <Option value="0">天</Option>
                          <Option value="1" >月</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={6}>
                    <Form.Item label="账单日 距">
                      {getFieldDecorator('accBillDateBase', {
                        initialValue: infoDetail.accBillDateBase ? infoDetail.accBillDateBase.toString() : "2",
                        rules: [{ required: true, message: '请选择应收期间' }],
                      })(
                        <Select placeholder="==选择应收期间==">
                          <Option value="0">同一季度费用,每季度首月为应收期间</Option>
                          <Option value="1" >计费起始日期</Option>
                          <Option value="2">计费终止日期</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('accBillDateNum', {
                        initialValue: infoDetail.accBillDateNum ? infoDetail.accBillDateNum : 7,
                        rules: [{ required: true, message: '请输入数量' }],
                      })(
                        <Input></Input>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('accBillDateUnit', {
                        initialValue: infoDetail.accBillDateUnit ? infoDetail.accBillDateUnit.toString() : "1",
                        rules: [{ required: true, message: '请选择单位' }],
                      })(
                        <Select placeholder="==选择单位==" onChange={value => {
                          if (value == "0") {
                            setAccFixedDisabled(true);
                          } else {
                            setAccFixedDisabled(false);
                          }
                        }}>
                          <Option value="0">天</Option>
                          <Option value="1" >月</Option>
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
                          <Option value="1"> 1日</Option>
                          <Option value="2"> 2日</Option>
                          <Option value="3"> 3日</Option>
                          <Option value="4"> 4日</Option>
                          <Option value="5"> 5日</Option>
                          <Option value="6"> 6日</Option>
                          <Option value="7"> 7日</Option>
                          <Option value="8"> 8日</Option>
                          <Option value="9"> 9日</Option>
                          <Option value="10"> 10日</Option>
                          <Option value="11"> 11日</Option>
                          <Option value="12"> 12日</Option>
                          <Option value="13"> 13日</Option>
                          <Option value="14"> 14日</Option>
                          <Option value="15"> 15日</Option>
                          <Option value="16"> 16日</Option>
                          <Option value="17"> 17日</Option>
                          <Option value="18"> 18日</Option>
                          <Option value="19"> 19日</Option>
                          <Option value="20"> 20日</Option>
                          <Option value="21"> 21日</Option>
                          <Option value="22"> 22日</Option>
                          <Option value="23"> 23日</Option>
                          <Option value="24"> 24日</Option>
                          <Option value="25"> 25日</Option>
                          <Option value="26"> 26日</Option>
                          <Option value="27"> 27日</Option>
                          <Option value="28"> 28日</Option>
                          <Option value="29"> 29日</Option>
                          <Option value="30"> 30日</Option>
                          <Option value="31"> 31日</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={6}>
                    <Form.Item label="收款截止日 距">
                      {getFieldDecorator('payDeadlineBase', {
                        initialValue: infoDetail.payDeadlineBase ? infoDetail.payDeadlineBase.toString() : "2",
                        rules: [{ required: true, message: '请选择应收期间' }],
                      })(
                        <Select placeholder="==选择应收期间==">
                          <Option value="0">同一季度费用,每季度首月为应收期间</Option>
                          <Option value="1" >计费起始日期</Option>
                          <Option value="2">计费终止日期</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('payDeadlineNum', {
                        initialValue: infoDetail.payDeadlineNum ? infoDetail.payDeadlineNum : 10,
                        rules: [{ required: true, message: '请输入数量' }],
                      })(
                        <Input></Input>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('payDeadlineUnit', {
                        initialValue: infoDetail.payDeadlineUnit ? infoDetail.payDeadlineUnit.toString() : "1",
                        rules: [{ required: true, message: '请选择单位' }],
                      })(
                        <Select placeholder="==选择单位==" onChange={value => {
                          if (value == "0") {
                            setPayFixedDisabled(true);
                          } else {
                            setPayFixedDisabled(false);
                          }
                        }}>
                          <Option value="0">天</Option>
                          <Option value="1" >月</Option>
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
                        initialValue: infoDetail.lateStartDateBase ? infoDetail.lateStartDateBase.toString() : "2",
                        rules: [{ required: true, message: '请选择应收期间' }],
                      })(
                        <Select placeholder="==选择应收期间==">
                          <Option value="0">同一季度费用,每季度首月为应收期间</Option>
                          <Option value="1" >计费起始日期</Option>
                          <Option value="2">计费终止日期</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('lateStartDateNum', {
                        initialValue: infoDetail.lateStartDateNum ? infoDetail.lateStartDateNum : 10,
                        rules: [{ required: true, message: '请输入数量' }],
                      })(
                        <Input></Input>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('lateStartDateUnit', {
                        initialValue: infoDetail.lateStartDateUnit ? infoDetail.lateStartDateUnit.toString() : "1",
                        rules: [{ required: true, message: '请选择单位' }],
                      })(
                        <Select placeholder="==选择单位==" onChange={value => {
                          if (value == "0") {
                            setLateFixedDisabled(true);
                          } else {
                            setLateFixedDisabled(false);
                          }
                        }}>
                          <Option value="0">天</Option>
                          <Option value="1" >月</Option>
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
              </Card>
              <Card title="其他">
                <Row gutter={8}>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('payedCreateCope', {
                        initialValue: infoDetail.payedCreateCope,
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
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item >
                      {getFieldDecorator('payFeeItemID', {
                        initialValue: infoDetail.payFeeItemID,
                      })(
                        <Select placeholder="==应付款项==">
                          {feeItemNames.map(item => (
                            <Option value={item.key} key={item.key}>
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
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('copePersonType', {
                        initialValue: infoDetail.copePersonType,
                      })(
                        <Select placeholder="==付款对象==">
                          <Option value="业主">业主</Option>
                          <Option value="住/租户" >住/租户</Option>
                          <Option value="住/租户，空置时转给业主" >住/租户，空置时转给业主</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8} style={{ display: showFeeField ? "" : "none" }}>
                  <Col span={6}>
                    <Form.Item label="应付期间距收款日">
                      {getFieldDecorator('payDateNum', {
                        initialValue: infoDetail.payDateNum,
                      })(
                        <InputNumber style={{width:'100%'}}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ marginTop: '29px' }}>
                    <Form.Item>
                      {getFieldDecorator('payDateUnit', {
                        initialValue: infoDetail.payDateUnit,
                      })(
                        <Select placeholder="==请选择单位==">
                          <Option value="0">天</Option>
                          <Option value="1" >月</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </TabPane>
          }
          {
            id ?
              <TabPane tab="所属机构" key="3">
                <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
                  <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                    onClick={() => { setSelectOrgVisible(true) }}
                  >
                    <Icon type="plus" />
                    新增
                </Button>
                  {/* <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                  onClick={() => {  }}
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
                  rowKey={record => record.allName}
                  pagination={orgPagination}
                  scroll={{ y: 420 }}
                  onChange={(pagination: PaginationConfig, filters, sorter) =>
                    orgLoadData(pagination, sorter)
                  }
                  loading={orgLoading}
                />
              </TabPane> : null
          }
          {
            id ?
              <TabPane tab="设置房屋费项" key="4">
                <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
                  <Input.Search
                    key='search'
                    className="search-input"
                    placeholder="请输入要查询的房屋编号"
                    style={{ width: 200 }}
                    onSearch={value => houseLoadData(value)}
                  />
                  <Button type="link" style={{ float: 'right' }}
                    onClick={() => { setSelectHouseVisible(true); }}
                  >
                    <Icon type="plus" />
                    新增
                </Button>
                  <Button type="link" style={{ float: 'right'  }}
                    onClick={() => { initOrgLoadData() }}
                  >
                    <Icon type="reload" />
                    刷新
                </Button>
                </div>
                <Table
                  key='list'
                  style={{ border: 'none' }}
                  bordered={false}
                  size="middle"
                  dataSource={houseData}
                  columns={housecolumns}
                  rowKey={record => record.code}
                  pagination={housePagination}
                  scroll={{ y: 420, x: 920 }}
                  onChange={(pagination: PaginationConfig, filters, sorter) =>
                    houseLoadData(houseSearch, pagination, sorter)
                  }
                  loading={houseLoading}
                />
              </TabPane> : null
          }
        </Tabs>
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
          <Button onClick={close} style={{ marginRight: 8 }}>
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
        reload={initOrgLoadData}
      />
      <EditOrginize
        visible={editOrgVisible}
        closeModal={closeEditOrgVisible}
        orgItemId={orgItemId}
        reload={initOrgLoadData}
      />
      <AddHouseFee
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

