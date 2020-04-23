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
import Room from './Room';
import Atlas from './Atlas/Atlas';
import Split from './Split';
const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;

function HouseMore(props) {
  //const [pstructId, setPstructId] = useState<string>(''); //小区id 
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  //const [treeData, setTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [currData, setCurrData] = useState<any>(); 
  const [type, setType] = useState<number>(1);
  const [parentId, setParentId] = useState<string>('');//左侧树点击的节点id
  const [selectId, setSelectId] = useState<string>(''); //列表选中的节点id  
  const [organizeId, setOrganizeId] = useState<string>(''); //列表选中的节点组织id  
  const [roomVisible, setRoomVisible] = useState<boolean>(false); 
  const [selectOrganizeId, setSelectOrganizeId] = useState<string>(''); //点击树获取的机构id

  const doSelectTree = (parentId, type) => {
    //初始化页码，防止页码错乱导致数据查询出错 
    const page = new DefaultPagination();
    refresh(parentId, type, search, page);//, pstructId); 
    setParentId(parentId);
    setPagination(page);
    setType(type);
  };

  useEffect(() => {
    //首页传递过来小区id
    const pid = props.location.state ? props.location.state.pstructid : '';//房产id  
    const orgid = props.location.state ? props.location.state.organizeid : '';//房产所在组织id 
    setSelectId(pid);
    setOrganizeId(orgid);
    setParentId(pid);//设置首页列表点击的房产Id为父节点Id
    setSelectOrganizeId(orgid);
    //setPstructId(psid);
    // GetBuildings(psid).then((res: any[]) => {
    //   setTreeData(res || []);
    // }); 
    initLoadData(pid, type, '');//, psid);
  }, [organizeId]);

  const closeDrawer = () => {
    setModifyVisible(false);
  };

  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };

  //房态图弹出房间
  const showAtlasDrawer = (item?) => {
    setCurrData(item);
    setRoomVisible(true);
  };

  const closeAtlasDrawer = () => {
    setRoomVisible(false);
  };

  const loadData = (searchText, parentId, type, paginationConfig?: PaginationConfig, sorter?) => {
    //刷新值，必须
    setSearch(searchText);
    setParentId(parentId);
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
        ParentId: parentId, //selectId,
        keyword: searchText,
        //PStructId: pstructId,
        Type: type,
      },
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'name';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'name';
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

  const initLoadData = (parentId, type, searchText) => {
    setSearch(searchText);//必须赋值，否则查询条件不生效
    setParentId(parentId);
    const queryJson = {
      keyword: searchText,
      //PStructId: psid,
      ParentId: parentId,//== null ? psid : parentId,
      Type: type == null ? 1 : type,
    };
    const sidx = 'name';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //点击树刷新列表
  const refresh = (parentId, type, searchText, page) => {
    setSearch(searchText);
    const queryJson = {
      keyword: searchText,
      //PStructId: psid,
      ParentId: parentId,//== null ? psid : parentId,
      Type: type == null ? 1 : type,
    };
    const sidx = 'name';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = page;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //是否能新增
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  //拆分房间
  const [splitVisible, setSplitVisible] = useState<boolean>(false); 
  const closeSplit = () => { 
    setSplitVisible(false);
  } 
  const showSplit = (item) => {
    setCurrData(item);
    setSplitVisible(true);
  }
  return (
    <Layout style={{ height: '100%' }}>
      <HouseMoreLeftTree
        organizeId={organizeId}
        selectId={selectId}
        // treeData={treeData}
        selectTree={(parentId, type, organizeId) => {
          if ('ABCD'.indexOf(type) != -1) {
            setIsDisabled(true);
            return;
          }
          setSelectOrganizeId(organizeId);
          setIsDisabled(false);
          doSelectTree(parentId, type);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="房产列表" key="1">
            <div style={{ marginBottom: '10px' }}>
              <Search
                className="search-input"
                placeholder="搜索名称和编号"
                // value={search}
                onSearch={value => loadData(value, parentId, type)}
                style={{ width: 200 }}
              />
              <Button key='add' type="primary"
                disabled={isDisabled}
                style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => showDrawer()}>
                <Icon type="plus" />
                新增
              </Button>
              {/* <Button style={{ float: 'right' }} >
                <Icon type="arrow-left" />
                返回
              </Button> */}
              <Button style={{ float: 'right' }} key='return'>
                <Link to={{ pathname: 'house' }}>
                  <Icon type="arrow-left" />返回
               </Link>
              </Button>
            </div>

            <ListTableMore
              onchange={(paginationConfig, filters, sorter) =>
                loadData(search, parentId, type, paginationConfig, sorter)
              }
              loading={loading}
              pagination={pagination}
              data={data}
              type={type}
              selectId={selectId}
              modify={showDrawer}
              showSplit={showSplit}
              reload={(id, selecttype) => {
                setType(selecttype || type);
                setSelectId(id);
                initLoadData(id || parentId, selecttype || type, search)
              }}
            />
          </TabPane>
          {type === 2 ? (
            <TabPane tab="房态图" key="2">
              <Atlas parentId={parentId} showDrawer={showAtlasDrawer}></Atlas>
            </TabPane>
          ) : null}
        </Tabs>
      </Content>

      <PstructInfo
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        // organizeId={organizeId}
        organizeId={selectOrganizeId}
        parentId={parentId}
        data={currData}
        type={type}
        reload={() => {
          //刷新一下左侧树 to do
          initLoadData(parentId, type, search);
        }}
      />

      <Room
        modifyVisible={roomVisible}
        closeDrawer={closeAtlasDrawer}
        organizeId={selectOrganizeId} //{organizeId}
        parentId={parentId}
        data={currData}
        type={5}
        reload={() => {
          //刷新一下左侧树 to do
          initLoadData(parentId, type, search);
        }}
      />

      <Split
        splitVisible={splitVisible}
        closeSplit={closeSplit}
        data={currData}
        // id={splitId}
        reload={() => initLoadData(parentId, type, search)}
      />

    </Layout>
  );
}

//export default HouseMore;
export default Form.create<any>()(HouseMore);
