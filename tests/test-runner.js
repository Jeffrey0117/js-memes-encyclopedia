// JavaScript Memes Encyclopedia - 測試框架
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async run() {
        console.log('🚀 開始執行測試...\n');
        
        for (const { name, testFn } of this.tests) {
            try {
                await testFn();
                console.log(`🟢 ${name}`);
                this.passed++;
            } catch (error) {
                console.log(`🔴 ${name}: ${error.message}`);
                this.failed++;
            }
        }
        
        console.log(`\n📊 測試結果: ${this.passed} 通過, ${this.failed} 失敗`);
        return this.failed === 0;
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    assertContains(container, item, message) {
        if (!container.includes(item)) {
            throw new Error(message || `Expected container to include ${item}`);
        }
    }
}

// 檔案結構測試
const testFileStructure = new TestRunner();

testFileStructure.test('檢查專案結構 - README.md存在', () => {
    // 模擬檔案檢查
    const fs = require('fs');
    testFileStructure.assert(fs.existsSync('README.md'), 'README.md 不存在');
});

testFileStructure.test('檢查專案結構 - plan.md存在', () => {
    const fs = require('fs');
    testFileStructure.assert(fs.existsSync('plan.md'), 'plan.md 不存在');
});

testFileStructure.test('檢查memes目錄結構', () => {
    const fs = require('fs');
    testFileStructure.assert(fs.existsSync('memes'), 'memes 目錄不存在');
    testFileStructure.assert(fs.existsSync('memes/wat-meme.md'), 'wat-meme.md 不存在');
    testFileStructure.assert(fs.existsSync('memes/this-is-fine-meme.md'), 'this-is-fine-meme.md 不存在');
    testFileStructure.assert(fs.existsSync('memes/equality-meme.md'), 'equality-meme.md 不存在');
    testFileStructure.assert(fs.existsSync('memes/hoisting-meme.md'), 'hoisting-meme.md 不存在');
    testFileStructure.assert(fs.existsSync('memes/this-binding-meme.md'), 'this-binding-meme.md 不存在');
});

testFileStructure.test('檢查quotes目錄結構', () => {
    const fs = require('fs');
    testFileStructure.assert(fs.existsSync('quotes'), 'quotes 目錄不存在');
    testFileStructure.assert(fs.existsSync('quotes/brenndan-eich.md'), 'brenndan-eich.md 不存在');
    testFileStructure.assert(fs.existsSync('quotes/douglas-crockford.md'), 'douglas-crockford.md 不存在');
    testFileStructure.assert(fs.existsSync('quotes/kyle-simpson.md'), 'kyle-simpson.md 不存在');
});

testFileStructure.test('檢查docs目錄結構', () => {
    const fs = require('fs');
    testFileStructure.assert(fs.existsSync('docs'), 'docs 目錄不存在');
    testFileStructure.assert(fs.existsSync('docs/type-coercion.md'), 'type-coercion.md 不存在');
    testFileStructure.assert(fs.existsSync('docs/closures.md'), 'closures.md 不存在');
    testFileStructure.assert(fs.existsSync('docs/async-await.md'), 'async-await.md 不存在');
    testFileStructure.assert(fs.existsSync('docs/prototype-chain.md'), 'prototype-chain.md 不存在');
    testFileStructure.assert(fs.existsSync('docs/event-loop.md'), 'event-loop.md 不存在');
});

testFileStructure.test('檢查public目錄結構', () => {
    const fs = require('fs');
    testFileStructure.assert(fs.existsSync('public'), 'public 目錄不存在');
    testFileStructure.assert(fs.existsSync('public/index.html'), 'index.html 不存在');
    testFileStructure.assert(fs.existsSync('public/styles.css'), 'styles.css 不存在');
    testFileStructure.assert(fs.existsSync('public/script.js'), 'script.js 不存在');
    testFileStructure.assert(fs.existsSync('public/markdown-loader.js'), 'markdown-loader.js 不存在');
    testFileStructure.assert(fs.existsSync('public/code-executor.js'), 'code-executor.js 不存在');
});

// 內容品質測試
const testContentQuality = new TestRunner();

testContentQuality.test('檢查README內容品質', () => {
    const fs = require('fs');
    const content = fs.readFileSync('README.md', 'utf8');
    testContentQuality.assertContains(content, 'js-memes-encyclopedia', 'README缺少專案名稱');
    testContentQuality.assertContains(content, 'JavaScript', 'README缺少JavaScript關鍵字');
});

testContentQuality.test('檢查memes內容品質', () => {
    const fs = require('fs');
    const watContent = fs.readFileSync('memes/wat-meme.md', 'utf8');
    testContentQuality.assertContains(watContent, '```javascript', 'wat-meme缺少程式碼範例');
    testContentQuality.assertContains(watContent, '## 解釋', 'wat-meme缺少解釋章節');
});

