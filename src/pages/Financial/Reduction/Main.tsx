 
import { DefaultPagination } from '@/utils/defaultSetting'; 
import { Tabs, Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetPageListJson, GetDetailPageListJson } from './Main.service';
import AsynLeftTree from '../AsynLeftTree';
import ListTable from './ListTable';
import Modify from './Modify';
import DetailList from './DetailList';
const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false); 
  const [organize, SetOrganize] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [detailloading, setDetailLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [detailpagination, setDetailPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [data, setData] = useState<any[]>([]); const [detaildata, setDetailData] = useState<any[]>([]);
  const [id, setId] = useState<string>();

  const [search, setSearch] = useState<string>('');
  const [detailsearch, setDetailSearch] = useState<string>('');

  const selectTree = (org, item, searchText) => {
    initLoadData(item, '');
    SetOrganize(item);
  };

  useEffect(() => {
    // getTreeData().then(res => {
    //   const root = res.filter(item => item.parentId === '0');
    //   const rootOrg = root.length === 1 ? root[0] : undefined;
    //   SetOrganize(rootOrg);
    //   initLoadData(rootOrg, '');
    //   initDetailLoadData(rootOrg, '');
    // });

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

  const closeDrawer = () => {
    setModifyVisible(false);
    setId('');
  };

  const showDrawer = (id?) => {
    setModifyVisible(true);
    setId(id);
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
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billID';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'billID';
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
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'billcode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
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
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billID';
    }

    return detailload(searchCondition).then(res => {
      return res;
    });
  };
  //明细表加载
  const detailload = data => {
    setDetailLoading(true);
    data.sidx = data.sidx || 'billID';
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
    const sidx = 'billcode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return detailload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };


  return (
    <Layout style={{ height: '100%' }}>
      <AsynLeftTree
        parentid={'0'}
        selectTree={(id, item) => {
          selectTree(id, item, search);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="减免单" key="1">
            <div style={{ marginBottom: '10px'  }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的单号"
                style={{ width: 200 }}
                onSearch={value => loadData(value)}
              />
              <Button type="primary" style={{ float: 'right' }}
                onClick={() => showDrawer()}
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
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        organizeId={organize}
        rowKey='billid'
        id={id}
        reload={() => initLoadData('', search)}
      />
    </Layout>
  );
}
export default Main;
