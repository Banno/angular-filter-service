/*!
 * angular-filter-service v1.0.3
 * https://github.com/Banno/angular-filter-service
 * (c) 2015 Jack Henry & Associates Inc
 * License: Apache-2.0
 */
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['angular'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('angular'));
  } else {
    root.banno = root.banno || {}; root.banno.filterService = factory(root.angular);
  }
}(this, function(angular) {
angular.module('banno.filterService', []).factory('filterService', function filterService() {
	'use strict';

	var searchParameters = {
		limit: 20,
		offset: 0,
		searchQuery: ''
	};

	var searchResults = {
		total: 0,
		items: []
	};

	function getSearchParameters() {
		return angular.copy(searchParameters);
	}

	function executeSearch() {
		if (searchParameters && searchParameters.callback) {
			searchResults = {
				total: 0,
				items: []
			};
			searchParameters.callback();
		}
	}

	function searchWithParameters(searchParams, callback) {
		searchParameters = {
			limit: angular.copy(searchParams.limit),
			offset: angular.copy(searchParams.offset),
			sortAscending: angular.copy(searchParams.sortAscending),
			sortField: angular.copy(searchParams.sortField),
			searchField: angular.copy(searchParams.searchField),
			searchQuery: angular.copy(searchParams.searchQuery),
			callback: callback,
			triggerSearchCallBack: function() {
				console.warn('triggerSearchCallBack has been deprecated. Please use the "callback" property instead.');
				return callback();
			}
		};
		executeSearch();
	}

	function changePageLimit(limit) {
		if (searchParameters) {
			searchParameters.offset = 0;
			searchParameters.limit = limit;
			executeSearch();
		}
	}

	function showPreviousPage() {
		if (searchParameters) {
			searchParameters.offset -= searchParameters.limit;
			executeSearch();
		}
	}

	function showNextPage() {
		if (searchParameters) {
			searchParameters.offset += searchParameters.limit;
			executeSearch();
		}
	}

	function setSortField(field) {
		if (searchParameters) {
			searchParameters.offset = 0;
			searchParameters.sortField = field;
			executeSearch();
		}
	}

	function setSortAscending(ascending) {
		if (searchParameters) {
			searchParameters.offset = 0;
			searchParameters.sortAscending = ascending;
			executeSearch();
		}
	}

	function setSearchType(type, forceUpdate) {
		if (searchParameters) {
			searchParameters.searchField = type;
			if (forceUpdate) {
				searchParameters.offset = 0;
				executeSearch();
			}
		}
	}

	function setSearchInput(input) {
		if (searchParameters) {
			searchParameters.offset = 0;
			searchParameters.searchQuery = input;
			executeSearch();
		}
	}

	function numberOfSearchResults() {
		return searchResults && searchResults.items ? searchResults.items.length : 0;
	}

	function isFirstPageSearch() {
		return searchParameters.offset === 0;
	}

	function isLastPageSearch() {
		return searchParameters && searchResults && searchResults.total <= searchParameters.offset + searchParameters.limit;
	}

	function pageBeginTotal() {
		return searchResults.total === 0 ? 0 : searchParameters.offset + 1;
	}

	function pageEndTotal() {
		if (isLastPageSearch()) {
			return searchResults.total;
		} else {
			return searchParameters.offset + searchParameters.limit;
		}
	}

	function showNoItemsFeedback() {
		return !searchResults.items || searchResults.items.length === 0;
	}

	function getSortPageSearchState() {
		return {
			isLastPage: isLastPageSearch(),
			isFirstPage: isFirstPageSearch(),
			count: numberOfSearchResults(),
			firstIndex: pageBeginTotal(),
			lastIndex: pageEndTotal(),
			results: searchResults,
			empty: showNoItemsFeedback(),
			showNoAssetsFeedback: function() {
				console.warn('showNoAssetsFeedback() has been deprecated. Please use the "empty" property instead.');
				return showNoItemsFeedback();
			}
		};
	}

	function setSearchResults(results, sortPageSearchCompleteCallback) {
		searchResults = {
			total: results.total,
			items: results.items
		};
		sortPageSearchCompleteCallback(getSortPageSearchState());
	}

	return {
		getParameters: getSearchParameters,
		getState: getSortPageSearchState,
		refresh: executeSearch,
		setPageLimit: changePageLimit,
		setResults: setSearchResults,
		setSearchField: setSearchType,
		setSearchQuery: setSearchInput,
		setSortAscending: setSortAscending,
		setSortField: setSortField,
		showPreviousPage: showPreviousPage,
		showNextPage: showNextPage,
		use: searchWithParameters
	};
});

return "banno.filterService";
}));