// 網站功能測試
const testWebsiteFeatures = new TestRunner();

testWebsiteFeatures.test('檢查HTML結構', () => {
    const fs = require('fs');
    const html = fs.readFileSync('public/index.html', 'utf8');
    testWebsiteFeatures.assertContains(html, '<title>', 'HTML缺少title標籤');
    testWebsiteFeatures.assertContains(html, 'viewport', 'HTML缺少viewport設定');
    testWebsiteFeatures.assertContains(html, 'searchInput', 'HTML缺少搜尋功能');
});

testWebsiteFeatures.test('檢查CSS樣式', () => {
    const fs = require('fs');
    const css = fs.readFileSync('public/styles.css', 'utf8');
    testWebsiteFeatures.assertContains(css, ':root', 'CSS缺少CSS變數定義');
    testWebsiteFeatures.assertContains(css, 'responsive', 'CSS缺少響應式設計');
});

testWebsiteFeatures.test('檢查JavaScript功能', () => {
    const fs = require('fs');
    const js = fs.readFileSync('public/script.js', 'utf8');
    testWebsiteFeatures.assertContains(js, 'addEventListener', 'JS缺少事件監聽器');
    testWebsiteFeatures.assertContains(js, 'search', 'JS缺少搜尋功能');
});

testWebsiteFeatures.test('檢查Markdown載入器', () => {
    const fs = require('fs');
    testWebsiteFeatures.assert(fs.existsSync('public/markdown-loader.js'), 'markdown-loader.js不存在');
    const loader = fs.readFileSync('public/markdown-loader.js', 'utf8');
    testWebsiteFeatures.assertContains(loader, 'MarkdownLoader', 'JS缺少MarkdownLoader類');
    testWebsiteFeatures.assertContains(loader, 'loadMarkdown', 'JS缺少loadMarkdown方法');
});

testWebsiteFeatures.test('檢查HTML整合Markdown載入器', () => {
    const fs = require('fs');
    const html = fs.readFileSync('public/index.html', 'utf8');
    testWebsiteFeatures.assertContains(html, 'markdown-loader.js', 'HTML未引入markdown-loader.js');
});

testWebsiteFeatures.test('檢查動態載入功能', () => {
    const fs = require('fs');
    const js = fs.readFileSync('public/script.js', 'utf8');
    testWebsiteFeatures.assertContains(js, 'window.markdownLoader', 'JS未使用markdownLoader');
    testWebsiteFeatures.assertContains(js, 'loadMarkdown', 'JS缺少loadMarkdown調用');
});

testWebsiteFeatures.test('檢查程式碼執行器', () => {
    const fs = require('fs');
    testWebsiteFeatures.assert(fs.existsSync('public/code-executor.js'), 'code-executor.js不存在');
    const executor = fs.readFileSync('public/code-executor.js', 'utf8');
    testWebsiteFeatures.assertContains(executor, 'class CodeExecutor', 'JS缺少CodeExecutor類');
    testWebsiteFeatures.assertContains(executor, 'executeCode', 'JS缺少executeCode方法');
});

testWebsiteFeatures.test('檢查HTML整合程式碼執行器', () => {
    const fs = require('fs');
    const html = fs.readFileSync('public/index.html', 'utf8');
    testWebsiteFeatures.assertContains(html, 'code-executor.js', 'HTML未引入code-executor.js');
});

testWebsiteFeatures.test('檢查程式碼執行器功能', () => {
    const fs = require('fs');
    const js = fs.readFileSync('public/script.js', 'utf8');
    testWebsiteFeatures.assertContains(js, 'showCodeEditor', 'JS缺少showCodeEditor函數');
});

// 執行所有測試
async function runAllTests() {
    console.log('🧪 JavaScript Memes Encyclopedia - 測試套件\n');
    
    console.log('=== 檔案結構測試 ===');
    const structureResult = await testFileStructure.run();
    
    console.log('\n=== 內容品質測試 ===');
    const contentResult = await testContentQuality.run();
    
    console.log('\n=== 網站功能測試 ===');
    const featuresResult = await testWebsiteFeatures.run();
    
    const allPassed = structureResult && contentResult && featuresResult;
    
    console.log('\n' + '='.repeat(50));
    if (allPassed) {
        console.log('🟢 所有測試通過！專案狀態良好');
    } else {
        console.log('🔴 部分測試失敗，需要修復');
    }
    console.log('='.repeat(50));
    
    return allPassed;
}

// 如果直接執行此檔案
if (require.main === module) {
    runAllTests();
}

module.exports = { TestRunner, runAllTests };