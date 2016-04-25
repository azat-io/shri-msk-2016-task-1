# Школа разработки интерфейсов 2016: Задание 1

Поскольку в решении данного задания главным образом оцениваются навыки в вёрстке, я решил не использовать JavaScript в проекте абсолютно и постараться решить задачу усилиями языков разметки HTML и CSS.

Решение данного задания представляет собой минималистичную веб-страницу с телепрограммой за неделю для пяти каналов: Fox, TNT, HBO, ABC и USA. Информация о телепередачах взята с сайта америанской поисковой системы [AOL](http://tvlistings.aol.com/) и актуальна для южного Бруклина г. Нью-Йорк (в процессе работы с удивлением для себя обнаружил то, что список телепередач в разных районах одного американского города может незначительно отличаться).

## Сборка проекта

Для сборки проекта я решил использовать **Gulp.js**. Он удобен и легок в использовании.

Для того, чтобы собрать проект у себя на компьютере необходимо выполнить следующие команды:

1. Клонируем репозиторий

```bash
$ git clone git@github.com:azat-io/shri-msk-2016-task-1.git
```

2. После чего переходим в папку проекта и устанавливаем зависимости

```bash
$ npm install
```

3. Выполняем команду для сборки проекта, после которой все файлы соберутся в папке `dist`

```bash
$ gulp build
```

### HTML

Для работы по написанию HTML кода я буду использовать шаблонизатор **Pug.js** (бывший Jade).

Поскольку я решил, что будущий сайт будет работать без JavaScript мне очень пригодится мощь этого шаблонизатора. Ведь для реализации проекта мне необходимо создать сайт с телепрограммой по 5 каналам для 7 дней недели (а это очень много HTML кода) и без использования хотя бы тех же миксинов тут не обойтись.

### CSS

Для работы с CSS я буду использовать **PostCSS** со следующим набором плагинов:

* `cssnext` - для расстановки вендорных префиксов (Автопрефиксер) и использования возможностей "CSS 4" по работе с цветами и переменными
* `postcss-color-short` - немного сахара для возможности писать названия цветов в более коротком виде, например, так: `#f`
* `postcss-focus` - добавим псевдоэлемент `:focus` ко всем `:hover`
* `postcss-inline-image` - будем инлайнить изображения в наш CSS код
* `postcss-nested` - вложеность как в Sass
* `postcss-pxtorem` - для конвертации пикселей в rem
* `postcss-size` - ещё сахар, для задания ширины и высоты с помощью свойства `size`
* `css-declaration-sorter` - отсортируем все свойства в алфавитном порядке для того, чтобы было удобнее ориентироваться в инспекторе
* `css-mqpacker` - объединим и вынесем медиазапросы в конец нашего CSS файла
* `uncss` - спарсим HTML код и удалим весь неиспользуемый и ненужный CSS
* `cssnano` - сожмём конечный код

## Приступаем к работе

Здесь я хотел бы расписать некоторые, возможно не совсем очевидные, вещи. Сайт состоит из трёх ключевых блоков - хидера, основного блока и футера.

Основной блок содержит семь вкладок с телепрограммами пяти каналов. Для того, чтобы вкладки переключались мне нужно каким-либо образом обработать событие клика средствами CSS. Якорные ссылки с псевдоклассом :target создают мусор в истории браузера и добавляют к ссылке в адресной строке браузера всякие слова, что выглядит некрасиво и является по-моему плохим решением. Поэтому для вкладок я решил использовать замаскированные чекбоксы. Выглядит это примерно следующим образом:

```jade
// Миксин содержит в себе четыре параметра: имя вкладки, её ID, аббревиатурное название
// (посколько в CSS невозможно задать псевдоэлемент вроде :first-three-letters) для
// названия вкладки в мобильной версии сайта и параметр checked для определения вкладки,
// которая включена по умолчанию

mixin tab(name, id, abbr, checked)
  input(type='radio' name='tabs' id=id checked=checked)
  label(for=id)= name
    abbr= abbr
+tab('Monday', 'toggle-monday', 'Mon', true)
+tab('Tuesday', 'toggle-tuesday', 'Tue', false)
+tab('Wednesday', 'toggle-wednesday', 'Wed', false)
// ...
```

Событие клика обрабатывает CSS код:

```css
.tab {
  min-height: 200px;
  background: #f;
  display: none;
  padding: 12px;
}

#toggle-monday:checked ~ label[for="toggle-monday"],
#toggle-tuesday:checked ~ label[for="toggle-tuesday"],
#toggle-wednesday:checked ~ label[for="toggle-wednesday"] {
  background: #f;
  margin-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding-bottom: 18px;
  color: #35;
  cursor: default;
}

#toggle-monday:checked ~ #monday,
#toggle-tuesday:checked ~ #tuesday,
#toggle-wednesday:checked ~ #wednesday {
  display:block;
}
```

В каждой вкладке располагаются таблицы 5 телеканалов, свёрстанные по технологии Flexbox. Теперь немного о содержимом этих таблиц:

```jade
// В миксине содержится информация о том, как будет выглядеть ячейка таблицы с отдельной
// передачей. В теге span у нас всплывающее при наведении окно с изображением передачи
// и, при наличии, описанием передачи

mixin movie-card(movie)
  tr
    td(class=movie.genre)
      i= movie.time
      p= movie.title
      span
        img(src='images/' + movie.image alt=movie.title)
        p= movie.info

// После этого мы импортируем базу данных, которая отобразится в ячейках нашей таблицы.
// Например, база телеканала Fox за вторник

include ./data/tuesday-fox.pug

// И отрисовываем нашу таблицу. В теге thead содержится логотип телеканала. В теге tbody
// мы описываем цикл, который и отобразит все наши телепередачи канала Fox за вторник

table
  thead: tr: td
    .fox
  tbody
    for movie in tuesdayFox
      +movie-card(movie)
```

Пример того, как хранятся данные:

```jade
-
  var tuesdayFox = [
    {
      title: 'The Big Bang Theory',
      time: '6:00 AM',
      genre: 'tv-series',
      info: 'Unable to get Comic-Con tickets, Sheldon tries to hold his own convention and ends up spending a wild evening with James Earl Jones; the ladies try to act maturely',
      image: 'the-big-bang-theory.jpg'
    }, {
      title: 'The Simpsons',
      time: '6:30 AM',
      genre: 'tv-series',
      info: '',
      image: 'the-simpsons.jpg'
    }, {
      // .....
    }
  ]
```

Ну и напоследок немного о том, как работает обрабатывается событие клика на фильтр по передачам. Хотя, тут всё просто:

```jade
button(tabindex='0' class='filter-tv-series') TV Series
button(tabindex='0' class='filter-sport') Sport
```

```css
/* Используем псевдокласс :focus. При клике на кнопку изменяем цвет фона и текста
ячейки таблицы, которая содержит класс, говорящий нам о жанре телепередачи */

.filter-tv-series:focus ~ .channels table tbody tr .tv-series,
.filter-cinema:focus ~ .channels table tbody tr .cinema {
  background: color(var(--mainColor) lightness(30%));
  color: #f;
}
```

В остальном, я думаю, всё просто. Спасибо за внимание!
