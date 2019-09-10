//周期费计算
import { DefaultPagination } from '@/utils/defaultSetting';
import { Tabs, Button, Icon, Input, Layout, Modal } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetPageListJson, GetPageDetailListJson, RemoveForm } from './BillingMain.service';
import AsynLeftTree from '../AsynLeftTree';
import ListTable from './ListTable';
import UnitTable from './UnitTable';
import Modify from './Modify';
import Verify from './Verify';
const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;
function BillingMain() {
  const [organize, SetOrganize] = useState<any>({});
  // const [treeSearch, SetTreeSearch] = useState<any>({});
  const [id, setId] = useState<string>();

  const [meterLoading, setMeterLoading] = useState<boolean>(false);
  const [unitMeterLoading, setUnitMeterLoading] = useState<boolean>(false);

  const [meterData, setMeterData] = useState<any>();
  const [unitMeterData, setUnitMeterData] = useState<any[]>([]);


  const [meterSearch, setMeterSearch] = useState<string>('');
  const [unitMeterSearch, setUnitMeterSearch] = useState<string>('');

  const [meterPagination, setMeterPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [unitMeterPagination, setUnitMeterPagination] = useState<DefaultPagination>(new DefaultPagination());

  const [ifVerify, setIfVerify] = useState<boolean>(false);
  const [vertifyVisible, setVerifyVisible] = useState<boolean>(false);

  const selectTree = (org, item, info) => {
    SetOrganize(org);
    initMeterLoadData(info, '');
    initUnitMeterLoadData(info, '');
  };

  useEffect(() => {
    initMeterLoadData('', '');
    initUnitMeterLoadData('', '');
  }, []);


  const loadMeterData = (paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: meterPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: meterSearchParams.search }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billId';
    }
    return meterload(searchCondition);
  }
  const loadUnitMeterData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setUnitMeterSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: unitMeterPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: search }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    }

    return unitMeterload(searchCondition);
  }
  const meterload = data => {
    setMeterLoading(true);
    data.sidx = data.sidx || 'billId';
    data.sord = data.sord || 'asc';

    return GetPageListJson(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setMeterPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });

      setMeterData(res.data);
      setMeterLoading(false);
      return res;
    });
  };
  const unitMeterload = data => {
    setUnitMeterLoading(true);
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'asc';
    return GetPageDetailListJson(data).then(res => {
      console.log(res);
      const { pageIndex: current, total, pageSize } = res;
      setUnitMeterPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setUnitMeterData(res.data);
      setUnitMeterLoading(false);
      return res;
    });
  };

  const initMeterLoadData = (org, searchText) => {
    console.log(org);
    setMeterSearch(searchText);
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'billId';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = meterPagination;
    return meterload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };
  const initUnitMeterLoadData = (org, searchText) => {
    setUnitMeterSearch(searchText);
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = unitMeterPagination;
    return unitMeterload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };

  const closeVerify = (result?) => {
    setVerifyVisible(false);
    if (result) {
      initMeterLoadData(organize, '');
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

  const [meterSearchParams, setMeterSearchParams] = useState<any>({});
  const [isEdit, setIsEdit] = useState<boolean>(false);
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
          <TabPane tab="计费单列表" key="1">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }} onChange={(value) => {
              var params = Object.assign({}, meterSearchParams, { metertype: value });
              setMeterSearchParams(params);
            }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的单号"
                style={{ width: 200 }}
                onChange={e => {
                  var params = Object.assign({}, meterSearchParams, { search: e.target.value });
                  setMeterSearchParams(params);
                }}
              />
              {/* <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {}}  disabled={ifVerify?false:true}
              >
                <Icon type="minus-square" />
                权责摊销
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  if(id==null||id=='')
                  {
                    message.warning('请先选择计费单');
                  }else{
                    showVerify('',false);
                  }
                }}  disabled={ifVerify?false:true}
              >
                <Icon type="minus-square" />
                取消审核
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  if(id==null||id=='')
                  {
                    message.warning('请先选择计费单');
                  }else{
                    showVerify('',true);
                  }
                }}
                disabled={ifVerify?true:false}
              >
                <Icon type="check-square" />
                审核
              </Button> */}
              <Button type="primary" style={{ marginLeft: '10px' }}
                onClick={() => { loadMeterData() }}
              >
                <Icon type="search" />
                查询
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => { showModify(null, true) }}
              >
                <Icon type="plus" />
                新增
              </Button>
            </div>
            <ListTable
              onchange={(paginationConfig, filters, sorter) => {
                loadMeterData(paginationConfig, sorter)
              }
              }
              loading={meterLoading}
              pagination={meterPagination}
              data={meterData}
              showVerify={showVerify}
              showModify={(id, isedit) => {
                if (id != null && id != '') {
                  setId(id);
                }
                setIsEdit(isedit);
                setModifyVisible(true);
              }}
              reload={() => initMeterLoadData('', meterSearch)}
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
          <TabPane tab="计费明细" key="2">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的计费单号或单元编号"
                style={{ width: 280 }}
                onSearch={value => loadUnitMeterData(value)}
              />
            </div>
            <UnitTable
              onchange={(paginationConfig, filters, sorter) =>
                loadUnitMeterData(unitMeterSearch, paginationConfig, sorter)
              }
              loading={unitMeterLoading}
              pagination={unitMeterPagination}
              data={unitMeterData}
              reload={() => initUnitMeterLoadData('', unitMeterSearch)}
            />
          </TabPane>
        </Tabs>
      </Content>
      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeModify}
        organizeId={organize}
        id={id}
        isEdit={isEdit}
        reload={() => initMeterLoadData('', '')}
      />
      <Verify
        vertifyVisible={vertifyVisible}
        closeVerify={closeVerify}
        ifVerify={ifVerify}
        id={id}
        reload={() => initMeterLoadData('', '')}
      />
    </Layout>
  );
}
export default BillingMain;
