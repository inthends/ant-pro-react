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
 * 
 */
export interface CwReductionmain {
    billId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    verifyPerson?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    createDate?: Date;
    organizeId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserId?: string;
    /**
     * Desc:折扣，默认1  Default:1.0000  Nullable:True
     */
    rebate?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    reductionAmount?: number;
    /**
     * Desc:  Default:b'0'  Nullable:False
     */
    ifVerify?: boolean;
    reductionFeeItemId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    memo?: string;
    /**
     * Desc:是否历史数据  Default:0  Nullable:True
     */
    status?: number;
    /**
     * Desc:  Default:  Nullable:False
     */
    billCode?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    verifyDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    billDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    verifyMemo?: string;
}
