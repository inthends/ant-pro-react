
import { DefaultPagination } from '@/utils/defaultSetting';
import { Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import LeftTree from '../LeftTree';
import ListTable from './ListTable';
import Modify from './Modify';
import { GetPageListJson } from './Main.service';
import { GetOrgs } from '@/services/commonItem';

const { Content } = Layout;
const { Search } = Input;

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [organizeId, setOrganizeId] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  const [search, setSearch] = useState<string>('');
  const [treeData, setTreeData] = useState<any[]>([]);

  // const selectTree = (org, item, searchText) => {
  //   initLoadData(item, searchText);
  //   SetOrganize(item);
  // };

  useEffect(() => {
    GetOrgs().then(res => {
      // const root = res.filter(item => item.parentId === '0');
      // const rootOrg = root.length === 1 ? root[0] : undefined;
      // SetOrganize(rootOrg);
      // initLoadData('', '');
      setTreeData(res || []);
      initLoadData('', '');
    });

    //获取房产树
    // GetQuickSimpleTreeAll()
    //   .then(getResult)
    //   .then((res: any[]) => {
    //     setTreeData(res || []);
    //     return res || [];
    //   }); 
  }, []);
  // 获取属性数据
  // const getTreeData = () => {
  //   return GetQuickPStructsTree().then((res: any[]) => {
  //     //const treeList = (res || []).map(item => {
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

  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };

  const loadData = (searchText, organizeId, paginationConfig?: PaginationConfig, sorter?) => { 

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
        OrganizeId: organizeId, 
      },
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'code';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'code';
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

  const initLoadData = (organizeId, searchText) => {
    setSearch(searchText);
    const queryJson = {
      OrganizeId: organizeId,
      keyword: searchText, 
    };
    const sidx = 'code';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const selectTreeLoad = (orgid, orgtype, searchText) => { 
    setOrganizeId(orgid);
    initLoadData(orgid, searchText);
  };

  return (
    <Layout style={{ height: '100%' }}>
      <LeftTree
        treeData={treeData}
        selectTree={(orgid, orgtype) => {
          selectTreeLoad(orgid, orgtype, search);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <div style={{ marginBottom: '10px' }}>
          <Search
            className="search-input"
            placeholder="请输入要查询的关键词"
            onSearch={value => loadData(value, organizeId)}
            style={{ width: 200 }}
          />
          <Button type="primary" style={{ float: 'right' }} onClick={() => showDrawer()}>
            <Icon type="plus" />
            仓库
          </Button>
        </div>
        <ListTable
          onchange={(paginationConfig, filters, sorter) =>
            loadData(search, organizeId, paginationConfig, sorter)
          }
          loading={loading}
          pagination={pagination}
          data={data}
          modify={showDrawer}
          reload={() => initLoadData(organizeId, search)}
        />
      </Content>

      <Modify
        visible={modifyVisible}
        closeDrawer={closeDrawer}
        // treeData={treeData}
        data={currData}
        reload={() => initLoadData(organizeId, search)}
      />
    </Layout>
  );
}
export default Main;
