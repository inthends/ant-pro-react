import { DefaultPagination } from '@/utils/defaultSetting';
import { Button, Icon, Input, Layout, Select } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import ChooseUser from './ChooseUser';
import RoleAuth from './RoleAuth';
import ListTable from './ListTable';
import Modify from './Modify';
import { getDataList } from './Role.service';

const { Option } = Select;
const { Content } = Layout;
const { Search } = Input;
interface SearchParam {
  condition: 'EnCode' | 'FullName';
  keyword: string;
}
const Role = () => {
  const [search, setSearch] = useState<SearchParam>({
    condition: 'EnCode',
    keyword: '',
  });
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [userVisible, setUserVisible] = useState<boolean>(false);
  const [authVisible, setAuthVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());

  useEffect(() => {
    initLoadData(search);
  }, []);

  const closeDrawer = () => {
    setModifyVisible(false);
  };
  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };
  const showChoose = (item?) => {
    setUserVisible(true);
    setCurrData(item);
  };
  const showAuth = (item?) => {
    setAuthVisible(true);
    setCurrData(item);
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
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'CreateDate';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'CreateDate';
    formData.sord = formData.sord || 'desc';
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
    const sidx = 'CreateDate';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Content style={{ padding: '0 20px', overflow: 'auto' }}>
        <div style={{ marginBottom: 20, padding: '3px 0' }}>
          <Select
            style={{ marginRight: 20, width: 100 }}
            value={search.condition}
            onChange={condition => loadData({ ...search, condition })}
          >
            <Option value="EnCode" key="EnCode">
              角色编号
            </Option>
            <Option value="FullName" key="FullName">
              角色名称
            </Option>
          </Select>
          <Search
            className="search-input"
            placeholder="请输入要查询的关键词"
            onSearch={keyword => loadData({ ...search, keyword })}
            style={{ width: 200 }}
          />
          <Button type="primary" style={{ float: 'right' }} onClick={() => showDrawer()}>
            <Icon type="plus" />
            角色
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
          choose={showChoose}
          showAuth={showAuth}
          reload={() => initLoadData(search)}
          setData={setData}
        />
      </Content>
      <Modify
        visible={modifyVisible}
        closeDrawer={closeDrawer}
        data={currData}
        reload={() => initLoadData({ ...search })}
      />
      <ChooseUser visible={userVisible} close={() => setUserVisible(false)} data={currData} />
      <RoleAuth
        visible={authVisible}
        close={() => setAuthVisible(false)}
        roleId={currData && currData.roleId}
      />
    </Layout>
  );
};

export default Role;
