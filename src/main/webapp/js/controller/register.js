/**
 * Created by feel on 2016/12/21.
 */
angular.module('myApp').controller('registerCtrl', ['$scope', 'httpSvc' ,'$state' ,function ($scope,httpSvc,$state) {
        $scope.fullHeight = function () {
        $('.js-fullheight').css('height', $(window).height() - 49);
        $(window).resize(function () {
            $('.js-fullheight').css('height', $(window).height() - 49);
            })
        };

        $scope.fullHeight();

    $scope.btnCommit = function () {
        if(($scope.username).length >8||$scope.username.length<5){
           return alert("username is illegal");
        }
        if(($scope.password).length >8||$scope.password.length<5){
            return alert("password is illegal");
        }
        if(($scope.password)!==($scope.password1)){
            return alert("password must be same")
        }
        else{
            var param = {
                username:$scope.username,
                password:$scope.password,
                sex:$scope.sex,
                email:$scope.email,
                phoneNum:$scope.phoneNum,
                address:$scope.address,
            }
            httpSvc.post('/api/json/admin/RegisterServices.do',param).then(function (result) {
                if(result.success){
                    alert("success");
                    $state.go('index');
                }
            });
        }
    }

    $scope.toggleBtnColor = function () {
        if ($('#fh5co-hero').length > 0) {
            $('#fh5co-hero').waypoint(function (direction) {
                if (direction === 'down') {
                    $('.fh5co-nav-toggle').addClass('dark');
                }
            }, {offset: -$('#fh5co-hero').height()});

            $('#fh5co-hero').waypoint(function (direction) {
                if (direction === 'up') {
                    $('.fh5co-nav-toggle').removeClass('dark');
                }
            }, {
                offset: function () {
                    return -$(this.element).height() + 0;
                }
            });
        }
    };
}]);