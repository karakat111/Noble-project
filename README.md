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
| `page-1.html` | Product catalogue, recorded prices, categories, photographs, and an employee quote. |
| `page2.html` | Contact information and a demonstration enquiry form. |
| `colophon.html` | Background on how the original project was created. |
| `collections.html` | Tea and coffee pieces, table settings, and decorative accessories grouped by use. |
| `gift-guide.html` | Gift ideas by occasion and a demonstration gift enquiry form. |
| `care.html` | Care checks, storage guidance, manufacturer references, and questions to ask before buying. |
| `visit.html` | Store location information, a visit checklist, and questions to ask in person. |

Every page includes navigation to all eight pages. Some pages also use internal
links to jump to sections. The collection groupings are editorial categories,
not official collection names supplied by Noble.

## File structure

```text
Noble-project/
├── indexx.html
├── page-1.html
├── page2.html
├── colophon.html
├── collections.html
├── gift-guide.html
├── care.html
├── visit.html
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
contact details when testing. The current `visit.html` contains no visit form.

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
- Remove the stale visit-planner link and form references in `visit.html`, or
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
