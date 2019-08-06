//项目资料 
import { DefaultPagination } from '@/utils/defaultSetting';
import { getResult } from '@/utils/networkUtils';
import { Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import General from './General';
import { GetStatistics, GetStatisticsTotal, GetOrgTree } from './House.service';
import LeftTree from '../LeftTree';
import ListTable from './ListTable';
import Modify from './Modify';
import AuthButton from '@/components/AuthButton/AuthButton';

const { Content } = Layout;
const { Search } = Input;

function House() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [totalData, setTotalData] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [organizeId, SetOrganizeId] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [id, setId] = useState<string>();
  const [search, setSearch] = useState<string>('');

  // const disabledCreate = (tree: any[], orgId: string) => {
  //   for (const item of tree) {
  //     if (item.id === orgId && item.parentId !== '0') {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  const selectTree = (org, searchText) => {
    initLoadData(org, searchText);
    SetOrganizeId(org);
  };

  useEffect(() => {
    getTreeData().then(res => {
      const root = res.filter(item => item.parentId === '0');
      const rootOrg = root.length === 1 ? root[0].id : '';
      SetOrganizeId(rootOrg as string);
      //initLoadData(rootOrg as string, '');
      initLoadData('', '');
    });
    getHouseTotal();
  }, []);
  // 获取属性数据
  const getTreeData = () => {
    return GetOrgTree().then((res: any[]) => {
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
  const showDrawer = (orgId?) => {
    setId(orgId);
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
      queryJson: { OrganizeId: org, keyword: searchText },
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
    return GetStatistics(formData).then(res => {
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
  const initLoadData = (orgId: string, searchText) => {
    setSearch(searchText);
    const queryJson = { OrganizeId: orgId, keyword: searchText };
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
        selectTree={(orgId, item) => {
          selectTree(orgId, search);
        }}  
      />
      <Content style={{paddingLeft:'18px'}}>
        <div style={{ marginBottom: '10px'  }}>
          <Search
            className="search-input"
            placeholder="搜索项目名称"
            value={search}
            onSearch={value => loadData(value, organizeId)}
            style={{ width: 200 }}
          />
          <AuthButton
            type="primary"
            // disabled={disabledCreate(treeData, organizeId)}
            style={{ float: 'right' }}
            onClick={() => showDrawer()}
          >
            <Icon type="plus" />
            项目
          </AuthButton>
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
