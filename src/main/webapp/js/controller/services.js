var _error = console.error;
console.error = function () {
    var msg = [].slice.call(arguments).join(' ');
    _error.call(console, msg);
    alert(msg);
};

function queryString(paramObject) {
    var result = [];
    angular.forEach(paramObject, function (val, key) {
        this.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
    }, result);
    return result.join('&');
}
var resolvedPromise = function ($q, value) {
    var deferred = $q.defer();
    deferred.resolve(value);
    return deferred.promise;
};
var myPost = function ($q, $http, url, paramObj) {
    return $http.post(url, paramObj).then(function (result) {
        return resolvedPromise($q, result.data);
    }, function (error) {
        return resolvedPromise($q, {success: false, errCode: '' + error.status, errMsg: error.statusText});
    });
};
var myGet = function ($q, $http, url, paramObj) {
    var urlQryStr = url + (paramObj == undefined || paramObj == {} ? '' : ('?' + queryString(paramObj)));
    return $http.get(urlQryStr).then(function (result) {
        return resolvedPromise($q, result.data);
    }, function (error) {
        return resolvedPromise($q, {success: false, errCode: '' + error.status, errMsg: error.statusText});
    });
};

var myPostFormData = function ($q, $http, url, formData) {
    var headers = {
        'Content-Type': undefined
    };
    return $http.post(url, formData, {
        transformRequest: angular.identity,
        headers: headers
    }).then(function (result) {
        return resolvedPromise($q, result.data);
    }, function (error) {
        return resolvedPromise($q, {
            success: false,
            errCode: '' + error.status,
            errMsg: error.statusText
        });
    });
};

var amazonUpload = function ($q, $http, url, file) {
    var deferred = $q.defer();
    $.ajax({
        type: "PUT",
        beforeSend: function (request) {
            request.setRequestHeader("Content-Type", 'image/jpeg');
        },
        url: url,
        data: file,
        processData: false,
        contentType: false,
        success: function (data) {
            console.log("File available at: ", data);
            deferred.resolve(data);
        },
        error: function (data) {
            var obj = jQuery.parseJSON(data);
            alert(obj.error);
            deferred.reject(data);
        }
    });
    return deferred.promise;
};
var app = angular.module('myApp', ['angular-md5', 'ui.router', 'ui.bootstrap', 'ngDialog', 'dndLists', 'treasure-overlay-spinner', 'nvd3', 'highcharts-ng']);

app.config(['$httpProvider', function ($httpProvider) {
    // Intercept POST requests, convert to standard form encoding
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.put['Content-Type'] = 'image/jpeg';
    //$httpProvider.defaults.headers.put['Access-Control-Allow-Origin'] = '*';
    //$httpProvider.defaults.headers.put['Access-Control-Allow-Headers'] = 'X-Requested-With';
    $httpProvider.defaults.transformRequest.unshift(function (paramObject /*, headersGetter*/) {
        return queryString(paramObject);
    });

    $httpProvider.interceptors.push(['$q', '$injector', function ($q, $injector) {
        return {
            request: function (config) {
                config.headers["Ng-Path"] = $injector.get('$state').$current.url.prefix;
                config.headers["Ak-Admin-Skey"] = localStorage.skey;
                return config;
            },
            responseError: function (response) {
                if (response.status === 401) {
                    //redirect them back to login page
                    if (!$injector.get('$state').is('login')) {
                        console.log('redirect!');
                        sessionStorage.clear();
                        $injector.get('$state').transitionTo('login');
                    }
                    return $q.reject(response);
                } else if (response.status === 403) {
                    if ($injector.get('$state').is('index.home')) {
                        $injector.get('$state').transitionTo('index');
                        return $q.reject(response);
                    }
                    var data = $injector.get('dataService').getData();
                    if (!data.accessDeniedWin) {
                        data.accessDeniedWin = true;
                        dialog = $injector.get('$modal').open({
                            size: 'sm',
                            templateUrl: 'template/accessDenied.html',
                            controller: function () {
                            }
                        });
                        dialog.result.finally(function () {
                            delete data.accessDeniedWin;
                        });
                    }
                    return $q.reject(response);
                } else if (response.status === 503) {
                    var data = $injector.get('dataService').getData();
                    if (!data.responseCode503) {
                        data.responseCode503 = true;
                        var dialog = $injector.get('ngDialogBox').show('Server Maintenance', function (value) {
                            delete data.responseCode503;
                        });
                    }
                    return $q.reject(response);
                } else {
                    var data = $injector.get('dataService').getData();
                    if (!data.responseCode) {
                        data.responseCode = true;
                        var dialog = $injector.get('ngDialogBox').show(response.status + ":" + response.statusText, function (value) {
                            delete data.responseCode;
                        });
                    }
                    return $q.reject(response);
                }
            }
        };
    }]);

}]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise(function ($injector, $location) {
        var $state = $injector.get("$state");
        $state.go('main');
    });

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: 'loginCtrl'
        })
        .state("main", {
            url: "/main",
            templateUrl: "/main.html",
            controller: 'mainCtrl',
        })
}]);
app.service('lazyLoadGMapApi', ['$window', '$q', function ($window, $q) {
    function loadScript() {
        console.log('loadScript')
        // use global document since Angular's $document is weak
        var s = document.createElement('script')
        s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDODNXZeafEUa_CmTO5r22eqzygSD3qKx8&libraries=visualization&callback=initMap'
        document.body.appendChild(s)
    }

    var deferred = $q.defer()

    $window.initMap = function () {
        deferred.resolve()
    }

    loadScript();

    return deferred.promise
}])
app.service('dataService', function () {
    var data = {};
    return {
        getData: function () {
            return data;
        },
        setData: function (key, value) {
            data[key] = value;
        },
        clearData: function () {
            data = {};
        }
    }
});

