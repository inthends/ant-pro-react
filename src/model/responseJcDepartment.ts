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
import { JcDepartment } from './jcDepartment';


/**
 * 返回消息
 */
export interface ResponseJcDepartment {
    /**
     * 状态码
     */
    code?: number;
    /**
     * 结果
     */
    success?: boolean;
    /**
     * 消息
     */
    msg?: string;
    /**
     * 记录总数
     */
    total?: number;
    /**
     * 数据
     */
    data?: JcDepartment;
}
