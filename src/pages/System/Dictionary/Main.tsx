import { DefaultPagination } from "@/utils/defaultSetting";
import { Button, Icon, Input, Layout } from "antd";
import { PaginationConfig } from "antd/lib/table";
import React, { useContext, useEffect, useState } from "react";
import ListTable from "./ListTable";
import Modify from "./Modify";
import { GetDataItemTreeList, GetDataList } from "./Dictionary.service";
import { SiderContext } from '../../SiderContext';
import LeftTree from '../LeftTree';
const { Sider } = Layout;
const { Content } = Layout;
const { Search } = Input;

const Main = () => {
  const [itemId, setItemId] = useState<string>('');
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const { hideSider, setHideSider } = useContext(SiderContext);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [search, setSearch] = useState<any>('');
  const [addButtonDisable, setAddButtonDisable] = useState<boolean>(true);

  useEffect(() => {
    GetDataItemTreeList().then((res) => {
      setTreeData(res || []);
    });
    initLoadData(itemId, search);
  }, []);

  const closeDrawer = () => {
    setModifyVisible(false);
  };

  const showDrawer = (data?) => {
    setCurrData(data);
    setModifyVisible(true);
  };

  const showChoose = (item?) => {
    setCurrData(item);
  };

  const loadData = (keyword: any, itemId: any, paginationConfig?: PaginationConfig, sorter?
  ) => {
    setSearch(keyword);//查询的时候，必须赋值，否则查询条件会不起作用 
    setItemId(itemId);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0
    };
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      itemId: itemId,
      keyword: keyword
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

  const initLoadData = (itemId, search) => {
    setItemId(itemId);
    //const queryJson = searchParam;
    const sidx = "CreateDate";
    const sord = "desc";
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, itemId, search }).then(
      res => {
        return res;
      }
    );
  };

  const selectTree = (item) => {
    var value = item.node.props.value;
    initLoadData(value, search);
    setItemId(value);
    setAddButtonDisable(false);
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
            placeholder="请输入要查询的关键词"
            style={{ width: 200 }}
            onSearch={keyword => loadData(keyword, itemId)}
          />
          <Button
            type="primary"
            style={{ float: "right" }}
            onClick={() => showDrawer()}
            disabled={addButtonDisable}
          >
            <Icon type="plus" />
            词典
          </Button>
        </div>
        <ListTable
          onchange={(paginationConfig, filters, sorter) =>
            loadData(itemId, paginationConfig, sorter)
          }
          loading={loading}
          pagination={pagination}
          data={data}
          modify={showDrawer}
          choose={showChoose}
          reload={() => initLoadData(itemId, search)}
          setData={setData}
        />
      </Content>
      <Modify
        visible={modifyVisible}
        closeDrawer={closeDrawer}
        itemId={itemId}
        data={currData}
        reload={() => initLoadData(itemId, search)}
      />

    </Layout>
  );
};

export default Main;
