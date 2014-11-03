angular.module('ng.kanbanery.config', [])

    .value('kanbaneryConfig', {
        "apiToken": '',
        "apiEndpoint": 'https://aomikefurr.kanbanery.com/api/v1'
    })
    .config(function ($provide, $httpProvider) {

        // Intercept http calls.
        $provide.factory('kanbaneryInterceptor', ['$q', 'kanbaneryConfig', function ($q, kanbaneryConfig) {
            return {
                // On request success
                request: function (config) {

                    // Add the Contentful API token to the header.
                    config.headers['X-Kanbanery-ApiToken'] = kanbaneryConfig.apiToken;

                    // Return the config or wrap it in a promise if blank.
                    return config || $q.when(config);

                },

                // On request failure
                requestError: function (rejection) {
                    // console.log(rejection); // Contains the data about the error on the request.

                    // Return the promise rejection.
                    return $q.reject(rejection);
                },

                // On response success
                response: function (response) {
                    // console.log(response); // Contains the data from the response.

                    // Return the response or promise.
                    return response || $q.when(response);
                },

                // On response failture
                responseError: function (rejection) {
                    // console.log(rejection); // Contains the data about the error.

                    // Return the promise rejection.
                    return $q.reject(rejection);
                }
            };
        }]);

        // Add the interceptor to the $httpProvider.
        $httpProvider.interceptors.push('kanbaneryInterceptor');

    })
;

angular.module('ng.kanbanery', ['ng.kanbanery.config'])
    .factory('KanbaneryDataAcess', ['$timeout','$http', '$q', 'kanbaneryConfig', function ($timeout, $http, $q, kanbaneryConfig) {
        return{
            "name": 'KanbaneryDataAcess',
            "getArchivedTasks": getTasks,
            "deleteArchivedTasks": deleteTasksAsync,
            "deleteTask":deleteTask,
            "f1":f1
        };

        function f1(counter) {

            if (!counter) {
                counter = 0;
            }

            counter++;
            console.log(counter);

            return asyncFunc(counter).then(function() {
                if (counter < 10) {
                    return f1(counter);
                } else {
                    return;
                }
            });

        }

        function asyncFunc(counter) {
            var deferred = $q.defer();


            $timeout(function() {

                deferred.notify("Notify called for " + counter);

                deferred.resolve(counter);

            }, 100);

            return deferred.promise;
        }

        function getTasks() {

            var archivedTasksUrl = kanbaneryConfig.apiEndpoint + "/projects/6365/archive/tasks.json";
//            var archivedTasksUrl = "http://localhost:63342/task-manager/task-app/www/data/tasks-archived.json";

//            return archivedTasksUrl;

            // returns a promise.
            return getData(archivedTasksUrl);

        }

        function deleteTasksAsync(tasks) {

            var deferred = $q.defer();

            try {
                deleteTasks(tasks);
            } catch (e) {

            } finally {
                deferred.resolve("deleteTasksAsync COMPLETE");
            }


            return deferred.promise;

        }

        function deleteTasks(tasks) {

            console.log("TASKS TO DELETE", tasks.length); // todo: delete me

//            _.forEach(tasks, function(task){
//                console.log(task.id); // todo: delete me

            var taskToDelete = tasks[0];

            console.log("TASK TO DELETE:", taskToDelete); // todo: delete me

            var remainingTasks = _.without(tasks, taskToDelete);

            console.log("REMAINING TASKS:", remainingTasks.length); // todo: delete me

            // process the task to delete
//            deferred.notify("Deleting task ", taskToDelete.id);
            asyncFunc(taskToDelete.id).then(
                function(response){

                    if(remainingTasks.length > 0){
                        return deleteTasks(remainingTasks);
                    }
                    else{
                        // return or resolve?
                        return;
                    }

                },
                function(error){}
            );

//            });

        }



        function deleteTask(task) {

            var deferred = $q.defer();

            var deleteTaskUrl = kanbaneryConfig.apiEndpoint + "/tasks/" + task.id + ".json";

//            return deleteData(deleteTaskUrl);

            // Make the API call
            deleteData(deleteTaskUrl).then(
                function (response) {

                    deferred.resolve(response);

                },
                function(error){

                    deferred.reject(error);

                }
            );

            return deferred.promise;
        }

        function getData(url, params) {
            return $http({
                method: 'GET',
                url: url,
                params: params
            });
        }

        function deleteData(url) {
            return $http({
                method: 'DELETE',
                url: url
            });
        }

    }])
;