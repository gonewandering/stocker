'use strict';

/* Controllers */

angular.module('app.controllers', []).
  controller('Summary', ['$scope', '$http', function($scope, $http) {
  
  	  $scope.dates = {
	  	  start: "2012-07-01",
	  	  end: "2013-07-01"
  	  };
  	  
  	  $scope.loading = true;
  	  
  	  $scope.ticker = "BND";
  	  
  	  $scope.outcomes = function () { 
	  	  return [
	  	  	{ color: "#006699", label: "Stock Portfolio", value: sym.chart.datasets[1].data.pop() },
	  	  	{ color: "#006699", label: "Stock Portfolio", value: sym.chart.datasets[1].data.pop() },
	  	  	{ color: "#006699", label: "Stock Portfolio", value: sym.chart.datasets[1].data.pop() },
	  	  	{ color: "#006699", label: "Stock Portfolio", value: sym.chart.datasets[1].data.pop() },
	  	  ]
  	  }
  	  
  	  $scope.quotes = [];
  	  
  	  $scope.outcomes = function () { 
	  	 return {
	  	 	items: $scope.syms[0].chart.datasets,
	  	 	last: function (arr) { 
		  	 	return arr.data[arr.data.length - 1];
	  	 	}
	  	 }
	  	 
  	  }

  	  $scope.syms = [{
  	  		options: {
				  animation:false,
				  pointDot : false
  	  		},
	        initial: 1000,
	        bank: 1000,
	        fee: .5,
	        buy: "x(0) > x(1)*1.001",
	        sell: "x(0) < x(1)*.999",
			chart: {
		        labels : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
		        datasets : [
		            {
		            	/* Initial Value */
		            	label: "Initial Investment",
		                fillColor : "rgba(255,255,255,0)",
		                strokeColor : "#CCC",
		                pointColor : "rgba(151,187,205,0)",
		                pointStrokeColor : "rgba(151,187,205,0)",
		                data : [4, 3, 5, 4, 6]
		            },
		            {
		            	/* Stock price */
		            	label: "Stock Portfolio",
		                fillColor : "rgba(255,0,0,.3)",
		                strokeColor : "rgba(255,0,0,.3)",
		                pointColor : "rgba(151,187,205,0)",
		                pointStrokeColor : "rgba(151,187,205,0)",
		                data : [4, 3, 5, 4, 6]
		            },
		            {
		            	/* Adjusted portfolio */
		            	label: "Alg-traded Portfolio",
		                fillColor : "rgba(0,0,255, .3)",
		                strokeColor : "rgba(0,0,255, .3)",
		                pointColor : "rgba(151,187,205,0)",
		                pointStrokeColor : "rgba(151,187,205,0)",
		                data : [4, 3, 5, 4, 6]
		            },
		            {
		            	/* Buy/sell price diff */
		            	label: "Long/Short Portfolio",
		                fillColor : "rgba(151,187,205,0)",
		                strokeColor : "#62AD00",
		                pointColor : "rgba(151,187,205,0)",
		                pointStrokeColor : "rgba(151,187,205,0)",
		                data : [4, 3, 5, 4, 6]
		            }
		        ], 
		     }
        }];
        
      $scope.createSym = function () { 
	      $scope.syms.push({});
	      angular.copy($scope.syms[0], $scope.syms[$scope.syms.length-1]);
      }
      
      // Sym helpers
      
      $scope.x = function (n, x) { 
	  	  return $scope.quotes[n-x];    
      };
      
      $scope.symUpdate = function (sym) { 
      	$scope.loading = true;
      	var port = [];
      	var stat = [];
      	var adj = [];
      	var ls = [];
      	
      	var bank = 0;
      	
      	var total = ($scope.quotes[0] * sym.initial) + bank;
      	
      	var shares = sym.initial;
      	
	     for (var n in $scope.quotes) { 
		     
		     // Get value of overall portfolio
		     port.push($scope.quotes[n] * sym.initial);
			 stat.push(total);
			 
			 // Get adjusted values
			 var buy = eval(sym.buy.replace(/x\(/g, "$scope.x("+n+", "));
			 var sell = eval(sym.sell.replace(/x\(/g, "$scope.x("+n+", "));
			 
			 // Check whether to buy sell etc.
			 if (buy == true && bank > 0) { 
				 shares = shares + (bank / $scope.quotes[n]) - sym.fee;
				 bank = 0;
				 adj.push(bank + (shares * $scope.quotes[n]));
				 
			 } else if (sell == true && shares > 0) { 
				 bank = bank + (shares*$scope.quotes[n]) - sym.fee;
				 shares = 0;
				 adj.push(bank + (shares*$scope.quotes[n]));
				 
			 } else { 
				 adj.push(bank + (shares*$scope.quotes[n])); 
			 }
			 
			 var iv = $scope.quotes[0] * sym.initial;
			 var lng = (bank + (shares * $scope.quotes[n])) - iv;
			 var shrt = iv - ($scope.quotes[n] * sym.initial);
			 ls.push(iv + lng + shrt);
	     }
	     angular.copy(adj, sym.chart.datasets[2].data);    
	     angular.copy(port, sym.chart.datasets[1].data);
	     angular.copy(stat, sym.chart.datasets[0].data);
	     angular.copy(ls, sym.chart.datasets[3].data);
	     $scope.loading = false;
      }
  	  
  	  $scope.getData = function () { 
	  	  var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22'+$scope.ticker+'%22%20and%20startDate%20%3D%20%22'+$scope.dates.start+'%22%20and%20endDate%20%3D%20%22'+$scope.dates.end+'%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK';
	  	  
	  	  $scope.loading = true;
	  	  $http.jsonp(url).success(function (data) {
	  	  	var quo = data.query.results.quote;
	  	  	var labels = [];
	  	  	var close = [];
	  	  	for (var n in quo) { 
	  	  		if (n % 20) { 
		  	  		labels.push("");
		  	  	} else { labels.push(quo[n].date); }
		  	  	close.push(quo[n].Close);
	  	  	}
	  	  	
	  	  	angular.copy(labels.reverse(), $scope.labels);
		  	angular.copy(close.reverse(), $scope.quotes);
		  	  	
	  	  	for (var n in $scope.syms) { 
		  	  	angular.copy(labels.reverse(), $scope.syms[n].chart.labels);
		  	  	$scope.symUpdate($scope.syms[n]);
	  	  	}
	  	  	$scope.loading = false;
	  	  });
  	  }
  	  	 
     $scope.getData();
  }])
  
/*
function sym(config) { 
	this.config = config;
	
	this.update = function () { 

	}
	
	this.init();
}
*/