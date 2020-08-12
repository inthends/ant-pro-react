import { ChargeDetailDTO, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';


// 验证合同编号
export function CheckNo(keyvalue, no): Promise<any> {
  return request
    .get(process.env.basePath + `/Contract/CheckNo?keyvalue=${keyvalue}&no=${no}`)
    .then(getResult as any);
}

export function GetPageListJson(data): Promise<any> {
  return request.post(process.env.basePath + `/Contract/GetPageListJson`, { data: objToFormdata(data) }).then(getResult as any);
}
 
export function GetTotalJson(data): Promise<any> {
  return request.post(process.env.basePath + `/Contract/GetTotal`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取所有费项
// export function GetAllFeeItems(): Promise<TreeEntity[]> {
//   return request
//     .get(process.env.basePath + `/FeeItems/GetAllFeeItems`)
//     .then(getResult as any);
// }

//获取当前选中多个房屋的收款费项
export function GetFeeItemsByUnitIds(unitIds): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetFeeItemsByUnitIds?unitIds=${unitIds}`)
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

//重新提交
// export function ReSubmitForm(data): Promise<any> {
//   return request
//     .post(process.env.basePath + `/Contract/ReSubmitForm`, { data: objToFormdata(data) })
//     .then(getResult as any);
// }

// 获取合同信息
// export function GetContractInfo(keyvalue): Promise<LeaseContractDTO> {
//   return request
//     .get(process.env.basePath + `/Contract/GetContractInfo?keyvalue=${keyvalue}`)
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
    .get(process.env.basePath + `/Contract/GetContractInfo?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

// 获取条款
export function GetChargeByChargeId(keyvalue): Promise<ChargeDetailDTO> {
  return request
    .get(process.env.basePath + `/Contract/GetChargeByChargeId?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

// 获取条款
export function GetChargeByContractId(keyvalue): Promise<ChargeDetailDTO> {
  return request
    .get(process.env.basePath + `/Contract/GetChargeByContractId?keyvalue=${keyvalue}`)
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
export function RemoveFile(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Contract/RemoveFile?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

//获取附件
export function GetFilesData(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/Contract/GetFilesData?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//刷新跟进
export function GetFollowCount(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/Contract/GetFollowCount?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

// 提交跟进
export function SaveFollow(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Contract/SaveFollow`, { data: objToFormdata(data) })
    .then(getResult as any);
}

export function GetFollow(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/Contract/GetFollow?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//删除合同
export function RemoveForm(keyvalue): Promise<any> {
  return request.post(process.env.basePath + `/Contract/RemoveForm?keyvalue=${keyvalue}`).then(getResult as any);
}
