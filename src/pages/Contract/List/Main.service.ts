import { ChargeDetailDTO, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';


export function GetPageListJson(data): Promise<any> {
  return request.post(process.env.basePath + `/Contract/GetPageListJson`, { data: objToFormdata(data) }).then(getResult as any);
}

// //获取费项类型
// export function GetFeeType(code): Promise<TreeEntity[]> {
//   return request
//     .get(process.env.basePath + `/Common/GetDataItemTreeJson?EnCode=` + code)
//     .then(getResult as any);
// }

//获取所有费项
// export function GetAllFeeItems(): Promise<TreeEntity[]> {
//   return request
//     .get(process.env.basePath + `/FeeItems/GetAllFeeItems`)
//     .then(getResult as any);
// }

//获取当前选中房屋的收款费项
export function GetFeeItemsByUnitId(unitId): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetFeeItemsByUnitId?unitId=${unitId}`)
    .then(getResult as any);
}

// 新增页面计算费用明细
export function GetChargeDetail(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Contract/GetChargeDetail`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//编辑页面计算费用明细
export function GetModifyChargeDetail(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Contract/GetModifyChargeDetail`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// 保存合同
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Contract/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//提交
export function SubmitForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Contract/SubmitForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// 获取合同信息
// export function GetContractInfo(keyValue): Promise<LeaseContractDTO> {
//   return request
//     .get(process.env.basePath + `/Contract/GetContractInfo?keyValue=${keyValue}`)
//     .then(getResult as any);
// }

//获取合同信息
export function GetContractInfo(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Contract/GetContractInfo?keyValue=${keyValue}`)
    .then(getResult as any);
}

// 获取条款
export function GetCharge(keyValue): Promise<ChargeDetailDTO> {
  return request
    .get(process.env.basePath + `/Contract/GetCharge?keyValue=${keyValue}`)
    .then(getResult as any);
}

// 获取条款
export function GetChargeByContractId(keyValue): Promise<ChargeDetailDTO> {
  return request
    .get(process.env.basePath + `/Contract/GetChargeByContractId?keyValue=${keyValue}`)
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
    .get(process.env.basePath + `/Contract/GetUserListJson?DepartmentId=${DepartmentId}`)
    .then(getResult as any);
}

// //审核
// export function ApproveForm(data): Promise<any> {
//   return request
//     .post(process.env.basePath + `/Contract/ApproveForm`, { data: objToFormdata(data) })
//     .then(getResult as any);
// }

//退租
export function WithdrawalForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Contract/WithdrawalForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//删除附件
export function RemoveFile(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Contract/RemoveFile?keyValue=${keyValue}`, {})
    .then(getResult as any);
}

//获取附件
export function GetFilesData(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Contract/GetFilesData?keyValue=${keyValue}`)
    .then(getResult as any);
}

//刷新跟进
export function GetFollowCount(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Contract/GetFollowCount?keyValue=${keyValue}`)
    .then(getResult as any);
}

// 提交跟进
export function SaveFollow(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Contract/SaveFollow`, { data: objToFormdata(data) })
    .then(getResult as any);
}

export function GetFollow(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Contract/GetFollow?keyValue=${keyValue}`)
    .then(getResult as any);
}