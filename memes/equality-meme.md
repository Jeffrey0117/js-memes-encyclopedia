# JavaScript相等性比較的奇異世界

![JavaScript Equality](https://i.imgur.com/dVDQiVz.gif)

## 令人困惑的程式碼
```javascript
// == vs === 的困惑
console.log(0 == false);          // true
console.log(0 === false);         // false

console.log("" == false);         // true
console.log("" === false);        // false

console.log(null == undefined);   // true
console.log(null === undefined);  // false

// 陣列比較的混亂
console.log([] == false);         // true
console.log([] == 0);             // true
console.log([] == "");            // true
console.log("" == 0);             // true

// 但是...
console.log([] == []);            // false (不同物件參考)
console.log({} == {});            // false (不同物件參考)

// 最經典的
console.log(0.1 + 0.2 == 0.3);    // false
console.log(0.1 + 0.2);           // 0.30000000000000004
```

## 為什麼會發生這種情況？

### 1. 抽象相等比較 (==)
JavaScript的 `==` 運算子會進行類型轉換：
- 如果類型不同，JavaScript會嘗試轉換其中一個或兩個值
- 轉換規則複雜且有時違反直覺

### 2. 嚴格相等比較 (===)
`===` 運算子不進行類型轉換：
- 類型必須相同
- 值必須完全相等

### 3. 物件比較
- 物件比較的是參考（reference），不是內容
- 每次建立新物件都有新的參考

### 4. 浮點數精度
- JavaScript使用IEEE 754雙精度浮點數
- 某些小數無法精確表示

## 最佳實踐

```javascript
// 1. 總是使用 ===
if (value === 42) { /* ... */ }

// 2. 明確型別檢查
if (typeof value === 'string' && value.length > 0) { /* ... */ }

// 3. 物件比較使用深度比較函數
function deepEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// 4. 浮點數比較使用容差
function floatEqual(a, b, epsilon = Number.EPSILON) {
    return Math.abs(a - b) < epsilon;
}

console.log(floatEqual(0.1 + 0.2, 0.3)); // true
```

## 記憶口訣
> 「==是魔法師，===是數學家」  
> 魔法師會變把戲（類型轉換），數學家只講事實（嚴格比較）

## 相關概念
- 抽象相等比較演算法
- 嚴格相等比較
- IEEE 754標準
- 物件參考與值的區別