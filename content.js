const ORIGIN = window.location.origin;
const URL_PATHS = window.location.pathname.split('/');
const CURRENT_MODULE = URL_PATHS[1];
const TREE_ID = URL_PATHS[3];
const VIEWED_HINTS = new Set();

function getUrlParameter(urlToSearch, urlParameter) {
  return new URLSearchParams(urlToSearch.split('?')[1]).get(urlParameter);
}

function createHintAggregator(mutationTarget) {
  const AGGREGATE_FORMAT = `${ORIGIN}/hints/tree/${TREE_ID}/hints?`;

  const hintLink = mutationTarget.children[1].children[0].href;
  if (VIEWED_HINTS.has(hintLink)) return;

  const DB_ID = getUrlParameter(hintLink, 'dbid');
  const urlParams = new URLSearchParams({
    hf: 'record',
    hs: 'last',
    hdbid: DB_ID,
  }).toString();

  const aggregatorTarget = AGGREGATE_FORMAT + urlParams;

  mutationTarget.nextElementSibling.innerHTML =
  `<p><a href="${aggregatorTarget}">View all hints in this collection</a></p>` +
  mutationTarget.nextElementSibling.innerHTML;

  VIEWED_HINTS.add(hintLink);
};

// const FAMILY_TREE_MODULE = 'family-tree';
const HINTS_MODULE = 'hints';

let domScope = '';
let elementClass = '';

/* Between the /hints/ and /family-tree/ pages, hints are presented
identically. However, the DOM differs significantly. */
if (CURRENT_MODULE == HINTS_MODULE) {
  domScope = '.filterSec';
  elementClass = 'recordTitleTextContainer';
/*
} else if (CURRENT_MODULE == FAMILY_TREE_MODULE) {
  domScope = '.hintsSection';
  elementClass = 'hintsRegion';
*/
} else {
  console.log(`Module ${CURRENT_MODULE} not recognized.`);
}

filterSection = document.querySelector(domScope);

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    isTargetElement = mutation.target.classList.contains(elementClass);
    hasExpectedDepth = mutation.target.children[1] !== undefined;
    alreadyFiltered = getUrlParameter(window.location.href, 'hdbid') !== null;

    // Don't display option to filter a collection if already filtered.
    if (alreadyFiltered) return;

    if (isTargetElement && hasExpectedDepth) {
      createHintAggregator(mutation.target);
    }
  });
});

observer.observe(filterSection, {
  childList: true,
  subtree: true,
});
