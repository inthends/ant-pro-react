//房产资料
import { DefaultPagination } from '@/utils/defaultSetting';
import { Form, Tabs, Button, Icon, Input, Layout } from 'antd';
import Link from 'umi/link';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetPageListJson } from './House.service';
import HouseMoreLeftTree from '../HouseMoreLeftTree';
import ListTableMore from './ListTableMore';
import PstructInfo from './PstructInfo';
import Atlas from './Atlas/Atlas';
const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;

function HouseMore(props) {
  const [pstructId, setPstructId] = useState<string>(''); //小区id
  const [type, setType] = useState<number>(1);
  const [parentId, setParentId] = useState<string>('');
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  //const [treeData, setTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');

  const [currData, setCurrData] = useState<any>();

  const selectTree = (parentId, type, searchText) => {
    initLoadData(parentId, type, searchText, pstructId);
    setType(type);
    setParentId(parentId);
  };

  useEffect(() => {
    //页面传递过来的值
    const psid = props.location.state ? props.location.state.pstructid : '';
    setPstructId(psid);
    // GetBuildings(psid).then((res: any[]) => {
    //   setTreeData(res || []);
    // });
    initLoadData(parentId, type, '', psid);
  }, []);

  const closeDrawer = () => {
    setModifyVisible(false);
  };
  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };
  const loadData = (searchText, parentId, type, paginationConfig?: PaginationConfig, sorter?) => {
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
        ParentId: parentId,
        keyword: searchText,
        PStructId: pstructId,
        Type: type,
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

  const initLoadData = (parentId, type, searchText, psid) => {
    setSearch(searchText);
    const queryJson = {
      keyword: search,
      PStructId: psid,
      ParentId: parentId == null ? psid : parentId,
      Type: type == null ? 1 : type,
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
      <HouseMoreLeftTree
        parentid={pstructId}
        // treeData={treeData}
        selectTree={(parentId, type) => {
          selectTree(parentId, type, search);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="房产列表" key="1">
            <div style={{ marginBottom: '10px' }}>
              <Search
                className="search-input"
                placeholder="搜索关键字"
                value={search}
                onSearch={value => loadData(value, parentId, type)}
                style={{ width: 200 }}
              />
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }} onClick={() => showDrawer()}>
                <Icon type="plus" />
                新增
              </Button>
              {/* <Button style={{ float: 'right' }} >
                <Icon type="arrow-left" />
                返回
              </Button> */}
              <Button style={{ float: 'right' }}>
                <Link to={{ pathname: 'house' }}>
                  <Icon type="arrow-left" />
                  返回</Link>
              </Button>
            </div>

            <ListTableMore
              onchange={(paginationConfig, filters, sorter) =>
                loadData(search, parentId, type, paginationConfig, sorter)
              }
              loading={loading}
              pagination={pagination}
              data={data}
              modify={showDrawer}
              reload={() => initLoadData(parentId, type, search, pstructId)}
            />
          </TabPane>
          {type === 2 ? (
            <TabPane tab="房态图" key="2">
              <Atlas parentId={parentId} showDrawer={showDrawer}></Atlas>
            </TabPane>
          ) : null}
        </Tabs>
      </Content>

      <PstructInfo
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        organizeId={''}
        data={currData}
        type={type}
        reload={() => initLoadData(parentId, type, search, pstructId)}
      />
    </Layout>
  );
}

//export default HouseMore;
export default Form.create<any>()(HouseMore);
