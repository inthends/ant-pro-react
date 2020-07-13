import Page from "@/components/Common/Page";
import { Tag, Table } from "antd";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import React from "react";
import { RemoveForm } from "./ApartmentApp.service";
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
      title: "姓名",
      dataIndex: "name",
      key: "name",
      sorter: true,
      fixed: 'left',
      width: 150,
    },
    {
      title: "类别",
      dataIndex: "userType",
      key: "userType",
      sorter: true,
      width: 70,
    },
    {
      title: "手机号码",
      dataIndex: "phoneNum",
      key: "phoneNum",
      sorter: true,
      width: 120
    },
    {
      title: "工作单位",
      dataIndex: "workUnit",
      key: "workUnit",
      sorter: true,
      width: 120
    },

    {
      title: "证件类别",
      dataIndex: "certificateType",
      key: "certificateType",
      sorter: true,
      width: 100
    },

    {
      title: "证件号码",
      dataIndex: "certificateNO",
      key: "certificateNO",
      sorter: true,
      width: 160
    },

    {
      title: "法人代表",
      dataIndex: "legal",
      key: "legal",
      width: 100
    },

    {
      title: "组织机构代码",
      dataIndex: "taxCode",
      key: "taxCode",
      width: 120
    }, 
    {
      title: "电子邮箱",
      dataIndex: "email",
      key: "email",
      width: 150
    },
    // {
    //   title: "传真号码",
    //   dataIndex: "fax",
    //   key: "fax",
    //   width: 80
    // },
    {
      title: "申请日期",
      dataIndex: "appDate",
      key: "appDate",
      width: 120,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '审核状态',
      dataIndex: 'ifVerify',
      key: 'ifVerify',
      align: 'center',
      width: 100,
      render: val => val ? <Tag color="#61c33a">已审核</Tag> : <Tag color="#d82d2d">待审核</Tag>
    },
    {
      title: '审核人',
      dataIndex: 'verifyPerson',
      key: 'verifyPerson',
      width: 80
    },
    {
      title: '审核日期',
      dataIndex: 'verifyDate',
      key: 'verifyDate',
      width: 100,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '审核情况',
      dataIndex: 'verifyMemo',
      key: 'verifyMemo',
      width: 160,
    },

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
          // <a onClick={() => doModify(record)} key="modify">审核</a> 
          !record.ifVerify ? <a onClick={() => doModify(record)} key="app">编辑</a>
           : <a onClick={() => doModify(record)} key="unapp">查看</a>
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
        scroll={{ x: 2000 }}
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