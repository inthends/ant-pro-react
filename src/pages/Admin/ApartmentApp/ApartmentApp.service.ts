import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";

export function GetAppPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Apartment/GetAppPageListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//审核
export function Audit(data): Promise<any> {
  return request.post(process.env.basePath + `/Apartment/Audit`, {data:objToFormdata(data)});
}

export function GetFilesData(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/Apartment/GetFilesData?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

export function SaveForm(data): Promise<any> { 
  return request
    .post(process.env.basePath + `/Apartment/SaveForm`, { data:objToFormdata(data) })
    .then(getResult as any);
}

export function SaveAppForm(data): Promise<any> { 
  return request
    .post(process.env.basePath + `/Apartment/SaveAppForm`, { data:objToFormdata(data) })
    .then(getResult as any);
}

export function SubmitAppForm(data): Promise<any> { 
  return request
    .post(process.env.basePath + `/Apartment/SubmitAppForm`, { data:objToFormdata(data) })
    .then(getResult as any);
}

//重新提交
export function ReSubmitAppForm(data): Promise<any> { 
  return request
    .post(process.env.basePath + `/Apartment/ReSubmitAppForm`, { data:objToFormdata(data) })
    .then(getResult as any);
}


//保存会员
export function SaveItemForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Apartment/SaveItemForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}


export function GetPageItemListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Apartment/GetPageItemListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}


// 作废
export function InvalidForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Apartment/InvalidForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

// 删除
export function RemoveItemForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Apartment/RemoveItemForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}


//删除附件
export function RemoveMemberFile(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Apartment/RemoveMemberFile?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

export function GetMemberFilesData(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/Apartment/GetMemberFilesData?keyvalue=${keyvalue}`)
    .then(getResult as any);
}



//获取信息
export function GetAppInfo(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/Apartment/GetAppInfo?keyvalue=${keyvalue}`)
    .then(getResult as any);
}