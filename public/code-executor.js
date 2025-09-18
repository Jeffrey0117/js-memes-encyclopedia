// JavaScript 程式碼執行器
class CodeExecutor {
    constructor() {
        this.sandboxedConsole = [];
        this.isExecuting = false;
    }

    // 建立安全的執行環境
    createSafeEnvironment() {
        return {
            console: {
                log: (...args) => {
                    this.sandboxedConsole.push({
                        type: 'log',
                        args: args.map(arg => this.formatValue(arg)),
                        timestamp: Date.now()
                    });
                },
                error: (...args) => {
                    this.sandboxedConsole.push({
                        type: 'error',
                        args: args.map(arg => this.formatValue(arg)),
                        timestamp: Date.now()
                    });
                },
                warn: (...args) => {
                    this.sandboxedConsole.push({
                        type: 'warn',
                        args: args.map(arg => this.formatValue(arg)),
                        timestamp: Date.now()
                    });
                }
            },
            setTimeout: (fn, delay) => {
                if (delay > 5000) delay = 5000; // 最多5秒
                return setTimeout(fn, delay);
            }
        };
    }

    // 格式化輸出值
    formatValue(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'string') return `"${value}"`;
        if (typeof value === 'function') return '[Function]';
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value, null, 2);
            } catch (e) {
                return '[Object (circular)]';
            }
        }
        return String(value);
    }

    // 安全執行程式碼
    async executeCode(code) {
        if (this.isExecuting) {
            throw new Error('程式碼正在執行中，請稍候...');
        }

        this.isExecuting = true;
        this.sandboxedConsole = [];

        try {
            // 檢查危險操作
            this.validateCode(code);

            // 建立安全環境
            const safeEnv = this.createSafeEnvironment();

            // 執行程式碼
            const wrappedCode = `
                (function() {
                    ${code}
                })();
            `;

            // 使用Function建構子而非eval，相對安全
            const result = new Function(
                'console', 'setTimeout',
                `try { ${wrappedCode} } catch(e) { console.error(e.message); }`
            )(safeEnv.console, safeEnv.setTimeout);

            return {
                success: true,
                console: this.sandboxedConsole,
                result: this.formatValue(result)
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                console: this.sandboxedConsole
            };
        } finally {
            this.isExecuting = false;
        }
    }

    // 驗證程式碼安全性
    validateCode(code) {
        const dangerousPatterns = [
            /document\./,
            /window\./,
            /location\./,
            /localStorage\./,
            /sessionStorage\./,
            /XMLHttpRequest/,
            /fetch\(/,
            /import\s+/,
            /require\(/,
            /eval\(/,
            /Function\(/,
            /while\s*\(\s*true\s*\)/,
            /for\s*\(\s*;\s*;\s*\)/
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(code)) {
                throw new Error(`程式碼包含不安全的操作: ${pattern.source}`);
            }
        }

        // 檢查程式碼長度
        if (code.length > 5000) {
            throw new Error('程式碼太長，請縮短至5000字符以內');
        }
    }

    // 獲取執行歷史
    getExecutionHistory() {
        return this.sandboxedConsole;
    }

    // 清空歷史
    clearHistory() {
        this.sandboxedConsole = [];
    }
}

// 程式碼編輯器UI組件
class CodeEditor {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.executor = new CodeExecutor();
        this.init();
    }

    init() {
        this.createEditor();
        this.setupEventListeners();
        this.loadExamples();
    }

    createEditor() {
        this.container.innerHTML = `
            <div class="code-editor">
                <div class="editor-header">
                    <h3>🧪 JavaScript 程式碼實驗室</h3>
                    <div class="editor-controls">
                        <select id="codeExamples" class="example-selector">
                            <option value="">選擇範例...</option>
                        </select>
                        <button id="runCode" class="run-button">▶️ 執行</button>
                        <button id="clearCode" class="clear-button">🗑️ 清空</button>
                    </div>
                </div>
                <textarea id="codeInput" class="code-input" placeholder="在這裡輸入 JavaScript 程式碼...">// 試試這個經典的類型轉換範例
console.log([] + []);
console.log([] + {});
console.log({} + []);
console.log(true + false);
console.log("5" + 3);
console.log("5" - 3);</textarea>
                <div class="editor-output">
                    <div class="output-header">
                        <span>📄 執行結果</span>
                        <button id="clearOutput" class="clear-output">清空輸出</button>
                    </div>
                    <div id="codeOutput" class="code-output"></div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        document.getElementById('runCode').addEventListener('click', () => this.runCode());
        document.getElementById('clearCode').addEventListener('click', () => this.clearCode());
        document.getElementById('clearOutput').addEventListener('click', () => this.clearOutput());
        document.getElementById('codeExamples').addEventListener('change', (e) => this.loadExample(e.target.value));
        
        // 快捷鍵支援
        document.getElementById('codeInput').addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.runCode();
            }
        });
    }

    loadExamples() {
        const examples = {
            'type-coercion': {
                name: '類型轉換範例',
                code: `// JavaScript 類型轉換的有趣行為
console.log('=== 加法運算子 ===');
console.log([] + []);          // ""
console.log([] + {});          // "[object Object]"
console.log({} + []);          // 0 (在某些環境中)
console.log(true + false);     // 1
console.log("5" + 3);          // "53"

console.log('\\n=== 減法運算子 ===');
console.log("5" - 3);          // 2
console.log([] - {});          // NaN
console.log(true - false);     // 1`
            },
            'equality': {
                name: '相等性比較',
                code: `// == vs === 的差異
console.log('=== 寬鬆相等 (==) ===');
console.log(0 == false);       // true
console.log("" == false);      // true
console.log(null == undefined); // true
console.log("5" == 5);         // true

console.log('\\n=== 嚴格相等 (===) ===');
console.log(0 === false);      // false
console.log("" === false);     // false
console.log(null === undefined); // false
console.log("5" === 5);        // false

console.log('\\n=== 浮點數精度 ===');
console.log(0.1 + 0.2);        // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false`
            },
            'hoisting': {
                name: '變數提升',
                code: `// 變數提升範例
console.log('=== var 提升 ===');
console.log(x); // undefined (不是錯誤!)
var x = 5;
console.log(x); // 5

console.log('\\n=== 函數提升 ===');
sayHello(); // "Hello!" (可以在宣告前調用)

function sayHello() {
    console.log("Hello!");
}

console.log('\\n=== let/const 時間死區 ===');
try {
    console.log(y); // ReferenceError
} catch(e) {
    console.error('錯誤:', e.message);
}
let y = 10;`
            },
            'closures': {
                name: '閉包範例',
                code: `// 閉包的威力
console.log('=== 計數器閉包 ===');
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

console.log('\\n=== 模組模式 ===');
const calculator = (function() {
    let result = 0;
    return {
        add: function(x) { result += x; return this; },
        multiply: function(x) { result *= x; return this; },
        getResult: function() { return result; }
    };
})();

console.log(calculator.add(5).multiply(2).getResult()); // 10`
            }
        };

        const selector = document.getElementById('codeExamples');
        Object.keys(examples).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = examples[key].name;
            selector.appendChild(option);
        });

        this.examples = examples;
    }

    async runCode() {
        const code = document.getElementById('codeInput').value.trim();
        if (!code) {
            this.showOutput('請輸入程式碼', 'error');
            return;
        }

        const output = document.getElementById('codeOutput');
        output.innerHTML = '<div class="running">🔄 執行中...</div>';

        try {
            const result = await this.executor.executeCode(code);
            this.displayResult(result);
        } catch (error) {
            this.showOutput(`執行錯誤: ${error.message}`, 'error');
        }
    }

    displayResult(result) {
        const output = document.getElementById('codeOutput');
        let html = '';

        if (result.console && result.console.length > 0) {
            result.console.forEach(log => {
                const className = `console-${log.type}`;
                const args = log.args.join(' ');
                html += `<div class="${className}">${args}</div>`;
            });
        }

        if (!result.success && result.error) {
            html += `<div class="console-error">❌ ${result.error}</div>`;
        }

        if (!html) {
            html = '<div class="console-info">✅ 程式碼執行完成，無輸出</div>';
        }

        output.innerHTML = html;
    }

    showOutput(message, type = 'info') {
        const output = document.getElementById('codeOutput');
        output.innerHTML = `<div class="console-${type}">${message}</div>`;
    }

    clearCode() {
        document.getElementById('codeInput').value = '';
    }

    clearOutput() {
        document.getElementById('codeOutput').innerHTML = '';
    }

    loadExample(exampleKey) {
        if (exampleKey && this.examples[exampleKey]) {
            document.getElementById('codeInput').value = this.examples[exampleKey].code;
        }
    }
}

// 全域初始化
window.CodeExecutor = CodeExecutor;
window.CodeEditor = CodeEditor;

console.log('🧪 程式碼執行器已載入');