app.service('httpSvc', ['$q', '$http', function ($q, $http) {
    var qs = function (params) {
        var result = [];
        angular.forEach(params, function (val, key) {
            this.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
        }, result);
        return result.join('&');
    }
    var eo = function (error) {
        return {
            success: false,
            errCode: '' + error.status,
            errMsg: error.statusText
        };
    }
    return {
        delete: function (url) {
            var d = $q.defer();
            //var url = url + (params == undefined || params == {} ? '' : ('?' + qs(params)));
            return $http.delete(url).then(function (result) {
                d.resolve(result.data);
                return d.promise;
            }, function (error) {
                d.resolve(eo(error));
                return d.promise;
            });
        },
        get: function (url, params) {
            var d = $q.defer();
            //var url = url + (params == undefined || params == {} ? '' : ('?' + qs(params)));
            return $http.get(url, {
                params: params
            }).then(function (result) {
                d.resolve(result.data);
                return d.promise;
            }, function (error) {
                d.resolve(eo(error));
                return d.promise;
            });
        },
        post: function (url, params) {
            var d = $q.defer();
            return $http.post(url, params).then(function (result) {
                d.resolve(result.data);
                return d.promise;
            }, function (error) {
                d.resolve(eo(error));
                return d.promise;
            });
        },
        postFormData: function (url, formData) {
            var d = $q.defer();
            var headers = {
                'Content-Type': undefined
            };
            return $http.post(url, formData, {
                transformRequest: angular.identity,
                headers: headers
            }).then(function (result) {
                d.resolve(result.data);
                return d.promise;
            }, function (error) {
                d.resolve(eo(error));
                return d.promise;
            });
        },
        amazonUpload: function (url, file, opts) {
            var contentType = 'image/jpeg';
            if (opts && opts.contentType)
                contentType = opts.contentType;

            var d = $q.defer();
            $.ajax({
                type: "PUT",
                beforeSend: function (request) {
                    request.setRequestHeader("Content-Type", contentType);
                },
                url: url,
                data: file,
                processData: false,
                contentType: false,
                success: function (data) {
                    d.resolve({success: true, data: data});
                },
                error: function (error) {
                    d.resolve(eo(error));
                }
            });
            return d.promise;
        }
    }
}]);

