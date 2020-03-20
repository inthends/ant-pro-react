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

  const [organizeId, setOrganizeId] = useState<string>('');//左侧树选择的id
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
  //收款单送审
  const [chargeSelectedKeys, setChargeSelectedKeys] = useState<any[]>([]);
  //点击的tab
  const [tabIndex, setTabIndex] = useState<string>('1');

  const [id, setId] = useState<string>('');//当前费用Id

  //点击左侧树，加载数据
  const selectTree = (organizeId, type, search) => {
    if (tabIndex == "1") {
      //未收款
      initLoadData(search, organizeId, showCustomerFee);
    }
    else if (tabIndex == "2") {
      //已收款
      initChargeLoadData(organizeId, type);
    }
    else {
      //对账单
      initChargeCheckLoadData(organizeId, type);
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

  //刷新
  const loadData = (search, paginationConfig?: PaginationConfig, sorter?) => {
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
      queryJson: { keyword: search, unitId: organizeId, showCustomerFee: showCustomerFee },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
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
    const queryJson = { keyword: search, unitId: unitId, showCustomerFee: showCustomerFee };
    const sidx = 'billDate';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //已收款
  const loadChargeData = (paginationConfig?: PaginationConfig, sorter?) => {
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
        keyword: chargedSearchParams.search ? chargedSearchParams.search : '',
        TreeTypeId: organizeId,
        TreeType: chargedSearchParams.type ? chargedSearchParams.type : '',
        Status: chargedSearchParams.status ? chargedSearchParams.status : '',
        StartDate: chargedSearchParams.startDate ? chargedSearchParams.startDate : '',
        EndDate: chargedSearchParams.endDate ? chargedSearchParams.endDate : '',
        receiverId: chargedSearchParams.receiverId ? chargedSearchParams.receiverId : ''
      },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'createDate';
    }
    return loadCharge(searchCondition).then(res => {
      return res;
    });
  };

  const loadCharge = data => {
    setLoadingCharge(true);
    data.sidx = data.sidx || 'createDate';
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

  //收款单
  const initChargeLoadData = (id, type) => {
    const queryJson = {
      TreeType: type,
      TreeTypeId: id,
      keyword: chargedSearchParams.search ? chargedSearchParams.search : '',
      Status: chargedSearchParams.status ? chargedSearchParams.status : '',
      StartDate: chargedSearchParams.startDate ? chargedSearchParams.startDate : '',
      EndDate: chargedSearchParams.endDate ? chargedSearchParams.endDate : '',
      receiverId: chargedSearchParams.receiverId ? chargedSearchParams.receiverId : ''
    };
    const sidx = 'createDate';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = paginationCharge;
    return loadCharge({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //对账单
  const loadChargeCheckData = (paginationConfig?: PaginationConfig, sorter?) => {
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
        keyword: chargedSearchParams.search ? chargedSearchParams.search : '',
        // TreeType: "5",
        TreeTypeId: organizeId,
        TreeType: chargedSearchParams.type ? chargedSearchParams.type : '',
        Status: chargedSearchParams.status ? chargedSearchParams.status : '',
        StartDate: chargedSearchParams.startDate ? chargedSearchParams.startDate : '',
        EndDate: chargedSearchParams.endDate ? chargedSearchParams.endDate : ''
      },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billCode';
    }
    return loadChargeCheck(searchCondition).then(res => {
      return res;
    });
  };

  const loadChargeCheck = data => {
    setLoadingChargeCheck(true);
    data.sidx = data.sidx || 'billCode';
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
      keyword: chargedSearchParams.search ? chargedSearchParams.search : '',
      Status: chargedSearchParams.status ? chargedSearchParams.status : '',
      StartDate: chargedSearchParams.startDate ? chargedSearchParams.startDate : '',
      EndDate: chargedSearchParams.endDate ? chargedSearchParams.endDate : ''
    };
    const sidx = 'billCode';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = paginationCharge;
    return loadChargeCheck({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //显示该户其他费用
  const onShowCustomerChange = (e: any) => {
    setShowCustomerFee(e.target.checked);
    initLoadData(search, organizeId, e.target.checked);
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
      if (organizeId)
        initLoadData(search, organizeId);
    } else if (e == '2') {
      initChargeLoadData(organizeId, chargedSearchParams.type);
    } else {
      initChargeCheckLoadData(organizeId, chargedSearchParams.type);
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
    (item => <Option key={item.id} value={item.id}>{item.name}</Option>);

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
          //点击前重置 
          setAddButtonDisable(true);
          selectTree(id, type, search);
          setCustomerName('');
          setShowname('');
          setAdminOrgId(info.node.props.organizeId);//管理处Id
          setOrganizeId(id);
          //type
          var params = Object.assign({}, chargedSearchParams, { type: type });
          setChargedSearchParams(params);
          //type

          // SetOrganize(info);
          if (type == 5 || type == 9) {
            setAddButtonDisable(false);
            var cusname = info.node.props.tenantname;
            setCustomerName(cusname);
            setShowname(info.node.props.allname + ' 当前住户 ' + cusname);
          }
        }}
      />
      {/* </Sider> */}
      <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1" onChange={changeTab}>
          <TabPane tab="未收列表" key="1" >
            <div style={{ marginBottom: '10px' }}>
              <Search
                className="search-input"
                placeholder="搜索费项"
                style={{ width: 180 }}
                onSearch={value => loadData(value)} />
              <Checkbox style={{ marginLeft: '10px' }} onChange={onShowCustomerChange}
                defaultChecked={true}
              >显示该户其他费用</Checkbox>
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
                disabled={addButtonDisable}
              >
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
                loadData(search, paginationConfig, sorter)
              }
              loading={loading}
              pagination={pagination}
              data={data}
              modify={showDrawer}
              reload={() => initLoadData(search, organizeId,showCustomerFee)}
              rowSelect={GetUnChargeSelectedKeys}
              organizeId={organizeId}
              customerName={customerName}
              showSplit={showSplit}
              showTrans={showTrans}
              // showDetail={(billId) => { chargedRowSelectedKey.billId = billId; showDetail(); }}
              showDetail={showDetail}
            />
          </TabPane>
          <TabPane tab="收款单列表" key="2">
            <div style={{ marginBottom: '10px' }}> 
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
                }} style={{ marginRight: '5px', width: '120px' }} />
              至
              <DatePicker
                placeholder='收款日期止'
                onChange={(date, dateStr) => {
                  var params = Object.assign({}, chargedSearchParams, { endDate: dateStr });
                  setChargedSearchParams(params);
                }} style={{ marginLeft: '5px', marginRight: '5px', width: '120px' }} />
              <Search
                className="search-input"
                placeholder="搜索收款单号"
                style={{ width: 180 }}
                onChange={e => {
                  var params = Object.assign({}, chargedSearchParams, { search: e.target.value });
                  setChargedSearchParams(params);
                }}
              />
              <Button type="primary" style={{ marginLeft: '3px' }}
                onClick={() => {
                  initChargeLoadData(organizeId, chargedSearchParams.type);
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
                disabled={chargeSelectedKeys.length == 0 ? true : false}
              >
                <Icon type="plus" />
                送审
              </Button>
            </div>

            <ChargeListTable
              onchange={(paginationConfig, filters, sorter) =>
                loadChargeData(paginationConfig, sorter)
              }
              loading={loadingCharge}
              pagination={paginationCharge}
              data={dataCharge}
              showDetail={showDetail}
              showModify={showModify}
              showVerify={showVerify}
              showNote={showAddNote}
              reload={() => initChargeLoadData(organizeId, chargedSearchParams.type)}
              // getRowSelect={GetChargedSelectedKey}
              rowSelect={GetChargeSelectedKeys}
            />
          </TabPane>
          <TabPane tab="对账单" key="3">
            <div style={{ marginBottom: '10px' }}>
              <DatePicker
                placeholder='收款日期起'
                onChange={(date, dateStr) => {
                  var params = Object.assign({}, chargedSearchParams, { startDate: dateStr });
                  setChargedSearchParams(params);
                }} style={{ marginRight: '5px', width: '140px' }} />
              至
              <DatePicker
                placeholder='收款日期止'
                onChange={(date, dateStr) => {
                  var params = Object.assign({}, chargedSearchParams, { endDate: dateStr });
                  setChargedSearchParams(params);
                }} style={{ marginLeft: '5px', marginRight: '5px', width: '140px' }} />
              <Search
                className="search-input"
                placeholder="搜索收款单号"
                style={{ width: 180 }}
                onChange={e => {
                  var params = Object.assign({}, chargedSearchParams, { search: e.target.value });
                  setChargedSearchParams(params);
                }}
              />
              <Button type="primary" style={{ marginLeft: '3px' }}
                onClick={() => {
                  initChargeCheckLoadData(organizeId, chargedSearchParams.type);
                }}>
                <Icon type="search" />
                搜索
              </Button>
            </div>

            <ChargeCheckTable
              onchange={(paginationConfig, filters, sorter) =>
                loadChargeCheckData(paginationConfig, sorter)
              }
              loading={loadingChargeCheck}
              pagination={paginationChargeCheck}
              data={dataChargeCheck}
              reload={() => initChargeCheckLoadData(organizeId, chargedSearchParams.type)}
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
        roomId={organizeId}
        adminOrgId={adminOrgId}
        reload={() => initLoadData(search, organizeId)}
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
        reload={() => initChargeLoadData(organizeId, chargedSearchParams.type)}
      />
 
      <Verify
        //审核收款单
        verifyVisible={verifyVisible}
        closeVerify={closeVerify}
        id={billId}
        ifVerify={ifVerify}
        reload={() => initChargeLoadData(organizeId, chargedSearchParams.type)}
      />

      <Submit
        //送审
        visible={submitVisible}
        close={closeSubmit}
        ids={chargeSelectedKeys}
        reload={() => initChargeLoadData(organizeId, chargedSearchParams.type)}
      />

      <Split
        splitVisible={splitVisible}
        closeSplit={closeSplit}
        id={id}
        // id={splitId}
        reload={() => initLoadData(search, organizeId)}
      />

      <Transform
        transVisible={transVisible}
        closeTrans={closeTrans}
        id={id}
        // id={transId}
        reload={() => initLoadData(search, organizeId)}
      />

      <RoomShow
        showVisible={roomVisible}
        closeDrawer={closeRoomDrawer}
        unitId={organizeId}
      />

      <AddNote
        visible={addNoteVisible}
        closeModal={closeAddNote}
        reload={() => initChargeLoadData(organizeId, chargedSearchParams.type)}
        keyValue={billId}
      />

    </Layout>
  );
}
export default Main;
