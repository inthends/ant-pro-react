import { DefaultPagination } from '@/utils/defaultSetting';
import { Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import ListTable from './ListTable';
import { GetPageListJson } from './Main.service';
import Modify from './Modify';
const { Content } = Layout;
const { Search } = Input;

function Main() {

  const [search, setSearch] = useState<string>('');
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();

  useEffect(() => {
    initLoadData({ searchText: '' });
  }, []);

  const closeDrawer = () => {
    setModifyVisible(false);
  };
  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };
  const loadData = (
    { searchText },
    paginationConfig?: PaginationConfig,
    sorter?,
  ) => {
    setSearch(searchText);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };

    const queryJson = { keyword: searchText };
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson,
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'RoleId';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'RoleId';
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

  const initLoadData = ({ searchText }) => {
    const queryJson = { keyword: searchText };
    const sidx = 'RoleId';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Content style={{ padding: '0 20px', overflow: 'auto' }}>
        <div style={{ marginBottom: '20px', padding: '3px 0' }}>
          <Search
            className="search-input"
            placeholder="请输入要查询的关键词"
            onSearch={value =>
              loadData({ searchText: value })
            }
            style={{ width: 200 }}
          />
          <Button type="primary" style={{ float: 'right' }} onClick={() => showDrawer({ flag: '' })}>
            <Icon type="plus" />
            角色
          </Button>
        </div>
        <ListTable
          onchange={(paginationConfig, filters, sorter) =>
            loadData(
              { searchText: search },
              paginationConfig,
              sorter,
            )
          }
          loading={loading}
          pagination={pagination}
          data={data}
          modify={showDrawer}
          reload={() =>
            initLoadData({ searchText: search })
          }
        />
      </Content>
      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        data={currData}
        reload={() =>
          initLoadData({ searchText: search })
        }
      />
    </Layout>
  );
}

export default Main;