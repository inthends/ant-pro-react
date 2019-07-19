import { TreeEntity } from '@/model/models';
import { DefaultPagination } from '@/utils/defaultSetting';
import { Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import LeftTree from '../LeftTree';
import ListTable from './ListTable';
import Modify from './Modify';
import { GetPublicAreas, GetQuickPublicAreaTree } from './PublicArea.service';

const { Sider, Content } = Layout;
const { Search } = Input;

function PublicArea() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TreeEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [organize, SetOrganize] = useState<any>({});
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
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
      initLoadData(rootOrg, '');
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
      searchCondition.sidx = field ? field : 'pCode';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'pCode';
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
    const sidx = 'pCode';
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
          <Button type="primary" style={{ float: 'right' }} onClick={() => showDrawer()}>
            <Icon type="plus" />
            公区
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

      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        treeData={treeData}
        organizeId={organize.id}
        data={currData}
        reload={() => initLoadData(organize, search)}
      />
    </Layout>
  );
}

export default PublicArea;
