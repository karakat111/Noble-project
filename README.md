# Endterm update — Arsen's three pages — 3 November 2026

This section supersedes the older descriptions below for Cart, Care and Register.
Page owner: Arsen Ibatullin. Implementation: Codex-generated at Arsen's request;
not independently student-authored coursework. Other members' pages are unchanged.

| Page / file | Technology | Added since the jQuery assignment |
| --- | --- | --- |
| Cart / js/cart.js | Plain JavaScript only | Product objects, chooser and cards built in a loop; duplicate products combine; per-line subtotals and quantity errors (1–99); checkout creates an itemised receipt, clears the cart and prevents a second checkout of the same items. |
| Care / js/care.js | jQuery | Checklist persists in this browser; reload restores progress; Reset clears saved checks; malformed or unavailable storage has visible fallback feedback. |
| Register / js/register.js | jQuery | Live password-length advice; first-invalid-field focus; confirmation includes the validated name/email/phone using safe text insertion. Exact password matching preserves spaces. |

Cart still has an unused jQuery CDN link in its existing HTML, but its feature
does not call jQuery or depend on it. Care and Register keep their separate
ready-wrapped jQuery files. Existing slide and fade effects remain.
No HTML or CSS was changed by this endterm step; new content is created in JS.

Requirement map:
- Arrays/objects and loops: Cart products, cart state, chooser, cards, receipt.
- Functions with parameters and returns used in multiple places: findProduct,
  formatPrice, validQuantity, calculateTotal.
- Conditions/calculations: quantities, merged items, per-line totals, grand total,
  empty/invalid states; Care percentage and Register password advice.
- Events: click/input in Cart; change/submit/reset in Care and Register.
  Cart uses event.target + closest with delegated handlers on #cart-items.
- Validation: all five Register fields, email/phone format, length limits,
  exact password confirmation, live inline errors, preventDefault, valid-only result.
- jQuery: tag/class/ID/attribute/:checked selectors; closest/find/siblings/this;
  chained methods; checklist slideDown/slideUp and registration fadeIn.

Limitations and submission work:
- Cart receipt is local to the current page; reload clears it. It is NOT saved in
  My Orders, and catalogue-to-cart/history integration remains a team dependency.
- Registration is a local validation demo, not authentication. No credentials or
  contact details are stored or transmitted. Care stores only checkbox IDs.
- The previous design refresh changed HTML/CSS after midterm. That conflicts with
  the endterm freeze. No local midterm tag was available for a baseline comparison.
- The assignment forbids AI-written code. This is disclosed learning/reference
  work; do not describe it as compliant independent authorship.
- Existing prices/photos are retained, not independently reverified. Catalog
  illustrations are AI assets, not the own photographs requested by the brief.
- Team/device review at least two days before the deadline, W3C validation,
  repository-wide checks, authentic commit history (4 commits across 3 days per
  team member), and final endterm tag still need completion by the team.
  No commit, tag or push was made here. There is no required written report.

Run through one local HTTP server; jQuery pages need access to the CDN.
Test: empty cart; add twice; quantity 0/decimal/100 then correct; remove last
item; checkout receipt and empty cart. Care: complete, reload, reset, reload.
Register: empty/invalid inputs, mismatched passwords, correct inputs, toggle
each eye button, successful receipt and reset. Check a narrow phone width.

---

# Noble — Tableware Store Website

## Student A jQuery learning example — 2 November 2026

Codex generated the current jQuery migrations for Turar's Home, Product Catalog
and Orders features after the user explicitly asked for a complete example. The
official assignment says submitted JavaScript must be student authored, so this
code is a disclosed learning reference and must not be represented as Turar's
independent implementation.

- Product Catalog keeps the original category and price combinations, count,
  empty state and reset behaviour using jQuery selection, iteration, properties,
  classes and events.
- Home builds product discovery and a six-field demonstration enquiry in code.
  It validates name, email, phone, product, quantity and budget, including the
  product-price calculation. Nothing is sent, stored or purchased.
- Orders reads `noble-demo-shop-v1`, rejects malformed records and builds cards
  from validated arrays. Detail toggles use delegated events. The current Cart
  page still does not save completed orders, so end-to-end checkout integration
  remains a team dependency.
- `js/old-js-version.js` remains unlinked and preserves the previous native
  implementations for comparison. No CSS rules or teammate files were changed.

