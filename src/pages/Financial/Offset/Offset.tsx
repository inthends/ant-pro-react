//费用冲抵
import { TreeEntity } from '@/model/models';
import { DefaultPagination } from '@/utils/defaultSetting';
import { getResult } from '@/utils/networkUtils';
import { Tabs, Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useContext, useEffect, useState } from 'react';
import { GetTreeListExpand, GetOffsetPageDetailData, GetOffsetPageData, GetRoomTreeListExpand } from './Offset.service';
import AsynLeftTree from '../AsynLeftTree';
import Page from '@/components/Common/Page';
import { SiderContext } from './SiderContext';
import Modify from './Modify';

import BillCheckTable from './BillCheckTable';
import BillNoticeTable from './BillNoticeTable';

const { Sider, Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;

function Offset() {
  const [treeData, setTreeData] = useState<TreeEntity[]>([]);
  const [organize, SetOrganize] = useState<any>({});
  const [search, SetSearch] = useState<any>({});
  const { hideSider, setHideSider } = useContext(SiderContext);
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [id, setId] = useState<string>();

  const [vertifyVisible, setVertifuVisible] = useState<boolean>(false);

  const [checkloading, setCheckLoading] = useState<boolean>(false);
  const [checkpagination, setCheckPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [checkdata, setCheckData] = useState<any>();
  const [checksearch, setCheckSearch] = useState<string>('');

  const [noticeloading, setNoticeLoading] = useState<boolean>(false);
  const [noticepagination, setNoticePagination] = useState<DefaultPagination>(new DefaultPagination());
  const [noticedata, setNoticeData] = useState<any>();
  const [noticesearch, setNoticeSearch] = useState<string>('');

  const selectTree = (org, item, searchText) => {
    initCheckLoadData(item, '');
    initNoticeLoadData(item, '');
    SetOrganize(item);
  };

  useEffect(() => {
    getTreeData().then(res => {
      const root = res.filter(item => item.parentId === '0');
      const rootOrg = root.length === 1 ? root[0] : undefined;
      SetOrganize(rootOrg);
      initCheckLoadData(rootOrg, '');
      initNoticeLoadData(rootOrg, '');
    });
  }, []);
  // 获取属性数据
  const getTreeData = () => {
    return GetRoomTreeListExpand()
      .then((res: TreeEntity[]) => {
        const treeList = (res || []).map(item => {
          return {
            ...item,
            id: item.id,
            text: item.title,
            parentId: item.pId,
          };
        });
        setTreeData(treeList);
        return treeList;
      });
  };

  const closeDrawer = () => {
    setModifyVisible(false);
    setId(null);
  };

  const showDrawer = (id?) => {
    setModifyVisible(true);
    setId(id);
  };

  //账单表数据
  const loadCheckData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setCheckSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: checkpagination.pageSize,
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
      searchCondition.sidx = field ? field : 'billid';
    }

    return checkload(searchCondition).then(res => {
      return res;
    });
  };

  //账单表加载
  const checkload = data => {
    setCheckLoading(true);
    data.sidx = data.sidx || 'billID';
    data.sord = data.sord || 'asc';
    return GetOffsetPageData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setCheckPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setCheckData(res.data);
      setCheckLoading(false);
      return res;
    });
  };

  //明细表数据
  const loadNoticeData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setNoticeSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: noticepagination.pageSize,
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
      searchCondition.sidx = field ? field : 'billid';
    }

    return noticeload(searchCondition).then(res => {
      return res;
    });
  };
  //明细表加载
  const noticeload = data => {
    setNoticeLoading(true);
    data.sidx = data.sidx || 'billid';
    data.sord = data.sord || 'asc';
    return GetOffsetPageDetailData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setNoticePagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setNoticeData(res.data);
      setNoticeLoading(false);
      return res;
    });
  };

  const initCheckLoadData = (org, searchText) => {
    setCheckSearch(searchText);
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'billcode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = checkpagination;
    return checkload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const initNoticeLoadData = (org, searchText) => {
    setNoticeSearch(searchText);
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'billcode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = noticepagination;
    return noticeload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
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
      <Content style={{ padding: '0 20px' }}>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="账单" key="1">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要插叙你的非标名称或者编号"
                style={{ width: 280 }}
                onSearch={value => loadCheckData(value)}
              />
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => initCheckLoadData(organize, null)}
              >
                <Icon type="reload" />
                刷新
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => showDrawer()}
              >
                <Icon type="plus" />
                添加
              </Button>
            </div>
            <BillCheckTable
              onchange={(paginationConfig, filters, sorter) =>
                loadCheckData(checksearch, paginationConfig, sorter)
              }
              loading={checkloading}
              pagination={checkpagination}
              data={checkdata}
              reload={() => initCheckLoadData('', checksearch)}
            />
          </TabPane>
          <TabPane tab="明细" key="2">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的单号"
                style={{ width: 280 }}
                onSearch={value => loadNoticeData(value)}
              />
            </div>
            <BillNoticeTable
              onchange={(paginationConfig, filters, sorter) =>
                loadNoticeData(noticesearch, paginationConfig, sorter)
              }
              loading={noticeloading}
              pagination={noticepagination}
              data={noticedata}
              reload={() => initNoticeLoadData('', noticesearch)}
            />
          </TabPane>
        </Tabs>
      </Content>
      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        organizeId={organize}
        id={id}
        reload={() => initCheckLoadData('', checksearch)}
      />

    </Layout>
  );
}

export default Offset;
/*  <Vertify
        vertifyVisible={vertifyVisible}
        closeVertify={closeDrawer}
        id={id}
        reload={() => initCheckLoadData('',checksearch)}
      /> */
