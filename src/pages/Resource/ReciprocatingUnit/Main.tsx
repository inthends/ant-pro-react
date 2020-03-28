//往来单位
import { TreeEntity } from '@/model/models';
import { DefaultPagination } from '@/utils/defaultSetting';
import { Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import LeftTree from '../LeftTree';
import ListTable from './ListTable';
import Modify from './Modify';
import { GetPageListJson } from './ReciprocatingUnit.service';
import { GetOrgs } from '@/services/commonItem';

const { Content } = Layout;
const { Search } = Input;

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TreeEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  // const [organize, SetOrganize] = useState<any>({});
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  const [search, setSearch] = useState<string>('');
  const [orgid, setOrgId] = useState<string>('');
  const [orgtype, setOrgType] = useState<string>('');

  const selectTree = (id, type) => {
    // initLoadData(id, type, searchText);
    setOrgId(id);
    setOrgType(type);
    //初始化页码，防止页码错乱导致数据查询出错  
    const page = new DefaultPagination();
    loadData(search, id, type, page);
  };

  useEffect(() => {
    GetOrgs().then(res => {
      // const root = res.filter(item => item.parentId === '0');
      // const rootOrg = root.length === 1 ? root[0] : undefined;
      // SetOrganize(rootOrg);
      setTreeData(res || []);
      initLoadData('', '', '');
    });
  }, []);
  // 获取属性数据
  // const getTreeData = () => {
  //   return GetOrgTreeOnly().then((res: TreeEntity[]) => {
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

  const loadData = (searchText, orgid, orgtype, paginationConfig?: PaginationConfig, sorter?) => {
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
        OrganizeId: orgid,
        Type: orgtype
      },
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'enCode';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'enCode';
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

  const initLoadData = (id, type, searchText) => {
    setSearch(searchText);
    const queryJson = {
      OrganizeId: id,
      Type: type,
      keyword: searchText,
    };
    const sidx = 'enCode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  return (
    <Layout style={{ height: '100%' }}>
      <LeftTree
        treeData={treeData}
        selectTree={(orgid, orgtype, organizeId) => {
          selectTree(orgid, orgtype);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <div style={{ marginBottom: '10px' }}>
          <Search
            className="search-input"
            placeholder="搜索名称和编号"
            onSearch={value => loadData(value, orgid, orgtype)}
            style={{ width: 200 }}
          />
          <Button type="primary" style={{ float: 'right' }} onClick={() => showDrawer()}>
            <Icon type="plus" />
            单位
          </Button>
        </div>
        <ListTable
          onchange={(paginationConfig, filters, sorter) =>
            loadData(search, orgid, paginationConfig, sorter)
          }
          loading={loading}
          pagination={pagination}
          data={data}
          modify={showDrawer}
          reload={() => initLoadData(orgid, orgtype, search)}
        />
      </Content>

      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        treeData={treeData}
        organizeId={orgid}
        data={currData}
        reload={() => initLoadData(orgid, orgtype, search)}
      />
    </Layout>
  );
}

export default Main;
