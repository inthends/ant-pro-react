
import { DefaultPagination } from '@/utils/defaultSetting';
import { Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import AsynLeftTree from '../AsynLeftTree';
import ListTable from './ListTable';
import Modify from './Modify';
import Show from './Show';
import { GetPageListJson } from './Main.service';
import ShowLink from '../ServiceDesk/ShowLink';
const { Content } = Layout;
const { Search } = Input;

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [viewVisible, setViewVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [organize, SetOrganize] = useState<any>({});
  const [data, setData] = useState<any[]>([]);
  // const [currData, setCurrData] = useState<any>();
  const [id, setId] = useState<any>();
  const [search, setSearch] = useState<string>('');

  const selectTree = (pid, type, info) => {
    // initLoadData(info.node.props.dataRef, search);
    SetOrganize(info.node.props.dataRef);

    //初始化页码，防止页码错乱导致数据查询出错  
    const page = new DefaultPagination();
    loadData(search, info.node.props.dataRef, page); 
  };

  useEffect(() => {
    // getTreeData().then(res => {
    //   const root = res.filter(item => item.parentId === '0');
    //   const rootOrg = root.length === 1 ? root[0] : undefined;
    //   SetOrganize(rootOrg); 
    // });

    initLoadData('', '');

  }, []);
  // 获取属性数据
  // const getTreeData = () => {
  //   return GetQuickPStructsTree().then((res: any[]) => {
  //     // const treeList = (res || []).map(item => {
  //     //   return {
  //     //     ...item,
  //     //     id: item.id,
  //     //     text: item.name,
  //     //     parentId: item.pId,
  //     //   };
  //     // });
  //     setTreeData(res || []);
  //     return res || [];
  //   });
  // };

  const closeDrawer = () => {
    setModifyVisible(false);
  };
  const showDrawer = (id?) => {
    setId(id);
    // setCurrData(item);
    setModifyVisible(true);
  };

  const closeViewDrawer = () => {
    setViewVisible(false);
  };

  const showViewDrawer = (id?) => {
    setId(id);
    // setCurrData(item);
    setViewVisible(true);
  };


  const loadData = (searchText, org, paginationConfig?: PaginationConfig, sorter?) => {
    setSearch(searchText);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: searchText,
        // OrganizeId: org.organizeId,
        TreeTypeId: org.key,
        TreeType: org.type,
      },
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'id';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'id';
    formData.sord = formData.sord || 'asc';
    return GetPageListJson(formData).then(res => {
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
      // OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.key,
      TreeType: org.type,
    };
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const [serverVisible, setServerVisible] = useState<boolean>(false);
  const [billId, setBillId] = useState<any>('');
  //查看关联单据
  const showLinkDrawer = (billId) => {
    setServerVisible(true);
    setBillId(billId);
  };

  const closeLinkDrawer = () => {
    setServerVisible(false);
  };

  return (
    <Layout style={{ height: '100%' }}>
      <AsynLeftTree
        parentid={'0'}
        selectTree={(pid, type, info) => {
          selectTree(pid, type, info);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <div style={{ marginBottom: '10px' }}>
          <Search
            className="search-input"
            placeholder="搜索投诉单号"
            onSearch={value => loadData(value, organize)}
            style={{ width: 200 }}
          />
        </div>
        <ListTable
          onchange={(paginationConfig, filters, sorter) =>
            loadData(search, organize, paginationConfig, sorter)
          }
          loading={loading}
          pagination={pagination}
          data={data}
          modify={showDrawer}
          show={showViewDrawer}
          reload={() => initLoadData(organize, search)}
        />
      </Content>

      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        // data={currData}
        id={id}
        reload={() => initLoadData(organize, search)}
        showLink={showLinkDrawer}
      />

      <Show
        modifyVisible={viewVisible}
        closeDrawer={closeViewDrawer}
        // data={currData}
        id={id}
        showLink={showLinkDrawer}
      />

      <ShowLink
        showVisible={serverVisible}
        closeDrawer={closeLinkDrawer}
        billId={billId}
      />

    </Layout>
  );
}

export default Main;
