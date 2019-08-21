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


/**
 * 用于计算条件的类
 */
export interface CalOffsetMain {
    /**
     * 应付日期起
     */
    payBeginDate?: Date;
    /**
     * 应付日期结束
     */
    payEndDate?: Date;
    /**
     * 账单日起
     */
    beginDate?: Date;
    /**
     * 账单日结束
     */
    endDate?: Date;
    /**
     * 付款费项
     */
    payfeeitemid?: string;
    /**
     * 收款费项
     */
    feeitemid?: string;
}