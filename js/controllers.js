angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('PlaylistsCtrl', function ($scope) {
        $scope.playlists = [
            { title: 'Reggae', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 }
        ];
    })

    .controller('PlaylistCtrl', function ($scope, $stateParams) {
    })

    .controller('TasksCtrl', ['$scope', 'KanbaneryDataAcess', '$q', '$ionicLoading',
        function ($scope, KanbaneryDataAcess, $q, $ionicLoading) {

            $scope.list = {
                "showDelete":false
            }

//        $scope.name = KanbaneryDataAcess.getArchivedTasks();

            $scope.tasks;


            $ionicLoading.show({
                template: 'Loading Archived Tasks...'
            });

            KanbaneryDataAcess.getArchivedTasks().then(
                function (response) {

                    response.data = _.without(response.data, response.data[0]);
                    $scope.tasks = response.data;

                    $ionicLoading.hide();

                }, function (error) {
                    $scope.tasks = error;
                    $ionicLoading.hide();

                }, function () {

                });

            $scope.deleteTasks = function () {

                if ($scope.tasks) {

                    $ionicLoading.show({
                        template: 'Deleting Archived Tasks...'
                    });

//                KanbaneryDataAcess.f1($scope.tasks)
                    KanbaneryDataAcess.deleteArchivedTasks($scope.tasks)
                        .then(
                        function (message) {
                            $ionicLoading.hide();
//                        alert(message);
                            alert("DELETED!!");
                        },
                        function () {
                            $ionicLoading.hide();
                        },
                        function (message) {
                            $ionicLoading.show({
                                template: message
                            });
                        }
                    );


                }
                else {

                    alert("NOTHING TO DELETE!!");

                }
            }

            $scope.deleteTask = function(task){

                $ionicLoading.show({
                    template: 'Deleting task ' + task.id
                });

                KanbaneryDataAcess.deleteTask(task).then(
                    function (response) {
                        console.log("DELETE TASK SUCCESS RESPONSE", response); // todo: delete me
                        $scope.tasks = _.without($scope.tasks, task);
                        $ionicLoading.hide();

                    },
                    function(error){

                        console.log("DELETE TASK ERROR RESPONSE", error); // todo: delete me
                        $ionicLoading.hide();

                    }
                );

            }

        }])
;
