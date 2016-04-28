// List Page Controller
app.controller('listCtrl', function($scope, $routeParams, $http) {
  // Page Details
  $scope.name = 'listCtrl';
  $scope.params = $routeParams;
  $scope.groceryList = {};
  $scope.data = [4, 8, 16, 24, 32, 40];

  // Pagination
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.entries = [];
  $scope.numPages = function() {
    return Math.ceil($scope.entries.length / $scope.pageSize);
  }
  
  // Search Food
  $scope.getFood = function() {
    $scope.entries.length = 0;
    var food = $scope.query.text;
    var tmp = []

    // Add Items
  	$http.get('/api/get_food/' + food).then(function(response) {
      for(var food in response.data) {
        $scope.entries.push({ 
          food : food,
          id: response.data[food],
          nutrition: {},
          added: null
        });
      }

      // Add Nutrition Information
      /*tmp.forEach(function(entry) {
        $http.get('/api/get_nutrition/' + response.data[food]).then(function(nutrition) {
          entry.nutrition['Energy'] = parseInt(nutrition.data['Energy']);
          entry.nutrition['Fat'] = parseInt(nutrition.data['Total lipid (fat)']);
          entry.nutrition['Carbohydrates'] = parseInt(nutrition.data['Carbohydrate, by difference']);
          entry.nutrition['Sugar'] = parseInt(nutrition.data['Sugars, total']);
          entry.nutrition['Fiber'] = parseInt(nutrition.data['Fiber, total dietary']);
        });
      });*/
    }, function(response) {
      console.log(response);
    });

    
  };

  // Add Food
  $scope.toggleFood = function(entry) {
    // If Added
    if(entry.added) {
      entry.added = false;
      delete $scope.groceryList[entry.id];
      return;
    }

    // If Never Added
    if(entry.added == null) {
      $http.get('/api/get_nutrition/' + entry.id).then(function(nutrition) {
        entry.nutrition['Energy'] = parseInt(nutrition.data['Energy']);
        entry.nutrition['Fat'] = parseInt(nutrition.data['Total lipid (fat)']);
        entry.nutrition['Carbohydrates'] = parseInt(nutrition.data['Carbohydrate, by difference']);
        entry.nutrition['Sugar'] = parseInt(nutrition.data['Sugars, total']);
        entry.nutrition['Fiber'] = parseInt(nutrition.data['Fiber, total dietary']);
        entry.added = true;
        $scope.groceryList[entry.id] = entry;
        return;
      });
    }

    // If Removed
    if(!entry.added) {
      entry.added = true;
      $scope.groceryList[entry.id] = entry;
      return;
    }
  }

  // Sum Nutrition
  $scope.sumNutrition = function(category) {
    var total = 0;
    for(var entry in $scope.groceryList) {
      total += $scope.groceryList[entry].nutrition[category];
    }
    return total;
  }

  //Scale Widths
  /*var x = d3.scale.linear().domain([0, d3.max($scope.data)]).range([0, 400]);

  // Append Chart Bars
  d3.select('.chart').selectAll('div')
      .data($scope.data).enter().append('div')
      .style("width", function(d) { return x(d) + 'px'; })
      .text(function(d) { return d; });*/
});
