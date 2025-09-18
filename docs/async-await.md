# Async/Await - 現代異步編程

## 概述

Async/Await 是 ES2017 (ES8) 引入的語法糖，讓異步代碼看起來像同步代碼，大大提升了代碼的可讀性和維護性。

## 基礎語法

### async 函數

```javascript
async function fetchData() {
    // async 函數總是返回 Promise
    return "Hello World";
}

// 等同於
function fetchData() {
    return Promise.resolve("Hello World");
}
```

### await 關鍵字

```javascript
async function example() {
    // await 只能在 async 函數內使用
    const result = await fetchData();
    console.log(result); // "Hello World"
}
```

## 實際應用

### 取代 Promise 鏈

**使用 Promise：**
```javascript
function getData() {
    return fetch('/api/user')
        .then(response => response.json())
        .then(user => fetch(`/api/posts/${user.id}`))
        .then(response => response.json())
        .then(posts => {
            console.log('用戶文章:', posts);
            return posts;
        })
        .catch(error => {
            console.error('錯誤:', error);
        });
}
```

**使用 Async/Await：**
```javascript
async function getData() {
    try {
        const userResponse = await fetch('/api/user');
        const user = await userResponse.json();
        
        const postsResponse = await fetch(`/api/posts/${user.id}`);
        const posts = await postsResponse.json();
        
        console.log('用戶文章:', posts);
        return posts;
    } catch (error) {
        console.error('錯誤:', error);
    }
}
```

## 錯誤處理

### try-catch 模式

```javascript
async function handleError() {
    try {
        const data = await riskyOperation();
        return data;
    } catch (error) {
        console.error('操作失敗:', error.message);
        return null;
    }
}
```

### 混合 Promise 方法

```javascript
async function mixedApproach() {
    // 可以混合使用 await 和 .catch()
    const data = await fetchData().catch(err => {
        console.log('捕獲錯誤:', err);
        return 'default value';
    });
    return data;
}
```

## 並行執行

### Promise.all 與 async/await

```javascript
async function parallelExecution() {
    // 並行執行多個異步操作
    const [user, posts, comments] = await Promise.all([
        fetchUser(),
        fetchPosts(),
        fetchComments()
    ]);
    
    return { user, posts, comments };
}
```

### 順序 vs 並行

```javascript
// 順序執行（較慢）
async function sequential() {
    const a = await operation1(); // 等待 1 秒
    const b = await operation2(); // 等待 1 秒
    return [a, b]; // 總共 2 秒
}

// 並行執行（較快）
async function parallel() {
    const [a, b] = await Promise.all([
        operation1(), // 並行執行
        operation2()  // 並行執行
    ]);
    return [a, b]; // 總共 1 秒
}
```

## 常見陷阱

### 1. 忘記使用 await

```javascript
// ❌ 錯誤：沒有 await
async function wrong() {
    const result = fetchData(); // 返回 Promise，不是實際值
    console.log(result); // [object Promise]
}

// ✅ 正確：使用 await
async function correct() {
    const result = await fetchData();
    console.log(result); // 實際的值
}
```

### 2. 在循環中的誤用

```javascript
// ❌ 錯誤：順序執行（慢）
async function wrongLoop(items) {
    const results = [];
    for (const item of items) {
        results.push(await processItem(item));
    }
    return results;
}

// ✅ 正確：並行執行（快）
async function correctLoop(items) {
    const promises = items.map(item => processItem(item));
    return await Promise.all(promises);
}
```

### 3. 錯誤傳播

```javascript
// ❌ 錯誤：錯誤沒有被正確處理
async function badErrorHandling() {
    await riskyOperation(); // 如果失敗，錯誤會向上傳播
    console.log('這行可能不會執行');
}

// ✅ 正確：適當的錯誤處理
async function goodErrorHandling() {
    try {
        await riskyOperation();
        console.log('操作成功');
    } catch (error) {
        console.log('操作失敗，但程式繼續運行');
    }
}
```

## 實用技巧

### 1. 超時控制

```javascript
function timeout(ms) {
    return new Promise((_, reject) => 
        setTimeout(() => reject(new Error('超時')), ms)
    );
}

async function fetchWithTimeout() {
    try {
        const result = await Promise.race([
            fetchData(),
            timeout(5000) // 5 秒超時
        ]);
        return result;
    } catch (error) {
        console.log('請求超時或失敗');
    }
}
```

### 2. 重試機制

```javascript
async function retryOperation(operation, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            console.log(`重試 ${i + 1}/${maxRetries}`);
            await new Promise(resolve => setTimeout(resolve, 1000 * i));
        }
    }
}
```

### 3. 條件式執行

```javascript
async function conditionalExecution(condition) {
    const data = await fetchInitialData();
    
    if (condition) {
        // 只有在需要時才執行額外的異步操作
        const extraData = await fetchExtraData();
        return { ...data, ...extraData };
    }
    
    return data;
}
```

## 效能考量

### 記憶化異步函數

```javascript
const cache = new Map();

async function memoizedFetch(url) {
    if (cache.has(url)) {
        return cache.get(url);
    }
    
    const promise = fetch(url).then(r => r.json());
    cache.set(url, promise);
    
    try {
        return await promise;
    } catch (error) {
        cache.delete(url); // 失敗時清除緩存
        throw error;
    }
}
```

## 最佳實踐

1. **總是處理錯誤**：使用 try-catch 或 .catch()
2. **避免不必要的 await**：如果不需要等待結果，不要使用 await
3. **並行執行獨立操作**：使用 Promise.all 或 Promise.allSettled
4. **小心循環中的 await**：考慮是否需要順序執行
5. **為長時間運行的操作添加超時**
6. **使用有意義的錯誤消息**

## 總結

Async/Await 讓異步編程變得更加直觀和易於維護。掌握其正確用法和常見陷阱，能夠幫助你寫出更好的異步代碼。記住，async/await 只是 Promise 的語法糖，理解底層的 Promise 機制仍然很重要。