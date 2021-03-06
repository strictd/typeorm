import {NamingStrategyInterface} from "./NamingStrategyInterface";
import * as _ from "lodash";

/**
 * Naming strategy that is used by default.
 */
export class DefaultNamingStrategy implements NamingStrategyInterface {

    tableName(className: string, customName: string): string {
        return customName ? customName : _.snakeCase(className);
    }

    columnName(propertyName: string, customName: string): string {
        return customName ? customName : propertyName;
    }

    embeddedColumnName(embeddedPropertyName: string, columnPropertyName: string, columnCustomName?: string): string {
        return _.camelCase(embeddedPropertyName + "_" + (columnCustomName ? columnCustomName : columnPropertyName));
    }

    relationName(propertyName: string): string {
        return propertyName;
    }

    indexName(customName: string|undefined, tableName: string, columns: string[]): string {
        if (customName)
            return customName;
        
        const key = "ind_" + tableName + "_" + columns.join("_");
        return "ind_" + require("sha1")(key);
    }

    joinColumnInverseSideName(joinColumnName: string, propertyName: string): string {
        if (joinColumnName)
            return joinColumnName;
        
        return propertyName;
    }

    joinTableName(firstTableName: string,
                  secondTableName: string,
                  firstPropertyName: string,
                  secondPropertyName: string,
                  firstColumnName: string,
                  secondColumnName: string): string {
        return _.snakeCase(firstTableName + "_" + firstPropertyName + "_" + secondTableName + "_" + secondColumnName);
    }

    joinTableColumnName(tableName: string, columnName: string, secondTableName: string, secondColumnName: string): string {
        const column1 = _.camelCase(tableName + "_" + columnName);
        const column2 = _.camelCase(secondTableName + "_" + secondColumnName);
        return column1 === column2 ? column1 + "_1" : column1; // todo: do we still need _1 prefix?!
    }

    joinTableInverseColumnName(tableName: string, columnName: string, secondTableName: string, secondColumnName: string): string {
        const column1 = _.camelCase(tableName + "_" + columnName);
        const column2 = _.camelCase(secondTableName + "_" + secondColumnName);
        return column1 === column2 ? column1 + "_2" : column1; // todo: do we still need _2 prefix?!
    }

    closureJunctionTableName(tableName: string): string {
        return tableName + "_closure";
    }

    foreignKeyName(tableName: string, columnNames: string[], referencedTableName: string, referencedColumnNames: string[]): string {
        const key = `${tableName}_${columnNames.join("_")}_${referencedTableName}_${referencedColumnNames.join("_")}`;
        return "fk_" + require("sha1")(key).substr(0, 27); // todo: use crypto instead?
    }

    classTableInheritanceParentColumnName(parentTableName: any, parentTableIdPropertyName: any): string {
        return _.camelCase(parentTableName + "_" + parentTableIdPropertyName);
    }

    /**
     * Adds prefix to the table.
     */
    prefixTableName(prefix: string, originalTableName: string): string {
        return prefix + originalTableName;
    }
    
}
