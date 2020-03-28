
import { DefaultPagination } from '@/utils/defaultSetting';
import { Select, Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import LeftTree from '../LeftTree';
import ListTable from './ListTable';
import Modify from './Modify';
import { GetPageListJson } from './Main.service';
import { GetOrgEsates } from '@/services/commonItem';

const { Content } = Layout;
const { Search } = Input;

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [organizeId, setOrganizeId] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  const [search, setSearch] = useState<string>('');//查询关键字
  const [type, setType] = useState<string>('');//类型
  const [treeData, setTreeData] = useState<any[]>([]);

  // const selectTree = (org, item, searchText) => {
  //   initLoadData(item, searchText);
  //   SetOrganize(item);
  // };

  useEffect(() => {
    GetOrgEsates().then(res => {
      // const root = res.filter(item => item.parentId === '0');
      // const rootOrg = root.length === 1 ? root[0] : undefined;
      // SetOrganize(rootOrg);
      // initLoadData('', '');
      setTreeData(res || []);
      initLoadData('', '');
    });

    //获取房产树
    // GetQuickSimpleTreeAll()
    //   .then(getResult)
    //   .then((res: any[]) => {
    //     setTreeData(res || []);
    //     return res || [];
    //   }); 
  }, []);
  // 获取属性数据
  // const getTreeData = () => {
  //   return GetQuickPStructsTree().then((res: any[]) => {
  //     //const treeList = (res || []).map(item => {
  //     //   return {
  //     //     ...item,
  //     //     id: item.id,
  //     //     text: item.name,
  //     //     parentId: item.pId,
  //     //   };
  //     // });
  //     setTreeData(res || []);
  //     return res || [];
  //   });
  // };

  const closeDrawer = () => {
    setModifyVisible(false);
  };

  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };

  //分页刷新
  const loadData = (type, searchText, organizeId, paginationConfig?: PaginationConfig, sorter?) => {
    setSearch(searchText);
    setType(type);

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
        OrganizeId: organizeId,
        Type: type,
      },
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'createDate';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'createDate';
    formData.sord = formData.sord || 'desc';
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

  const initLoadData = (organizeId, searchText) => {
    setSearch(searchText);
    const queryJson = {
      OrganizeId: organizeId,
      keyword: searchText,
    };
    const sidx = 'createDate';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const selectTreeLoad = (orgId, orgType) => {
    setOrganizeId(orgId);
    // initLoadData(orgid, searchText); 
    const page = new DefaultPagination();
    loadData(type, search, orgId, page);

  };

  return (
    <Layout style={{ height: '100%' }}>
      <LeftTree
        treeData={treeData}
        selectTree={(orgid, orgtype) => { 
          selectTreeLoad(orgid, orgtype);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <div style={{ marginBottom: '10px' }}>
          <Select
            allowClear={true}
            style={{ width: '160px', marginRight: '5px' }}
            placeholder="请选择类型"
            onChange={(value) => {
              loadData(value, search, organizeId);
            }}
          >
            <Select.Option key='通知' value='通知'>通知</Select.Option>
            <Select.Option key='公告' value='公告'>公告</Select.Option>
            <Select.Option key='资讯' value='资讯'>资讯</Select.Option>
            <Select.Option key='广告' value='广告'>广告</Select.Option>
            <Select.Option key='活动' value='活动'>活动</Select.Option>
            <Select.Option key='关于我们' value='关于我们'>关于我们</Select.Option>
          </Select>

          <Search
            className="search-input"
            placeholder="搜索标题"
            onSearch={value => loadData(type, value, organizeId)}
            style={{ width: 200 }}
          />
          <Button type="primary" style={{ float: 'right' }} onClick={() => showDrawer()}>
            <Icon type="plus" />
            添加
          </Button>
        </div>
        <ListTable
          onchange={(paginationConfig, filters, sorter) =>
            loadData(type, search, organizeId, paginationConfig, sorter)
          }
          loading={loading}
          pagination={pagination}
          data={data}
          modify={showDrawer}
          reload={() => initLoadData(organizeId, search)}
        />
      </Content>

      <Modify
        visible={modifyVisible}
        closeDrawer={closeDrawer}
        // treeData={treeData}
        data={currData}
        reload={() => initLoadData(organizeId, search)}
      />
    </Layout>
  );
}
export default Main;
