import { ParkingData, TreeEntity } from '@/model/models';
import { DefaultPagination } from '@/utils/defaultSetting';
import { Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import LeftTree from '../LeftTree';
import ListTable from './ListTable';
import ModifyGarage from './ModifyGarage';
import ModifyParking from './ModifyParking';
// import { TreeNode } from 'antd/lib/tree-select';
import { GetPublicAreas, GetQuickParkingTree } from './ParkingLot.service';
import { GetOrgs } from '@/services/commonItem';
const { Content } = Layout;
const { Search } = Input;

function ParkingLot() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TreeEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [orgid, setOrgid] = useState<string>('');
  const [orgtype, setOrgtype] = useState<string>('1');
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<ParkingData>();
  const [search, setSearch] = useState<string>('');
  //是否能新增
  const [isAdd, setIsAdd] = useState<boolean>(true);
  // const [orgs, setOrgs] = useState<TreeNode[]>();
  const [orgs, setOrgs] = useState<any[]>([]);

  const selectTree = (id, type, searchText) => {
    initLoadData(id, type, searchText);
    if (type == '1' || type == '8' ) {
      setIsAdd(false);
    } else {
      setIsAdd(true);
    } 
    setOrgid(id);
    setOrgtype(type); 
  };

  useEffect(() => {
    GetQuickParkingTree('').then(res => {
      // const root = res.filter(item => item.parentId === '0');
      // const rootOrg = root.length === 1 ? root[0] : undefined;
      // SetOrganize(rootOrg);
      setTreeData(res || []);

      //加载管理处
      GetOrgs().then(res => {
        setOrgs(res|| []);
      });

      initLoadData('', '', '');
    });
  }, []);

  // 获取属性数据
  // const getTreeData = () => {
  //   return GetQuickParkingTree('').then((res: any[]) => {
  //     setTreeData(res || []);
  //     return res || [];
      // const treeList = (res || []).map(item => {
      //   return {
      //     ...item,
      //     id: item.id,
      //     text: item.name,
      //     parentId: item.pId,
      //   };
      // });
      // setTreeData(treeList);
      // return treeList;
  //   });
  // };

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

  const initLoadData = (id, type, searchText) => {
    setSearch(searchText);
    const queryJson = {
      //OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: id,
      TreeType: type,
    };
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };
  // const disabledCreate = org => {
  //   return !(org.type === '1' || org.type === '8' || org.type === '');
  // };
  return (
    <Layout style={{ height: '100%' }}>
      <LeftTree
        treeData={treeData}
        selectTree={(id, type) => {
          selectTree(id, type, search);
        }}
      />
      <Content style={{ paddingLeft: '18px' }} >
        <div style={{ marginBottom: '10px' }}>
          <Search
            className="search-input"
            placeholder="请输入要查询的关键词"
            onSearch={value => loadData(value, orgid)}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            style={{ float: 'right' }}
            // disabled={disabledCreate(orgid)}
            disabled={isAdd}
            onClick={() => create(orgid)}
          >
            <Icon type="plus" />
            {orgtype == '8' ? '车位' : '车库'}
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
      {orgtype == '8' ? (
        <ModifyParking
          modifyVisible={modifyVisible}
          closeDrawer={closeDrawer}
          treeData={treeData}
          organizeId={orgid}
          data={currData}
          reload={() => initLoadData(orgid, orgtype, search)}
        />
      ) : null}
      {orgtype == '1' ? (
        <ModifyGarage
          modifyVisible={modifyVisible}
          closeDrawer={closeDrawer}
          treeData={orgs}
          organizeId={orgid}
          data={currData}
          reload={() => initLoadData(orgid, orgtype, search)}
        />
      ) : null}
    </Layout>
  );
}

export default ParkingLot;
