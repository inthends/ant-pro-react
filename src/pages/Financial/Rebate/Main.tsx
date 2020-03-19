
import { DefaultPagination } from '@/utils/defaultSetting';
import { Tabs, Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetPageListJson, GetDetailPageListJson } from './Main.service';
import { GetUnitTreeAll } from '@/services/commonItem';//获取全部房间树
import { getResult } from '@/utils/networkUtils';
import AsynLeftTree from '../AsynLeftTree';
import ListTable from './ListTable';
import Modify from './Modify';
import Verify from './Verify';
import Show from './Show';
import DetailList from './DetailList';
const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;

//查看收款单
import ChargeShow from '../ChargeBill/Show';

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);//编辑
  const [viewVisible, setViewVisible] = useState<boolean>(false);//查看
  const [verifyVisible, setVerifyVisible] = useState<boolean>(false);//审批
  // const [organize, SetOrganize] = useState<any>({}); 
  const [loading, setLoading] = useState<boolean>(false);
  const [detailloading, setDetailLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [detailpagination, setDetailPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [data, setData] = useState<any[]>([]);
  const [detaildata, setDetailData] = useState<any[]>([]);
  const [id, setId] = useState<string>();
  const [ifVerify, setIfVerify] = useState<boolean>(true);
  // const [addButtonDisabled, setAddButtonDisabled] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [detailsearch, setDetailSearch] = useState<string>('');
  const [unitTreeData, setUnitTreeData] = useState<any[]>([]);

  //收款单查看
  const [chargeId, setChargeId] = useState<string>();
  const [chargeVisible, setChargeVisible] = useState<boolean>(false);//查看

  //org
  const [orgId, setOrgId] = useState<string>();
  const [type, setType] = useState<string>();

  const selectTree = (orgId, type, info) => {
    initLoadData(orgId, type, search);
    initDetailLoadData(orgId, type, search);
    setOrgId(orgId);
    setType(type);
  };

  useEffect(() => {
    // getTreeData().then(res => {
    //   const root = res.filter(item => item.parentId === '0');
    //   const rootOrg = root.length === 1 ? root[0] : undefined;
    //   SetOrganize(rootOrg);
    //   initLoadData(rootOrg, '');
    //   initDetailLoadData(rootOrg, '');
    // });

    //获取房产树
    GetUnitTreeAll()
      .then(getResult)
      .then((res: any[]) => {
        setUnitTreeData(res || []);
        return res || [];
      });

    initLoadData('', '', '');
    initDetailLoadData('', '', '');
  }, []);

  // 获取属性数据
  // const getTreeData = () => {
  //   return GetTreeListExpand()
  //     .then(getResult)
  //     .then((res: TreeEntity[]) => {
  //       // const treeList = (res || []).map(item => {
  //       //   return {
  //       //     ...item,
  //       //     id: item.id,
  //       //     text: item.title,
  //       //     parentId: item.pId,
  //       //   };
  //       // });
  //       setTreeData(res || []);
  //       return res || [];
  //     });
  // };

  //编辑
  const closeDrawer = () => {
    setModifyVisible(false);
    setId('');
  };

  const showDrawer = (id?) => {
    setId(id);
    setModifyVisible(true);
  };

  //查看
  const closeViewDrawer = () => {
    setViewVisible(false);
    setId('');
  };

  const showViewDrawer = (id?) => {
    setViewVisible(true);
    setId(id);
  };

  //审核
  const closeVerifyDrawer = () => {
    setVerifyVisible(false);
    setId('');
  };

  const showVerifyDrawer = (id, ifVerify) => {
    setId(id);
    setIfVerify(ifVerify);
    setVerifyVisible(true);
  };

  //查看收款单
  const showChargeDrawer = (id) => {
    setChargeVisible(true);
    setChargeId(id);
  };

  //收款单关闭
  const closeChargeDrawer = () => {
    setChargeVisible(false);
    setChargeId('');
  };

  const initLoadData = (orgId, type, searchText) => {
    setSearch(searchText);
    // setAddButtonDisabled(true);
    const queryJson = { 
      keyword: searchText,
      TreeTypeId: orgId,
      TreeType: type,
    };
    const sidx = 'createDate';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      // setAddButtonDisabled(false);
      return res;
    });
  };

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
      queryJson: { keyword: search },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'createDate';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'createDate';
    data.sord = data.sord || 'asc';
    return GetPageListJson(data).then(res => {
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

  //明细表数据
  const loadDetailData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setDetailSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: search },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    }

    return detailload(searchCondition).then(res => {
      return res;
    });
  };
  //明细表加载
  const detailload = data => {
    setDetailLoading(true);
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'desc';
    return GetDetailPageListJson(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setDetailPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setDetailData(res.data);
      setDetailLoading(false);
      return res;
    });
  };
  const initDetailLoadData = (orgId, type,  searchText) => {
    setDetailSearch(searchText);
    const queryJson = { 
      keyword: searchText,
      TreeTypeId: orgId,
      TreeType: type,
    };
    const sidx = 'id';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = pagination;
    return detailload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //页签切换刷新
  const changeTab = key => {
    if (key == "1") {
      initLoadData(orgId, type, search);
    } else {
      initDetailLoadData(orgId, type, detailsearch);
    }
  };

  return (
    <Layout style={{ height: '100%' }}>
      <AsynLeftTree
        parentid={'0'}
        selectTree={(pid, type, info) => {
          selectTree(pid, type, info);
        }}
      />

      {/* <SynLeftTree
        treeData={unitTreeData} 
        selectTree={(id, type, info?) => {
          initLoadData(id, type, '');
        }}
      /> */}

      <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1" onChange={changeTab}>
          <TabPane tab="优惠单" key="1">
            <div style={{ marginBottom: '10px' }}>
              <Search
                className="search-input"
                placeholder="搜索优惠单号"
                style={{ width: 180 }}
                onSearch={value => loadData(value)}
              />
              <Button type="primary" style={{ float: 'right' }}
                onClick={() => showDrawer()}
              // disabled={addButtonDisabled}
              >
                <Icon type="plus" />
                添加
              </Button>
            </div>
            <ListTable
              onchange={(paginationConfig, filters, sorter) =>
                loadData(search, paginationConfig, sorter)
              }
              loading={loading}
              pagination={pagination}
              data={data}
              modify={showDrawer}
              show={showViewDrawer}
              verify={(id, ifVerify) => showVerifyDrawer(id, ifVerify)}
              reload={() => initLoadData(orgId, type, search)}
            />
          </TabPane>
          <TabPane tab="明细" key="2">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="搜索优惠单号"
                style={{ width: 180 }}
                onSearch={value => loadDetailData(value)}
              />
            </div>
            <DetailList
              onchange={(paginationConfig, filters, sorter) =>
                loadDetailData(detailsearch, paginationConfig, sorter)
              }
              loading={detailloading}
              pagination={detailpagination}
              data={detaildata}
              reload={() => initDetailLoadData(orgId, type, detailsearch)}
            />
          </TabPane>
        </Tabs>
      </Content>

      <Modify
        treeData={unitTreeData}
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        id={id}
        reload={() => initLoadData(orgId, type, search)}
      />

      <Show
        modalVisible={viewVisible}
        closeModal={closeViewDrawer}
        id={id}
        showCharge={showChargeDrawer}
      />

      <Verify
        modalVisible={verifyVisible}
        closeModal={closeVerifyDrawer}
        id={id}
        ifVerify={ifVerify}
        reload={() => initLoadData(orgId, type, search)}
      />

      <ChargeShow
        showVisible={chargeVisible}
        closeShow={closeChargeDrawer}
        id={chargeId}
      />

    </Layout>
  );
}
export default Main;
