//费用冲抵

import { DefaultPagination } from '@/utils/defaultSetting';
// import { getResult } from '@/utils/networkUtils';
import { Tabs, Button, Icon, Input, Layout, Modal } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, {   useEffect, useState } from 'react';
import {  GetOffsetPageDetailData, GetOffsetPageData,  RemoveForm } from './Offset.service';
import AsynLeftTree from '../AsynLeftTree';
// import Page from '@/components/Common/Page';
// import { SiderContext } from './SiderContext'; 
import AddDrawer from './AddDrawer';
import Vertify from './Vertify';
import Modify from './Modify';
import BillCheckTable from './BillCheckTable';
import BillNoticeTable from './BillNoticeTable';

const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;

function Offset() {
  // const [treeData, setTreeData] = useState<TreeEntity[]>([]);
  const [organize, SetOrganize] = useState<any>({});
  const [search, SetSearch] = useState<any>({});
  // const { hideSider, setHideSider } = useContext(SiderContext);
  const [addDrawerVisible, setAddDrawerVisible] = useState<boolean>(false);
  const [id, setId] = useState<string>();

  const [vertifyVisible, setVertifyVisible] = useState<boolean>(false);
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);

  const [ifVertify, setIfVertify] = useState<boolean>(false);

  const [addButtonDisable, setAddButtonDisable] = useState<boolean>(true);
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
    //getTreeData().then(res => {
      // const root = res.filter(item => item.parentId === '0');
      // const rootOrg = root.length === 1 ? root[0] : undefined;
      // SetOrganize(rootOrg);
      initCheckLoadData('', '');
      initNoticeLoadData('', '');
    //});
  }, []);

  // 获取属性数据
  // const getTreeData = () => {
  //   return GetRoomTreeListExpand()
  //     .then((res: any[]) => {
  //       const treeList = (res || []).map(item => {
  //         return {
  //           ...item,
  //           id: item.id,
  //           text: item.title,
  //           parentId: item.pId,
  //         };
  //       });
  //       setTreeData(treeList);
  //       return treeList;
  //     });
  // };

  const closeDrawer = () => {
    setAddDrawerVisible(false);
    setId('');
  };

  const showDrawer = (id?) => {
    setAddDrawerVisible(true);
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
    data.sidx = data.sidx || 'billId';
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
    setAddButtonDisable(true);
    return checkload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    }).then(() => {
      setAddButtonDisable(false);
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

  const closeVertify = (result?) => {
    setVertifyVisible(false);
    if (result) {
      initCheckLoadData(organize, null);
    }
    setId('');
  };

  const showVertify = (id?, ifVertify?) => {
    setVertifyVisible(true);
    setIfVertify(ifVertify);
    setId(id);
  };
  const closeModify = (result?) => {
    setModifyVisible(false);
    if (result) {
      initCheckLoadData(organize, null);
    }
  };

  const showModify = (id?) => {
    setModifyVisible(true);
    setId(id);
  };
  //删除冲抵单
  const deleteData = (id?) => {
    Modal.confirm({
      title: '是否确认删除该条抵冲记录?',
      onOk() {
        RemoveForm({
          keyValue: id
        }).then(res => {

        });
      },
      onCancel() { },
    });
  }

  return (
    <Layout className="offsetMain">
      <AsynLeftTree
        parentid={'0'}
        selectTree={(id, item) => {
          selectTree(id, item, search);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="冲抵单" key="1">
            <div style={{ marginBottom: '10px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的单号"
                style={{ width: 280 }}
                onSearch={value => loadCheckData(value)}
              />
              {/* <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => initCheckLoadData(organize, null)}
              >
                <Icon type="reload" />
                刷新
              </Button> */}
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => showDrawer()} disabled={addButtonDisable}
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
              showVertify={showVertify}
              closeVertify={closeVertify}
              deleteData={deleteData}
              showModify={showModify}
              closeModify={closeModify}
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
      <AddDrawer
        addDrawerVisible={addDrawerVisible}
        closeDrawer={closeDrawer}
        organizeId={organize}
        id={id}
        reload={() => initCheckLoadData('', checksearch)}
      />
      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeModify}
        organizeId={organize}
        id={id}
        reload={() => initCheckLoadData('', checksearch)}
      />
      <Vertify
        vertifyVisible={vertifyVisible}
        closeVertify={closeVertify}
        ifVertify={ifVertify}
        id={id}
        reload={() => initCheckLoadData('', checksearch)}
      />
    </Layout>
  );
}

export default Offset;
