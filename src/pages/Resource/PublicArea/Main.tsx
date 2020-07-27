import { DefaultPagination } from '@/utils/defaultSetting';
import { Modal, message, Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import AsynLeftTreeForArea from '../AsynLeftTreeForArea';
import ListTable from './ListTable';
import Modify from './Modify';
import { CreateQrCodeFrom, GetPublicAreas } from './Main.service';
import { GetQuickSimpleTreeAllForArea } from '@/services/commonItem';
// import { getResult } from '@/utils/networkUtils';

const { Content } = Layout;
const { Search } = Input;

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [organize, SetOrganize] = useState<any>({});
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  const [search, setSearch] = useState<string>('');

  const select = (id, type, info) => {
    // initLoadData(info.node.props.dataRef, search);
    SetOrganize(info.node.props.dataRef);
    //初始化页码，防止页码错乱导致数据查询出错  
    const page = new DefaultPagination();
    loadData(search, info.node.props.dataRef, page);
  };

  useEffect(() => {
    // getTreeData().then(res => {
    //   const root = res.filter(item => item.parentId === '0');
    //   const rootOrg = root.length === 1 ? root[0] : undefined;
    //   SetOrganize(rootOrg);
    //   initLoadData('', '');
    // });

    //获取房产树
    // GetQuickSimpleTreeAllForArea()
    //   .then(getResult)
    //   .then((res: any[]) => {
    //     setTreeData(res || []);
    //     return res || [];
    //   });F

    GetQuickSimpleTreeAllForArea().then(res => {
      setTreeData(res || []);
    })

    initLoadData('', '');

  }, []);

  // 获取属性数据
  // const getTreeData = () => {
  //   return GetQuickPublicAreaTree().then((res: any[]) => {
  //     //const treeList = (res || []);
  //     //.map(item => {
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
        //OrganizeId: org.organizeId,
        TreeTypeId: org.key,
        TreeType: org.type,
      },
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'enCode';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'enCode';
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

  const initLoadData = (searchText, org) => {
    setSearch(searchText);
    const queryJson = {
      // OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.key,
      TreeType: org.type,
    };
    const sidx = 'enCode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

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
          message.success('生成成功，请到服务器wwwroot/upload/Area目录下查看');
        }).catch(() => {
        });;
      }, 
      onCancel: () => {
        setLoading(false);
      }

    });
  }

  //是否能新增
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  return (
    <Layout style={{ height: '100%' }}>
      <AsynLeftTreeForArea
        parentid={'0'}
        //treeData={treeData}
        selectTree={(parentId, type, info) => {
          if (type != 4) {
            setIsDisabled(true);
          } else {
            setIsDisabled(false);
          }
          select(parentId, type, info);
        }}
      />
      <Content style={{ paddingLeft: '18px' }} >
        <div style={{ marginBottom: '10px' }}>
          <Search
            className="search-input"
            placeholder="搜索区域名称"
            onSearch={value => loadData(value, organize)}
            style={{ width: 200 }}
          />
          <Button type="primary"
            style={{ float: 'right', marginLeft: '10px' }}
            onClick={() => { CreateQrCode() }} >
            <Icon type="qrcode" />
            二维码
           </Button>

          <Button type="primary"
            disabled={isDisabled}
            style={{ float: 'right', marginLeft: '10px' }}
            onClick={() => showDrawer()}>
            <Icon type="plus" />
            区域
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
          reload={() => initLoadData(search, organize)}
        />
      </Content>

      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        organizeId={organize.id}
        data={currData}
        treeData={treeData}
        reload={() => initLoadData(search, organize)}
      />
    </Layout>
  );
}

export default Main;
