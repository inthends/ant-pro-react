/**
 * A6资产管理系统接口
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
export interface HtLeasecontractcharge {
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyDate?: Date;
    // /**
    //  * Desc:  Default:  Nullable:True
    //  */
    // deposit?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserId?: string;
    // /**
    // * Desc:  Default:  Nullable:True
    // */
    // depositFeeItemId?: string;
    // /**
    //  * Desc:  Default:  Nullable:True
    //  */
    // depositFeeItemName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserName?: string;
    // /**
    //  * Desc:  Default:  Nullable:True
    //  */
    // depositUnit?: string;

   //  /**
   //   * Desc:  滞纳金起算日期
   //   */
   //  lateDate?: Date;

     /**
     * Desc:  Default:1  Nullable:False
     */
    lateStartDateBase?: number;

      /**
     * Desc:  Default:0  Nullable:False
     */
    lateStartDateUnit?: number;

        /**
     * Desc:  Default:0  Nullable:True
     */
    lateStartDateFixed?: number;
 
    /**
     * Desc:  Default:0  Nullable:False
     */
    lateStartDateNum?: number;

    /**
    * 滞纳金比例
    */
    lateFee?: number;

    /**
   * Desc: 滞纳金算法
   */
    lateMethod?: string;

    //     /**
    //     * 物业费
    //     */
    //     propertyFeeId?: string;

    //      /**
    //     * 物业费
    //     */
    //    propertyFeeName?: string;

    // /**
    //  * 单价保留小数点位数
    //  */
    // calcPrecision?: number;

    // /**
    //  * Desc:  Default:  Nullable:True
    //  */
    // endDate?: Date;
    // /**
    //  * Desc:  Default:  Nullable:True
    //  */
    // startDate?: Date;

    /**
     * Desc:  Default:  Nullable:False
     */
    id?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    createDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    leaseArea?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserId?: string;
    /**
     * Desc:  Default:  Nullable:False
     */
    leaseContractId?: string;

       /**
     * Desc:  Default:0  Nullable:True
     */
    midResultScale?: number;

       /**
     * Desc:  Default:0  Nullable:True
     */
    midScaleDispose?: number;

       /**
     * Desc:  Default:0  Nullable:True
     */
    lastResultScale?: number;

        /**
     * Desc:  Default:0  Nullable:True
     */
    lastScaleDispose?: number;
}
