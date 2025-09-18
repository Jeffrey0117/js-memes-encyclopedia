# "You Don't Know JS" - Kyle Simpson

## 背景介紹
Kyle Simpson，綽號"getify"，是JavaScript社群中的知名教育家和作者。他最著名的作品是《You Don't Know JS》系列書籍，深入探討JavaScript的核心機制。

## 經典語錄

### "You Don't Know JS (Yet)"
> "JavaScript is not an interpreted language. It's a compiled language."

這句話挑戰了許多開發者對JavaScript的基本認知。

### "Scope & Closures"
> "Closure is when a function is able to remember and access its lexical scope even when that function is executing outside its lexical scope."

## 核心理念

### 1. 深度理解勝過表面技巧
```javascript
// 表面上看起來簡單
function foo() {
    var a = 2;
    function bar() {
        console.log(a);
    }
    return bar;
}

var baz = foo();
baz(); // 2 -- 這就是閉包！
```

### 2. JavaScript編譯過程
雖然JavaScript看起來是解釋型語言，但實際上會經過編譯：
1. **詞法分析** (Tokenizing/Lexing)
2. **語法分析** (Parsing) 
3. **程式碼生成** (Code Generation)

### 3. 作用域不是你想的那樣
```javascript
function foo(a) {
    var b = a;
    return a + b;
}

var c = foo(2);

// 引擎對話：
// Engine: "我需要 foo 的 RHS 查找"
// Scope: "找到了，它是一個函數"
// Engine: "我需要 a 的 LHS 查找"
// Scope: "找到了，這是 foo 的形參"
```

## 重要概念解析

### 閉包的實際應用
```javascript
// 模組模式
function Module() {
    var something = "cool";
    var another = [1, 2, 3];
    
    function doSomething() {
        console.log(something);
    }
    
    function doAnother() {
        console.log(another.join(" ! "));
    }
    
    return {
        doSomething: doSomething,
        doAnother: doAnother
    };
}

var foo = Module();
foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```

### this綁定規則
Kyle Simpson提出的四大this綁定規則：
1. **預設綁定** (Default Binding)
2. **隱式綁定** (Implicit Binding)  
3. **明式綁定** (Explicit Binding)
4. **new綁定** (new Binding)

```javascript
// 隱式綁定
var obj = {
    a: 2,
    foo: function() {
        console.log(this.a);
    }
};
obj.foo(); // 2

// 明式綁定
function foo() {
    console.log(this.a);
}
var obj = { a: 2 };
foo.call(obj); // 2
```

## You Don't Know JS 系列

### 核心書籍
1. **Scope & Closures** - 作用域與閉包
2. **this & Object Prototypes** - this與物件原型
3. **Types & Grammar** - 類型與語法
4. **Async & Performance** - 非同步與效能
5. **ES6 & Beyond** - ES6及未來

### 教學理念
- 不要只是複製貼上程式碼
- 理解語言的核心機制
- 學會問"為什麼"而不只是"怎麼做"

## 社群貢獻
- 開源專案維護者
- 技術會議講者
- JavaScript標準委員會參與者
- 線上教育平台講師

## 金句集錦
> "The path to learning JavaScript is not about shortcuts."

> "You can't write quality JS programs without understanding how the language actually works."

> "Scope is the set of rules that determines where and how a variable can be looked up."

## 影響
Kyle Simpson的工作幫助了無數開發者真正理解JavaScript，而不只是使用它。他強調概念理解的重要性，這在快節奏的開發環境中尤其珍貴。