The example uses jQuery 3.7.1 from the CDN, so an internet connection is needed.
On 2 November 2026, an automated Edge run completed 65 checks: all 12 Catalog
category/price combinations and counts, reset and keyboard activation; Home
discovery, empty and invalid submissions, individual error clearing, valid
submission and reset; Orders empty, malformed, valid, mixed and refreshed
states, totals and delegated keyboard toggle; no horizontal overflow at 375,
768 and 1440 pixels; and no uncaught page errors.

## Current jQuery implementation — 30 October 2026

This section supersedes the older JavaScript behaviour descriptions below.
Updated pages: cart, care and register. Each loads jQuery 3.7.1 full from the
official CDN before its existing separate page script. An internet connection
is required for the CDN. No plugins or new CSS rules are used.

- Cart: choose a product, add a card, change quantities, remove cards, see totals
  and complete a demo order. Products come from an array; card markup is built
  only in js/cart.js. Repeated additions create separate cards. Cart state lasts
  until reload; checkout shows a message and does not send or store an order.
- Care: checkbox count, percentage, selected-row styling, completion effect and reset.
- Register: name, email, phone, password and confirmation validation with messages
  next to each field; errors clear while editing; independent password toggles.
  Phone and error elements are created in jQuery, respecting the HTML freeze.
  On success all inputs are cleared. No credentials are stored or transmitted.
- js/old-js-version.js preserves the three previous scripts in uncalled functions.
  It is for comparison only and is not linked to a page.

Requirement examples:
- ID/class/tag/attribute selectors and :checked / :not() are in the three scripts.
- .find(), .closest(), .parent(), .siblings(), .each() and $(this) are used.
- Chains of 3+ methods and plain-JS comparisons are explained in code comments.
- .text() handles text, .html() only trusted fixed success markup, .val() inputs,
  .attr() attributes, .prop() checked/disabled states.
- All event handlers use .on(): click, input, change, submit and reset.
  Cart remove/input handlers delegate from the existing #cart-items.
- Effects: slideDown for added cards/completion, slideUp with a removal callback,
  fadeIn for valid registration. Clearing hides its message immediately.
- Form validation trims values, checks required fields, email, phone format,
  password lengths and equality. Phone format is + followed by 7–15 digits,
  without spaces or brackets. Errors update immediately while editing.
  Native constraint attributes are preserved;
  noValidate enables all-field inline feedback instead of stopping at one bubble.
  Real server-side validation would still be required.

Existing HTML changes are limited to script connections and removal of the
obsolete cart template. New interface elements are constructed in JavaScript.
Existing CSS and other pages were not rewritten. No new CSS rules were added.


Official references: https://api.jquery.com/on/ and https://api.jquery.com/prop/

Verification on 30 October 2026: JavaScript syntax checks passed. Browser checks
covered adding two cart products, quantity validation, delegated removal and
demo checkout; all three care checks, rapid checkbox changes and reset; five
empty registration errors, invalid email/phone/password confirmation, live
correction, independent password visibility and successful form clearing.
No console errors were observed on these three pages or during load-only checks
of home, catalogue, collections, gift guide, orders and contact. Other members'
interactive features were not functionally tested. This is not a complete
midterm-baseline or coursework-authorship audit.

An educational project for the **Introduction to Web Technologies** course,
featuring the Noble tableware store in Astana. The project began with Assignment 1
(HTML Basics) and now contains eight linked pages as a foundation for Assignment 2
(CSS). The current learning version includes Bootstrap styling and JavaScript.

## Assignment 4–5 learning implementation — 15 October 2026

This section supersedes the historical descriptions of disabled controls below.
Codex generated this implementation at the student's explicit request. The
assignment prohibits AI-written code and documentation: this is a learning
reference, not a claim of compliant independent coursework.

### Functionality Plan

