import { DefaultPagination } from "@/utils/defaultSetting";
import { message, Modal, Button, Icon, Input, Layout, notification } from "antd";
import { PaginationConfig } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import ListTable from "./ListTable";
import Add from "./Add";
import Modify from "./Modify";
import { CreateMenu, GetPageListJson } from "./WechatMenu.service";
// import create from "antd/lib/icon/IconFont";
const { Content } = Layout;
const { Search } = Input;
interface SearchParam {
  keyword: string;
};

const Main = () => {
  const [search, setSearch] = useState<SearchParam>({
    keyword: ""
  });

  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  const [pagination, setPagination] = useState<PaginationConfig>(
    new DefaultPagination()
  );

  useEffect(() => {
    initLoadData(search);
  }, []);

  const closeDrawer = () => {
    setModifyVisible(false);
  };

  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };

  // const showChoose = (item?) => {
  //   // setUserVisible(true);
  //   setCurrData(item);
  // };

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
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : "sortCode";
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || "sortCode";
    formData.sord = formData.sord || "asc";
    return GetPageListJson(formData).then(res => {
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
    const sidx = "sortCode";
    const sord = "asc";
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(
      res => {
        return res;
      }
    );
  };

  const Create = () => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要创建微信菜单？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        CreateMenu().then(() => {
          message.success('创建成功');
        }).catch((err) => {
           message.warn(err); 
          // notification['warning']({
          //   message: '系统提示',
          //   description: err
          // });

        });
      },
    });
  }

  return (
    <Layout style={{ height: "100%" }}>
      <Content  >
        <div style={{ marginBottom: 20, padding: "3px 0" }}>
          <Search
            className="search-input"
            placeholder="搜索菜单名称"
            onSearch={keyword => loadData({ ...search, keyword })}
            style={{ width: 200 }}
          />

          <Button
            type="primary"
            style={{ float: "right", marginLeft: '10px' }}
            onClick={Create}
          >
            创建到微信
          </Button>

          <Button
            type="primary"
            style={{ float: "right", marginLeft: '10px' }}
            onClick={() => {
              setCurrData(undefined);
              setAddVisible(true);
            }}
          >
            <Icon type="plus" />
            菜单
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
          // choose={showChoose}
          reload={() => initLoadData(search)}
          setData={setData}
        />
      </Content>

      <Add
        visible={addVisible}
        closeDrawer={() => setAddVisible(false)}
        data={currData}
        reload={() => initLoadData({ ...search })}
      />

      <Modify
        visible={modifyVisible}
        closeDrawer={closeDrawer}
        data={currData}
        reload={() => initLoadData({ ...search })}
      />
    </Layout>
  );
};

export default Main;
