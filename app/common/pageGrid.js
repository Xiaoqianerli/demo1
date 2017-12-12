
define(function (require) {

    var ko = require('knockout');
    var box = require('cab/box');
    var tips = require('cab/tips');
    
    function pageGrid(configuration) {

        var that = this;

        that.oreder = function (pData) {
            if (pData.order() == '') {
                pData.order('DESC');
            } else if (pData.order() == 'DESC') {
                pData.order('ASC');
            } else {
                pData.order('DESC');
            }
            for (var i = 0; i < that.columns.length; i++) {
                if (that.columns[i].orderby.key != pData.orderby.key) {
                    that.columns[i].order('');
                }
            }
            that.condition.sortField = pData.orderby.key;
            that.condition.sortWay = pData.order();
            that.callData(1);
        };

        that.address = configuration.url; // 获取数据的api地址

        if (!that.address) {
            box.error('api地址不能为空！');
        }
        that.condition = {};

        that.data = ko.observableArray([]); // 数据集合

        that.isPage = ko.computed(function () {
            if (configuration.isPage != undefined) {
                return configuration.isPage;
            }
            else {
                return true;
            }
        });// 是否分页

        that.isCheck = configuration.isCheck || false; // 是否有全选

        that.isRadio = configuration.isRadio || false; // 是否为单选

        that.allkeys = ko.observableArray([]); // 选中的键集合
        that.data.subscribe(function () {
            that.allkeys([]);
            ko.utils.objectForEach(that.data(), function (pIndex, pObject) {
                //that.allkeys.push(pObject[that.checkKey] + '');
                that.allkeys.push(that.orgCheckVal(pObject, that.checkKey));
            });
        });

        that.key = ko.observable(); // 单选的值

        that.keys = ko.observableArray([]); // 选中的键集合

        that.checkKey = configuration.checkKey; // 复选框的值，一般为主键

        that.orgCheckVal = function (pData, pCheckKey) {
            var vResult = '';
            var checkKeyArray = pCheckKey.split(',');
            for (var i = 0; i < checkKeyArray.length; i++) {
                vResult += pData[checkKeyArray[i]] + ',';
            }
            return vResult.substr(0, vResult.length - 1);
        };

        that.operate = orgOperate(configuration.operate); // 操作列配置

        that.operateWidth = configuration.operateWidth || '100px'; // 操作列配置

        that.operatePlace = ko.computed(function () {
            if (configuration.operateBefore == true) {
                return false;
            } else {
                return true;
            }
        });

        that.isOperate = ko.computed(function () {
            return that.operate;
        });

        that.isBefore = ko.computed(function () {
            return that.isOperate() && !that.operatePlace();
        });

        that.isBehind = ko.computed(function () {
            return that.isOperate() && that.operatePlace();
        });

        that.checkAll = ko.observable(false);// 全选

        that.bridgeKeys = ko.observableArray([]);

        that.checkCallback = configuration.checkCallback; // 操作列配置

        that.keys.subscribe(function () {
            if (typeof that.checkCallback !== "function") {
                that.checkCallback = false;
            }
            if (that.checkCallback) {
                that.checkCallback(that.keys());
            }

            if (isArrarEqual(that.keys(), that.allkeys())) {
                that.checkAll(true);
            } else {
                that.checkAll(false);
            }
        });

        that.checkAll.subscribe(function () { //监控全选
            if (that.checkAll()) {
                that.bridgeKeys([]);
                ko.utils.objectForEach(that.data(), function (pIndex, pObject) {
                    //that.bridgeKeys.push(pObject[that.checkKey] + '');
                    that.bridgeKeys.push(that.orgCheckVal(pObject, that.checkKey));
                });
            } else {
                if (isArrarEqual(that.keys(), that.allkeys())) {
                    that.bridgeKeys([]);
                }
            }

            that.keys(that.bridgeKeys());
        });

        that.pageCount = configuration.pageCount || 5; // 页码最多显示几页，默认5页

        that.pageCurrent = ko.observable(1); // 当前页

        that.ItemsPerPage = ko.observable(configuration.pageSize || 10); // 每页大小

        that.TotalItems = ko.observable(); // 总条数

        that.TotalPages = ko.observable();// 总页数

        // 上一页是否禁用
        that.prev = ko.computed(function () {
            return that.pageCurrent() <= 1;
        });

        // 下一页是否禁用
        that.next = ko.computed(function () {
            return that.pageCurrent() >= that.TotalPages();
        });

        // 上一页
        that.previousPage = function () {
            var vPreviousPage = that.pageCurrent() - 1;
            if (vPreviousPage < 1) return;
            that.callData(vPreviousPage);
        };

        // 下一页
        that.nextPage = function () {
            var vNextPage = that.pageCurrent() + 1;
            if (vNextPage > that.TotalPages()) return;
            that.callData(vNextPage);
        };

        // 末页
        that.lastPage = function () {
            if (that.pageCurrent() >= that.TotalPages()) {
                return;
            }
            that.callData(that.TotalPages());
        };

        // 首页
        that.firstPage = function () {
            if (that.pageCurrent() <= 1) {
                return;
            }
            that.callData(1);
        };

        //点击页码获取当前页数据
        that.turnPage = function (pageCurrent) {
            if (that.pageCurrent() == pageCurrent && that.pageCurrent() != 1) {
                return;
            }
            that.callData(pageCurrent);
        };

        that.columns = orgColumns(configuration.columns); // 数据列配置

        that.callData = function (pageCurrent) {
            that.clear();
            that.pageCurrent(pageCurrent);
            vUrl = that.address;
            if (that.isPage()) {
                that.condition.PageNum = that.pageCurrent();
                that.condition.PageSize = that.ItemsPerPage();
            }

            getData(vUrl,
                that.condition,
                that.data,
                that.pageCurrent,
                that.TotalPages,
                that.ItemsPerPage,
                that.TotalItems,
                that.isPage(),
                that.checkAll,
                that.keys);
        };

        that.activate = function () {
            var that = this;
            //setTimeout(function () { that.callData(1); }, 1);
            return true;
        };

        // 模块无效时
        that.deactivate = function () {
            for (var i = 0; i < that.columns.length; i++) {
                that.columns[i].order('');
            }
            that.dispose();
        }

        that.dispose = function () {
            that.data([]);
            that.clear();
        };

        that.clear = function () {
            that.keys([]);
            that.checkAll(false);
        };

        that.reload = function () {
            that.callData(1);
        };

        // 计算显示分页按钮
        that.pageButtons = ko.computed(function () {
            var current = that.pageCurrent(), // 当前页码
                last = that.TotalPages(), // 最后页码
                top = last, //最后显示
                bottom = 1; // 第一显示

            if (current === 1) {
                // 如果当前是第一页 计算最后显示
                top = Math.min(that.pageCount, last);
            } else if (current === last) {
                // 如果是最后页 计算第一页显示
                bottom = Math.max(1, current - that.pageCount + 1);
            } else {
                // 计算2侧分布页码个数
                var padding = Math.floor(that.pageCount / 2);
                // 计算第一页显示
                bottom = Math.max(1, current - padding);
                // 计算最后显示
                top = Math.min(last, current + padding);
                while (top - bottom < (that.pageCount - 1)
                        && last > padding
                        && (top < last || bottom > 1)) {
                    if (top < last)
                        top++;
                    else
                        bottom--;
                    if (bottom === 1)
                        break;
                }
            }

            var vRange = range(bottom, top);
            var pages = [];
            for (var i = 0; i < vRange.length; i++) {
                pages.push({ name: vRange[i], isActive: vRange[i] === current });
            }

            return pages;
        });

        that.subStr = function (str, len) {
            if (str == null) {
                return "";
            }
            if (str.length > len) {
                return str.substring(0, len) + '...';
            } else {
                return str;
            }
        };

        that.isShowTip = function (str, len, whether) {
            if (str == null || whether == false) {
                return false;
            }
            if (str.length > len) {
                return true;
            } else {
                return false;
            }
        };
    };

    // 组织显示列配置
    function orgColumns(pColumns) {
        if (pColumns != undefined) {
            for (var i = 0; i < pColumns.length; i++) {
                if (pColumns[i].width == undefined) {
                    pColumns[i].width = "auto";
                }
                if (pColumns[i].place == undefined) {
                    pColumns[i].place = "center";
                }
                if (pColumns[i].isOperate == undefined) {
                    pColumns[i].isOperate = false;
                }
                if (pColumns[i].isHide == undefined) {
                    pColumns[i].isHide = false;
                }
                if (pColumns[i].hidCount == undefined) {
                    pColumns[i].hidCount = 10;
                }
                if (pColumns[i].order == undefined) {
                    pColumns[i].order = ko.observable('');
                }
                if (pColumns[i].rawText == undefined) {
                    pColumns[i].rawText = pColumns[i].rowText;
                }
                if (pColumns[i].orderby == undefined) {
                    pColumns[i].orderby = {};
                }

            }
        }
        return pColumns;
    };

    // 组织操作列配置
    function orgOperate(pOperate) {
        if (pOperate != undefined) {
            for (var i = 0; i < pOperate.length; i++) {

                if (pOperate[i].readonly == undefined) {
                    pOperate[i].readonly = {};
                }
                if (pOperate[i].isDropdown == undefined) {
                    pOperate[i].isDropdown = false;
                }

            }
        }
        return pOperate;
    };

    // 获取数据
    function getData(pUrl,
                    pCondition,
                    pDataObservable,
                    pCurrentPageObservable,
                    pTotalPagesObservable,
                    pItemsPerPageObservable,
                    pTotalItemsObservable,
                    pIsPage,
                    pCheckAll,
                    pkeys) {

        box.post(pUrl, pCondition, succeeded);

        // 处理成功回调
        function succeeded(pageInfo) {
			
            var vPageInfo = ko.toJS(pageInfo);

            if (!pIsPage) {
                pDataObservable(vPageInfo); // 数据集
            } else {
                pDataObservable(vPageInfo.items); // 数据集
                pCurrentPageObservable(vPageInfo.currentPage); // 当前页
                pTotalPagesObservable(vPageInfo.totalPages); // 总页数
                pItemsPerPageObservable(vPageInfo.itemsPerPage); // 每页大小
                pTotalItemsObservable(vPageInfo.totalItems); // 总条数
            }
            if (pCondition.defaultKeys) {
                if (pCondition.defaultKeys[0] == 'all') {
                    pCheckAll(true);
                } else {
                    pkeys(pCondition.defaultKeys);
                }
            } else {
                pCheckAll(false);
            }
        }
    };

    function range(bottom, top) {
        var result = [bottom],
            lastIndex = 0;

        while (result[lastIndex] < top) {
            result.push(result[lastIndex++] + 1);
        }
        return result;
    };

    function isArrarEqual(pArrA, pArrB) {

        if (pArrA.length <= 0 || pArrB.length <= 0) {
            return false;
        }
        if (pArrA.length != pArrB.length) {
            return false;
        }

        for (var i = 0; i < pArrA.length; i++) {
            if (!ArrarContains(pArrB, pArrA[i])) {
                return false;
            }
        }
        return true;
    };

    function ArrarContains(pArrA, pVal) {
        var i = pArrA.length;
        while (i--) {
            if (pArrA[i] === pVal) {
                return true;
            }
        }
        return false;
    };

    return pageGrid;
});