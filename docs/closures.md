# JavaScript 閉包 (Closures) - 完整指南

閉包是JavaScript最強大也最容易被誤解的特性之一。理解閉包對於掌握JavaScript至關重要。

## 什麼是閉包？

**閉包是函數與其詞法環境的組合。**換句話說，閉包讓你可以在一個內部函數中訪問到其外部函數的作用域。

## 基本範例

```javascript
function outerFunction(x) {
    // 外部函數的變數
    const outerVariable = x;
    
    function innerFunction(y) {
        // 內部函數可以訪問外部函數的變數
        console.log(outerVariable + y);
    }
    
    return innerFunction;
}

const closure = outerFunction(10);
closure(5); // 輸出: 15
```

## 閉包的特性

### 1. 變數持久性
```javascript
function createCounter() {
    let count = 0;
    
    return function() {
        count++;
        return count;
    };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 (獨立的計數器)
```

### 2. 私有變數模擬
```javascript
function Person(name) {
    let _name = name; // 私有變數
    
    return {
        getName: function() {
            return _name;
        },
        setName: function(newName) {
            if (typeof newName === 'string' && newName.length > 0) {
                _name = newName;
            }
        }
    };
}

const person = Person("Alice");
console.log(person.getName()); // "Alice"
person.setName("Bob");
console.log(person.getName()); // "Bob"
console.log(person._name); // undefined (無法直接訪問)
```

## 實際應用場景

### 1. 模組模式
```javascript
const myModule = (function() {
    let privateVariable = 0;
    
    function privateFunction() {
        console.log('This is private');
    }
    
    return {
        publicMethod: function() {
            privateVariable++;
            return privateVariable;
        },
        getPrivateVariable: function() {
            return privateVariable;
        }
    };
})();

console.log(myModule.publicMethod()); // 1
console.log(myModule.getPrivateVariable()); // 1
```

### 2. 事件處理器
```javascript
function attachListeners() {
    let clickCount = 0;
    
    document.getElementById('button').addEventListener('click', function() {
        clickCount++;
        console.log(`Button clicked ${clickCount} times`);
    });
}
```

### 3. 函數工廠
```javascript
function multiplierFactory(multiplier) {
    return function(x) {
        return x * multiplier;
    };
}

const double = multiplierFactory(2);
const triple = multiplierFactory(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

## 常見陷阱

### 1. 迴圈中的閉包
```javascript
// 問題程式碼
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i); // 輸出: 3, 3, 3
    }, 100);
}

// 解決方案1: 使用let
for (let i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i); // 輸出: 0, 1, 2
    }, 100);
}

// 解決方案2: 使用閉包
for (var i = 0; i < 3; i++) {
    (function(j) {
        setTimeout(function() {
            console.log(j); // 輸出: 0, 1, 2
        }, 100);
    })(i);
}
```

### 2. 記憶體洩漏
```javascript
// 潛在的記憶體洩漏
function problematicClosure() {
    let largeData = new Array(1000000).fill('data');
    
    return function() {
        // 即使不使用largeData，它仍然被保持在記憶體中
        console.log('Function called');
    };
}

// 改善版本
function betterClosure() {
    let largeData = new Array(1000000).fill('data');
    let result = largeData.length; // 提取需要的資料
    largeData = null; // 釋放大型物件
    
    return function() {
        console.log(`Data length was: ${result}`);
    };
}
```

## 進階概念

### 1. 閉包與this
```javascript
const obj = {
    name: 'Object',
    method: function() {
        return function() {
            console.log(this.name); // undefined (非嚴格模式) 或 TypeError (嚴格模式)
        };
    },
    
    arrowMethod: function() {
        return () => {
            console.log(this.name); // "Object" (箭頭函數繼承this)
        };
    }
};
```

### 2. 閉包與垃圾回收
```javascript
function createClosure() {
    let data = "I will be kept alive";
    let unused = "I might be garbage collected";
    
    return function() {
        return data; // 只有被引用的變數會被保持
    };
}
```

## 最佳實踐

### 1. 明確意圖
```javascript
// 好的：清楚表達閉包的用途
function createValidator(pattern) {
    const regex = new RegExp(pattern);
    
    return function validate(input) {
        return regex.test(input);
    };
}

const emailValidator = createValidator(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
```

### 2. 避免不必要的閉包
```javascript
// 不好的：不必要的閉包
function processArray(arr) {
    return arr.map(function(item) {
        return item * 2;
    });
}

// 好的：使用已存在的函數
function double(x) { return x * 2; }
function processArray(arr) {
    return arr.map(double);
}
```

## 記憶口訣
> 「閉包是函數的記憶體」  
> 函數記住了它出生時的環境，即使後來搬到別的地方，依然記得老家的一切。

## 相關概念
- 詞法作用域 (Lexical Scope)
- 作用域鏈 (Scope Chain)
- 執行環境 (Execution Context)
- 垃圾回收 (Garbage Collection)
- 模組模式 (Module Pattern)