app.service('imgSvc', ['$q', function ($q) {
    return {
        dataURIToBlob: function (dataURI) {
            'use strict'
            var byteString,
                mimestring

            if (dataURI.split(',')[0].indexOf('base64') !== -1) {
                byteString = atob(dataURI.split(',')[1])
            } else {
                byteString = decodeURI(dataURI.split(',')[1])
            }

            mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0]

            var content = new Array();
            for (var i = 0; i < byteString.length; i++) {
                content[i] = byteString.charCodeAt(i)
            }

            try {
                return new Blob([new Uint8Array(content)], {
                    type: mimestring
                });
            } catch (e) {
                return null;
            }
        },
        dataURLCompress: function (dataUrl, opt) {
            if (!opt) opt = {
                dataType: 'image/jpeg'
            };
            else if (!opt.dataType) opt.dataType = 'image/jpeg';
            var d = $q.defer();
            var img = new Image();
            img.onload = function () {
                var cvs = document.createElement('canvas');
                if (!cvs.getContext || 0 == img.width || 0 == img.height) {
                    d.resolve(dataUrl);
                    return;
                }
                cvs.width = img.width;
                cvs.height = img.height;
                if (opt.maxWidth && cvs.width > opt.maxWidth) {
                    cvs.width = opt.maxWidth;
                    cvs.height = cvs.width * img.height / img.width;
                }
                if (opt.maxHeight && cvs.height > opt.maxHeight) {
                    cvs.height = opt.maxHeight;
                    cvs.width = cvs.height * img.width / img.height;
                }
                var ctx = cvs.getContext('2d');
                ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
                d.resolve(cvs.toDataURL(opt.dataType));
            }
            img.src = dataUrl;
            return d.promise;
        },
        imgCompress: function (img, opt) {
            if (!opt) opt = {
                dataType: 'image/jpeg'
            };
            else if (!opt.dataType) opt.dataType = 'image/jpeg';
            var cvs = document.createElement('canvas');
            if (!cvs.getContext || 0 == img.width || 0 == img.height) {
                return img.src;
            }
            cvs.width = img.width;
            cvs.height = img.height;
            if (opt.maxWidth && cvs.width > opt.maxWidth) {
                cvs.width = opt.maxWidth;
                cvs.height = cvs.width * img.height / img.width;
            }
            if (opt.maxHeight && cvs.height > opt.maxHeight) {
                cvs.height = opt.maxHeight;
                cvs.width = cvs.height * img.width / img.height;
            }
            var ctx = cvs.getContext('2d');
            ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
            return cvs.toDataURL(opt.dataType)
        },
        getImgFromDataUrl: function (dataUrl) {
            var d = $q.defer();
            var img = new Image();
            img.onload = function () {
                d.resolve(img);
            }
            img.src = dataUrl;
            return d.promise;
        }
    };
}]);

app.directive('smartRows', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if ($(element).is('textarea')) {
                var minRows = Math.max(1, Number(attrs.smartRows));
                scope.$watch(function () {
                    if (!$(element).val()) return minRows;
                    return Math.max(minRows, $(element).val().split('\n').length + 1);
                }, function (newVal, oldVal) {
                    $(element).attr('rows', newVal);
                });
            }
        }
    };
}]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.directive('fileSelector', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                if (scope.$eval(attrs.fileSelDisable)) return;
                var fileInput = $('<input>', {
                    type: 'file'
                });
                fileInput.change(function () {
                    if (0 === fileInput[0].files.length) {
                        return;
                    }
                    scope.$apply(function () {
                        scope.$fileSel = fileInput[0].files[0];
                        scope.$eval(attrs.fileSelector);
                    });
                });
                fileInput.click();
            });
        }
    };
}]);

