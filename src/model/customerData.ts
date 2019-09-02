/**
 * A6物业管理系统接口
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { GmCustomerinfo } from './gmCustomerinfo';
import { GmRelationpc } from './gmRelationpc';


/**
 * 客户信息
 */
export interface CustomerData {
    /**
     * 主信息
     */
    customerInfo?: GmCustomerinfo;
    /**
     * 关联房产信息
     */
    relationPC?: GmRelationpc;
}
