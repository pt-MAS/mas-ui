import { inject, bindable, computedFrom } from 'aurelia-framework'
import { Service } from './service';
// import moment from 'moment';



var MachineLoader = require('../../../../loader/machines-loader');
var ProductionOrderLoader = require('../../../../loader/production-order-loader');

@inject(Service)
export class DataForm {

    @bindable readOnly = false;
    @bindable data = {};
    @bindable error;
    @bindable machine;
    @bindable productionOrder;
    @bindable title;

    auInputOptions = {
        label: {
            length: 4,
            align: "right"
        },
        control: {
            length: 5
        }
    };

    divisionFilter = { "UnitDivisionName": "FINISHING & PRINTING" };

    bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;
    }

    constructor(service) {
        this.service = service;
    }

    @computedFrom("data.Id")
    get isEdit() {
        return (this.data.Id || '').toString() != '';
    }

    get isFilterMachineType() {
        this.filterMachineType = {
            "machineType.code": this.data.machineType.code
        };
        return this.filterMachineType;
    }

    // itemsColumns = [
    //     { header: "Indicator", value: "Indicator" },
    //     { header: "Value", value: "DefaultValue" },
    //     { header: "Satuan", value: "Uom" },
    // ]

    // IndicatorsHeader = {
    //     Columns: [
    //         { header: "Indikator", value: "Indicator" },
    //         { header: "Value", value: "DefaultValue" },
    //         { header: "Satuan", value: "Uom" },
    //     ],
    //     onRemove: function () {
    //         console.log("remove");
    //     }.bind(this)
    // };

    async machineChanged(newValue) {
        this.resetErrors();
        this.data.Machine = newValue;
        if (this.data.Machine) {
            var items = [];
            var machineTypeId = this.data.Machine.MachineType.Id;
            var MachineType = await this.service.getMachineType(machineTypeId);

            for (var indicator of MachineType.Indicators) {
                var item = {
                    Indicator: indicator.Indicator,
                    DataType: indicator.DataType,
                    DefaultValue: indicator.DefaultValue,
                    Value: "",
                    Uom: indicator.Uom,
                };
                items.push(item);
            }
            console.log(items)
            this.data.Indicators = items;

        } else {
            this.data.Indicators = [];
            this.dataCollection.refresh();
        }
    }

    get machineLoader() {
        return MachineLoader;
    }

    get productionOrderLoader() {
        return ProductionOrderLoader;
    }

    productionOrderChanged(newValue) {
        // this.data.productionOrder = newValue;
        if (this.productionOrder) {
            this.data.ProductionOrder = this.productionOrder;
        }
    }

    resetErrors() {

        this.context.error = {};
        // this.data.items = []

    }


    activate() {

    }

    attached() {

    }

} 