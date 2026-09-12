# Tag Checklist — Noble Project

Format: tag — file — line number

Line numbers below are exact for **page-1.html** (verified against the final 211-line
file). For **indexx.html**, **page2.html**, and **colophon.html**, open each file in
VS Code and confirm/adjust the line numbers against your own saved copy, since minor
edits after this checklist was written could shift a line by a few positions.

## Structure (on every page)
| Tag | File | Line |
|---|---|---|
| header | page-1 | 13 |
| header | indexx, page2, colophon | (check in VS Code) |
| nav | page-1 | 16 |
| nav | indexx, page2, colophon | (check in VS Code) |
| main | page-1 | 25 |
| main | indexx, page2, colophon | (check in VS Code) |
| footer | page-1 | 203 |
| footer | indexx, page2, colophon | (check in VS Code) |
| h1 | page-1 | 14 |
| h1 | indexx, page2, colophon | (check in VS Code) |

## Semantics
| Tag | File | Line |
|---|---|---|
| section | page-1 | 27, 55, 132, 144, 173, 182 |
| article | page-1 | 30 |
| aside | page-1 | 47 |
| figure | page-1 | 41, 134, 139 |
| figcaption | page-1 | 44, 136, 141 |
| figure/figcaption | indexx | (check in VS Code — 3 instances) |

## Table
| Tag | File | Line |
|---|---|---|
| table | page-1 | 58 |
| caption | page-1 | 59 |
| thead | page-1 | 60 |
| tbody | page-1 | 67 |
| th scope="col" | page-1 | 62, 63, 64 |

## Lists
| Tag | File | Line |
|---|---|---|
| ul (nested) | page-1 | 147, 149, 158, 166 |
| ol start="1" | page-1 | 176 |
| dl | page-1 | 185 |
| dt / dd | page-1 | 186–193 |

## Links
| Tag | File | Line |
|---|---|---|
| a href (external, target+rel) | page-1 | 36 |
| a href="tel:" | page-1 | 204 |
| a href="tel:" | indexx, page2 | (check in VS Code) |
| a href="#id" (anchor ×2) | page-1 | 198, 200 |

## Text tags
| Tag | File | Line |
|---|---|---|
| strong | page-1 | 35 |
| em | page-1 | 36 |
| b | page-1 | 177 |
| i | page-1 | 189 |
| mark | page-1 | 205 |
| small | page-1 | 129 |
| small | indexx | (check in VS Code) |
| sup | page-1 | 77, 129 |
| abbr[title] ×2 | page-1 | 35, 36 |
| blockquote | page-1 | 49 |
| q | page-1 | 38 |
| cite | page-1 | 51 |
| hr | page-1 | 130 |
| br | page-1 | 199 |
| &copy; | page-1 | 207 |
| &copy; | indexx | (check in VS Code) |
| HTML entities (4+ total) | indexx, page-1 | (confirm exact count/lines in VS Code) |

## div / span
| Tag | File | Line |
|---|---|---|
| div (with comment) | page-1 | 197 |
| span (with comment) | page-1 | 35 |

## Form (page2.html)
| Element | File | Line |
|---|---|---|
| form + fieldset + legend | page2 | (check in VS Code) |
| label + id (all fields) | page2 | (check in VS Code) |
| input text/email/tel/number/date | page2 | (check in VS Code) |
| radio group | page2 | (check in VS Code) |
| checkbox | page2 | (check in VS Code) |
| select + options | page2 | (check in VS Code) |
| textarea | page2 | (check in VS Code) |
| required + placeholder | page2 | (check in VS Code) |
| submit/reset buttons | page2 | (check in VS Code) |
| "no server" comment | page2 | (check in VS Code) |

## code/pre/kbd/samp (colophon.html)
| Tag | File | Line |
|---|---|---|
| code | colophon | (check in VS Code) |
| pre | colophon | (check in VS Code) |
| kbd ×2 | colophon | (check in VS Code) |
| samp | colophon | (check in VS Code) |

## "Why" comments (at least 2 per file)
| File | Line(s) |
|---|---|
| page-1 | 29, 57, 196 |
| indexx, page2, colophon | (check in VS Code) |

---
**Important:** the rows marked "(check in VS Code)" are for indexx.html, page2.html,
and colophon.html — I don't have the exact final saved version of those three files
in front of me (only page-1.html was pasted in its complete, confirmed final form),
so I can't respond to those line numbers accurately. Open each file, use the line
numbers shown on the left of the editor, and fill them in — it only takes a few
minutes per file.
