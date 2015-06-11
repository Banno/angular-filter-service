define(['testModule'], function(data) {
	'use strict';

	describe('filterService', function() {

		var filterService, params, state;

		var executeCallback = jasmine.createSpy('executeCallback');

		var arbitraryParams = {
			type: 'abcdef',
			limit: 9999,
			offset: 9999,
			sortField: 'abcdef',
			sortAscending: 'abcdef',
			input: 'abcdef'
		};

		var setArbitraryParams = function() {
			filterService.searchWithParameters(arbitraryParams, null);
		};

		var retrieveParams = function() {
			params = filterService.getSearchParameters();
		};

		var retrieveState = function() {
			state = filterService.getSortPageSearchState();
		};

		var spyOnExecute = function() {
			var currentState = filterService.getSearchParameters();
			filterService.searchWithParameters(currentState, executeCallback);
			executeCallback.calls.reset();
		};

		beforeEach(module('banno.filterService'));

		beforeEach(inject(function(_filterService_) {
			filterService = _filterService_;
		}));

		beforeEach(function() {
			spyOn(filterService, 'executeSearch').and.callThrough();
		});

		describe('getSearchParameters()', function() {

			beforeEach(function() {
				filterService.searchWithParameters(arbitraryParams);
				retrieveParams();
			});

			it('should return the search parameters', function() {
				expect(params.type).toBe(arbitraryParams.type);
				expect(params.limit).toBe(arbitraryParams.limit);
				expect(params.offset).toBe(arbitraryParams.offset);
				expect(params.sortField).toBe(arbitraryParams.sortField);
				expect(params.sortAscending).toBe(arbitraryParams.sortAscending);
				expect(params.input).toBe(arbitraryParams.input);
			});

		});

		describe('searchWithParameters()', function() {

			var searchFunc = jasmine.createSpy('searchFunc');

			beforeEach(function() {
				filterService.searchWithParameters(arbitraryParams, searchFunc);
				retrieveParams();
			});

			it('should change the search parameters', function() {
				expect(params.type).toBe(arbitraryParams.type);
				expect(params.limit).toBe(arbitraryParams.limit);
				expect(params.offset).toBe(arbitraryParams.offset);
				expect(params.sortField).toBe(arbitraryParams.sortField);
				expect(params.sortAscending).toBe(arbitraryParams.sortAscending);
				expect(params.input).toBe(arbitraryParams.input);
			});

			it('should perform the search', function() {
				expect(searchFunc).toHaveBeenCalled();
			});

		});

		describe('executeSearch()', function() {

			var searchFunc = jasmine.createSpy('searchFunc');
			var results = {
				total: 42,
				items: [{ foo: 'bar' }]
			};

			beforeEach(function() {
				searchFunc.calls.reset();
				filterService.setSearchResults(results, angular.noop);
			});

			describe('when a search function exists', function() {

				beforeEach(function() {
					filterService.searchWithParameters(arbitraryParams, searchFunc);
					filterService.executeSearch();
					retrieveState();
				});

				it('should reset the results', function() {
					expect(state.searchResults.total).toBe(0);
					expect(state.searchResults.items).toEqual([]);
				});

				it('should call the search function', function() {
					expect(searchFunc).toHaveBeenCalled();
				});

			});

			describe('when a search function does NOT exist', function() {

				beforeEach(function() {
					filterService.searchWithParameters(arbitraryParams, null);
					filterService.executeSearch();
					retrieveState();
				});

				it('should NOT reset the results', function() {
					expect(state.searchResults.total).not.toBe(0);
					expect(state.searchResults.items).not.toEqual([]);
				});

				it('should NOT call the search function', function() {
					expect(searchFunc).not.toHaveBeenCalled();
				});

			});

		});

		describe('showPreviousPage()', function() {

			var limit = 20;
			var offset;

			beforeEach(function() {
				filterService.changePageLimit(limit);
				filterService.showNextPage();
				filterService.showNextPage();
				retrieveParams();
				offset = params.offset;

				spyOnExecute();
				filterService.showPreviousPage();
				retrieveParams();
			});

			it('should move the offset backward', function() {
				expect(params.offset).toBe(offset - limit);
			});

			it('should perform the search', function() {
				expect(executeCallback).toHaveBeenCalled();
			});

		});

		describe('showNextPage()', function() {

			var limit = 20;
			var offset;

			beforeEach(function() {
				filterService.changePageLimit(limit);
				retrieveParams();
				offset = params.offset;

				spyOnExecute();
				filterService.showNextPage();
				retrieveParams();
			});

			it('should move the offset forward', function() {
				expect(params.offset).toBe(offset + limit);
			});

			it('should perform the search', function() {
				expect(executeCallback).toHaveBeenCalled();
			});

		});

		describe('setSortField()', function() {

			var sortField = 'sort field';

			beforeEach(function() {
				setArbitraryParams();
				spyOnExecute();
				filterService.setSortField(sortField);
				retrieveParams();
			});

			it('should set params to the specified value', function() {
				expect(params.sortField).toBe(sortField);
			});

			it('should reset the offset', function() {
				expect(params.offset).toBe(0);
			});

			it('should perform the search', function() {
				expect(executeCallback).toHaveBeenCalled();
			});

		});

		describe('setSortAscending()', function() {

			var isAscending = true;

			beforeEach(function() {
				setArbitraryParams();
				spyOnExecute();
				filterService.setSortAscending(isAscending);
				retrieveParams();
			});

			it('should set params to the specified value', function() {
				expect(params.sortAscending).toBe(isAscending);
			});

			it('should reset the offset', function() {
				expect(params.offset).toBe(0);
			});

			it('should perform the search', function() {
				expect(executeCallback).toHaveBeenCalled();
			});

		});

		describe('setSearchType()', function() {

			var newType = 'type string';

			beforeEach(function() {
				setArbitraryParams();
				spyOnExecute();
			});

			describe('when forceUpdate is set', function() {

				beforeEach(function() {
					filterService.setSearchType(newType, true);
					retrieveParams();
				});

				it('should set params to the specified string', function() {
					expect(params.type).toBe(newType);
				});

				it('should reset the offset', function() {
					expect(params.offset).toBe(0);
				});

				it('should perform the search', function() {
					expect(executeCallback).toHaveBeenCalled();
				});

			});

			describe('when forceUpdate is NOT set', function() {

				beforeEach(function() {
					filterService.setSearchType(newType);
					retrieveParams();
				});

				it('should set params to the specified string', function() {
					expect(params.type).toBe(newType);
				});

				it('should NOT reset the offset', function() {
					expect(params.offset).not.toBe(0);
				});

				it('should NOT perform the search', function() {
					expect(executeCallback).not.toHaveBeenCalled();
				});

			});

		});

		describe('setSearchInput()', function() {

			var newInput = 'search string';

			beforeEach(function() {
				setArbitraryParams();
				spyOnExecute();
				filterService.setSearchInput(newInput);
				retrieveParams();
			});

			it('should set params to the specified string', function() {
				expect(params.input).toBe(newInput);
			});

			it('should reset the offset', function() {
				expect(params.offset).toBe(0);
			});

			it('should perform the search', function() {
				expect(executeCallback).toHaveBeenCalled();
			});

		});

		describe('changePageLimit()', function() {

			var newLimit = 42;

			beforeEach(function() {
				setArbitraryParams();
				spyOnExecute();
				filterService.changePageLimit(newLimit);
				retrieveParams();
			});

			it('should set params to the specified limit', function() {
				expect(params.limit).toBe(newLimit);
			});

			it('should reset the offset', function() {
				expect(params.offset).toBe(0);
			});

			it('should perform the search', function() {
				expect(executeCallback).toHaveBeenCalled();
			});

		});

		describe('setSearchResults()', function() {

			var results = {
				total: 42,
				items: [{ foo: 'bar' }]
			};
			var callback = jasmine.createSpy('sortPageSearchCompleteCallBack');

			beforeEach(function() {
				filterService.setSearchResults(results, callback);
			});

			it('should save the results', function() {
				retrieveState();
				expect(state.searchResults.total).toBe(results.total);
				expect(state.searchResults.items).toEqual(results.items);
			});

			it('should call the callback with the search state', function() {
				expect(callback).toHaveBeenCalledWith(jasmine.any(Object));
			});

		});

		describe('getSortPageSearchState()', function() {

			var api = [
				'disableNextPage',
				'disablePreviousPage',
				'searchResultsCount',
				'pageBeginCount',
				'pageEndCount',
				'searchResults',
				'showNoItemsFeedback',
				'showNoAssetsFeedback'
			];

			beforeEach(function() {
				retrieveState();
			});

			it('should initialize with no results', function() {
				expect(state.searchResults.total).toBe(0);
				expect(state.searchResults.items).toEqual([]);
			});

			angular.forEach(api, function(funcName) {
				it('should have a "' + funcName + '" property', function() {
					expect(state[funcName]).toBeDefined();
				});
			});

		});

	});

});
