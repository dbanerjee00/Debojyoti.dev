(function () {
  'use strict';

  var pages = document.querySelectorAll('.page');
  var navLinks = document.querySelectorAll('[data-page]');
  var pageContainer = document.querySelector('.page-container');
  var currentPage = document.querySelector('.page.active');
  var isTransitioning = false;

  var pageMap = {
    '/': 'home',
    '/about': 'about',
    '/work': 'work',
    '/contact': 'contact'
  };

  function getPageNameFromPath(path) {
    return pageMap[path] || 'home';
  }

  function updateNav(pageName) {
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('data-page') === pageName);
    });
  }

  function showPage(pageName, pushState) {
    if (isTransitioning) return;
    var target = document.querySelector('.page[data-page="' + pageName + '"]');
    if (!target) return;

    if (target === currentPage) {
      updateNav(pageName);
      return;
    }

    isTransitioning = true;
    if (pushState !== false) {
      var url = pageName === 'home' ? '/' : '/' + pageName;
      history.pushState({ page: pageName }, '', url);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (currentPage) {
      currentPage.classList.remove('active');
    }

    target.classList.add('active');
    currentPage = target;

    updateNav(pageName);

    setTimeout(function () {
      isTransitioning = false;
      window.dispatchEvent(new CustomEvent('pagechange'));
    }, 500);
  }

  function handleNavClick(e) {
    var link = e.target.closest('[data-page]');
    if (!link) return;
    e.preventDefault();
    var pageName = link.getAttribute('data-page');
    showPage(pageName);
  }

  document.addEventListener('click', handleNavClick);

  window.addEventListener('popstate', function (e) {
    var pageName = e.state ? e.state.page : getPageNameFromPath(location.pathname);
    showPage(pageName, false);
  });

  var initialPage = getPageNameFromPath(location.pathname);
  showPage(initialPage, false);

})();
