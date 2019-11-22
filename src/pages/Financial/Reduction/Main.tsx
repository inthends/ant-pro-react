
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

  const selectTree = (org, item, searchText) => {
    initLoadData(item, '');
    // SetOrganize(item);
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

    initLoadData('', '');
    initDetailLoadData('', '');
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
    setModifyVisible(true);
    setId(id);
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
    setVerifyVisible(true);
    setId(id);
    setIfVerify(ifVerify);
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
      searchCondition.sidx = field ? field : 'billId';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'billId';
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

  const initLoadData = (org, searchText) => {
    setSearch(searchText);
    // setAddButtonDisabled(true);
    const queryJson = {
      // OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'billcode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      // setAddButtonDisabled(false);
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
      searchCondition.sidx = field ? field : 'billId';
    }

    return detailload(searchCondition).then(res => {
      return res;
    });
  };
  //明细表加载
  const detailload = data => {
    setDetailLoading(true);
    data.sidx = data.sidx || 'billId';
    data.sord = data.sord || 'asc';
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
  const initDetailLoadData = (org, searchText) => {
    setDetailSearch(searchText);
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'billCode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return detailload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //页签切换刷新
  const changeTab = key => {
    if (key == "1") {
      initLoadData('', search);
    } else {
      initDetailLoadData('', detailsearch);
    }
  };

  return (
    <Layout style={{ height: '100%' }}>
      <AsynLeftTree
        parentid={'0'}
        selectTree={(id, item) => {
          selectTree(id, item, search);
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
          <TabPane tab="减免单" key="1">
            <div style={{ marginBottom: '10px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的单号"
                style={{ width: 200 }}
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
              reload={() => initLoadData('', search)}
            />
          </TabPane>
          <TabPane tab="明细" key="2">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的单号"
                style={{ width: 200 }}
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
              reload={() => initDetailLoadData('', detailsearch)}
            />
          </TabPane>
        </Tabs>
      </Content>

      <Modify
        treeData={unitTreeData}
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        id={id}
        reload={() => initLoadData('', search)}
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
        reload={() => initLoadData('', search)}
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
