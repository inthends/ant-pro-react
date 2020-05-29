import { DefaultPagination } from '@/utils/defaultSetting';
import { AutoComplete, Checkbox, Tabs, Button, Icon, Input, Layout, Select, DatePicker, message } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import { NotChargeFeeData, ChargeFeePageData, ChargeCheckPageData } from './Main.service';
import { GetUserList } from '@/services/commonItem';
import AsynLeftTree from '../AsynLeftTree';
import ListTable from './ListTable';
import ChargeListTable from './ChargeListTable';
import ChargeCheckTable from './ChargeCheckTable';
import FeeModify from './FeeModify';
import BillShow from './BillShow';
import BillModify from './BillModify';
import Verify from './Verify';
import Split from './Split';
import Reduction from './Reduction';
import Rebate from './Rebate';
import Transform from './Transform';
import Submit from './Submit';
import RoomShow from '../../Resource/House/RoomShow';
import AddNote from './AddNote';

const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  // const [addFeeVisible, setAddFeeVisibleisible] = useState<boolean>(false);
  // const [treeData, setTreeData] = useState<TreeEntity[]>([]); 
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  //收款单
  const [dataCharge, setChargeData] = useState<any[]>([]);
  const [loadingCharge, setLoadingCharge] = useState<boolean>(false);
  const [paginationCharge, setPaginationCharge] = useState<PaginationConfig>(new DefaultPagination());
  //对账单
  const [dataChargeCheck, setChargeCheckData] = useState<any[]>([]);
  const [loadingChargeCheck, setLoadingChargeCheck] = useState<boolean>(false);
  const [paginationChargeCheck, setPaginationChargeCheck] = useState<PaginationConfig>(new DefaultPagination());

  const [adminOrgId, setAdminOrgId] = useState<string>('');//当前房间的管理处Id
  const [search, setSearch] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [showname, setShowname] = useState<string>('');
  const [addButtonDisable, setAddButtonDisable] = useState<boolean>(true);

  //显示该户其他费用
  const [showCustomerFee, setShowCustomerFee] = useState<boolean>(true);
  const [splitVisible, setSplitVisible] = useState<boolean>(false);
  const [transVisible, setTransVisible] = useState<boolean>(false);
  // const [billDetailVisible, setBillDetailVisible] = useState<boolean>(false); 
  const [showVisible, setShowVisible] = useState<boolean>(false);
  //减免
  const [reductionVisible, setReductionVisible] = useState<boolean>(false);
  //优惠
  const [rebateVisible, setRebateVisible] = useState<boolean>(false);

  //对账
  const [verifyVisible, setVerifyVisible] = useState<boolean>(false);
  const [ifVerify, setIfVerify] = useState<boolean>(false);

  //送审
  const [submitVisible, setSubmitVisible] = useState<boolean>(false);
  // const [flushVisible, setflushVisible] = useState<boolean>(false);
  // const [chargeRowStatus, setChargeRowStatus] = useState<number>(0);
  // const [billRowKey, setBillRowKey] = useState<number>(0); 
  const [unChargeSelectedKeys, setUnChargeSelectedKeys] = useState<any[]>([]);
  const [modifyEdit, setModifyEdit] = useState<boolean>(true);
  // const [organize, SetOrganize] = useState<any>({});
  const [chargedSearchParams, setChargedSearchParams] = useState<any>({});
  const [chargedCheckSearchParams, setChargedCheckSearchParams] = useState<any>({});

  //收款单送审
  const [chargeSelectedKeys, setChargeSelectedKeys] = useState<any[]>([]);
  //点击的tab
  const [tabIndex, setTabIndex] = useState<string>('1');

  const [id, setId] = useState<string>('');//当前费用Id

  //树查询
  const [orgId, setOrgId] = useState<string>('');//左侧树选择的id
  const [orgType, setOrgType] = useState<string>();//类型

  //点击左侧树，加载数据
  const doSelectTree = (orgId, type) => {
    //初始化页码，防止页码错乱导致数据查询出错  
    const page = new DefaultPagination();
    if (tabIndex == "1") {
      //未收款
      // initLoadData(search, organizeId, showCustomerFee);
      if (type == 5 || type == 9)
        loadData(search, orgId, page);
    }
    else if (tabIndex == "2") {
      //已收款
      // initChargeLoadData(organizeId, type);
      loadChargeData(orgId, type, page);
    }
    else {
      //对账单
      // initChargeCheckLoadData(organizeId, type);
      loadChargeCheckData(orgId, type, page);
    }
  };

  // useEffect(() => {
  //   //getTreeData().then(res => {
  //   //initLoadData('','');
  //   initChargeLoadData('');
  //   //});
  // }, []);

  const closeDrawer = () => {
    setModifyVisible(false);
  };

  const showDrawer = (id?, edit = true) => {
    setModifyEdit(edit);
    if (!edit) {
      if (unChargeSelectedKeys.length != 1) {
        message.warning("请选择一条记录查看！");
        return;
      }
      setModifyVisible(true);
      setId(unChargeSelectedKeys[0].id);
    }
    else {
      setModifyVisible(true);
      if (id) {
        setId(id);
      } else {
        setId('');
      }
    }
  };

  //未收款
  const loadData = (search, orgId, paginationConfig?: PaginationConfig, sorter?) => {
    setSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: search,
        unitId: orgId,
        showCustomerFee: showCustomerFee
      },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'billDate';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'billDate';
    data.sord = data.sord || 'asc';
    return NotChargeFeeData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setData(res.data);
      setLoading(false);
      return res;
    });
  };

  const initLoadData = (search, unitId = '', showCustomerFee = false) => {
    setSearch(search);
    // setShowCustomerFee(showCustomerFee);
    const queryJson = {
      keyword: search,
      unitId: unitId,
      showCustomerFee: showCustomerFee
    };

    const sidx = 'billDate';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //收款单
  const loadChargeData = (orgId, type, paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: paginationCharge.pageSize,
      total: 0,
    };

    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        TreeTypeId: orgId,
        TreeType: type,//chargedSearchParams.type ? chargedSearchParams.type : '',
        keyword: chargedSearchParams.search ? chargedSearchParams.search : '',
        Status: chargedSearchParams.status ? chargedSearchParams.status : '',
        StartDate: chargedSearchParams.startDate ? chargedSearchParams.startDate : '',
        EndDate: chargedSearchParams.endDate ? chargedSearchParams.endDate : '',
        receiverId: chargedSearchParams.receiverId ? chargedSearchParams.receiverId : ''
      }
    };
    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billDate';
    }
    return loadCharge(searchCondition).then(res => {
      return res;
    });
  };

  const loadCharge = data => {
    setLoadingCharge(true);
    data.sidx = data.sidx || 'billDate';
    data.sord = data.sord || 'desc';
    return ChargeFeePageData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPaginationCharge(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setChargeData(res.data);
      setLoadingCharge(false);
      return res;
    });
  };

  const initChargeLoadData = (orgId, type) => {
    const queryJson = {
      TreeTypeId: orgId,
      TreeType: type,
      keyword: chargedSearchParams.search ? chargedSearchParams.search : '',
      Status: chargedSearchParams.status ? chargedSearchParams.status : '',
      StartDate: chargedSearchParams.startDate ? chargedSearchParams.startDate : '',
      EndDate: chargedSearchParams.endDate ? chargedSearchParams.endDate : '',
      receiverId: chargedSearchParams.receiverId ? chargedSearchParams.receiverId : ''
    };
    const sidx = 'billDate';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = paginationCharge;
    return loadCharge({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //对账单
  const loadChargeCheckData = (orgId, type, paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: paginationChargeCheck.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: chargedCheckSearchParams.search ? chargedCheckSearchParams.search : '',
        TreeTypeId: orgId,
        TreeType: type,
        StartDate: chargedCheckSearchParams.startDate ? chargedCheckSearchParams.startDate : '',
        EndDate: chargedCheckSearchParams.endDate ? chargedCheckSearchParams.endDate : ''
      }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billDate';
    }
    return loadChargeCheck(searchCondition).then(res => {
      return res;
    });
  };

  const loadChargeCheck = data => {
    setLoadingChargeCheck(true);
    data.sidx = data.sidx || 'billDate';
    data.sord = data.sord || 'desc';
    return ChargeCheckPageData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPaginationChargeCheck(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setChargeCheckData(res.data);
      setLoadingChargeCheck(false);
      return res;
    });
  };

  const initChargeCheckLoadData = (id, type) => {
    const queryJson = {
      TreeType: type,
      TreeTypeId: id,
      keyword: chargedCheckSearchParams.search ? chargedCheckSearchParams.search : '',
      StartDate: chargedCheckSearchParams.startDate ? chargedCheckSearchParams.startDate : '',
      EndDate: chargedCheckSearchParams.endDate ? chargedCheckSearchParams.endDate : ''
    };
    const sidx = 'billDate';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = paginationChargeCheck;
    return loadChargeCheck({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //显示该户其他费用
  const onShowCustomerChange = (e: any) => {
    setShowCustomerFee(e.target.checked);
    initLoadData(search, orgId, e.target.checked);
  }

  const showVerify = (id: string, ifVerify: boolean) => {
    setBillId(id);
    setVerifyVisible(true);
    setIfVerify(ifVerify);
  }

  const closeVerify = () => {
    setVerifyVisible(false);
  }

  //送审
  const showSubmit = (id: string, ifVerify: boolean) => {
    setId(id);
    setSubmitVisible(true);
    setIfVerify(ifVerify);
  }

  const closeSubmit = () => {
    setSubmitVisible(false);
  }

  //拆费
  // const [splitId, setSplitId] = useState<string>('');
  const showSplit = (id) => {
    setId(id);
    // console.log(id);
    // setSplitId(id);
    setSplitVisible(true);
  }

  const closeSplit = () => {
    setId('');
    // setSplitId('');
    setSplitVisible(false);
  }

  //减免
  const showReduction = (id) => {
    setId(id);
    setReductionVisible(true);
  }

  const closeReduction = () => {
    setId('');
    // setSplitId('');
    setReductionVisible(false);
  }

  const showRebate = (id) => {
    setId(id);
    setRebateVisible(true);
  }

  const closeRebate = () => {
    setId('');
    // setSplitId('');
    setRebateVisible(false);
  }

  //转费
  // const [transId, setTransId] = useState<string>('');
  const showTrans = (id) => {
    setId(id);
    // setTransId(id);
    setTransVisible(true);
  }

  const closeTrans = () => {
    setId('');
    // setTransId('');
    setTransVisible(false);
  }

  //收款单Id
  const [billId, setBillId] = useState<string>('');

  const showDetail = (id?) => {
    setBillId(id);
    setShowVisible(true);
  }

  const closeDetail = () => {
    setBillId('');
    setShowVisible(false);
  }

  //修改收款单
  const [billModifyVisible, setBillModifyVisible] = useState<boolean>(false);
  const showModify = (id?) => {
    setBillId(id);
    setBillModifyVisible(true);
  }

  const closeBillDetail = () => {
    setBillId('');
    setBillModifyVisible(false);
  }

  // const onInvalid = () => {
  //   if (chargedRowSelectedKey == null || chargedRowSelectedKey == {}) {
  //     message.warning("请选择要作废的表单");
  //     return;
  //   }
  //   Modal.confirm({
  //     title: '请确认',
  //     content: `您是否要作废？`,
  //     onOk: () => {
  //       InvalidForm(chargedRowSelectedKey.billId).then(res => {
  //         initChargeLoadData(organizeId);
  //       });
  //     },
  //   });
  // }

  // const onRedFlush = () => {
  //   if (chargedRowSelectedKey == null || chargedRowSelectedKey == {}) {
  //     message.warning("请选择要冲红表单");
  //     return;
  //   }
  //   Modal.confirm({
  //     title: '请确认',
  //     content: `您是否要冲红？`,
  //     onOk: () => {
  //       CheckRedFlush(chargedRowSelectedKey.billId).then(res => {
  //         if (res == "1") {
  //           RedFlush(chargedRowSelectedKey.billId).then(res => {
  //             initChargeLoadData(organizeId);
  //           });
  //         } else {
  //           message.warning("当前表单无法冲红。");
  //         }
  //       })
  //     },
  //   });
  // }

  //未收费用勾选
  const GetUnChargeSelectedKeys = (rowSelectedKeys?) => {
    setUnChargeSelectedKeys(rowSelectedKeys);
    // console.log(rowSelectedKeys);
  }

  // const [chargedRowSelectedKey, setChargedRowSelectedKey] = useState<any>({});
  // const GetChargedSelectedKey = (record) => {
  //   setChargedRowSelectedKey(record);
  // }

  //收款单勾选
  const GetChargeSelectedKeys = (rowSelectedKeys?) => {
    setChargeSelectedKeys(rowSelectedKeys);
  }

  //tab切换刷新数据
  const changeTab = (e: string) => {
    setTabIndex(e);
    if (e == '1') {
      if (orgId)
        loadData(search, orgId);
    } else if (e == '2') {
      loadChargeData(orgId, orgType);
    } else {
      loadChargeCheckData(orgId, orgType);
    }
  };

  const [roomVisible, setRoomVisible] = useState<boolean>(false);
  //查看关联单据
  const showRoomDrawer = () => {
    setRoomVisible(true);
  };

  const closeRoomDrawer = () => {
    setRoomVisible(false);
  };

  const [addNoteVisible, setAddNoteVisible] = useState<boolean>(false);

  const showAddNote = (id: string) => {
    setBillId(id);
    setAddNoteVisible(true);
  }

  const closeAddNote = () => {
    setAddNoteVisible(false);
  };

  //收款人
  const [userSource, setUserSource] = useState<any[]>([]);
  const handleSearch = value => {
    if (value == '')
      return;
    GetUserList(value, '员工').then(res => {
      setUserSource(res || []);
    })
  };
  const userList = userSource.map
    (item => <Option key={item.id} value={item.userId}>{item.name}</Option>);

  // const onReceiverNameSelect = (value, option) => {
  //   var params = Object.assign({}, chargedSearchParams, { receiverId: option.key });
  //   setChargedSearchParams(params);
  // };

  const onReceiverNameChange = (value) => {
    var params = Object.assign({}, chargedSearchParams, { receiverId: value });
    setChargedSearchParams(params);
  };

  return (
    <Layout style={{ height: '100%' }}>
      {/* <Sider theme="light" style={{ overflow: 'hidden', height: '100%' }} width="245px"> */}
      <AsynLeftTree
        parentid={'0'}
        selectTree={(id, type, info?) => {
          setCustomerName('');
          setShowname('');
          setAdminOrgId(info.node.props.organizeId);//管理处Id
          setOrgId(id);
          setOrgType(type);
          //点击前重置 
          setAddButtonDisable(true);
          doSelectTree(id, type);
          //type
          // var params = Object.assign({}, chargedSearchParams, { type: type });
          // setChargedSearchParams(params);  
          // SetOrganize(info);
          if (type == 5 || type == 9) {
            setAddButtonDisable(false);
            var cusname = info.node.props.tenantname;
            setCustomerName(cusname);
            var showTitle = '当前住户';
            if (type == 9) {
              showTitle = '当前租户';
            }
            setShowname(info.node.props.allname + ' ' + showTitle + ' ' + cusname);
          }
        }}
      />

      {/* </Sider> */}
      <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1" onChange={changeTab}>
          <TabPane tab="未收列表" key="1" >
            <div style={{ marginBottom: '10px' }}>
              <Search
                // className="search-input"
                placeholder="搜索费项"
                style={{ width: 180 }}
                onSearch={value => loadData(value, orgId)} />
              <Checkbox style={{ marginLeft: '10px' }} onChange={onShowCustomerChange}
                defaultChecked={true}>显示该户其他费用</Checkbox>

              {/* <Button type="primary" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => showTrans()}
                disabled={billRowKey == -1 ? true : false}  >
                <Icon type="minus-square" />
                转费
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => showSplit()}
                disabled={billRowKey == -1 ? true : false}
              >
                <Icon type="minus-square" />
                拆费
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => showDrawer('', false)}
                disabled={billRowKey == -1 ? true : false}
              >
                <Icon type="minus-square" />
                查看
              </Button> */}

              <a style={{ marginLeft: 8 }} onClick={showRoomDrawer}>
                {showname}
              </a>

              <Button type="primary" style={{ float: 'right' }}
                onClick={() => showDrawer()}
                disabled={addButtonDisable}>
                <Icon type="plus" />
                加费
              </Button>

              {/* <Button type="primary" style={{ float: 'right',marginLeft:'3px' }}
                onClick={() => showVerify('',false)}
              >
                <Icon type="minus-square" />
                刷新
              </Button> */}
            </div>

            <ListTable
              onchange={(paginationConfig, filters, sorter) =>
                loadData(search, orgId, paginationConfig, sorter)
              }
              loading={loading}
              pagination={pagination}
              data={data}
              modify={showDrawer}
              reload={() => initLoadData(search, orgId, showCustomerFee)}
              rowSelect={GetUnChargeSelectedKeys}
              organizeId={orgId}
              customerName={customerName}
              showSplit={showSplit}
              showTrans={showTrans}
              // showDetail={(billId) => { chargedRowSelectedKey.billId = billId; showDetail(); }}
              showDetail={showDetail}
              showReduction={showReduction}
              showRebate={showRebate}
            />

          </TabPane>
          <TabPane tab="收款单列表" key="2">
            <div style={{ marginBottom: '10px' }}> 
              <Search
                className="search-input"
                placeholder="搜索收款单号"
                style={{ width: 180, marginRight: '5px' }}
                onChange={e => {
                  var params = Object.assign({}, chargedSearchParams, { search: e.target.value });
                  setChargedSearchParams(params);
                }}
              />
              <AutoComplete
                allowClear={true}
                dataSource={userList}
                onSearch={handleSearch}
                placeholder="搜索收款人"
                // onSelect={onReceiverNameSelect}
                onChange={onReceiverNameChange}
                style={{ width: '120px', marginRight: '5px' }}
              />
              <Select placeholder="收款单状态"
                allowClear={true}
                style={{ width: '120px', marginRight: '5px' }} onChange={(value) => {
                  var params = Object.assign({}, chargedSearchParams, { status: value });
                  setChargedSearchParams(params);
                }} >
                {/* <Option key='2' value='2'>
                  {'已审核'}
                </Option>
                <Option key='1' value='1'>
                  {'未审核'}
                </Option> */}
                <Option key='2' value='2'>
                  {'已冲红'}
                </Option>
                <Option key='-1' value='-1'>
                  {'已作废'}
                </Option>
              </Select>
              <DatePicker
                placeholder='收款日期起'
                onChange={(date, dateStr) => {
                  var params = Object.assign({}, chargedSearchParams, { startDate: dateStr });
                  setChargedSearchParams(params);
                }} style={{ marginRight: '5px', width: '130px' }} />
              至
              <DatePicker
                placeholder='收款日期止'
                onChange={(date, dateStr) => {
                  var params = Object.assign({}, chargedSearchParams, { endDate: dateStr });
                  setChargedSearchParams(params);
                }} style={{ marginLeft: '5px', marginRight: '5px', width: '130px' }} />

              <Button type="primary" style={{ marginLeft: '3px' }}
                onClick={() => {
                  // initChargeLoadData(organizeId, chargedSearchParams.type); 
                  loadChargeData(orgId, orgType);
                }}
              >
                <Icon type="search" />
                搜索
              </Button>

              {/* <Button type="danger" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => onInvalid()}
                disabled={chargedRowSelectedKey.status == null || chargedRowSelectedKey.status == 2 || chargedRowSelectedKey.status == 3 || chargedRowSelectedKey.status == -1 || chargedRowSelectedKey.status == 0 ? true : false}
              >
                <Icon type="delete" />
                作废
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => onRedFlush()}
                disabled={chargedRowSelectedKey.status == null || chargedRowSelectedKey.status == 3 || chargedRowSelectedKey.status == 1 || chargedRowSelectedKey.status == -1 || chargedRowSelectedKey.status == 0 ? true : false}
              >
                <Icon type="form" />
                冲红
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => showVerify('', false)}
                disabled={chargedRowSelectedKey.status == null || chargedRowSelectedKey.status == 3 || chargedRowSelectedKey.status == -1 || chargedRowSelectedKey.status == 1 || chargedRowSelectedKey.status == 0 ? true : false}
              >
                <Icon type="minus-square" />
                反审
              </Button>
              <Button type="default" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => showDetail()}
                disabled={chargedRowSelectedKey.status == null || chargedRowSelectedKey.status == 0 ? true : false}
              >
                <Icon type="file" />
                查看
              </Button> */}
              <Button type="primary" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => showSubmit('', true)}
                disabled={chargeSelectedKeys.length == 0 ? true : false}  >
                <Icon type="plus" />
                送审
              </Button>
            </div>

            <ChargeListTable
              onchange={(paginationConfig, filters, sorter) =>
                loadChargeData(orgId, orgType, paginationConfig, sorter)
              }
              loading={loadingCharge}
              pagination={paginationCharge}
              data={dataCharge}
              showDetail={showDetail}
              showModify={showModify}
              showVerify={showVerify}
              showNote={showAddNote}
              reload={() => initChargeLoadData(orgId, orgType)}
              // getRowSelect={GetChargedSelectedKey}
              rowSelect={GetChargeSelectedKeys}
            />
          </TabPane>

          <TabPane tab="对账单" key="3">
            <div style={{ marginBottom: '10px' }}>
              <DatePicker
                placeholder='收款日期起'
                onChange={(date, dateStr) => {
                  var params = Object.assign({}, chargedCheckSearchParams, { startDate: dateStr });
                  setChargedCheckSearchParams(params);
                }} style={{ marginRight: '5px', width: '140px' }} />
              至
              <DatePicker
                placeholder='收款日期止'
                onChange={(date, dateStr) => {
                  var params = Object.assign({}, chargedCheckSearchParams, { endDate: dateStr });
                  setChargedCheckSearchParams(params);
                }} style={{ marginLeft: '5px', marginRight: '5px', width: '140px' }} />
              <Search
                className="search-input"
                placeholder="搜索收款单号"
                style={{ width: '180px', marginRight: '5px' }}
                onChange={e => {
                  var params = Object.assign({}, chargedCheckSearchParams, { search: e.target.value });
                  setChargedCheckSearchParams(params);
                }}
              />
              <Button type="primary" style={{ marginLeft: '3px' }}
                onClick={() => {
                  initChargeCheckLoadData(orgId, orgType);
                }}>
                <Icon type="search" />
                搜索
              </Button>
            </div>

            <ChargeCheckTable
              onchange={(paginationConfig, filters, sorter) =>
                loadChargeCheckData(orgId, orgType, paginationConfig, sorter)
              }
              loading={loadingChargeCheck}
              pagination={paginationChargeCheck}
              data={dataChargeCheck}
              reload={() => initChargeCheckLoadData(orgId, orgType)}
            // rowSelect={GetChargedSelectedKey}
            />
          </TabPane>
        </Tabs>
      </Content>

      <FeeModify
        //新增&修改临时费
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        id={id}
        roomId={orgId}
        adminOrgId={adminOrgId}
        reload={() => initLoadData(search, orgId)}
        edit={modifyEdit}
      />

      <BillShow
        //查看收款单
        showVisible={showVisible}
        closeShow={closeDetail}
        id={billId}
      // id={chargedRowSelectedKey.billId}
      />

      <BillModify
        //修改收款单
        showVisible={billModifyVisible}
        closeShow={closeBillDetail}
        id={billId}
        reload={() => initChargeLoadData(orgId, orgType)}
      />

      <Verify
        //审核收款单
        verifyVisible={verifyVisible}
        closeVerify={closeVerify}
        id={billId}
        ifVerify={ifVerify}
        reload={() => initChargeLoadData(orgId, orgType)}
      />

      <Submit
        //送审
        visible={submitVisible}
        close={closeSubmit}
        ids={chargeSelectedKeys}
        reload={() => initChargeLoadData(orgId, orgType)}
      />

      <Reduction
        reductionVisible={reductionVisible}
        closeReduction={closeReduction}
        id={id}
        // id={splitId}
        reload={() => initLoadData(search, orgId)}
      />

      <Rebate
        visible={rebateVisible}
        close={closeRebate}
        id={id}
        reload={() => initLoadData(search, orgId)}
      />

      <Split
        splitVisible={splitVisible}
        closeSplit={closeSplit}
        id={id}
        // id={splitId}
        reload={() => initLoadData(search, orgId)}
      />

      <Transform
        transVisible={transVisible}
        closeTrans={closeTrans}
        id={id}
        // id={transId}
        reload={() => initLoadData(search, orgId)}
      />

      <RoomShow
        showVisible={roomVisible}
        closeDrawer={closeRoomDrawer}
        unitId={orgId}
      />

      <AddNote
        visible={addNoteVisible}
        closeModal={closeAddNote}
        reload={() => initChargeLoadData(orgId, orgType)}
        keyValue={billId}
      />

    </Layout>
  );
}
export default Main;
