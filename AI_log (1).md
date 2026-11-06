# AI Log — Use of AI in the Noble Project

## 2 November 2026 — Student A Assignment 6 jQuery learning example

Turar asked Codex to implement the complete Assignment 6 example after several
tutoring and review steps. Codex rewrote `js/products.js`, `js/home.js` and
`js/orders.js` with jQuery, added dynamic Home validation and delegated Orders
controls, tested the result, and updated this disclosure and README.

This is AI-generated learning code. The official assignment permits explanation
but prohibits AI-written submitted JavaScript. It must not be presented as
independent student work. No real order, payment or enquiry is sent.

Correction: the original statement that AI only explained concepts is no longer
accurate. AI has also generated code and project content as documented below
and in README. Do not present this work as independently written.

## 15 October 2026 — Assignment 4–5 learning example

Requests: implement Assignment 4–5 for care, cart and register; after the
assignment's AI restriction was explained, the user repeated "do it please for me".

Codex generated care progress, registration validation/password controls,
shared product/cart storage, catalogue integration, demo checkout/history,
script connections and this documentation. It performed browser checks and
corrected quantity validation after testing. Existing CSS was unchanged.

The supplied assignment prohibits AI-written JavaScript, validation, README
and checklist. This generated implementation does not meet that authorship
requirement. It is disclosed as a learning reference, not independent coursework.

No server-side authentication, real order, payment, Git commit or tag was created.

## List of questions asked to AI 

1. General explanation of the assignment structure and checklist requirements
2. How many commits are needed and how to spread them across days
3. The difference between working solo vs. in a team (number of pages/commits)
4. Advice on which photographs would be worth taking for the project




Follow-up: at the user’s request, Codex simplified register.js by removing the
submitted flag, automatic error focus and the reset animation. Phone input now
accepts + followed by 7–15 digits. Conditional expressions were expanded into
ordinary if/else blocks. Field validation and error messages remain.

Тогда тебе дадут маленькую задачу прямо в твоём коде. Выучи шаблоны ниже: почти всё решается ими. Документацию jQuery и w3schools на защите смотреть можно.

**1. Поменять или добавить эффект**
```js
$('#box').fadeIn(400);            // плавно показать
$('#box').slideToggle(300);       // открыть или закрыть
$('#box').fadeOut(300, function () {
  $(this).remove();               // callback: после окончания
});
```

**2. Добавить поле в валидацию** (например, возраст от 18)
```js
const age = Number($('#age').val());
if (age < 18) {
  AppUtils.showError($('#age'), 'You must be at least 18.');
}
```
Ещё вариант: сообщение не короче 10 символов.
```js
if ($('#message').val().length < 10) {
  AppUtils.showError($('#message'), 'Message is too short.');
}
```

**3. Добавить ещё один элемент в массив** (товар или повод)
```js
{ id: 7, name: 'Tea Spoon', category: 'tea-coffee', price: 1500, inStock: true, imageAlt: 'Tea spoon' }
```
Записать через запятую после последнего объекта.

**4. Кнопка, которая добавляет ещё одну карточку или пункт**
```js
$('<button>', { type: 'button', text: 'Add item' }).appendTo('body');

$('body').on('click', 'button', function () {
  $('<p>', { text: 'New item' }).appendTo('#list');
});
```
Кнопка создаётся кодом, поэтому обработчик делегированный. Это и есть ответ на вопрос «почему».

**5. Добавить метод в цепочку**
```js
$box.text('Hi').addClass('active').hide().fadeIn(300);
```
К любой цепочке можно дописать ещё один метод через точку.

**6. Простые обработчики событий**
```js
$('#btn').on('click', function () {
  $(this).toggleClass('active');
});

$('#name').on('input', function () {
  $('#preview').text($(this).val());
});

$('#form').on('submit', function (event) {
  event.preventDefault();
});
```

**7. Прочитать или изменить значения**
```js
$('#name').val();                // взять
$('#name').val('Anna');          // записать
$('#agree').prop('checked');     // true или false
$('#phone').prop('required', true);
$('a').attr('href', '/new');
$('#out').text('Done');
```

**8. Выбрать нужные элементы**
```js
$('input[type="text"]');         // по атрибуту
$('li:first');                   // первый
$('input:checked');              // отмеченные
$('li:not(.done)');              // все, кроме с классом done
$(this).closest('.card');        // карточка, в которой кнопка
$(this).siblings();              // соседи
```

**Как действовать, если растерялась:**
1. Скажи вслух, что хочешь сделать и какой метод для этого нужен.
2. Найди в своём коде похожее место и скопируй оттуда.
3. Открой документацию (api.jquery.com), если забыла название или синтаксис.
4. Проверь в браузере: обнови страницу и посмотри консоль.

Хочешь, дам пять таких задач по очереди, а ты напишешь решения, и я проверю?

