import { inject, bindable, containerless, computedFrom, BindingEngine } from 'aurelia-framework'
import { Service } from "./service";
var StorageLoader = require('../../../loader/storage-loader');
//var UnitLoader = require('../../../loader/garment-units-loader');
var UnitSenderLoader = require('../../../loader/garment-units-loader');
var UnitRequestLoader = require('../../../loader/garment-units-loader');
var UnitReceiptNoteLoader = require('../../../loader/garment-unit-receipt-note-for-unit-delivery-order-loader');
import moment from 'moment';

@containerless()
@inject(Service, BindingEngine)
export class DataForm {
    @bindable readOnly = false;
    @bindable data = {};
    @bindable title;
    @bindable dataItems = [];
    @bindable error = {};
    @bindable options = {};
    @bindable unitDOType;
    @bindable unitRequest;
    @bindable unitSender;
    @bindable storage;
    @bindable storageRequest;
    @bindable RONo;
    @bindable RONoHeader;
    @bindable newProduct = {};
    @bindable isProses = false;
    @bindable isTransfer = false;
    @bindable isSample = false;

    typeUnitDeliveryOrderOptions = ['PROSES', 'TRANSFER', 'SAMPLE'];

    controlOptions = {
        label: {
            align: "left",
            length: 4
        },
        control: {
            length: 5,
            align: "right"
        }
    }

    constructor(service, bindingEngine) {
        this.service = service;
        this.bindingEngine = bindingEngine;
    }

    bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;

        this.options = {
            readOnly : this.readOnly,
            isEdit : this.isEdit
        };

        if (this.readOnly || this.isEdit) {
            this.items.columns =  [
                "Kode Barang",
                "Nama Barang",
                "Keterangan Barang",
                "RO Asal",
                "Jumlah DO Awal",
                "Jumlah DO",
                "Satuan",
                "Tipe Fabric"
            ];
        }
        
