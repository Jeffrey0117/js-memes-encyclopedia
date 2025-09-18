# Event Loop - JavaScript的心跳機制

## 概述

Event Loop（事件循環）是JavaScript運行時的核心機制，它使得單線程的JavaScript能夠處理異步操作，如定時器、網絡請求、用戶交互等。理解Event Loop對於編寫高效的異步代碼至關重要。

## JavaScript的運行時模型

### 基本組件

```javascript
// JavaScript運行時包含以下組件：
// 1. Call Stack（調用堆疊）
// 2. Heap（堆）
// 3. Task Queue（任務隊列）
// 4. Microtask Queue（微任務隊列）
// 5. Web APIs（瀏覽器提供的API）

console.log('1'); // 同步執行

setTimeout(() => {
    console.log('2'); // 異步執行，進入Task Queue
}, 0);

Promise.resolve().then(() => {
    console.log('3'); // 異步執行，進入Microtask Queue
});

console.log('4'); // 同步執行

// 輸出順序：1, 4, 3, 2
```

## Event Loop的工作原理

### 基本流程

1. 執行Call Stack中的同步代碼
2. Call Stack為空時，檢查Microtask Queue
3. 執行所有Microtask
4. 檢查Task Queue
5. 執行一個Task
6. 重複步驟2-5

```javascript
console.log('=== Event Loop 示例 ===');

// 同步代碼
console.log('1: Sync');

// 宏任務（Macrotask）
setTimeout(() => console.log('2: setTimeout 1'), 0);

// 微任務（Microtask）
Promise.resolve().then(() => console.log('3: Promise 1'));

// 同步代碼
console.log('4: Sync');

// 更多異步操作
setTimeout(() => console.log('5: setTimeout 2'), 0);
Promise.resolve().then(() => console.log('6: Promise 2'));

// 輸出：1: Sync → 4: Sync → 3: Promise 1 → 6: Promise 2 → 2: setTimeout 1 → 5: setTimeout 2
```

## 宏任務與微任務

### 宏任務（Macrotasks）

常見的宏任務包括：
- setTimeout
- setInterval  
- setImmediate (Node.js)
- I/O 操作
- UI 渲染

### 微任務（Microtasks）

常見的微任務包括：
- Promise.then/catch/finally
- async/await
- queueMicrotask
- MutationObserver

## 實際應用場景

### 任務調度

```javascript
// 利用微任務進行狀態同步
function batchUpdates() {
    const updates = [];
    
    function scheduleUpdate(updateFn) {
        updates.push(updateFn);
        
        if (updates.length === 1) {
            Promise.resolve().then(() => {
                const currentUpdates = updates.splice(0);
                currentUpdates.forEach(update => update());
            });
        }
    }
    
    return scheduleUpdate;
}
```

### 避免阻塞主線程

```javascript
// 分片處理大型任務
function heavyComputationAsync(data) {
    return new Promise(resolve => {
        let index = 0;
        
        function processChunk() {
            const start = performance.now();
            
            while (index < 1000000 && (performance.now() - start < 5)) {
                // 處理數據
                index++;
            }
            
            if (index < 1000000) {
                setTimeout(processChunk, 0); // 讓出控制權
            } else {
                resolve(data);
            }
        }
        
        processChunk();
    });
}
```

## 最佳實踐

1. **理解異步操作的優先級**：微任務 > 宏任務
2. **避免長時間運行的同步代碼**：會阻塞Event Loop
3. **合理使用setTimeout(fn, 0)**：將任務延遲到下一個宏任務
4. **利用微任務進行狀態同步**：確保在DOM更新前執行
5. **分片處理大型任務**：避免阻塞用戶界面

## 總結

Event Loop是JavaScript異步編程的核心，理解它的工作原理有助於編寫更高效的異步代碼。記住：**JavaScript是單線程的，但通過Event Loop實現了並發處理的能力**。