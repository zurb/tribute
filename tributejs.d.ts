export as namespace tributejs;

declare class Tribute{
        constructor(element:Tribute.TributeOptions);
    }

    export = Tribute;

declare namespace Tribute {
    export interface TributeOptions {
        values: string[];
        lookup: string;
        menuItemTemplate:any;
        selectClass: string;
        selectTemplate: any;
    }
}
