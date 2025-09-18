# JavaScript變數提升(Hoisting) - 時間旅行者的噩夢

![Hoisting Confusion](https://i.imgur.com/VKx6riy.jpg)

## 令人困惑的程式碼
```javascript
console.log(x); // undefined (不是ReferenceError!)
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

console.log(z); // ReferenceError: Cannot access 'z' before initialization  
const z = 15;

// 函數提升更神奇
console.log(foo()); // "Hello from foo!" (works!)

function foo() {
    return "Hello from foo!";
}

console.log(bar()); // TypeError: bar is not a function
var bar = function() {
    return "Hello from bar!";
};

console.log(baz()); // ReferenceError: Cannot access 'baz' before initialization
const baz = () => {
    return "Hello from baz!";
};
```

## 這是什麼魔法？

### 變數提升(Variable Hoisting)
JavaScript引擎在執行前會先掃描程式碼，將變數宣告「提升」到作用域頂部：

```javascript
// 你寫的程式碼
console.log(x);
var x = 5;

// JavaScript引擎看到的
var x; // undefined
console.log(x); // undefined
x = 5;
```

### 函數提升(Function Hoisting)
函數宣告會完全提升：
```javascript
// 你寫的程式碼
sayHello(); // "Hello!"

function sayHello() {
    console.log("Hello!");
}

// JavaScript引擎看到的
function sayHello() {
    console.log("Hello!");
}
sayHello(); // "Hello!"
```

### let和const的時間死區(Temporal Dead Zone)
```javascript
console.log(typeof x); // "undefined"
console.log(typeof y); // ReferenceError!

var x;
let y;
```

## 常見陷阱
```javascript
// 陷阱1: 迴圈中的閉包
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100); // 印出 3, 3, 3
}

// 解決方案1: 使用let
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100); // 印出 0, 1, 2
}

// 陷阱2: 意外的全域變數
function oops() {
    x = 1; // 沒有var/let/const，變成全域變數！
    var y = 2;
}

// 陷阱3: 函數表達式提升
console.log(typeof foo); // "function"
console.log(typeof bar); // "undefined"

function foo() {}
var bar = function() {};
```

## 最佳實踐
```javascript
// 1. 使用let和const替代var
const PI = 3.14159;
let counter = 0;

// 2. 在使用前先宣告
let name;
console.log(name); // undefined，但不會出錯

// 3. 函數宣告放在作用域頂部
function myFunction() {
    // function body
}

// 4. 使用strict mode
'use strict';
// 這樣可以防止意外建立全域變數
```

## 記憶訣竅
> 「var是電梯，let/const是樓梯」  
> var會把宣告搭電梯到頂樓，但值還在原地；  
> let/const要一步一步走樓梯，到達前不能使用。

## 相關概念
- 執行環境(Execution Context)
- 變數環境(Variable Environment)
- 時間死區(Temporal Dead Zone)
- 作用域鏈(Scope Chain)