app.directive('datePicker', ['$parse', function ($parse) {
    var dateFormat = "YYYY-MM-DD";
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var useTimestamp = !(undefined === attrs.timestamp);
            var model = $parse(attrs.datePicker);
            var assignModel = function (v) {
                if (useTimestamp)
                    model.assign(scope, moment(v).valueOf());
                else
                    model.assign(scope, moment(v));
            }
            if (undefined === model(scope))
                assignModel(moment().startOf('day'));
            element.val(moment(model(scope)).format(dateFormat));
            element.daterangepicker({
                    locale: {
                        format: dateFormat
                    },
                    autoClose: true,
                    singleDatePicker: true,
                    showShortcuts: false,
                    startDate: moment(model(scope)),
                    autoUpdateInput: false
                },
                function (start, end, label) {
                    scope.$apply(function () {
                        assignModel(start);
                    })
                }
            );
            scope.$watch(function () {
                return element.val();
            }, function (v) {
                var d = new moment(v, dateFormat).startOf('day');
                if (d.isValid()) {
                    assignModel(d);
                    var drp = element.data('daterangepicker');
                    drp.startDate = d;
                    drp.endDate = d;
                    drp.oldStartDate = d;
                    drp.oldEndDate = d;
                }
            });
            scope.$watch(function () {
                return model(scope);
            }, function (v) {
                element.val(moment(v).format(dateFormat));
            });
        }
    }
}])
    .directive('uiSref', ['dataService', function (dataService) {
        var getRegex = function (ctrl) {
            if (!ctrl.regex) ctrl.regex = new RegExp('^#' + ctrl.url + '($|\\?)', 'i');
            return ctrl.regex;
        };
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var unwatch = scope.$watch(function () {
                    return element.attr('href');
                }, function (v) {
                    if (!v) return;
                    // console.log('uiSref-href: ' + v);
                    var ok = false;
                    for (i in dataService.getData().accessCtrls) {
                        var ctrl = dataService.getData().accessCtrls[i];
                        if (getRegex(ctrl).test(v)) {
                            if (0 == ctrl.readAccess) continue;
                            else if (2 == ctrl.readAccess) ok = true;
                            break;
                        }
                    }
                    if (!ok) {
                        element.remove();
                    }
                    unwatch();
                });
            }
        }
    }])
    .directive('akBtn', ['$state', 'dataService', function ($state, dataService) {
        var getRegex = function (ctrl) {
            if (!ctrl.btnRegex) ctrl.btnRegex = new RegExp('^' + ctrl.url + '($|\\?)', 'i');
            return ctrl.btnRegex;
        };
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var v = $state.$current.url.prefix + ':' + attrs.akBtn;
                var ok = false;
                for (i in dataService.getData().accessCtrls) {
                    var ctrl = dataService.getData().accessCtrls[i];
                    if (getRegex(ctrl).test(v)) {
                        if (0 == ctrl.readAccess) continue;
                        else if (2 == ctrl.readAccess) ok = true;
                        break;
                    }
                }
                if (!ok) {
                    element.remove();
                }
            }
        }
    }])
    .directive('siteHeader', function () {
        return {
            restrict: 'E',
            template: '<button class="btn">{{back}}</button>',
            scope: {
                back: '@back'
            },
            link: function (scope, element, attrs) {
                $(element[0]).on('click', function () {
                    history.back();
                    scope.$apply();
                });
                $(element[1]).on('click', function () {
                    history.forward();
                    scope.$apply();
                });
            }
        };
    })

    .service('cfmWinSvc', ['$modal', function ($modal) {
        return {
            show: function (message, opt) {
                var modalInstance = $modal.open({
                    templateUrl: 'template/cfmWin.html',
                    controller: 'cfmWinCtrl',
                    size: 'sm',
                    resolve: {
                        message: function () {
                            return message;
                        },
                        opt: function () {
                            return opt;
                        }
                    }
                });
                return modalInstance.result;
            }
        };
    }])
    .controller('cfmWinCtrl', ['$scope', '$modalInstance', 'message', 'opt', function ($scope, $modalInstance, message, opt) {
        $scope.message = message;
        if (undefined !== opt) {
            $scope.noOK = opt.noOK;
            $scope.noCancel = opt.noCancel;
        }
        $scope.ok = function () {
            $modalInstance.close();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }])

    .directive('clickAnyWhereButHere', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(document).click(function (e) {
                    var target = $(e.target);
                    if (target.closest(element).length)
                        return;
                    scope.$apply(function () {
                        scope.$eval(attrs.clickAnyWhereButHere);
                    })
                })
            }
        }
    }])

    .directive('akDropDown', ['$parse', function ($parse) {
        // select As label default def for value in (array | obj)
        var regex = /^\s*(\S+)\s+as\s+(\S+)\s+default\s+(\S+)\s+for\s+(\S+)\s+in\s+(\S+)$/i;
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.addClass('dropdown');
                var btn = $('<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">');
                var choose = $('<span style="margin-right: 5px;">');
                var caret = $('<span class="caret">')
                btn.append(choose);
                btn.append(caret);
                element.append(btn);
                var ul = $('<ul class="dropdown-menu">');
                element.append(ul);

                if (!attrs.akDropDown) return;
                var match = attrs.akDropDown.match(regex);
                if (!match) return;
                var selectFn = $parse(match[1]);
                var labelFn = $parse(match[2]);
                var defLabelFn = $parse(match[3]);
                var valueName = match[4];
                var valuesFn = $parse(match[5]);
                var model = attrs.ngModel ? $parse(attrs.ngModel) : null;
                var disabledFn = attrs.ngDisabled ? $parse(attrs.ngDisabled) : function () {
                    return false
                };

                var locals = {};
                var getLocals = function (v) {
                    locals[valueName] = v;
                    return locals;
                }

                var updateOptions = function () {
                    var defLabel = defLabelFn(scope);
                    var defSelect;
                    element.find('ul li').remove();
                    var values = valuesFn(scope);
                    var matched = false;
                    for (k in values) {
                        var v = values[k];
                        var locals = getLocals(v);
                        var select = selectFn(scope, locals);
                        var label = labelFn(scope, locals);
                        if (label == defLabel)
                            defSelect = select;
                        var li = $('<li style="cursor: pointer">' + label + '</li>');
                        li.data('_select', select);
                        li.click(function () {
                            var me = $(this);
                            if (element.data('_select') == me.data('_select')) {
                                return;
                            }
                            choose.text(me.text());
                            element.data('_select', me.data('_select'));
                            if (model) model.assign(scope, me.data('_select'));
                            if (attrs.ngChange) {
                                scope.$apply(function () {
                                    scope.$eval(attrs.ngChange);
                                })
                            }
                            ;
                        })
                        if (model && model(scope) == select) {
                            choose.text(label);
                            element.data('_select', select);
                            matched = true;
                        }
                        ul.append(li);
                    }
                    if (!matched) {
                        choose.text(defLabel);
                        element.data('_select', defSelect);
                        if (model && undefined !== defSelect) model.assign(scope, defSelect);
                    }
                }

                scope.$watch(function () {
                    return disabledFn(scope);
                }, function (v) {
                    if (v) btn.addClass('disabled');
                    else btn.removeClass('disabled');
                });
                scope.$watchCollection(function () {
                    return [model(scope)].concat(valuesFn(scope));
                }, function () {
                    updateOptions();
                });
            }
        }
    }]);

