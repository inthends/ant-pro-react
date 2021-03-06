import { ChargeDetailDTO, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';


export function GetPageListJson(data): Promise<any> {
  return request.post(process.env.basePath + `/AdminContract/GetPageListJson`, { data: objToFormdata(data) }).then(getResult as any);
}
 
export function GetTotalJson(data): Promise<any> {
  return request.post(process.env.basePath + `/AdminContract/GetTotal`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取所有费项
export function GetAllFeeItems(): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetAllFeeItems`)
    .then(getResult as any);
}

//获取当前选中房屋的收款费项
export function GetFeeItemsByUnitId(unitId): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetFeeItemsByUnitId?unitId=${unitId}`)
    .then(getResult as any);
}

// 新增页面计算费用明细
export function GetChargeDetail(data): Promise<any> {
  return request
    .post(process.env.basePath + `/AdminContract/GetChargeDetail`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//编辑页面计算费用明细
export function GetModifyChargeDetail(data): Promise<any> {
  return request
    .post(process.env.basePath + `/AdminContract/GetModifyChargeDetail`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// 保存合同
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/AdminContract/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//提交
export function SubmitForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/AdminContract/SubmitForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// 获取合同信息
// export function GetContractInfo(keyvalue): Promise<LeaseContractDTO> {
//   return request
//     .get(process.env.basePath + `/AdminContract/GetContractInfo?keyvalue=${keyvalue}`)
//     .then(getResult as any);
// }

//获取租赁房态图楼层和房间数据
export function GetContranctFloorData(keyvalue): Promise<any> {
  // const data = {
  //   keyvalue
  // };
  return request
    .get(process.env.basePath + `/PStructs/GetContranctFloorData?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//获取合同信息
export function GetContractInfo(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/AdminContract/GetContractInfo?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

// 获取条款
export function GetCharge(keyvalue): Promise<ChargeDetailDTO> {
  return request
    .get(process.env.basePath + `/AdminContract/GetCharge?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

// 获取条款
export function GetChargeByContractId(keyvalue): Promise<ChargeDetailDTO> {
  return request
    .get(process.env.basePath + `/AdminContract/GetChargeByContractId?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

export function GetDepartmentTreeJson(): Promise<any> {
  return request
    .get(process.env.basePath + `/PermissionRole/GetDepartmentTreeJson`)
    .then(getResult as any);
}

//获取合同审批用户
export function GetUserList(DepartmentId): Promise<any> {
  return request
    .get(process.env.basePath + `/AdminContract/GetUserListJson?DepartmentId=${DepartmentId}`)
    .then(getResult as any);
}

// //审核
// export function ApproveForm(data): Promise<any> {
//   return request
//     .post(process.env.basePath + `/AdminContract/ApproveForm`, { data: objToFormdata(data) })
//     .then(getResult as any);
// }

//退租
export function WithdrawalForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/AdminContract/WithdrawalForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//删除附件
export function RemoveFile(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/AdminContract/RemoveFile?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

//获取附件
export function GetFilesData(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/AdminContract/GetFilesData?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//刷新跟进
export function GetFollowCount(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/AdminContract/GetFollowCount?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

// 提交跟进
export function SaveFollow(data): Promise<any> {
  return request
    .post(process.env.basePath + `/AdminContract/SaveFollow`, { data: objToFormdata(data) })
    .then(getResult as any);
}

export function GetFollow(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/AdminContract/GetFollow?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//删除合同
export function RemoveForm(keyvalue): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/RemoveForm?keyvalue=${keyvalue}`).then(getResult as any);
}
