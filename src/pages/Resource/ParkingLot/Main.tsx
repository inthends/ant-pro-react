import { TreeEntity } from '@/model/models';
import { DefaultPagination } from '@/utils/defaultSetting';
import { Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import LeftTree from '../LeftTree';
import ListTable from './ListTable';
import ModifyGarage from './ModifyGarage';
import ModifyParking from './ModifyParking';
// import { TreeNode } from 'antd/lib/tree-select';
import { GetParkPageList, GetQuickParkingTree } from './ParkingLot.service';
import { GetOrgs } from '@/services/commonItem';
const { Content } = Layout;
const { Search } = Input;

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TreeEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [orgid, setOrgid] = useState<string>('');//左侧点击树id 
  const [organizeId, setOrganizeId] = useState<string>('');//所属机构id
  const [orgtype, setOrgtype] = useState<string>('1');
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  const [search, setSearch] = useState<string>('');
  //是否能新增
  const [isDisabledAdd, setDisabledAdd] = useState<boolean>(true);
  // const [orgs, setOrgs] = useState<TreeNode[]>();
  const [orgs, setOrgs] = useState<any[]>([]);

  const selectTree = (orgid, orgtype, organizeId) => {

    if (orgtype == '1' || orgtype == '8') {
      setDisabledAdd(false);
    } else {
      setDisabledAdd(true);
    } 
    // initLoadData(orgid, orgtype, searchText);
    setOrgid(orgid);
    setOrgtype(orgtype);
    setOrganizeId(organizeId); 
    //初始化页码，防止页码错乱导致数据查询出错  
    const page = new DefaultPagination();
    loadData(search, orgid, orgtype, page);

  };

  useEffect(() => {
    GetQuickParkingTree('').then(res => {
      // const root = res.filter(item => item.parentId === '0');
      // const rootOrg = root.length === 1 ? root[0] : undefined;
      // SetOrganize(rootOrg);
      setTreeData(res || []);
      //加载管理处
      GetOrgs().then(res => {
        setOrgs(res || []);
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
        // OrganizeId: org.organizeId,
        OrganizeId: orgid,
        Type: orgtype,
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
    return GetParkPageList(formData).then(res => {
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
      OrganizeId: id,
      Type: type,
    };
    const sidx = 'code';
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
        selectTree={(id, type, organizeId) => {
          selectTree(id, type, organizeId);
        }}
      />
      <Content style={{ paddingLeft: '18px' }} >
        <div style={{ marginBottom: '10px' }}>
          <Search
            className="search-input"
            placeholder="请输入要查询的关键词"
            onSearch={value => loadData(value, orgid, orgtype)}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            style={{ float: 'right' }}
            // disabled={disabledCreate(orgid)}
            disabled={isDisabledAdd}
            onClick={() => create(orgid)}>
            <Icon type="plus" />
            {orgtype == '8' ? '车位' : '车库'}
          </Button>
        </div>
        <ListTable
          onchange={(paginationConfig, filters, sorter) =>
            loadData(search, orgid, orgtype, paginationConfig, sorter)
          }
          loading={loading}
          pagination={pagination}
          data={data}
          modify={showDrawer}
          type={orgtype}
          reload={() => initLoadData(orgid, orgtype, search)}
        />
      </Content>
      {orgtype == '8' ? (
        <ModifyParking
          modifyVisible={modifyVisible}
          closeDrawer={closeDrawer}
          treeData={treeData}
          organizeId={organizeId}
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
export default Main;
