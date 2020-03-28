import { DefaultPagination } from "@/utils/defaultSetting";
import { Button, Icon, Input, Layout } from "antd";
import { PaginationConfig } from "antd/lib/table";
import React, { useContext, useEffect, useState } from "react";
import ListTable from "./ListTable";
import Modify from "./Modify";
import { GetTreeRoleJson, GetDataItemTreeList, GetDataList } from "./Flow.service";
import { SiderContext } from '../../SiderContext';
import LeftTree from '../LeftTree';
const { Sider } = Layout;
const { Content } = Layout;
const { Search } = Input;

interface SearchParam {
  typeId: string;
  typeName: string;
  type: string;
  keyword: string;
}

const Flow = () => {
  // const [itemId, setItemId] = useState<string>(); 
  const [search, setSearch] = useState<SearchParam>({
    typeId: '',
    typeName: '',
    type: '',
    keyword: '',
  });

  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const { hideSider, setHideSider } = useContext(SiderContext);
  const [treeData, setTreeData] = useState<any[]>([]);
  //是否能新增
  const [isDisabled, setDisabled] = useState<boolean>(true);
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    GetDataItemTreeList().then((res) => {
      setTreeData(res || []);
    });

    GetTreeRoleJson().then(res => {
      setRoles(res || []);
    });

    initLoadData(search);
  }, []);

  const closeDrawer = () => {
    setModifyVisible(false);
  };
  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };
  const showChoose = (item?) => {
    setCurrData(item);
  };
  const loadData = (
    searchParam: any,
    paginationConfig?: PaginationConfig,
    sorter?
  ) => {
    setSearch(searchParam);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0
    };
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: searchParam
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === "ascend" ? "asc" : "desc";
      searchCondition.sidx = field ? field : "CreateDate";
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || "CreateDate";
    formData.sord = formData.sord || "desc";
    return GetDataList(formData).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize
        };
      });
      setData(res.data);
      setLoading(false);
      return res;
    });
  };

  const initLoadData = (searchParam: SearchParam) => {
    setSearch(searchParam);
    const queryJson = searchParam;
    const sidx = "CreateDate";
    const sord = "desc";
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(
      res => {
        return res;
      }
    );
  };

  const selectTree = (item) => {
    var type = item.node.props.type;
    if (type == '1') {
      setDisabled(true);
      type = '';
    }
    else {
      setDisabled(false);
    }

    var typeId = item.node.props.value;
    var typeName = item.node.props.title;
    // initLoadData({ ...search, typeId, typeName, type });
    //初始化页码，防止页码错乱导致数据查询出错  
    const page = new DefaultPagination();
    loadData({ ...search, typeId, typeName, type }, page);

  };

  return (
    <Layout style={{ height: "100%" }}>
      <Sider
        theme="light"
        style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh + 10px)' }}
        width={hideSider ? 20 : 245}
      >
        {hideSider ? (
          <div style={{ position: 'absolute', top: '40%', left: 5 }}>
            <Icon
              type="double-right"
              onClick={() => {
                setHideSider(false);
              }}
              style={{ color: '#1890ff' }}
            />
          </div>
        ) : (
            <>
              {treeData != null && treeData.length > 0 ?
                (<LeftTree
                  key='lefttree'
                  treeData={treeData}
                  selectTree={(id, item) => {
                    selectTree(item);
                  }}
                />) : null}
              <div
                style={{ position: 'absolute', top: '40%', right: -15 }}
                onClick={() => {
                  setHideSider(true);
                }}
              >
                <Icon type="double-left" style={{ color: '#1890ff', cursor: 'pointer' }} />
              </div>
            </>
          )}
      </Sider>

      <Content style={{ paddingLeft: '18px' }}>
        <div style={{ marginBottom: 20, padding: "3px 0" }}>
          <Search
            key='search'
            className="search-input"
            placeholder="搜索流程名称"
            style={{ width: 200 }}
            onSearch={keyword => loadData({ ...search, keyword })}
          />

          <Button
            type="primary"
            style={{ float: "right" }}
            onClick={() => showDrawer()}
            disabled={isDisabled}
          >
            <Icon type="plus" />
            流程
          </Button>
        </div>
        <ListTable
          onchange={(paginationConfig, filters, sorter) =>
            loadData(search, paginationConfig, sorter)
          }
          loading={loading}
          pagination={pagination}
          data={data}
          modify={showDrawer}
          choose={showChoose}
          reload={() => initLoadData(search)}
        />
      </Content>
      <Modify
        visible={modifyVisible}
        closeDrawer={closeDrawer}
        typeId={search.typeId}
        typeName={search.typeName}
        data={currData}
        reload={() => initLoadData(search)}
        roles={roles}
      />

    </Layout>
  );
};

export default Flow;