        if (this.data) {
            if (this.data.Items) {
                this.options.checkedAll = this.data.Items.filter(item => item.IsDisabled === false).reduce((acc, curr) => acc && curr.IsSave, true);
            }

            this.isProses = this.data.UnitDOType === "PROSES";
            this.isTransfer = this.data.UnitDOType === "TRANSFER";
            this.isSample = this.data.UnitDOType === "SAMPLE";
        }
    }

    @computedFrom("data.Id")
    get isEdit() {
        return (this.data.Id || '').toString() != '';
    }

    @computedFrom("data.UnitRequest")
    get filterUnitRequest() {
        var storageFilter = {}
        if (this.data.UnitRequest) {
            storageFilter.UnitId = this.data.UnitRequest.Id;
        }

        return storageFilter;
    }

    @computedFrom("data.UnitSender")
    get filterUnit() {
        var storageFilter = {}
        if (this.data.UnitSender) {
            storageFilter.UnitId = this.data.UnitSender.Id;
        }

        return storageFilter;
    }

    @computedFrom("data.UnitSender", "data.UnitDOType", "data.Storage")
    get filterRONoByUnit() {
        var rONoFilter = {};
        if (this.data.UnitSender && this.data.Storage) {
            rONoFilter.UnitId = this.data.UnitSender.Id;
            rONoFilter.Type = this.data.UnitDOType;
            rONoFilter.StorageId = this.data.Storage._id;
        }
        return rONoFilter;
    }

    @computedFrom("data.UnitSender", "data.UnitDOType", "data.RONo", "data.Storage")
    get filterRONoAddProductByUnit() {
        var rONoFilter = {}
        if (this.data.UnitSender  && this.data.Storage) {
            rONoFilter.UnitId = this.data.UnitSender.Id;
            rONoFilter.Type = this.data.UnitDOType;
            rONoFilter.RONo = this.data.RONo;
            rONoFilter.StorageId = this.data.Storage._id;
        }
        return rONoFilter;
    }

    unitDOTypeChanged(newValue) {
        var selectedCategory = newValue;
        if (selectedCategory) {
            this.data.UnitDOType = selectedCategory;

            this.isProses = this.data.UnitDOType === "PROSES";
            this.isTransfer = this.data.UnitDOType === "TRANSFER";
            this.isSample = this.data.UnitDOType === "SAMPLE";

            this.unitRequest = null;
            this.unitSender = null;
            this.storage = null;
            this.storageRequest = null;
            this.RONo = null;
            this.RONoHeader = null;
            this.data.Article = null;

            //this.context.error.Items = [];
            this.context.error = [];
        }
    }

    get storageLoader() {
        return StorageLoader;
    }

    get garmentUnitReceiptNoteHeaderLoader() {
        return (keyword, filter) => {
            var info = {
                keyword: keyword,
                filter: JSON.stringify(filter),
            };
            return this.service.searchUnitReceiptNote(info)
                .then((result) => {
                    let itemIds = this.data.Items.map(i => i.URNItemId);
                    return result.data.filter(data => data && itemIds.indexOf(data.Id) < 0);
                });
        }
    }

    storageView = (storage) => {
        var code = storage.code ? storage.code : storage.Code;
        var name = storage.name ? storage.name : storage.Name;
        return `${name}`
    }

    unitRequestChanged(newValue) {
        var selectedUnit = newValue;
        if (selectedUnit) {
            this.data.UnitRequest = selectedUnit;
            if (this.isProses || this.isSample) {
                this.unitSender = selectedUnit;
            }
        }
        else {
            this.data.UnitRequest = null;
            if (this.isProses || this.isSample) {
                this.unitSender = null;
            }
            this.context.unitRequestViewModel.editorValue = "";
        }
        this.storageRequest = null;
        if(this.context.storageRequestViewModel && this.context.storageRequestViewModel.editorValue) {
            this.context.storageRequestViewModel.editorValue = "";
        }
        this.storage = null;
        this.RONoHeader = null;
        this.RONo = null;
        this.data.Article = null;
        this.context.RONoHeaderViewModel.editorValue = "";
        this.context.RONoViewModel.editorValue = "";
        this.data.Items = [];
    }

    unitSenderChanged(newValue) {
        var selectedUnit = newValue;
        if (selectedUnit) {
            this.data.UnitSender = selectedUnit;
        }
        else {
            this.data.UnitSender = null;
            this.context.unitSenderViewModel.editorValue = "";
        }
        this.storage = null;
        this.context.storageViewModel.editorValue = "";
        this.RONoHeader = null;
        this.RONo = null;
        this.data.Items = [];
        this.context.RONoHeaderViewModel.editorValue = "";
        this.context.RONoViewModel.editorValue = "";
        this.data.Article = null;
    }

    storageRequestChanged(newValue) {
        var selectedStorage = newValue;
        if (selectedStorage) {
            this.data.StorageRequest = selectedStorage;
        }
        else {
            this.data.StorageRequest = null;
            if (this.isTransfer) {
                this.context.storageRequestViewModel.editorValue = "";
            }
        }
        this.data.Items = [];
        this.RONo = null;
        this.data.Article = null;
        this.storage = null;
        this.context.RONoViewModel.editorValue = "";
        this.unitSender = null;
    }

    storageChanged(newValue) {
        var selectedStorage = newValue;
        if (selectedStorage) {
            this.data.Storage = selectedStorage;
        }
        else {
            this.data.Storage = null;
            this.context.storageViewModel.editorValue = "";
        }
        this.data.Items = [];
        this.RONo = null;
        this.data.Article = null;
        this.context.RONoHeaderViewModel.editorValue = "";
        this.context.RONoViewModel.editorValue = "";
        this.RONoHeader = null;
    }

    RONoChanged(newValue) {
        var selectedro = newValue;
        this.dataItems = [];
        this.data.Items = [];
        this.data.Article = null;
        if(this.error && this.error.Items) {
            this.error.Items = [];
        }

        if (newValue == null) {
            this.data.RONo = null;
            this.data.Article = null;
            this.context.RONoViewModel.editorValue = "";
        }
        else if (newValue) {
            console.log(newValue)
            this.data.RONo = selectedro.RONo;
            this.data.Article = selectedro.Article;
            if(this.isProses){
                Promise.resolve(this.service.searchUnitReceiptNoteItems({ filter: JSON.stringify({ RONo: this.data.RONo}) }))
                    .then(result => {
                        if(result.data.length>0){
                            for(var item of result.data){ 
                                
                                var Items = {};
                                Items.URNItemId = item.Id;
                                Items.URNNo = item.URNNo;
                                Items.DODetailId = item.DODetailId;
                                Items.URNId = item.URNId;
                                Items.POItemId = item.POItemId;
                                Items.EPOItemId = item.EPOItemId;
                                Items.PRItemId = item.PRItemId;
                                Items.RONo = item.RONo;
                                Items.Article = item.Article;
                                Items.POSerialNumber = item.POSerialNumber;
                                Items.ProductId = item.ProductId;
                                Items.ProductCode = item.ProductCode;
                                Items.ProductName = item.ProductName;
                                Items.ProductRemark = `${item.POSerialNumber}; ${item.Article}; ${item.RONo}; ${item.ProductRemark}`;
                                Items.UomId = item.SmallUomId;
                                Items.UomUnit = item.SmallUomUnit;
                                Items.PricePerDealUnit = item.PricePerDealUnit;
                                Items.DesignColor = item.DesignColor;
                                Items.DefaultDOQuantity = parseFloat(((item.ReceiptCorrection*item.CorrectionConversion) - item.OrderQuantity).toFixed(2));
                                //parseFloat(((item.SmallQuantity - item.OrderQuantity)).toFixed(2));
                                Items.Quantity = Items.DefaultDOQuantity;
                                Items.IsSave = Items.Quantity > 0;
                                Items.IsDisabled = !(Items.Quantity > 0);
                
                                this.dataItems.push(Items);
                            }
                        }
                        
                        
                    });
            }
            else{
                for (var item of selectedro.Items) {
                    var Items = {};
                    Items.URNItemId = item.Id;
                    Items.URNNo = item.URNNo;
                    Items.DODetailId = item.DODetailId;
                    Items.URNId = item.URNId;
                    Items.POItemId = item.POItemId;
                    Items.EPOItemId = item.EPOItemId;
                    Items.PRItemId = item.PRItemId;
                    Items.RONo = item.RONo;
                    Items.Article = item.Article;
                    Items.POSerialNumber = item.POSerialNumber;
                    Items.ProductId = item.ProductId;
                    Items.ProductCode = item.ProductCode;
                    Items.ProductName = item.ProductName;
                    Items.ProductRemark = `${item.POSerialNumber}; ${item.Article}; ${item.RONo}; ${item.ProductRemark}`;
                    Items.UomId = item.SmallUomId;
                    Items.UomUnit = item.SmallUomUnit;
                    Items.PricePerDealUnit = item.PricePerDealUnit;
                    Items.DesignColor = item.DesignColor;
                    Items.DefaultDOQuantity = parseFloat(((item.ReceiptCorrection*item.CorrectionConversion) - item.OrderQuantity).toFixed(2));
                    //parseFloat(((item.SmallQuantity - item.OrderQuantity)).toFixed(2));
                    Items.Quantity = Items.DefaultDOQuantity;
                    Items.IsSave = Items.Quantity > 0;
                    Items.IsDisabled = !(Items.Quantity > 0);
    
                    this.dataItems.push(Items);
                }
            }
            
        }
        
        this.context.error.Items = [];
        this.context.error = [];
        this.RONoHeader = null;
        this.context.RONoHeaderViewModel.editorValue = "";
    }

    RONoHeaderChanged(newValue) {
        var selectedROHeader = newValue;
        this.newProduct = {};
        if (selectedROHeader == null) {
            this.context.RONoHeaderViewModel.editorValue = "";
            this.data.RONoHeader = null;
        }
        else if (selectedROHeader) {
            this.newProduct.URNItemId = selectedROHeader.Id;
            this.newProduct.URNNo = selectedROHeader.URNNo;
            this.newProduct.DODetailId = selectedROHeader.DODetailId;
            this.newProduct.URNId = selectedROHeader.URNId;
            this.newProduct.POItemId = selectedROHeader.POItemId;
            this.newProduct.EPOItemId = selectedROHeader.EPOItemId;
            this.newProduct.PRItemId = selectedROHeader.PRItemId;
            this.newProduct.RONo = selectedROHeader.RONo;
            this.newProduct.Article = selectedROHeader.Article;
            this.newProduct.POSerialNumber = selectedROHeader.POSerialNumber;
            this.newProduct.ProductId = selectedROHeader.ProductId;
            this.newProduct.ProductCode = selectedROHeader.ProductCode;
            this.newProduct.ProductName = selectedROHeader.ProductName;
            this.newProduct.ProductRemark = `${selectedROHeader.POSerialNumber}; ${selectedROHeader.Article}; ${selectedROHeader.RONo}; ${selectedROHeader.ProductRemark}`;
            this.newProduct.UomId = selectedROHeader.SmallUomId;
            this.newProduct.UomUnit = selectedROHeader.SmallUomUnit;
            this.newProduct.PricePerDealUnit = selectedROHeader.PricePerDealUnit;
            this.newProduct.DesignColor = selectedROHeader.DesignColor;
            this.newProduct.DefaultDOQuantity = parseFloat(((selectedROHeader.ReceiptCorrection*selectedROHeader.CorrectionConversion) - selectedROHeader.OrderQuantity).toFixed(2));
            //(selectedROHeader.SmallQuantity - selectedROHeader.OrderQuantity);
            this.newProduct.Quantity = this.newProduct.DefaultDOQuantity;
            this.newProduct.IsSave = this.newProduct.Quantity > 0;
            this.newProduct.IsDisabled = !(this.newProduct.Quantity > 0);
        }
        // this.context.error.Items = [];
        // this.context.error = [];
    }

    get unitRequestLoader() {
        return UnitRequestLoader;
    }

    get unitSenderLoader() {
        return UnitSenderLoader;
    }

    roNoView = (rono) => {
        return `${rono.RONo} - ${rono.ProductCode} - ${rono.ProductName} - ${rono.POSerialNumber}`;
    }

    unitRequestView = (unitRequest) => {
        return `${unitRequest.Code} - ${unitRequest.Name}`
    }

    unitSenderView = (unitSender) => {
        return `${unitSender.Code} - ${unitSender.Name}`
    }

    get unitReceiptNoteLoader() {
        return UnitReceiptNoteLoader;
    }

    async searchRONo() {
        this.data.Items = this.dataItems;
        this.options.checkedAll = this.data.Items.filter(item => item.IsDisabled === false).reduce((acc, curr) => acc && curr.IsSave, true);
    }

    async addProduct() {
        if (this.newProduct && this.newProduct.ProductId) {
            this.data.Items.push(this.newProduct);
            this.options.checkedAll = this.data.Items.filter(item => item.IsDisabled === false).reduce((acc, curr) => acc && curr.IsSave, true);
            this.context.ItemsCollection.bind();
            this.newProduct = {};
            this.RONoHeader = null;
        }
    }

    items = {
        columns: [
            "Kode Barang",
            "Nama Barang",
            "Keterangan Barang",
            "RO Asal",
            "Jumlah DO Awal",
            "Satuan",
            "Tipe Fabric"
        ],
    };

    get roLoader() {
        return (keyword) => {
            var info = {
              keyword: keyword,
              filter: JSON.stringify({'RONo.Contains("M")': "false", 'RONo.Contains("S")': "false"})
            };
            var ro=[];
            return this.service.getGarmentEPOByRONo(info)
            .then((epo)=>{
                for(var a of epo.data){
                    if(ro.length==0){
                        ro.push(a);
                    }
                    else{
                        var dup=ro.find(b=>b.RONo==a.RONo);
                        if(!dup){
                            ro.push(a);
                        }
                    }
                }
                return ro;
            });
                    
        }
    }
}