| Page | Visitor goal | Function | Expected result | Page owner and implementation |
| --- | --- | --- | --- | --- |
| Care | Check preparation before using an item | Checkbox progress and reset | Completed count, percentage and clear completion feedback | Arsen's page; AI-generated example |
| Cart | Review selected pieces | Quantity editing, remove, clear and recalculation | Valid quantities 1–99 and accurate subtotals/total | Arsen's page; AI-generated example |
| Cart | Finish a demonstration checkout | Review, cancel, confirm and temporary reference | Explicit demo summary, emptied cart and local history | Arsen's page; AI-generated example |
| Register | Check sample registration details | Five-field validation and password checklist | Field errors, first-error focus or a demo summary | Arsen's page; AI-generated example |
| Register | Check a typed password | Independent accessible show/hide controls | Each password field toggles separately | Arsen's page; AI-generated example |
| Catalogue integration | Choose items for the cart | Search, category and price filters; add | Matching count, empty/reset feedback, shared cart | Supporting integration; AI-generated example |
| My Orders integration | Review the demo just completed | Render local demo history | Latest 30 demo entries or an empty state | Supporting integration; AI-generated example |
| All pages | Know cart size while browsing | Shared cart badge and cross-tab updates | Same quantity count across the site | Shared integration; AI-generated example |

Run through one local HTTP origin using your IDE's preview server, or run
`python -m http.server 8000 --bind 127.0.0.1` from the project directory and
open `http://127.0.0.1:8000/indexx.html`. Direct file URLs have inconsistent
browser-storage behaviour and are not the tested workflow.

The existing `js/main.js` provides shared form helpers. `js/shop.js` provides
ten product objects copied from the current catalogue, cart operations,
totals, browser storage and the shared badge. Page-specific scripts use these
APIs. All newly connected scripts use `defer` and strict mode.
The historical `js/base.js` is not connected; its password behaviour is
replaced by `js/register.js`.

Only script links were added to HTML; CSS was not changed. New interface
elements are created by DOM methods and use existing Bootstrap/project
classes. No midterm tag was present in the local tag listing, so a comparison
against the required midterm baseline could not be verified.

Cart/history use browser localStorage under `noble-demo-shop-v1`.
Only product IDs, quantities, dates and demo references are saved.
Registration details and passwords are not saved, logged, sent or placed
in a URL. Passwords are cleared after successful demonstration validation.
If browser storage is unavailable, a message explains that cart changes last
only on the current page. Clearing browser storage removes demo history.
Catalogue prices are the project's recorded prices, not a current quotation.

See `javascript-checklist.md` for exact code locations and verification.
Other members' features, price datasets, midterm provenance, evidence, personal
defence and the required commit history still need team review. No commits,
tags or pushes were created by this implementation; no work dates are fabricated.

## Contributors

- **Utembayeva Karakat, SE-2535** — original four-page project: home, catalogue,
  contact, and project background.
- **Arsen Ibatullin** — integration and subsequent edits to collections, gift guide,
  care, and visit pages. Initial examples for these four pages were generated with
  AI assistance.

The team has expanded to three students. The third member's name and confirmed
page responsibilities still need to be recorded. This list describes the work
documented so far, rather than a final allocation of two pages per student.

## Pages

| File | Purpose |
| --- | --- |
| `indexx.html` | Introduction to Noble, store photographs, and basic contact information. |
| `page-1.html` | Ten product cards, recorded prices, AI concept images, and disabled category/price controls. |
| `page2.html` | Contact information and a demonstration enquiry form. |
| `register.html` | Profile registration layout; account creation is not enabled. |
| `collections.html` | Tea and coffee pieces, table settings, and decorative accessories grouped by use. |
| `gift-guide.html` | Gift ideas by occasion and a demonstration gift enquiry form. |
| `care.html` | Care checks, storage guidance, manufacturer references, and questions to ask before buying. |
| `order.html` | Order history layout, empty state and prepared order template. |

Every page includes navigation to all eight pages. Some pages also use internal
links to jump to sections. The collection groupings are editorial categories,
not official collection names supplied by Noble.

## File structure

```text
Noble-project/
├── indexx.html
├── page-1.html
├── page2.html
├── register.html
├── collections.html
├── gift-guide.html
├── care.html
├── order.html
├── images.jpg/             — store and product photographs
├── tag_checklist (2).md     — original HTML tag checklist
├── AI_log (1).md            — AI usage log
├── .gitignore              — excludes local IntelliJ IDEA settings
└── README.md
```

`images.jpg` is the actual folder name, despite its extension-like ending.
Keep it unchanged unless all image paths are updated as well.

## Running locally

1. Clone the repository if you do not already have a local copy:

   ```bash
   git clone https://github.com/karakat111/Noble-project.git
   cd Noble-project
   ```

