import { ParkingData, TreeEntity } from '@/model/models';
import { DefaultPagination } from '@/utils/defaultSetting';
import { Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import LeftTree from '../LeftTree';
import ListTable from './ListTable';
import ModifyGarage from './ModifyGarage';
import ModifyParking from './ModifyParking';
import { GetPublicAreas, GetQuickPublicAreaTree } from './ParkingLot.service';
const { Sider, Content } = Layout;
const { Search } = Input;

function ParkingLot() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TreeEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [organize, SetOrganize] = useState<any>({});
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<ParkingData>();
  const [search, setSearch] = useState<string>('');

  const selectTree = (org, item, search) => {
    initLoadData(item, search);
    SetOrganize(item);
  };

  useEffect(() => {
    getTreeData().then(res => {
      const root = res.filter(item => item.parentId === '0');
      const rootOrg = root.length === 1 ? root[0] : undefined;
      SetOrganize(rootOrg);
      initLoadData(rootOrg, '');
    });
  }, []);
  // 获取属性数据
  const getTreeData = () => {
    return GetQuickPublicAreaTree().then((res: any[]) => {
      let treeList = (res || []).map(item => {
        return {
          ...item,
          id: item.id,
          text: item.name,
          parentId: item.pId,
        };
      });
      setTreeData(treeList);
      return treeList;
    });
  };

  const closeDrawer = () => {
    setModifyVisible(false);
  };
  const create = organize => {
    if (organize.type === '1' || organize.type === '') {
      setCurrData({ baseInfo: { type: 8 } });
    }
    if (organize.type === '8') {
      setCurrData({ baseInfo: { type: 9 } });
    }
    setModifyVisible(true);
  };
  const showDrawer = (item?) => {
    setCurrData(item);
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
      queryJson: {
        keyword: search,
        OrganizeId: org.organizeId,
        TreeTypeId: org.id,
        TreeType: org.type,
      },
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
    return GetPublicAreas(data).then(res => {
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

  const initLoadData = (org, search) => {
    setSearch(search);
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: search,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };
  const disabledCreate = organize => {
    return !(organize.type === '1' || organize.type === '8' || organize.type === '');
  };
  return (
    <Layout style={{ height: '100%' }}>
      <LeftTree
        treeData={treeData}
        selectTree={(id, item) => {
          selectTree(id, item, search);
        }}
      />
      <Content style={{ padding: '0 20px' }}>
        <div style={{ marginBottom: '20px', padding: '3px 0' }}>
          <Search
            className="search-input"
            placeholder="搜索楼宇名称"
            onSearch={value => loadData(value, organize)}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            style={{ float: 'right' }}
            disabled={disabledCreate(organize)}
            onClick={() => create(organize)}
          >
            <Icon type="plus" />
            车位
          </Button>
        </div>
        <ListTable
          onchange={(paginationConfig, filters, sorter) =>
            loadData(search, organize, paginationConfig, sorter)
          }
          loading={loading}
          pagination={pagination}
          data={data}
          modify={showDrawer}
          reload={() => initLoadData(organize, search)}
        />
      </Content>
      {currData && currData.baseInfo && currData.baseInfo.type === 9 ? (
        <ModifyParking
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        treeData={treeData}
        organizeId={organize.organizeId}
        data={currData}
        reload={() => initLoadData(organize, search)}
      /> ) : null}
      {currData && currData.baseInfo && currData.baseInfo.type === 8 ? (
        <ModifyGarage
          modifyVisible={modifyVisible}
          closeDrawer={closeDrawer}
          treeData={treeData}
          organizeId={organize.id}
          data={currData}
          reload={() => initLoadData(organize, search)}
        />
      ) : null}
    </Layout>
  );
}

export default ParkingLot;
