//房产资料 
import { DefaultPagination } from '@/utils/defaultSetting';
import { Form, Tabs, Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetPageListJson, GetBuildings } from './House.service';
import LeftTree from '../LeftTree';
import ListTableMore from './ListTableMore';
import Modify from './Modify';

const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;

// interface HouseMoreProps {
// }


function HouseMore(props) {
  const [pstructId, setPstructId] = useState<string>('');//小区id
  const [organize, setOrganize] = useState<any>({});
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');

  const selectTree = (orgid, item, searchText) => {
    initLoadData(item, searchText); 
    setOrganize(item);
  };

  useEffect(() => {
    //页面传递过来的值  
    const _pstructid = props.location.state ? props.location.state.pstructid : '';
    setPstructId(_pstructid);
    GetBuildings(_pstructid).then((res: any[]) => {
      setTreeData(res || []);
    });
    initLoadData('', '');
  }, []);


  const closeDrawer = () => {
    setModifyVisible(false);
  };
  const showDrawer = (orgId?) => {
    //setId(orgId);
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
        ParentId: org.id,
        keyword: searchText,
        PStructId: pstructId,
        Type: org.type
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

  const initLoadData = (org, searchText) => {
    setSearch(searchText);
    const queryJson = { 
      keyword: search,
      PStructId: pstructId,
      ParentId: org.id,
      Type: org.type
    };
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
          selectTree(id, item, search);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="房产列表" key="1">
            <div style={{ marginBottom: '10px' }}>
              <Search
                className="search-input"
                placeholder="搜索项目名称"
                value={search}
                onSearch={value => loadData(value, organize)}
                style={{ width: 200 }}
              />


              <Button
                type="primary"
                style={{ float: 'right' }}
                onClick={() => showDrawer()}
              >
                <Icon type="plus" />
                新增
          </Button>
            </div>

            <ListTableMore
              onchange={(paginationConfig, filters, sorter) =>
                loadData(search, organize, paginationConfig, sorter)
              }
              loading={loading}
              pagination={pagination}
              data={data}
              modify={showDrawer}
              reload={() => initLoadData(organize, search)}
            />

          </TabPane>
          <TabPane tab="房态图" key="2">

          </TabPane>
        </Tabs>
      </Content>

      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        treeData={treeData}
        organizeId={''}
        id={''}
        reload={() => initLoadData(organize, search)}
      />
    </Layout>
  );
}

//export default HouseMore;
export default Form.create<any>()(HouseMore);
