/**
 * Base search class for AJAX searching
 */

!function(window, $) {
	'use strict';

	function ConcreteAjaxSearch($element, options) {
		options = options || {};
		options = $.extend({
			'items': [],
			'columns': [],
			'pagination': {},
			'fields': []
		}, options);
		this.$element = $element;
		this.$results = $element.find('div[data-search-results]');
		this.$resultsTableBody = this.$results.find('tbody');
		this.$resultsTableHead = this.$results.find('thead');
		this.$resultsPagination = this.$results.find('div.ccm-search-results-pagination');
		this.$advancedFields = $element.find('div.ccm-search-fields-advanced')
		this.options = options;


		this._templateAdvancedSearchFieldRow = _.template($element.find('script[data-template=search-field-row]').html());
		this._templateSearchResultsTableHead = _.template($element.find('script[data-template=search-results-table-head]').html());
		this._templateSearchResultsTableBody = _.template($element.find('script[data-template=search-results-table-body]').html());
		this._templateSearchResultsPagination = _.template($element.find('script[data-template=search-results-pagination]').html());
		
		this.setupCheckboxes();
		this.setupSort();
		this.setupSearch();
		this.setupPagination();
		this.setupAdvancedSearch();
		this.setupCustomizeColumns();
		this.updateResults(options);
	}

	ConcreteAjaxSearch.prototype.ajaxUpdate = function(url, data, callback) {
		data = data || [];
		var cs = this;
		jQuery.fn.dialog.showLoader();
		$.ajax({
			type: 'post', 
			data: data,
			dataType: 'json',
			url: url,
			complete: function() {
				jQuery.fn.dialog.hideLoader();
			},
			error: function(r) {
				ccmAlert.notice(r);
			},
			success: function(r) {
				if (!callback) {
					cs.updateResults(r);
				} else {
					callback(r);
				}
			}
		});
	}

	ConcreteAjaxSearch.prototype.setupCustomizeColumns = function() {
		var cs = this;
		cs.$element.on('click', 'a[data-search-toggle=customize]', function() {
			var url = $(this).attr('data-search-column-customize-url');
			$.fn.dialog.open({
				width: 480,
				height: 400,
				href: url,
				modal: true,
				title: ccmi18n.customizeSearch,
				onOpen: function() {
					var $form = $('form[data-dialog-form=search-customize'),
						$selectDefault = $form.find('select[data-search-select-default-column]'),
						$columns = $form.find('ul[data-search-column-list]');

					$('ul[data-search-column-list]').sortable({
						cursor: 'move',
						opacity: 0.5
					});
					$form.on('click', 'input[type=checkbox]', function() {
						var label = $(this).parent().find('span').html(),
							id = $(this).attr('id');
						
						if ($(this).prop('checked')) {
							if ($form.find('li[data-field-order-column=' + id + ']').length == 0) {
								$selectDefault.append($('<option>', {'value': id, 'text': label}));
								$selectDefault.prop('disabled', false);
								$columns.append('<li data-field-order-column="' + id + '"><input type="hidden" name="column[]" value="' + id + '" />' + label + '<\/li>');
							}
						} else {
							$columns.find('li[data-field-order-column=' + id + ']').remove();
							$selectDefault.find('option[value=' + id + ']').remove();
							if ($columns.find('li').length == 0) {
								$selectDefault.prop('disabled', true);
							}
						}
					});
				}
			});
			return false;
		});
	}

	ConcreteAjaxSearch.prototype.updateResults = function(results) {
		var cs = this;
		cs.$resultsTableHead.html(cs._templateSearchResultsTableHead({'columns': results.columns}));
		cs.$resultsTableBody.html(cs._templateSearchResultsTableBody({'items': results.items}));
		cs.$resultsPagination.html(cs._templateSearchResultsPagination({'pagination': results.pagination}));

		cs.$advancedFields.html('');
		$.each(results.fields, function(i, field) {
			cs.$advancedFields.append(cs._templateAdvancedSearchFieldRow({'field': field}));
		});
	}

	ConcreteAjaxSearch.prototype.setupAdvancedSearch = function() {
		var cs = this;

		cs.$element.on('click', 'a[data-search-toggle=advanced]', function() {
			cs.$advancedFields.append(cs._templateAdvancedSearchFieldRow());
			return false;
		});
		cs.$element.on('change', 'select[data-search-field]', function() {
			var $content = $(this).parent().find('.ccm-search-field-content');
			$content.html('');
			var field = $(this).find(':selected').attr('data-search-field-url');
			if (field) {
				cs.ajaxUpdate(field, false, function(r) {
					$content.html(r.html);
				});
			}
		});
		cs.$element.on('click', 'a[data-search-remove=search-field]', function() {
			var $row = $(this).parent();
			$row.queue(function () {
				$(this).addClass('ccm-search-field-removing');
				$(this).dequeue()
			}).delay(200).queue(function() {
				$(this).remove();
				$(this).dequeue();
			});
			return false;
		});
	}

	ConcreteAjaxSearch.prototype.setupSort = function() {
		var cs = this;
		this.$element.on('click', 'thead th a', function() {
			cs.ajaxUpdate($(this).attr('href'));
			return false;
		});
	}

	ConcreteAjaxSearch.prototype.setupSearch = function() {
		var cs = this;
		this.$element.on('submit', 'form[data-search-form]', function() {
			var data = $(this).serializeArray();
			data.push({'name': 'submitSearch', 'value': '1'});
			cs.ajaxUpdate($(this).attr('action'), data);
			return false;
		});
	}

	ConcreteAjaxSearch.prototype.setupPagination = function() {
		var cs = this;
		this.$element.on('click', 'ul.pagination a', function() {
			cs.ajaxUpdate($(this).attr('href'));
			return false;
		});
	}

	ConcreteAjaxSearch.prototype.setupCheckboxes = function() {
		var cs = this;
		this.$element.on('click', 'input[data-search-checkbox=select-all]', function() {
			cs.$element.find('input[data-search-checkbox=individual]').prop('checked', $(this).is(':checked'));
		});
	}

	// jQuery Plugin
	$.fn.concreteAjaxSearch = function(options) {
		return new ConcreteAjaxSearch(this, options);
	}

}(window, $);