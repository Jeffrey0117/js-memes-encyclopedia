# "This is Fine" - JavaScript Edition

![This is Fine](https://i.imgur.com/c4jt321.png)

## The Code
```javascript
function add(a, b) {
    return a + b;
}

console.log(add(1, 2));           // 3 (expected)
console.log(add("1", "2"));       // "12" (wat?)
console.log(add([], {}));         // "[object Object]"
console.log(add({}, []));         // "[object Object]"
console.log(add(true, false));    // 1
console.log(add(null, undefined)); // NaN
```

## 為什麼會這樣？

這個meme完美展現了JavaScript開發者的心境：明明寫了一個簡單的加法函數，但因為JavaScript的自動類型轉換，結果常常出乎意料。

### 問題分析：
1. **字串優先**: 當任一操作數是字串時，`+` 變成字串連接
2. **隱式轉換**: JavaScript會自動將物件轉換為字串或數字
3. **布林轉換**: `true` 變成 1，`false` 變成 0
4. **null/undefined**: `null` 變成 0，`undefined` 變成 `NaN`

## 解決方案
```javascript
function safeAdd(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('Both arguments must be numbers');
    }
    return a + b;
}

// 或使用TypeScript
function add(a: number, b: number): number {
    return a + b;
}
```

## 相關概念
- 類型轉換 (Type Coercion)
- 運算子優先級
- 防禦性程式設計