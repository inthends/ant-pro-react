import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";
import { TreeEntity } from '@/model/models';

export function GetDataList(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Device/GetPageListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

// 新增修改
export function SaveDeviceForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Device/SaveDeviceForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}
 
// 删除分类
export function RemoveForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Device/RemoveForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

//获取分类
export function GetTypes(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/Device/GetTypes`, {}).then(getResult as any);
}

// 删除明细
export function RemoveDetailForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Device/RemoveDetailForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

export function GetMaintenanceListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Device/GetMaintenanceListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

export function GetRepairListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Device/GetRepairListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}


export function GetDefectListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Device/GetDefectListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//生成二维码
export function CreateQrCodeFrom(): Promise<any> {
  return request.post(process.env.basePath + `/Device/CreateQrCodeFrom`).then(getResult as any);
}

 
//保存维保记录
export function SaveMaintenanceForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Device/SaveMaintenanceForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//保存维修记录
export function SaveRepairForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Device/SaveRepairForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//保存设备缺陷
export function SaveDefectForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Device/SaveDefectForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//删除
export function RemoveMaintenanceForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Device/RemoveMaintenanceForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

//删除
export function RemoveRepairForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Device/RemoveRepairForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}
//删除
export function RemoveDefectForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Device/RemoveDefectForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}