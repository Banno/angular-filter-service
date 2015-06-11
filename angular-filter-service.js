angular.module('banno.filterService', []).factory('filterService', function filterService() {
	'use strict';

	var searchParameters = {
		limit: 20,
		offset: 0,
		input: ''
	};

	var searchResults = {
		total: 0,
		items: []
	};

	function getSearchParameters() {
		return angular.copy(searchParameters);
	}

	function searchWithParameters(searchParams, triggerSearchCallback) {
		searchParameters = {
			type: angular.copy(searchParams.type),
			limit: angular.copy(searchParams.limit),
			offset: angular.copy(searchParams.offset),
			sortField: angular.copy(searchParams.sortField),
			sortAscending: angular.copy(searchParams.sortAscending),
			input: angular.copy(searchParams.input),
			triggerSearchCallback: triggerSearchCallback,
			triggerSearchCallBack: function() {
				console.warn('triggerSearchCallBack has been deprecated. Please use triggerSearchCallback instead.');
				return triggerSearchCallback();
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
			searchParameters.type = type;
			if (forceUpdate) {
				searchParameters.offset = 0;
				executeSearch();
			}
		}
	}

	function setSearchInput(input) {
		if (searchParameters) {
			searchParameters.offset = 0;
			searchParameters.input = input;
			executeSearch();
		}
	}

	function executeSearch() {
		if (searchParameters && searchParameters.triggerSearchCallback) {
			searchResults = {
				total: 0,
				items: []
			};
			searchParameters.triggerSearchCallback();
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
			disableNextPage: isLastPageSearch(),
			disablePreviousPage: isFirstPageSearch(),
			searchResultsCount: numberOfSearchResults(),
			pageBeginCount: pageBeginTotal(),
			pageEndCount: pageEndTotal(),
			searchResults: searchResults,
			showNoItemsFeedback: showNoItemsFeedback(),
			showNoAssetsFeedback: function() {
				console.warn('showNoAssetsFeedback() has been deprecated. Please use showNoItemsFeedback() instead.');
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
		getSearchParameters: getSearchParameters,
		searchWithParameters: searchWithParameters,
		executeSearch: executeSearch,
		showPreviousPage: showPreviousPage,
		showNextPage: showNextPage,
		setSortField: setSortField,
		setSortAscending: setSortAscending,
		setSearchType: setSearchType,
		setSearchInput: setSearchInput,
		changePageLimit: changePageLimit,
		setSearchResults: setSearchResults,
		getSortPageSearchState: getSortPageSearchState
	};
});
