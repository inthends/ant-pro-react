import { DefaultPagination } from '@/utils/defaultSetting';
import { Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import ListTable from './ListTable';
import Modify from './Modify';
import { TreeNode } from 'antd/lib/tree-select';
import { getDataList } from './User.service';
import { GetOrgs } from '@/services/commonItem';
import UserAuth from './UserAuth';

const { Content } = Layout;
const { Search } = Input;
interface SearchParam {
  condition: 'Account' | 'Name' | 'Code';
  keyword: string;
}
const User = () => {
  const [search, setSearch] = useState<SearchParam>({
    condition: 'Account',
    keyword: '',
  });
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [orgs, setOrgs] = useState<TreeNode[]>([]);
  const [authVisible, setAuthVisible] = useState<boolean>(false);

  useEffect(() => {
    initLoadData(search);
    GetOrgs().then(res => {
      setOrgs(res);
    });
  }, []);


  const closeDrawer = () => {
    setModifyVisible(false);
  };
  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };
  const loadData = (searchParam: any, paginationConfig?: PaginationConfig, sorter?) => {
    setSearch(searchParam);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: searchParam,
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
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
    return getDataList(formData).then(res => {
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

  const initLoadData = (searchParam: SearchParam) => {
    setSearch(searchParam);
    const queryJson = searchParam;
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const showAuth = (item?) => {
    setAuthVisible(true);
    setCurrData(item);
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Content  >
        <div style={{ marginBottom: 20, padding: '3px 0' }}>
          {/* <Select
            style={{ marginRight: 20, width: 100 }}
            value={search.condition}
            onChange={condition => loadData({ ...search, condition })}
          >
            <Option value="Account" key="Account">
              账户
            </Option>
            <Option value="Name" key="Name">
              姓名
            </Option>
            <Option value="Code" key="Code">
              用户编号
            </Option>
          </Select> */}
          <Search
            className="search-input"
            placeholder="请输入要查询的关键词"
            onSearch={keyword => loadData({ ...search, keyword })}
            style={{ width: 200 }}
          />
          <Button type="primary" style={{ float: 'right' }} onClick={() => showDrawer()}>
            <Icon type="plus" />
            用户
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
          reload={() => initLoadData(search)}
          setData={setData}
          showAuth={showAuth}
        />
      </Content>
      <Modify
        visible={modifyVisible}
        closeDrawer={closeDrawer}
        data={currData}
        treeDate={orgs}
        reload={() => initLoadData({ ...search })}
      />

      <UserAuth
        visible={authVisible}
        close={() => setAuthVisible(false)}
        userId={currData && currData.id}
      />

    </Layout>
  );
}

export default User;
