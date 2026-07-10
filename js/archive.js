(function () {
  'use strict';

  window.initArchivePage = function () {
    var tagBox = document.querySelector('.js-tags');
    var result = document.querySelector('.js-result');
    if (!tagBox || !result || tagBox.dataset.archiveReady === 'true') return;
    tagBox.dataset.archiveReady = 'true';

    var buttons = Array.prototype.slice.call(tagBox.querySelectorAll('[data-encode]'));
    var items = Array.prototype.slice.call(result.querySelectorAll('.item'));

    function selectTag(tag, selected) {
      buttons.forEach(function (button) {
        button.classList.toggle('focus', button === selected || (!selected && button.dataset.encode === tag));
      });

      items.forEach(function (item) {
        var tags = (item.dataset.tags || '').split(',');
        item.classList.toggle('d-none', Boolean(tag) && tags.indexOf(tag) === -1);
      });

      result.querySelectorAll('.archive-year').forEach(function (year) {
        var hasVisible = Array.prototype.some.call(year.querySelectorAll('.item'), function (item) {
          return !item.classList.contains('d-none');
        });
        year.classList.toggle('d-none', !hasVisible);
      });

      var url = new URL(window.location.href);
      if (tag) url.searchParams.set('tag', tag); else url.searchParams.delete('tag');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }

    tagBox.addEventListener('click', function (event) {
      var button = event.target.closest('[data-encode]');
      if (!button) return;
      selectTag(button.dataset.encode || '', button);
    });

    var initialTag = new URLSearchParams(window.location.search).get('tag') || '';
    var initialButton = buttons.find(function (button) { return button.dataset.encode === initialTag; }) || buttons[0];
    selectTag(initialButton ? initialButton.dataset.encode : '', initialButton);
  };

  window.initArchivePage();
}());
