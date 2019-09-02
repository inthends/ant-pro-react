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
export interface CwMeter {
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    memo?: string;
    /**
     * Desc:  Default:  Nullable:False
     */
    meterPrice?: number;
    /**
     * Desc:  Default:  Nullable:False
     */
    organizeId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    meterAddress?: string;
    /**
     * Desc:  Default:0  Nullable:False
     */
    meterRange?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    energyType?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    meterArea?: string;
    /**
     * Desc:  Default:  Nullable:False
     */
    meterType?: string;
    /**
     * Desc:  Default:0  Nullable:False
     */
    runType?: number;
    feeItemId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    meterCapacity?: number;
    /**
     * Desc:  Default:1  Nullable:False
     */
    meterZoom?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    feeItemName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    meterCode?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    minUsage?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    formula?: string;
    meterId?: string;
    /**
     * Desc:  Default:CURRENT_TIMESTAMP  Nullable:True
     */
    modifyDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    calculation?: string;
    /**
     * Desc:是否停用  Default:b'0'  Nullable:True
     */
    isStop?: boolean;
    /**
     * Desc:  Default:  Nullable:True
     */
    meterKind?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserId?: string;
    /**
     * Desc:  Default:CURRENT_TIMESTAMP  Nullable:True
     */
    createDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    maxUsage?: number;
    /**
     * Desc:  Default:  Nullable:False
     */
    meterName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserName?: string;
}