app.filter('currencyFormat', function () {
    return function (amount, countryCode, hideUnit) {
        if (amount == undefined)
            return '';
        var str = amount + "";
        if (typeof amount == 'number' && str.indexOf('.') > -1) {
            var decimal = (amount - parseInt(amount)).toFixed(2);
        }
        str = parseInt(amount) + "";
        var out = [];
        if (str.length > 0) {
            for (var i = str.length - 3; i > 0; i -= 3) {
                out.unshift(str.substr(i, 3));
            }
            out.unshift(str.substr(0, 3 + i));
        }
        if (countryCode === "ID") {
            out = out.join('.');
            if (!hideUnit)
                out = 'Rp' + out;
        } else {
            out = out.join(',');
            if (countryCode === "MY") {
                if (!hideUnit)
                    out = 'RM' + out;
            } else {
                if (!hideUnit)
                    out = '₱' + out;
            }
        }
        if (decimal) return out + decimal.substr(1);
        return out;
    };
});

app.directive('l1Nav', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch(function () {
                return elem.find('[ui-sref]').length;
            }, function (v) {
                if (0 == v)
                    elem.hide();
                else
                    elem.show();
            })
        }
    }
}]);

app.directive('loading', ['$http', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            scope.isLoading = function () {
                var requests = $http.pendingRequests;
                if (requests.length == 0)
                    return false;
                var postRequestCnt = 0;
                for (var index in requests) {
                    if (requests[index].method === "POST" || requests[index].method === "PUT" || requests[index].method === "DELETE") {
                        postRequestCnt++
                    }
                }
                return postRequestCnt > 0;
            };

            scope.$watch(scope.isLoading, function (v) {
                if (v) {
                    scope.spinner = {active: true};
                } else {
                    scope.spinner = {active: false};
                }
            });
        }
    };
}]);

app.factory('ngDialogBox', ['ngDialog', function (ngDialog) {
    function show(msg, preCloseCallback) {
        return ngDialog.openConfirm({
            template: 'template/prompt.html',
            controller: 'promptCtrl',
            className: 'ngdialog-theme-plain ngdialog-theme-custom',
            preCloseCallback: preCloseCallback,
            resolve: {
                notice: function () {
                    return msg;
                }
            }
        });
    }

    return {show: show};
}]);