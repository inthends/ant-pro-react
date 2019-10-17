//通知单
import { DefaultPagination } from '@/utils/defaultSetting';
import { message, Dropdown, Menu, Tabs, Button, Icon, Input, Layout, Modal, Select } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetBillPageData, ChargeFeePageData, RemoveForm, GetTemplates, BatchAudit } from './BillNotice.service';
import AsynLeftTree from '../AsynLeftTree';
import BillCheckTable from './BillCheckTable';
import BillNoticeTable from './BillNoticeTable';
import BillCheckModify from './BillCheckModify';
import BillCheckVerify from './BillCheckVerify';
import BillCheckShow from './BillCheckShow';
const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;
// const { Option } = Select;
function BillNotice() {
  const [organize, SetOrganize] = useState<any>({});
  // const [treeSearch, SetTreeSearch] = useState<any>({});
  const [id, setId] = useState<string>();
  const [selectIds, setSelectIds] = useState<any>();
  const [billCheckLoading, setBillCheckLoading] = useState<boolean>(false);
  const [billNoticeLoading, setBillNoticeLoading] = useState<boolean>(false);
  const [billCheckData, setBillCheckData] = useState<any>();
  const [billNoticeData, setBillNoticeData] = useState<any[]>([]);
  const [billCheckSearch, setBillCheckSearch] = useState<string>('');
  const [billNoticeSearch, setBillNoticeSearch] = useState<string>('');
  const [billCheckPagination, setBillCheckPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [billNoticePagination, setBillNoticePagination] = useState<DefaultPagination>(new DefaultPagination());
  const [ifVerify, setIfVerify] = useState<boolean>(false);
  const [vertifyVisible, setVerifyVisible] = useState<boolean>(false);
  const [showCheckBillVisible, setShowCheckBillVisible] = useState<boolean>(false);
  const [tempListData, setTempListData] = useState<any[]>([]);

  const selectTree = (org, item, info) => {
    SetOrganize(org);
    initBillCheckLoadData(info, '');
    initBillNoticeLoadData(info, '');
  };

  useEffect(() => {
    GetTemplates().then(res => {
      setTempListData(res);
    }).then(() => {
      initBillCheckLoadData('', '');
      initBillNoticeLoadData('', '');
    })
  }, []);


  const loadBillCheckData = (paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: billCheckPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: billCheckSearchParams.search,
        TemplateId: templateId,
        BillType: billType,
        TreeTypeId: organize.id,
        TreeType: organize.type,
      }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billId';
    }
    return billCheckload(searchCondition);
  }
  const loadBillNoticeData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setBillNoticeSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: billNoticePagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: search,
        TreeTypeId: organize.id,
        TreeType: organize.type
      }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    }
    return billNoticeload(searchCondition);
  };

  const billCheckload = data => {
    setBillCheckLoading(true);
    data.sidx = data.sidx || 'billId';
    data.sord = data.sord || 'asc';
    return GetBillPageData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setBillCheckPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setBillCheckData(res.data);
      setBillCheckLoading(false);
      return res;
    }).catch(err => {
      setBillCheckLoading(false);
    });
  };
  const billNoticeload = data => {
    setBillNoticeLoading(true);
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'asc';
    return ChargeFeePageData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setBillNoticePagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setBillNoticeData(res.data);
      setBillNoticeLoading(false);
      return res;
    }).catch(err => {
      setBillNoticeLoading(false);
    });
  };

  const initBillCheckLoadData = (org, searchText) => {
    //console.log(org);
    setBillCheckSearch(searchText);
    const queryJson = {
      TemplateId: templateId,
      BillType: billType,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'billId';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = billCheckPagination;
    return billCheckload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };
  const initBillNoticeLoadData = (org, searchText) => {
    setBillNoticeSearch(searchText);
    const queryJson = {
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = billNoticePagination;
    return billNoticeload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };

  const closeVerify = (result?) => {
    setVerifyVisible(false);
    if (result) {
      initBillCheckLoadData(organize, '');
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
    // setIsEdit(isedit);
    setModifyVisible(true);
    setId(id);
  };

  // const deleteData = (id?) => {
  //   Modal.confirm({
  //     title: '是否确认删除该记录?',
  //     onOk() {
  //       RemoveForm({
  //         keyValue: id
  //       }).then(res => {

  //       });
  //     },
  //     onCancel() { },
  //   });
  // };

  const [billCheckSearchParams, setBillCheckSearchParams] = useState<any>({});
  // const [isEdit, setIsEdit] = useState<boolean>(false);
  // const [divideVisible,setDivideVisible]=useState<boolean>(false);
  const [templateId, setTemplateId] = useState<string>('');
  const [billType, setBillType] = useState<string>('');

  const handleMenuClick = (e) => {
    if (e.key == '1') {

      if (selectIds == undefined) {
        message.error('请选择需要审核的账单！');
      } else {

        //如果选择了多条 在批量审核
        if (selectIds && selectIds.length > 1) {
          Modal.confirm({
            title: '请确认',
            content: `您是否要审核这些账单?`,
            onOk: () => {
              BatchAudit({
                keyValues: JSON.stringify(selectIds),
                IfVerify: true
              })
                .then(() => {
                  message.success('审核成功');
                  initBillCheckLoadData('', '');
                })
                .catch(e => { });
            },
          });
        }
        //如果仅选择一条 则显示账单
        else {
          /* if (id == null || id == '') {
             message.warning('请先选择账单');
           } else {*/
          showVerify(selectIds[0], true);
          //}
        }
      }
    }
    else if (e.key == '2') {
      if (selectIds && selectIds.length > 1) {
        Modal.confirm({
          title: '请确认',
          content: `您是否要取消审核这些账单?`,
          onOk: () => {
            BatchAudit({
              keyValues: JSON.stringify(selectIds),
              IfVerify: false
            })
              .then(() => {
                message.success('审核成功');
                initBillCheckLoadData('', '');
              })
              .catch(e => { });
          },
        });
      } else if (e.key == '4') {
        if (selectIds&&selectIds.length >= 1) {
          Modal.confirm({
            title: '请确认',
            content: `您是否要删除这些账单?`,
            onOk: () => {

              selectIds.forEach(idstr=>{
                RemoveForm({
                  keyValue: idstr
                }).then(res => {

                });
              });
              initBillCheckLoadData('', '');
            },
          });
        }
      }else {
        /* if (id == null || id == '') {
           message.warning('请先选择账单');
         } else {*/
        showVerify(id, false);
        // }
      }
    } else {
      //打印

    }
    // else {
    //   //删除
    //   if (selectIds == undefined) {
    //     message.error('请选择需要删除的账单！');
    //   } else {
    //     Modal.confirm({
    //       title: '是否确认删除?',
    //       onOk() {
    //         RemoveForm({
    //           keyValue: id
    //         }).then(res => {

    //         });
    //       },
    //       onCancel() { },
    //     });
    //   }
    // }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">审核</Menu.Item>
      <Menu.Item key="2">反审</Menu.Item>
      <Menu.Item key="3">打印</Menu.Item>
      {/* <Menu.Item key="4">删除</Menu.Item> */}
    </Menu>
  );

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
          <TabPane tab="账单列表" key="1">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}
              onChange={(value) => {
                var params = Object.assign({}, billCheckSearchParams, { billChecktype: value });
                setBillCheckSearchParams(params);
              }}>
              <Select placeholder="==账单类型==" style={{ width: '150px', marginRight: '5px' }}
                onChange={(value: string) => {
                  setBillType(value);
                }}>
                <Select.Option value="通知单">通知单</Select.Option>
                <Select.Option value="催款单">催款单</Select.Option>
                <Select.Option value="催缴函">催缴函</Select.Option>
                <Select.Option value="律师函">律师函</Select.Option>
              </Select>
              <Select placeholder="==模版类型==" style={{ width: '150px', marginRight: '5px' }}
                onChange={(value: string) => {
                  setTemplateId(value);
                }}
              >
                {
                  (tempListData || []).map(item => {
                    return <Select.Option value={item.value}>{item.title}</Select.Option>
                  })
                }
              </Select>
              <Search
                className="search-input"
                placeholder="请输入要查询的单号"
                style={{ width: 200 }}
                onChange={e => {
                  var params = Object.assign({}, billCheckSearchParams, { search: e.target.value });
                  setBillCheckSearchParams(params);
                }}
              />

              {/* <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  if (selectIds.length > 1) {
                    Modal.confirm({
                      title: '请确认',
                      content: `您是否要取消审核这些账单?`,
                      onOk: () => {
                        BatchAudit({
                          keyValues: JSON.stringify(selectIds),
                          IfVerify: false
                        })
                          .then(() => {
                            message.success('审核成功');
                            initBillCheckLoadData('', '');
                          })
                          .catch(e => { });
                      },
                    });
                  } else {
                    if (id == null || id == '') {
                      message.warning('请先选择账单');
                    } else {
                      showVerify('', false);
                    }
                  }
                }} disabled={ifVerify ? false : true}
              >
                <Icon type="minus-square" />
                取消审核
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  if (selectIds.length > 1) {
                    Modal.confirm({
                      title: '请确认',
                      content: `您是否要审核这些账单?`,
                      onOk: () => {
                        BatchAudit({
                          keyValues: JSON.stringify(selectIds),
                          IfVerify: true
                        })
                          .then(() => {
                            message.success('审核成功');
                            initBillCheckLoadData('', '');
                          })
                          .catch(e => { });
                      },
                    });
                  } else {
                    if (id == null || id == '') {
                      message.warning('请先选择账单');
                    } else {
                      showVerify('', true);
                    }
                  }
                }}
                disabled={ifVerify ? true : false}
              >
                <Icon type="check-square" />
                审核
              </Button> */}

              <Button type="primary" style={{ marginLeft: '10px' }}
                onClick={() => { loadBillCheckData() }}
              >
                <Icon type="search" />
                查询
              </Button>

              <Dropdown overlay={menu}  >
                <Button style={{ float: 'right', marginLeft: '10px' }}>
                  操作<Icon type="down" />
                </Button>
              </Dropdown>

              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => { showModify(null, true) }}
              >
                <Icon type="plus" />
                新增
              </Button>
            </div>

            <BillCheckTable
              onchange={(paginationConfig, filters, sorter) => {
                loadBillCheckData(paginationConfig, sorter)
              }
              }
              loading={billCheckLoading}
              pagination={billCheckPagination}
              data={billCheckData}
              showCheckBill={(id) => {
                if (id != null && id != '') {
                  setId(id);
                }
                setShowCheckBillVisible(true);
              }}
              reload={() => initBillCheckLoadData('', billCheckSearch)}
              getRowSelect={(records) => {
                if (records.length == 1) {
                  setId(records[0].billId);
                  if (records[0].ifVerify == 1) {
                    setIfVerify(true);
                  } else {
                    setIfVerify(false);
                  }
                }
                var recordList: Array<string> = [];
                records.forEach(record => {
                  recordList.push(record.billId)
                })
                setSelectIds(recordList);
              }}
            />
          </TabPane>
          <TabPane tab="账单明细" key="2">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的单号"
                style={{ width: 280 }}
                onSearch={value => loadBillNoticeData(value)}
              />
            </div>
            <BillNoticeTable
              showModify={(id) => {
                setId(id);
              }}
              onchange={(paginationConfig, filters, sorter) =>
                loadBillNoticeData(billNoticeSearch, paginationConfig, sorter)
              }
              loading={billNoticeLoading}
              pagination={billNoticePagination}
              data={billNoticeData}
              reload={() => initBillNoticeLoadData('', billNoticeSearch)}
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
      <BillCheckModify
        visible={modifyVisible}
        closeDrawer={closeModify}
        id={id}
        isEdit={true}
        reload={() => initBillCheckLoadData('', '')}
      />
      <BillCheckShow
        visible={showCheckBillVisible}
        closeDrawer={() => {
          setShowCheckBillVisible(false);
        }}
        id={id}
      />
      <BillCheckVerify
        vertifyVisible={vertifyVisible}
        closeVerify={closeVerify}
        ifVerify={ifVerify}
        id={id}
        reload={() => initBillCheckLoadData('', '')}
      />
    </Layout>
  );
}
export default BillNotice;
