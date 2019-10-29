//费用冲抵
import { DefaultPagination } from '@/utils/defaultSetting';
// import { getResult } from '@/utils/networkUtils';
import { Tabs, Button, Icon, Input, Layout, Modal } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetOffsetPageDetailData, GetOffsetPageData, RemoveForm } from './Offset.service';
import AsynLeftTree from '../AsynLeftTree';
import { GetUnitTreeAll } from '@/services/commonItem';//获取全部房间树
import { getResult } from '@/utils/networkUtils';
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
  const [organize, setOrganize] = useState<any>({});
  // const [search, setSearch] = useState<any>({});
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
  const [search, setSearch] = useState<string>('');  
  const [noticeloading, setNoticeLoading] = useState<boolean>(false);
  const [noticepagination, setNoticePagination] = useState<DefaultPagination>(new DefaultPagination());
  const [noticedata, setNoticeData] = useState<any>();
  const [noticesearch, setDetailSearch] = useState<string>(''); 
  const [unitTreeData, setUnitTreeData] = useState<any[]>([]);

  const selectTree = (org, item, searchText) => {
    initLoadData(item, '');
    initDetailLoadData(item, '');
    setOrganize(item);
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
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
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
  const loadDetailData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setDetailSearch(search);
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
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billid';
    }

    return detailload(searchCondition).then(res => {
      return res;
    });
  };
  //明细表加载
  const detailload = data => {
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
    const { current: pageIndex, pageSize, total } = checkpagination;
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
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'billcode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = noticepagination;
    return detailload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const closeVertify = (result?) => {
    setVertifyVisible(false);
    if (result) {
      initLoadData(organize, null);
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
      initLoadData(organize, null);
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
            <BillCheckTable
              onchange={(paginationConfig, filters, sorter) =>
                loadDetailData(search, paginationConfig, sorter)
              }
              loading={checkloading}
              pagination={checkpagination}
              data={checkdata}
              showVertify={showVertify}
              closeVertify={closeVertify}
              deleteData={deleteData}
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
            <BillNoticeTable
              onchange={(paginationConfig, filters, sorter) =>
                loadDetailData(noticesearch, paginationConfig, sorter)
              }
              loading={noticeloading}
              pagination={noticepagination}
              data={noticedata}
              reload={() => initDetailLoadData('', noticesearch)}
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
      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeModify}
        organizeId={organize}
        id={id}
        reload={() => initLoadData('', search)}
      />
      <Vertify
        vertifyVisible={vertifyVisible}
        closeVertify={closeVertify}
        ifVertify={ifVertify}
        id={id}
        reload={() => initLoadData('', search)}
      />
    </Layout>
  );
}

export default Offset;
