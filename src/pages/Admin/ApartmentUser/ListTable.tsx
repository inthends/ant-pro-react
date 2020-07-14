import Page from "@/components/Common/Page";
import { Tag, Table } from "antd";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import React from "react";
import { RemoveForm } from "./Apartment.service";
import moment from 'moment';

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(record: any): void;
  // choose(record: any): void;
  onchange(page: any, filter: any, sort: any): any;
  reload(): void;
  setData(data: any[]): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, data, modify, reload, pagination } = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };

  // const doDelete = record => {
  //   Modal.confirm({
  //     title: "请确认",
  //     content: `您确认要删除${record.fullName}吗？`,
  //     onOk: () => {
  //       RemoveForm(record.ruleId)
  //         .then(() => {
  //           message.success("删除成功");
  //           reload();
  //         }).catch(e => { });
  //     }
  //   });
  // };

  const doModify = record => {
    modify({ ...record });
  };

  const columns = [
    // {
    //   title: "头像",
    //   dataIndex: "headImgUrl",
    //   key: "headImgUrl", 
    //   align:'center',
    //   width: 80,
    //   render: val => val ? <img src={val} style={{ height: 50, width: 50 }} ></img> : ''
    // },

    // {
    //   title: "昵称",
    //   dataIndex: "nickName",
    //   key: "nickName",
    //   sorter: true,
    //   width: 150
    // },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      sorter: true,
      fixed: 'left',
      width: 300,
    },
    {
      title: "类别",
      dataIndex: "userType",
      key: "userType", 
      width: 100,
    },
    {
      title: "手机号码",
      dataIndex: "phoneNum",
      key: "phoneNum", 
      width: 150
    },
    {
      title: "联系人",
      dataIndex: "linkMan",
      key: "linkMan", 
      width: 150
    },
    {
      title: "联系电话",
      dataIndex: "linkTel",
      key: "linkTel", 
      width: 120
    },
    {
      title: "电子邮箱",
      dataIndex: "email",
      key: "email",
      width: 200
    },
    // {
    //   title: "传真号码",
    //   dataIndex: "fax",
    //   key: "fax",
    //   width: 80
    // }, 
    {
      title: "联系地址",
      dataIndex: "address",
      key: "address",
    },
    // {
    //   title: "有效",
    //   dataIndex: "enabledMark",
    //   key: "enabledMark",
    //   width: 100,
    //   render: (text: any, record, index) => {
    //     return (
    //       <Switch
    //         size="small"
    //         checked={text === ENABLEDMARKS.正常}
    //         checkedChildren={ENABLEDMARKS[ENABLEDMARKS.正常]}
    //         unCheckedChildren={ENABLEDMARKS[ENABLEDMARKS.禁用]}
    //         onClick={() => toggleDisabled(record)}
    //       />
    //     );
    //   }
    // }, 
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: 'center',
      fixed: 'right',
      width: 65,
      render: (text, record) => {
        return [
          <a onClick={() => doModify(record)} key="modify">编辑</a> 
        ];
      }
    }
  ] as ColumnProps<any>[];
  return (
    <Page>
      <Table
        style={{ border: "none" }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
        // scroll={{ x: 1200 }}
        loading={loading}
        pagination={pagination}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
      />
    </Page>
  );
}

export default ListTable;