import { TreeEntity } from '@/model/models';
import { DefaultPagination } from '@/utils/defaultSetting';
import { getResult } from '@/utils/networkUtils';
import { Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import General from './General';
import { GetStatistics, GetStatisticsTotal, GetTreeJsonById } from './House.service';
import LeftTree from './LeftTree';
import ListTable from './ListTable';
import Modify from './Modify';

const { Sider, Content } = Layout;
const { Search } = Input;

function House() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TreeEntity[]>([]);
  const [totalData, setTotalData] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [OrganizeId, SetOrganizeId] = useState<string>('');
  const [data, setData] = useState([]);

  const selectTree = org => {
    initLoadData(org);
    SetOrganizeId(org);
  };

  useEffect(() => {
    getTreeData().then(res => {
      const root = res.filter(item => item.parentId === '0');
      const rootOrg = root.length === 1 ? root[0].id : '';
      SetOrganizeId(rootOrg as string);
      initLoadData();
    });
    getHouseTotal();
  }, []);
  // 获取属性数据
  const getTreeData = () => {
    return GetTreeJsonById()
      .then(getResult)
      .then((res: TreeEntity[]) => {
        setTreeData(res || []);
        return res || [];
      });
  };
  // 获取房产统计
  const getHouseTotal = () => {
    GetStatisticsTotal()
      .then(getResult)
      .then(res => {
        setTotalData(res || []);
      });
  };
  const closeDrawer = () => {
    setModifyVisible(false);
  };
  const showDrawer = () => {
    setModifyVisible(true);
  };
  const loadData = (pagination: PaginationConfig, filters, sorter) => {
    let org = getOrg();
    const { current: page, pageSize: rows, total } = pagination;
    let { field: sidx, order: sord } = sorter;
    sord = sord === 'ascend' ? 'asc' : 'desc';
    sidx = sidx ? sidx : 'id';
    const queryJson = { OrganizeId: org };

    setLoading(true);
    return load({ page, rows, sidx, sord, total, queryJson, records: 0 }).then(res => {
      return res;
    });
  };
  const load = data => {
    return GetStatistics(data).then(res => {
      const { page: current, total } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
        };
      });
      setData(res.rows);
      setLoading(false);
      return res;
    });
  };
  const initLoadData = (orgId?: string) => {
    let org = orgId || getOrg();
    const queryJson = { OrganizeId: org };
    const sidx = 'id';
    const sord = 'asc';
    const { current: page, pageSize: rows, total } = pagination;
    return load({ page, rows, sidx, sord, total, queryJson, records: 0 }).then(res => {
      return res;
    });
  };
  const getOrg = () => {
    let org = '';
    SetOrganizeId(item => {
      org = item;
      return item;
    });
    return org;
  };
  return (
    <Layout style={{ height: '100%' }}>
      <Sider theme="light" style={{ overflow: 'hidden', height: '100%' }} width="245px">
        <LeftTree treeData={treeData} selectTree={selectTree}/>
      </Sider>
      <Content style={{ padding: '0 20px' }}>
        <div style={{ marginBottom: '20px', padding: '3px 0' }}>
          <Search
            className="search-input"
            placeholder="搜索楼宇名称"
            onSearch={value => console.log(value)}
            style={{ width: 200 }}
          />
          <Button type="primary" style={{ float: 'right' }} onClick={showDrawer}>
            <Icon type="plus" />
            楼宇
          </Button>
        </div>
        <General totalData={totalData} />
        <ListTable onchange={loadData} loading={loading} pagination={pagination} data={data} />
      </Content>
      <Modify modifyVisible={modifyVisible} closeDrawer={closeDrawer} />
    </Layout>
  );
}

export default House;
