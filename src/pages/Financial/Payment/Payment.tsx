//付款管理
import { DefaultPagination } from '@/utils/defaultSetting';
import { Tabs, Button, Icon, Input, Layout, Select, DatePicker } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import { NotPaymentFeeData, ChargeFeePageData } from './Payment.service';
import AsynLeftTree from '../AsynLeftTree';
import NotPaymentTable from './NotPaymentTable';
import PaymentTable from './PaymentTable';
import FeeModify from './FeeModify';
import PaymentVerify from './PaymentVerify';
import Show from './Show';

const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;
function Payment() {

  // const [treeSearch, SetTreeSearch] = useState<any>({});
  const [id, setId] = useState<string>();
  const [organizeId, setOrganizeId] = useState<string>('');//左侧树选择的id
  const [adminOrgId, setAdminOrgId] = useState<string>('');//当前房间的管理处Id

  const [notPaymentLoading, setNotPaymentLoading] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);

  const [paymentData, setPaymentData] = useState<any>();
  const [notPaymentData, setNotPaymentData] = useState<any[]>([]);

  const [paymentPagination, setPaymentPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [notPaymentPagination, setNotPaymentPagination] = useState<DefaultPagination>(new DefaultPagination());

  const [ifVerify, setIfVerify] = useState<boolean>(false);
  const [verifyVisible, setVerifyVisible] = useState<boolean>(false);
  const [showVisible, setShowVisible] = useState<boolean>(false);
  const [addBtnDisable, setAddBtnDisable] = useState<boolean>(true);

  const [organize, setOrganize] = useState<any>({});

  const selectTree = (id, type, info) => {
    setOrganize(info.node.props.dataRef);
    if (type == 5) {
      initNotPaymentLoadData({ id: id, type: type }, '');
      initPaymentLoadData({ id: id, type: type }, '');
      setAddBtnDisable(false);
    } else {
      setAddBtnDisable(true);
    }
  };

  // useEffect(() => {
  //   initPaymentLoadData('', '');
  //   initNotPaymentLoadData('', '');
  // }, []);

  const loadPaymentData = (paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: paymentPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: paymentSearchParams.search,
        UnitId: organize.id == null ? "" : organize.id,
        Status: paymentStatus, StartDate: paymentStartDate, EndDate: paymentEndDate
      }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    }
    return paymentload(searchCondition);
  }
  const loadNotPaymentData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setNotPaymentSearchParams(Object.assign({}, notPaymentSearchParams, { search: search }));
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: notPaymentPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: search,
        UnitId: organize.id == null ? "" : organize.id,
        // TreeType: organize.type
      }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    }

    return notPaymentload(searchCondition);
  }
  const paymentload = data => {
    setPaymentLoading(true);
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'asc';
    return ChargeFeePageData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPaymentPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setPaymentData(res.data);
      setPaymentLoading(false);
      return res;
    }).catch(err => {
      setPaymentLoading(false);
    });
  };
  const notPaymentload = data => {
    setNotPaymentLoading(true);
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'asc';
    return NotPaymentFeeData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setNotPaymentPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setNotPaymentData(res.data);
      setNotPaymentLoading(false);
      return res;
    }).catch(err => {
      setNotPaymentLoading(false);
    });
  };
  const [notPaymentSearchParams, setNotPaymentSearchParams] = useState<any>({});
  const [paymentSearchParams, setPaymentSearchParams] = useState<any>({});
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const initPaymentLoadData = (org, searchText) => {
    setPaymentSearchParams(Object.assign({}, paymentSearchParams, { search: searchText }));
    const queryJson = {
      keyword: searchText,
      UnitId: organize.id == null ? "" : organize.id,
      Status: paymentStatus, StartDate: paymentStartDate, EndDate: paymentEndDate
    };
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = paymentPagination;
    return paymentload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };
  const initNotPaymentLoadData = (org, searchText) => {
    setNotPaymentSearchParams(Object.assign({}, notPaymentSearchParams, { search: searchText }));
    const queryJson = {
      keyword: searchText,
      UnitId: org.id == null ? "" : org.id,
    };
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = notPaymentPagination;
    return notPaymentload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };

  const closeVerify = (result?) => {
    setVerifyVisible(false);
    if (result) {
      initPaymentLoadData(organize, '');
    }
    setId('');
  };

  const closeShowDrawer = () => {
    setShowVisible(false);
  };

  // const showVerify = (id?, ifVerify?) => {
  //   setVerifyVisible(true);
  //   setIfVerify(ifVerify);
  //   if (id != null && id != '')
  //     setId(id);
  // };

  const showVerifyDrawer = (id, ifVerify) => {
    setVerifyVisible(true);
    setId(id);
    setIfVerify(ifVerify);
  };


  const showViewDrawer = (id?) => {
    setShowVisible(true);
    setId(id);
  };

  // const showBill = (id?) => {
  //   setShowVisible(true);
  //   if (id != null && id != '')
  //     setId(id);
  // };

  const closeModify = (result?) => {
    setModifyVisible(false);
    // if (result) {
    //initCheckLoadData(organize, null);
    // }
  };

  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const showModify = (id?, isedit?) => {
    setIsEdit(isedit);
    setModifyVisible(true);
    setId(id);
  };

  // const deleteData = (id?) => {
  //   Modal.confirm({
  //     title: '是否确认删除该条抵冲记录?',
  //     onOk() {
  //       RemoveForm({
  //         keyValue: id
  //       }).then(res => {

  //       });
  //     },
  //     onCancel() { },
  //   });
  // };

  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [paymentStartDate, setPaymentStartDate] = useState<string>('');
  const [paymentEndDate, setPaymentEndDate] = useState<string>('');
  // const [billStatus, setBillStatus] = useState<number>(-1);

  //页签切换刷新
  const changeTab = key => {
    if (key == "1") {
      initPaymentLoadData(organize, '');
    } else {
      initPaymentLoadData(organize, '');
    }
  };

  return (
    <Layout>
      <AsynLeftTree
        parentid={'0'}
        selectTree={(id, type, info) => {
          setAdminOrgId(info.node.props.organizeId);//管理处Id
          setOrganizeId(id);
          selectTree(id, type, info); 
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1" onChange={changeTab}>
          <TabPane tab="应付列表" key="1">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }} onChange={(value) => {
              var params = Object.assign({}, paymentSearchParams, { paymenttype: value });
              setPaymentSearchParams(params);
            }}>
              <Search
                className="search-input"
                placeholder="请输入要查询费项"
                style={{ width: 200 }}
                onChange={e => {
                  var params = Object.assign({}, paymentSearchParams, { search: e.target.value });
                  setPaymentSearchParams(params);
                }}
              />
              {/* <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  if (id == null || id == '') {
                    message.warning('请先选择账单');
                  } else {
                    showVerify('', false);
                  }
                }} disabled={ifVerify ? false : true}
              >
                <Icon type="minus-square" />
                取消审核
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  if (id == null || id == '') {
                    message.warning('请先选择账单');
                  } else {
                    showVerify('', true);
                  }
                }}
                disabled={ifVerify ? true : false}
              >
                <Icon type="check-square" />
                审核
              </Button> */}
              <Button type="primary" style={{ marginLeft: '10px' }}
                onClick={() => { loadPaymentData() }}
              >
                <Icon type="search" />
                查询
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => { showModify(null, true) }}
                disabled={addBtnDisable}
              >
                <Icon type="plus" />
                加费
              </Button>
            </div>
            <NotPaymentTable
              onchange={(paginationConfig, filters, sorter) => {
                loadNotPaymentData(paginationConfig, sorter)
              }
              }
              loading={notPaymentLoading}
              pagination={notPaymentPagination}
              data={notPaymentData}
              modify={(id, isedit) => {
                if (id != null && id != '') {
                  setId(id);
                }
                setIsEdit(isedit);
                setModifyVisible(true);
              }}
              reload={() => initNotPaymentLoadData({ id: organize.code, type: organize.type }, paymentSearchParams.search)}
              rowSelect={(record) => {
                setId(record.billId);
              }}
              organize={organize}
              // showDetail={(billId) => showBill(billId)}  
              showDetail={(billId) => { setId(billId); setShowVisible(true); }}
            />
          </TabPane>
          <TabPane tab="付款单列表" key="2">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Select placeholder="==请选择=="
                allowClear={true}
                style={{ width: '150px', marginRight: '5px' }}
                onChange={(value: string) => {
                  setPaymentStatus(value);
                }}>
                <Select.Option value="2">已审核</Select.Option>
                <Select.Option value="1">未审核</Select.Option>
                <Select.Option value="-1">已作废</Select.Option>
              </Select>
              <DatePicker
                placeholder='请选择付款日期'
                onChange={(date, dateStr) => {
                  setPaymentStartDate(dateStr);
                }} /> 至 <DatePicker style={{ marginRight: '5px' }}
                  placeholder='请选择付款日期'
                  onChange={(date, dateStr) => {
                    setPaymentEndDate(dateStr);
                  }} />
              <Search
                className="search-input"
                placeholder="请输入付款单号"
                style={{ width: 180 }}
                onSearch={value => {
                  setPaymentSearchParams(Object.assign({}, paymentSearchParams, { search: value }));
                  loadPaymentData();
                }}
              />

              <Button type="primary" style={{ marginLeft: '3px' }}
                onClick={() => {
                  loadPaymentData();
                }}
              >
                <Icon type="search" />
                搜索
              </Button>

              {/* <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  if (id == null || id == '') {
                    message.warning('请先选择账单');
                  } else {
                    showVerify(id, false);
                  }
                }} disabled={status == 1 ? false : true}
              >
                <Icon type="minus-square" />
                取消审核
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  if (id == null || id == '') {
                    message.warning('请先选择账单');
                  } else {
                    showVerify(id, true);
                  }
                }}
                disabled={status == 0 ? false : true}
              >
                <Icon type="check-square" />
                审核
              </Button> */}
            </div>

            <PaymentTable

              show={showViewDrawer}

              // showBill={(id) => {
              //   showBill(id)
              // }}
              onchange={(paginationConfig, filters, sorter) =>
                loadPaymentData(paginationConfig, sorter)
              }
              loading={paymentLoading}
              pagination={paymentPagination}
              data={paymentData}
              reload={() => initPaymentLoadData('', paymentSearchParams.search)}
              // getRowSelect={(record) => {
              //   setId(record.billId);
              //   // setBillStatus(record.status); 
              //   if (record.status == 0) {
              //     setIfVerify(true);
              //   } else {
              //     setIfVerify(false);
              //   } 
              // }}
              // verify={showVerify}

              verify={(id, ifVerify) => showVerifyDrawer(id, ifVerify)}

            />
          </TabPane>
        </Tabs>
      </Content>
      <FeeModify
        visible={modifyVisible}
        closeDrawer={closeModify}
        id={id}
        isEdit={isEdit}
        reload={() => initNotPaymentLoadData({ id: organize.code, type: organize.type }, '')}
        // organize={organize}
        roomId={organizeId}
        adminOrgId={adminOrgId}
      />
      <PaymentVerify
        verifyVisible={verifyVisible}
        closeVerify={closeVerify}
        ifVerify={ifVerify}
        id={id}
        reload={() => initPaymentLoadData({ id: organize.code, type: organize.type }, '')}
      />
      <Show
        visible={showVisible}
        closeDrawer={closeShowDrawer}
        id={id}
      />
    </Layout>
  );
}
export default Payment;
