//费用冲抵
import { DefaultPagination } from '@/utils/defaultSetting';
// import { getResult } from '@/utils/networkUtils';
import { Tabs, Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetOffsetPageDetailData, GetOffsetPageData } from './Offset.service';
import AsynLeftTree from '../AsynLeftTree';
import { GetUnitTreeAll } from '@/services/commonItem';//获取全部房间树
import { getResult } from '@/utils/networkUtils';
// import Page from '@/components/Common/Page';
// import { SiderContext } from './SiderContext'; 
import AddDrawer from './AddDrawer';
import Verify from './Verify';
import Show from './Show';
import ListTable from './ListTable';
import DetailTable from './DetailTable';

const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;

function Offset() {
  // const [treeData, setTreeData] = useState<TreeEntity[]>([]);
  const [organize, setOrganize] = useState<any>({});
  // const [search, setSearch] = useState<any>({});
  // const { hideSider, setHideSider } = useContext(SiderContext);
  const [addDrawerVisible, setAddDrawerVisible] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [verifyVisible, setVerifyVisible] = useState<boolean>(false);
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [ifVerify, setIfVerify] = useState<boolean>(false);
  const [addButtonDisable, setAddButtonDisable] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [data, setData] = useState<any>();
  const [search, setSearch] = useState<string>('');

  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [detailPagination, setDetailPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [detailData, setDetailData] = useState<any>();
  const [detailSearch, setDetailSearch] = useState<string>('');

  const [unitTreeData, setUnitTreeData] = useState<any[]>([]);

  const selectTree = (id, type, info) => {
    initLoadData(info.node.props.dataRef, search);
    initDetailLoadData(info.node.props.dataRef, detailSearch);
    setOrganize(info.node.props.dataRef);
  };

  useEffect(() => {
    //getTreeData().then(res => {
    // const root = res.filter(item => item.parentId === '0');
    // const rootOrg = root.length === 1 ? root[0] : undefined;
    // SetOrganize(rootOrg);

    //获取房产树
    GetUnitTreeAll()
      .then(getResult)
      .then((res: any[]) => {
        setUnitTreeData(res || []);
        return res || [];
      });

    initLoadData('', '');
    initDetailLoadData('', '');
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

  //冲抵单数据
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
      queryJson: { keyword: search }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billId';
    }

    return checkload(searchCondition).then(res => {
      return res;
    });
  };

  //账单表加载
  const checkload = data => {
    setLoading(true);
    data.sidx = data.sidx || 'billId';
    data.sord = data.sord || 'asc';
    return GetOffsetPageData(data).then(res => {
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
      pageSize: detailPagination.pageSize,
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
    return GetOffsetPageDetailData(data).then(res => {
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

  const initLoadData = (org, searchText) => {
    setSearch(searchText);
    const queryJson = {
      // OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.key,
      TreeType: org.type,
    };
    const sidx = 'billCode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    setAddButtonDisable(true);
    return checkload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    }).then(() => {
      setAddButtonDisable(false);
    });
  };

  const initDetailLoadData = (org, searchText) => {
    setDetailSearch(searchText);
    const queryJson = {
      // OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.key,
      TreeType: org.type,
    };
    const sidx = 'billCode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = detailPagination;
    return detailload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const closeVerify = (result?) => {
    setVerifyVisible(false);
    if (result) {
      initLoadData(organize, null);
    }
    setId('');
  };

  const showVerify = (id?, ifVerify?) => {
    setVerifyVisible(true);
    setIfVerify(ifVerify);
    setId(id);
  };

  // const closeModify = (result?) => {
  //   setModifyVisible(false);
  //   if (result) {
  //     initLoadData(organize, null);
  //   }
  // };

  const closeModify = () => {
    setModifyVisible(false);
  };

  const showModify = (id?) => {
    setModifyVisible(true);
    setId(id);
  };

  //删除冲抵单
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
  // }

  return (
    <Layout className="offsetMain">
      <AsynLeftTree
        parentid={'0'}
        selectTree={(id, type, info) => {
          selectTree(id, type, info);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="冲抵单" key="1">
            <div style={{ marginBottom: '10px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的单号"
                style={{ width: 200 }}
                onSearch={value => loadData(value)}
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
            <ListTable
              onchange={(paginationConfig, filters, sorter) =>
                loadDetailData(search, paginationConfig, sorter)
              }
              loading={loading}
              pagination={pagination}
              data={data}
              showVerify={showVerify}
              closeVerify={closeVerify}
              // deleteData={deleteData}
              showModify={showModify}
              closeModify={closeModify}
              reload={() => initLoadData('', search)}
            />
          </TabPane>
          <TabPane tab="明细" key="2">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的单号"
                style={{ width: 280 }}
                onSearch={value => loadDetailData(value)}
              />
            </div>
            <DetailTable
              onchange={(paginationConfig, filters, sorter) =>
                loadDetailData(detailSearch, paginationConfig, sorter)
              }
              loading={detailLoading}
              pagination={detailPagination}
              data={detailData}
              reload={() => initDetailLoadData('', detailSearch)}
            />
          </TabPane>
        </Tabs>
      </Content>
      <AddDrawer
        treeData={unitTreeData}
        addDrawerVisible={addDrawerVisible}
        closeDrawer={closeDrawer}
        organizeId={organize}
        id={id}
        reload={() => initLoadData('', search)}
      />
      <Show
        modifyVisible={modifyVisible}
        closeDrawer={closeModify}
        // organizeId={organize}
        id={id}
      // reload={() => initLoadData('', search)}
      />
      <Verify
        verifyVisible={verifyVisible}
        closeVerify={closeVerify}
        ifVerify={ifVerify}
        id={id}
        reload={() => initLoadData('', search)}
      />
    </Layout>
  );
}
export default Offset;
