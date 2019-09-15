//付款管理
import { DefaultPagination } from '@/utils/defaultSetting';
import { Tabs, Button, Icon, Input, Layout,   Select, message, DatePicker } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { NotPaymentFeeData, ChargeFeePageData } from './Payment.service';
import AsynLeftTree from '../AsynLeftTree';
import NotPaymentTable from './NotPaymentTable';
import PaymentTable from './PaymentTable';
import FeeModify from './FeeModify';
// import AddFee from './AddFee';
import PaymentVerify from './PaymentVerify';
import ShowBill from './ShowBill';

const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;
function Payment() {
  const [organize, setOrganize] = useState<any>({});
  // const [treeSearch, SetTreeSearch] = useState<any>({});
  const [id, setId] = useState<string>();
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [notPaymentLoading, setNotPaymentLoading] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState<any>();
  const [notPaymentData, setNotPaymentData] = useState<any[]>([]);
  const [paymentPagination, setPaymentPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [notPaymentPagination, setNotPaymentPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [ifVerify, setIfVerify] = useState<boolean>(false);
  const [vertifyVisible, setVerifyVisible] = useState<boolean>(false);
  const [addBtnDisable, setAddBtnDisable] = useState<boolean>(true);

  const selectTree = (org, item, info) => {
    setOrganize({ id: org, type: item, allname: info.node.props.allname });
    if (item == 5) {
      initPaymentLoadData({ id: org, type: item }, '');
      initNotPaymentLoadData({ id: org, type: item }, '');
      setAddBtnDisable(false);
    } else {
      setAddBtnDisable(true);
    }
  };

  useEffect(() => {
    initPaymentLoadData('', '');
    //initNotPaymentLoadData('','');
  }, []);


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
        TreeTypeId: organize.id,
        TreeType: organize.type,
        Status: paymentStatus, StartDate: paymentStartDate, EndDate: paymentEndDate
      }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
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
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    }
    return notPaymentload(searchCondition);
  };

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
    setPaymentLoading(true);
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
      TreeTypeId: org.id,
      TreeType: org.type,
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

  const showVerify = (id?, ifVerify?) => {
    setVerifyVisible(true);
    setIfVerify(ifVerify);
    if (id != null && id != '')
      setId(id);
  };
  const closeModify = (result?) => {
    setModifyVisible(false);
    if (result) {
      //initCheckLoadData(organize, null);
    }
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

  return (
    <Layout>
      <AsynLeftTree
        parentid={'0'}
        selectTree={(id, item, info) => {
          selectTree(id, item, info);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1" >
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
                onClick={() => { showModify(null, true) }} disabled={addBtnDisable}
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
              reload={() => initNotPaymentLoadData('', paymentSearchParams.search)}
              rowSelect={(record) => {
                setId(record.billId);
                if (record.ifVerify == 1) {
                  setIfVerify(true);
                } else {
                  setIfVerify(false);
                }
              }}
              organize={organize}
            />
          </TabPane>
          <TabPane tab="付款单列表" key="2">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Select placeholder="==请选择==" style={{ width: '150px', marginRight: '5px' }}
                onChange={(value: string) => {
                  setPaymentStatus(value);
                }}>
                <Select.Option value="2">已审核</Select.Option>
                <Select.Option value="1">未审核</Select.Option>
                <Select.Option value="-1">已作废</Select.Option>
              </Select>
              <DatePicker onChange={(date, dateStr) => {
                setPaymentStartDate(dateStr);
              }} />
              至：
              <DatePicker onChange={(date, dateStr) => {
                setPaymentEndDate(dateStr);
              }} />
              <Search
                className="search-input"
                placeholder="请输入要查询的名称或者单元编号"
                style={{ width: 280 }}
                onSearch={value => {
                  setPaymentSearchParams(Object.assign({}, paymentSearchParams, { search: value }));
                  loadPaymentData();
                }}
              />
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {

                }} disabled={ifVerify ? false : true}
              >
                <Icon type="minus-square" />
                作废
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
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
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => { showModify(null, false) }}
              >
                <Icon type="plus" />
                查看
              </Button>
            </div>
            <PaymentTable
              showModify={(id) => {
                setId(id);
              }}
              onchange={(paginationConfig, filters, sorter) =>
                loadPaymentData(paginationConfig, sorter)
              }
              loading={paymentLoading}
              pagination={paymentPagination}
              data={paymentData}
              reload={() => initPaymentLoadData('', paymentSearchParams.search)}

              getRowSelect={(record) => {
                setId(record.billId);
                if (record.ifVerify == 1) {
                  setIfVerify(true);
                } else {
                  setIfVerify(false);
                }
              }}
            />
          </TabPane>
        </Tabs>
      </Content>
      <FeeModify
        visible={modifyVisible}
        closeDrawer={closeModify}
        id={id}
        isEdit={isEdit}
        reload={() => initNotPaymentLoadData('', '')}
        organize={organize}
      />
      <PaymentVerify
        vertifyVisible={vertifyVisible}
        closeVerify={closeVerify}
        ifVerify={ifVerify}
        id={id}
        reload={() => initPaymentLoadData('', '')}
      />
    </Layout>
  );
}
export default Payment;
