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
export interface JcModulebutton {
    /**
     * Desc:  Default:  Nullable:True
     */
    fullName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    icon?: string;
    /**
     * Desc:  Default:0  Nullable:True
     */
    isSystem?: number;
    /**
     * Desc:  Default:  Nullable:False
     */
    moduleButtonId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    moduleId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    parentId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    actionAddress?: string;
    /**
     * Desc:  Default:0  Nullable:True
     */
    sortCode?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    enCode?: string;
}