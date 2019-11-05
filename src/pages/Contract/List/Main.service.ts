import { ChargeDetailDTO, TreeEntity, LeaseContractDTO } from '@/model/models';
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
export function GetAllFeeItems(): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetAllFeeItems`)
    .then(getResult as any);
}


// 计算费用明细
export function GetChargeDetail(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Contract/GetChargeDetail`, { data: objToFormdata(data) })
    .then(getResult as any);
}


// 保存合同
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Contract/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}


// 获取合同信息
export function GetFormJson(keyValue): Promise<LeaseContractDTO> {
  return request
    .get(process.env.basePath + `/Contract/GetFormJson?keyValue=${keyValue}`)
    .then(getResult as any);
}

// 获取条款
export function GetCharge(keyValue): Promise<ChargeDetailDTO> {
  return request
    .get(process.env.basePath + `/Contract/GetCharge?keyValue=${keyValue}`)
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