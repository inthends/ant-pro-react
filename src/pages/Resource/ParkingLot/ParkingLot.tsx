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
const { Content } = Layout;
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

  const selectTree = (org, item, searchText) => {
    initLoadData(item, searchText);
    SetOrganize(item);
  };

  useEffect(() => {
    getTreeData().then(res => {
      const root = res.filter(item => item.parentId === '0');
      const rootOrg = root.length === 1 ? root[0] : undefined;
      SetOrganize(rootOrg);
      initLoadData('', '');
    });
  }, []);
  // 获取属性数据
  const getTreeData = () => {
    return GetQuickPublicAreaTree().then((res: any[]) => {
      const treeList = (res || []).map(item => {
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
  const create = org => {
    if (org.type === '1' || org.type === '') {
      setCurrData({ baseInfo: { type: 8 } });
    }
    if (org.type === '8') {
      setCurrData({ baseInfo: { type: 9 } });
    }
    setModifyVisible(true);
  };
  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
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
        OrganizeId: org.organizeId,
        TreeTypeId: org.id,
        TreeType: org.type,
      },
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
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
    return GetPublicAreas(formData).then(res => {
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
      OrganizeId: org.organizeId,
      keyword: searchText,
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
  const disabledCreate = org => {
    return !(org.type === '1' || org.type === '8' || org.type === '');
  };
  return (
    <Layout style={{ height: '100%' }}>
      <LeftTree
        treeData={treeData}
        selectTree={(id, item) => {
          selectTree(id, item, search);
        }}
      />
      <Content  style={{paddingLeft:'18px'}} >
        <div style={{ marginBottom: '10px'  }}>
          <Search
            className="search-input"
            placeholder="请输入要查询的关键词"
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
        />
      ) : null}
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
