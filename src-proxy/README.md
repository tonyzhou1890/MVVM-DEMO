# 通过proxy实现数据双向绑定

> 这个demo实现了以下功能：单向绑定、双向绑定、事件绑定

## 单向绑定

|指令|可用属性|例子|
|--|--|--|
|m-bind|'text', 'innerText', 'html', 'innerHTML', 'src', 'value', 'href', 'class', 'style', 'alt', 'title'|m-bind:text="query.tip"|

## 双向绑定

|指令|例子|
|--|--|
|m-model|m-model="query.query"|

## 事件绑定

|指令|可用事件|例子|
|--|--|--|
|m-on|'click', 'dbclick', 'input', 'focus', 'blur', 'change', 'load', 'select'|m-on:click="add"|

## 总结

&emsp;&emsp;功力还是不够，看不懂vue源码，也实现不了什么功能。