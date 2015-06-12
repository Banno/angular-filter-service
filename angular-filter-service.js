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

	function searchWithParameters(searchParams, callback) {
		searchParameters = {
			searchField: angular.copy(searchParams.searchField),
			limit: angular.copy(searchParams.limit),
			offset: angular.copy(searchParams.offset),
			sortField: angular.copy(searchParams.sortField),
			sortAscending: angular.copy(searchParams.sortAscending),
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

	function executeSearch() {
		if (searchParameters && searchParameters.callback) {
			searchResults = {
				total: 0,
				items: []
			};
			searchParameters.callback();
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
		use: searchWithParameters,
		refresh: executeSearch,
		showPreviousPage: showPreviousPage,
		showNextPage: showNextPage,
		setSortField: setSortField,
		setSortAscending: setSortAscending,
		setSearchField: setSearchType,
		setSearchQuery: setSearchInput,
		setPageLimit: changePageLimit,
		setResults: setSearchResults,
		getState: getSortPageSearchState
	};
});
