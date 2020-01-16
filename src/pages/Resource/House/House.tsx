//项目资料 
import { DefaultPagination } from '@/utils/defaultSetting';
import { getResult } from '@/utils/networkUtils';
import { Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import General from './General';
import { GetStatistics, GetStatisticsTotal } from './House.service';
import LeftTree from '../LeftTree';
import ListTable from './ListTable';
import Modify from './Modify';
import AuthButton from '@/components/AuthButton/AuthButton';
import { GetOrgs } from '@/services/commonItem';

const { Content } = Layout;
const { Search } = Input;

function House() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [totalData, setTotalData] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [organizeId, setOrganizeId] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [id, setId] = useState<string>();
  const [search, setSearch] = useState<string>('');
  //是否能新增
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  // const disabledCreate = (tree: any[], orgId: string) => {
  //   for (const item of tree) {
  //     if (item.id === orgId && item.parentId !== '0') {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  const setButton = (orgid, orgtype, searchText) => {
 
    setOrganizeId(orgid);
    if (orgtype == 'D') {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }

    initLoadData(orgid, searchText);
    initHouseTotal(orgid, searchText); 
  };

  useEffect(() => {
    GetOrgs().then(res => {
      // const root = res.filter(item => item.parentId === '0');
      // const key = root.length === 1 ? root[0].key : '';
      //SetOrganizeId(key);
      //initLoadData(rootOrg as string, '');
      setTreeData(res || []);
      initLoadData('', '');
      initHouseTotal('', '');
    });

  }, []);

  // 获取属性数据
  // const getTreeData = () => {
  //   return GetOrgTreeOnly().then((res: any[]) => {
  //     setTreeData(res || []);
  //     return res || [];
  //   });
  // };

  // 获取房产统计
  const initHouseTotal = (orgId: string, searchText) => { 
    setSearch(searchText);
    const queryJson = { OrganizeId: orgId, keyword: searchText }; 
    GetStatisticsTotal({ queryJson: queryJson })
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
  const loadData = (searchText, orgid, paginationConfig?: PaginationConfig, sorter?) => {
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
      queryJson: { OrganizeId: orgid, keyword: searchText },
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
        selectTree={(orgid, orgtype) => {
          setButton(orgid, orgtype, search);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <div style={{ marginBottom: '10px' }}>
          <Search
            className="search-input"
            placeholder="搜索项目名称"
            onSearch={value => { 
              //刷新统计
              GetStatisticsTotal(
                {
                  queryJson:
                  {
                    OrganizeId: organizeId,
                    keyword: value
                  }
                }
              ).then(getResult).then(res => {
                setTotalData(res || []);
              });

              //查询列表
              loadData(value, organizeId)
            }}
            style={{ width: 200 }}
          />
          <AuthButton
            disabled={isDisabled}
            style={{ float: 'right' }}
            onClick={() => showDrawer()}
            encode="lr-add"
            btype="primary">
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
