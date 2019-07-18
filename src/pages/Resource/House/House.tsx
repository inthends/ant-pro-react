import { TreeEntity } from '@/model/models';
import { DefaultPagination } from '@/utils/defaultSetting';
import { getResult } from '@/utils/networkUtils';
import { Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import General from './General';
import { GetStatistics, GetStatisticsTotal, GetTreeJsonById } from './House.service';
import LeftTree from '../LeftTree';
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
  const [organizeId, SetOrganizeId] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [id, setId] = useState<string>();
  const [search, setSearch] = useState<string>('');

  const disabledCreate = (treeData: TreeEntity[], organizeId: string) => {
    for (let item of treeData) {
      if (item.id === organizeId && item.parentId !== '0') {
        return false;
      }
    }
    return true;
  };

  const selectTree = (org, search) => {
    initLoadData(org, search);
    SetOrganizeId(org);
  };

  useEffect(() => {
    getTreeData().then(res => {
      const root = res.filter(item => item.parentId === '0');
      const rootOrg = root.length === 1 ? root[0].id : '';
      SetOrganizeId(rootOrg as string);
      initLoadData(rootOrg as string, '');
    });
    getHouseTotal();
  }, []);
  // 获取属性数据
  const getTreeData = () => {
    return GetTreeJsonById()
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
  const showDrawer = (id?) => {
    setId(id);
    setModifyVisible(true);
  };
  const loadData = (search, org, paginationConfig?: PaginationConfig, sorter?) => {
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
      queryJson: { OrganizeId: org, keyword: search },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'asc';
    return GetStatistics(data).then(res => {
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
  const initLoadData = (orgId: string, search) => {
    setSearch(search);
    const queryJson = { OrganizeId: orgId, keyword: search };
    const sidx = 'id';
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
          selectTree={(id, item) => {
            selectTree(id, search);
          }}
        />
      <Content style={{ padding: '0 20px' }}>
        <div style={{ marginBottom: '20px', padding: '3px 0' }}>
          <Search
            className="search-input"
            placeholder="搜索楼宇名称"
            value={search}
            onSearch={value => loadData(value, organizeId)}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            disabled={disabledCreate(treeData, organizeId)}
            style={{ float: 'right' }}
            onClick={() => showDrawer()}
          >
            <Icon type="plus" />
            楼宇
          </Button>
        </div>
        <General totalData={totalData} />
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
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        treeData={treeData}
        organizeId={organizeId}
        id={id}
        reload={() => initLoadData(organizeId, search)}
      />
    </Layout>
  );
}

export default House;
