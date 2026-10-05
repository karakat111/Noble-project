# Noble — Tableware Store Website

An educational project for the **Introduction to Web Technologies** course,
featuring the Noble tableware store in Astana. The project began with Assignment 1
(HTML Basics) and now contains eight linked pages as a foundation for Assignment 2
(CSS). The current version uses plain HTML, without CSS or JavaScript.

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
