# JavaScript learning implementation checklist

This file was generated with AI assistance on 15 October 2026.
It does not establish compliance with the assignment's AI prohibition.

| Requirement or behaviour | Exact source location |
| --- | --- |
| Ten objects with ID, name, category, price and volume | js/shop.js:5 |
| Find product; parameter and return value | js/shop.js:20 |
| Validate stored quantities using a loop and logical operators | js/shop.js:24 |
| Format price; parameter and return value | js/shop.js:58 |
| Calculate quantity and price using arithmetic and reduce | js/shop.js:62 |
| setQuantity calls findProduct and save | js/shop.js:80 |
| Random reference used only for demo checkout | js/shop.js:104 |
| DOM helper with parameters and return value | js/shop.js:119 |
| Shared cart badge and cross-tab state | js/shop.js:130 |
| Care count, percentage and completion state | js/care.js:12 |
| Checklist reset and change event | js/care.js:24 |
| Connected search, category and price controls | js/catalog.js:29 |
| Reusable card rendering from product array | js/catalog.js:36 |
| Count, no results and reset | js/catalog.js:49 |
| Cart template rendering, quantity limits, remove, increase/decrease | js/cart.js:31 |
| Cart empty state and total recalculation | js/cart.js:84 |
| Review, cancel and demo confirmation | js/cart.js:104 |
| Regex password rules and live checklist | js/register.js:12 |
| Required trimmed name, email, selection and comparison rules | js/register.js:63 |
| Field errors and valid/invalid classes | js/register.js:71 |
| Accessible show/hide password controls | js/register.js:89 |
| Submit, first invalid focus and safe textContent summary | js/register.js:114 |
| Password clearing after success | js/register.js:130 |
| Form reset, input, change and submit events | js/register.js:147 |
| Reusable demo-history rendering and empty state | js/orders.js:9 |

## Verification evidence

Browser checks on the staged local HTTP site:

- Blank registration: five specific errors; first invalid field focused.
- Different confirmation: matching error; corrected form produces a demo summary.
- First show/hide control changes only the first password field.
- Successful validation clears password fields; reset clears the form.
- Care: all three checks produce 100% and success; reset returns to 0%.
- Search and combined category/price filters can show zero matches; reset restores ten.
- Two mugs and one bowl total 340,000 KZT; incrementing a mug gives 460,000 KZT.
- Removing the bowl leaves two mugs at 240,000 KZT.
- Invalid quantity zero blocks checkout; valid quantity three updates totals.
- Review can be cancelled; confirmation creates one local demo entry and empties cart.
- Empty cart disables checkout; My Orders shows the completed demonstration.
- care/register/cart measured without horizontal page overflow at 375, 768 and 1280 px.
- Browser error log was empty during these tested flows.
- New JavaScript files pass Node syntax checks.

## Remaining team and submission work

Review the entire site, including other contributors' data consistency and flows.
The locally listed tags did not include midterm. The required baseline and freeze
history therefore remain unverified. Assignment tags and the multi-day meaningful
commit history must reflect real work; they were not generated retroactively.
The earlier AI-generated midterm content and current generated code require
discussion with the instructor before submission.
