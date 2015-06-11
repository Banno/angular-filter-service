# angular-filter-service

Provides a simple utility to help with filtering, sorting, and pagination capabilities. Potentially useful for tables, lists, and grids.

This service adds an abstraction layer slightly above [Angular's filters](https://docs.angularjs.org/api/ng/filter), but below a full-blown directive/component.

## Usage

```javascript
angular.module('myApp', ['banno.filterService'])
.controller('myController', function($scope, filterService) {
  function completed(response) {
    $scope.filtered = response;
  }

  function searchItems() {
    $scope.filters = filterService.getSearchParameters();
    myService.get({
      limit: $scope.filters.limit,
      offset: $scope.filters.offset,
      sortField: $scope.filters.sortField,
      sortDirection: $scope.filters.sortAscending ? 'asc' : 'desc'
    }).then(function(results) {
      filterService.setSearchResults(results, completed);
    }, function() {
      filterService.setSearchResults({
        items: [],
        total: 0
      }, completed);
    });
  }

  $scope.onPreviousClick = function() {
    filterService.showPreviousPage();
  };

  $scope.onNextClick = function() {
    filterService.showNextPage();
  };

  $scope.onSortFieldClick = function(sortField) {
    filterService.setSortField(sortField);
  };

  $scope.onSortDirectionClick = function(direction) {
    filterService.setSortAscending(direction.toLowerCase() === 'asc');
  };

  $scope.onSubmitSearch = function(input) {
    filterService.setSearchInput(input);
  };

  $scope.onSetSearchTypeClick = function(type, forceUpdate) {
    filterService.setSearchType(type, forceUpdate);
  };

  $scope.onClearSearchClick = function() {
    filterService.setSearchInput('');
  };

  $scope.refresh = function() {
    filterService.searchWithParameters($scope.filters, searchItems);
    $scope.filtered = filterService.getSortPageSearchState();
  };

  $scope.filters = {
    type: 'Title',
    limit: 20,
    offset: 0,
    sortField: 'createdOn',
    sortAscending: false,
    input: ''
  };
  $scope.refresh();
});
```

## Installation

```shell
bower install --save angular-filter-service
```

If you are using RequireJS, load the "banno/filterService" module.

## API

### changePageLimit(newLimit)

Changes the limit parameter (number of results per page).

Also resets the offset parameter to 0 and performs the search.

### executeSearch()

Performs the search, i.e. runs the function argument passed to `searchWithParameters()`.

### getSearchParameters()

Returns the search parameters as an object with the following properties:

* `type`
* `limit`
* `offset`
* `sortField`
* `sortAscending`
* `input`

### getSortPageSearchState()

Returns an object that contains information about the search state:

* `disableNextPage` -- `true` if the current results are the last page (given the offset & limit)
* `disablePreviousPage` -- `true` if the current results are the first page (given the offset)
* `searchResultsCount` -- The number of results
* `pageBeginCount` -- Index of the first item in the results (beginning with 1)
* `pageEndCount` -- Index of the last item in the results (beginning with 1)
* `searchResults` -- An object containing the results of the search:
  * `total` -- Number of results
  * `items` -- Array of results
* `showNoItemsFeedback` -- `true` if the results are empty
* `showNoAssetsFeedback` -- *deprecated* Same as showNoItemsFeedback

### searchWithParameters(searchParams, searchFunction)

Sets the parameters for the search, and performs the search.

The `searchParams` argument should be an object the same properties as `getSearchParameters()`. The second argument (`searchFunction`) is called every time that `executeSearch()` is called.

### setSearchInput(string)

Changes the text parameter.

Also resets the offset parameter to 0 and performs the search.

### setSearchResults(results, callback)

Saves the results into the search state. The `results` object should contain `total` and `items` properties.

The `callback` function is then called, with the search state passed as an argument.

### setSearchType(string, forceUpdate)

Changes the type parameter.

If `forceUpdate` is truthy, it also resets the offset parameter to 0 and performs the search.

### setSortAscending(bool)

Changes the ascending/descending order for sorting. A `true` value indicates that the results should be sorted in ascending order; otherwise the results should be sorted in descending order.

Also resets the offset parameter to 0 and performs the search.

### setSortField(field)

Changes the field for sorting.

Also resets the offset parameter to 0 and performs the search.

### showNextPage()

Moves the offset forward (based on the limit) and performs the search.

### showPreviousPage()

Moves the offset backward (based on the limit) and performs the search.

## Contributing

You'll need [gulp](http://gulpjs.com/) installed on your machine to run the development tools. Then run `gulp` to run all of the tasks and watch the files for changes.

Please add tests and maintain the existing styling when adding and updating the code.

## Bugs & Feature Requests

Have an issue or feature request? Please [open a new issue](https://github.com/Banno/angular-filter-service/issues/new).

## License

Copyright 2015 [Jack Henry & Associates Inc](https://www.jackhenry.com/).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