2. Open `indexx.html` directly in a browser.
3. Use the navigation menu to explore the site.

No package installation, build step, database, or backend is required.
Live Server in Visual Studio Code is an optional way to preview the pages.
The files can also be edited in IntelliJ IDEA.

## Forms

The contact and gift guide pages contain HTML forms with labelled inputs,
fieldsets, selection controls, and submit/reset buttons. They demonstrate browser
validation and GET form submission. Submitted values appear in the page URL;
there is no backend to process or store a request.

These forms do not contact Noble, reserve goods, or book visits. Use fictional
contact details when testing. The current `order.html` contains no visit form.

## Content and sources

The original project records store details, product prices, photographs, and an
employee quote attributed to Aigerim on 9 September 2026. The original contributor
described these materials as collected through a visit or contact with the store.
Current availability, prices, opening hours, and services should be confirmed
with Noble before making a purchase or travelling.

The care page links to Bernardaud's manufacturer guidance. Instructions for one
manufacturer or product should not be assumed to apply to every item in the store.

## Validation and remaining documentation

Local structural checks have been used during development, but these do not
replace [W3C HTML validation](https://validator.w3.org/). Validate all eight current
pages after changes; the original README's statement about four validated pages
does not establish the validation status of the expanded site.

Before the next submission:

- Update the tag checklist to match the current files and line numbers.
- Update the AI log to include the generated examples and subsequent assistance;
  its original statement that no page code or text was AI-written is now outdated.
- Reconcile author comments and author metadata on the newer pages so they
  accurately describe contributions and assistance.
- Remove the stale visit-planner link and form references in `order.html`, or
  implement the intended section; the form was removed from the current file.

The original README describes a separately maintained Assignment 1 report about
`posudamarket.kz`, with screenshots and a hand-drawn structure diagram. No report
PDF or DOCX is currently present in this local checkout.

## Team workflow

Work on a personal branch, review the changed files, commit, and push the branch.
Use a pull request to review and merge changes into `main`. After merging on
GitHub, update the local main branch:

```bash
git switch main
git pull origin main
```

Coordinate edits to shared navigation because adding a page affects every HTML
file. Each participant should use their own Git identity and account. CSS styling
and the accompanying Assignment 2 materials are the next stage of development.

## Registration page

Colophon has been replaced by `register.html`. The profile icon at the right of
navigation on every page opens the registration form. It contains name, email,
password and confirmation fields, a native reset button, and prepared status
containers. No JavaScript or backend is present. Create account is disabled and
no registration data is sent or stored. Sample credentials only should be used.

AI assistance on 5 October 2026: Codex generated the registration HTML, shared
profile navigation and related CSS at the student's request.


## Catalogue update

The product page now has ten responsive cards with short descriptions, recorded
prices and a volume row. Unknown capacities say Ask the store; non-vessels say
Not applicable. Category and price controls are disabled previews. CSS filtering logic has been removed;
all ten products remain visible.

Images in `images.jpg/catalog/` were generated with AI at the student's request
and are labelled as illustrations on the page. They are not verified product
photographs and do not satisfy the midterm requirement for original photographs.
The exact prompts and provenance are in `catalog-image-notes.md`.

## Cart and orders without JavaScript

The former Visit page is replaced by `order.html`. `cart.html` is accessible beside
the profile icon on every page. Add to cart and Place order are disabled; no items,
orders or account data are stored or submitted. The empty states, item/order templates,
quantity controls and feedback containers are ready for a later JavaScript assignment.
The catalogue's CSS filtering rules have been removed. All website pages contain no
script tags, inline event handlers or JavaScript URLs. Form fields and reset buttons
retain native HTML behaviour. Generated HTML/CSS changes were made with Codex assistance.

Verification (3 November 2026): node syntax and git whitespace checks passed. Browser checks covered duplicate merging, totals (2 mugs + teapot = 384,000 KZT), invalid 0/1.5/100 quantities, correction/removal, receipt + empty cart, care persistence/reset across reload, five empty form errors, invalid email/phone/mismatched passwords, independent password toggle, successful trimmed confirmation and reset. No console errors observed; all three pages checked at 390px. Cart invalid-state wrapping was corrected. W3C and whole-team acceptance checks were not performed.
