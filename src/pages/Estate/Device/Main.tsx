import { DefaultPagination } from "@/utils/defaultSetting";
import { message, Modal, Button, Icon, Input, Layout } from "antd";
import { PaginationConfig } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import ListTable from "./ListTable";
import Modify from "./Modify";
import { getResult } from '@/utils/networkUtils';
import { CreateQrCodeFrom, GetTypes, GetDataList } from "./Main.service";
import { GetQuickSimpleTreeAllForDeskService } from '@/services/commonItem';
// import { SiderContext } from '../../SiderContext';
// import LeftTree from '../LeftTree';
// const { Sider } = Layout;
const { Content } = Layout;
const { Search } = Input;

const Device = () => {
  const [itemId, setItemId] = useState<string>();
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  // const { hideSider, setHideSider } = useContext(SiderContext);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [unitData, setUnitData] = useState<any[]>([]);

  useEffect(() => {
    GetTypes().then((res) => {
      setTreeData(res || []);
    });

    //获取房产树
    GetQuickSimpleTreeAllForDeskService()
      .then(getResult)
      .then((res: any[]) => {
        setUnitData(res || []);
        // return res || [];
      });

    initLoadData(itemId);
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
    itemId: any,
    paginationConfig?: PaginationConfig,
    sorter?
  ) => {
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
      itemId: itemId
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

  const initLoadData = (itemId) => {
    setItemId(itemId);
    //const queryJson = searchParam;
    const sidx = "CreateDate";
    const sord = "desc";
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, itemId }).then(
      res => {
        return res;
      }
    );
  };

  // const selectTree = (item) => {
  //   var value = item.node.props.value;
  //   initLoadData(value);
  //   setItemId(itemId);
  // };

  //生成二维码
  const CreateQrCode = () => {
    setLoading(true);
    Modal.confirm({
      title: '请确认',
      content: `您是否要生成二维码？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        CreateQrCodeFrom().then(() => {
          setLoading(false);
          message.success('生成成功，请到服务器wwwroot/upload/Device目录下查看');
        }).catch(() => {
        });;
      },
      onCancel: () => {
        setLoading(false);
      }
    });
  }

  return (
    <Layout style={{ height: "100%" }}>

      {/* <Sider
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
      </Sider> */}

      <Content style={{ paddingLeft: '18px' }}>
        <div style={{ marginBottom: 20, padding: "3px 0" }}>
          <Search
            key='search'
            className="search-input"
            placeholder="请输入要查询的关键词"
            style={{ width: 200 }}
          />
          <Button type="primary"
            style={{ float: 'right', marginLeft: '10px' }}
            onClick={() => { CreateQrCode() }} >
            <Icon type="qrcode" />
            二维码
           </Button>

          <Button
            type="primary"
            style={{ float: 'right', marginLeft: '10px' }}
            onClick={() => showDrawer()}
          >
            <Icon type="plus" />
            设备
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
          reload={() => initLoadData(itemId)}
        />
      </Content>
      <Modify
        visible={modifyVisible}
        closeDrawer={closeDrawer}
        data={currData}
        reload={() => initLoadData(itemId)}
        types={treeData}
        unitData={unitData}
      />

    </Layout>
  );
};

export default Device;
