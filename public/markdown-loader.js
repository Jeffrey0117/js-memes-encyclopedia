// Markdown 動態載入器
class MarkdownLoader {
    constructor() {
        this.cache = new Map();
        this.baseUrl = './';
    }

    async loadMarkdown(filePath) {
        // 檢查快取
        if (this.cache.has(filePath)) {
            console.log(`📄 從快取載入: ${filePath}`);
            return this.cache.get(filePath);
        }

        try {
            console.log(`🔄 載入檔案: ${filePath}`);
            const response = await fetch(this.baseUrl + filePath);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const markdownText = await response.text();
            const htmlContent = this.parseMarkdown(markdownText);
            
            // 存入快取
            this.cache.set(filePath, htmlContent);
            console.log(`✅ 成功載入: ${filePath}`);
            
            return htmlContent;
        } catch (error) {
            console.error(`❌ 載入失敗: ${filePath}`, error);
            return this.getErrorContent(filePath, error);
        }
    }

    parseMarkdown(markdown) {
        let html = markdown;
        
        // 轉換標題
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        
        // 轉換程式碼區塊
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, 
            '<pre><code class="language-$1">$2</code></pre>');
        
        // 轉換inline程式碼
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // 轉換粗體
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // 轉換斜體
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // 轉換連結
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // 轉換列表
        html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // 轉換引用
        html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
        
        // 轉換段落
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';
        
        // 清理空段落
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[123]>)/g, '$1');
        html = html.replace(/(<\/h[123]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>)/g, '$1');
        html = html.replace(/(<\/pre>)<\/p>/g, '$1');
        
        return html;
    }

    getErrorContent(filePath, error) {
        return `
            <div class="error-content">
                <h2>⚠️ 載入錯誤</h2>
                <p><strong>檔案:</strong> ${filePath}</p>
                <p><strong>錯誤:</strong> ${error.message}</p>
                <p>請檢查檔案路徑是否正確，或稍後再試。</p>
                <details>
                    <summary>技術詳情</summary>
                    <pre><code>${error.stack || error.toString()}</code></pre>
                </details>
            </div>
        `;
    }

    clearCache() {
        this.cache.clear();
        console.log('🗑️ 快取已清空');
    }

    getCacheInfo() {
        return {
            size: this.cache.size,
            files: Array.from(this.cache.keys())
        };
    }
}

// 建立全域實例
window.markdownLoader = new MarkdownLoader();

// 測試函數
window.testMarkdownLoader = async function() {
    console.log('🧪 測試 Markdown 載入器...');
    
    const testFiles = [
        'memes/wat-meme.md',
        'quotes/douglas-crockford.md',
        'docs/type-coercion.md'
    ];
    
    for (const file of testFiles) {
        try {
            const content = await window.markdownLoader.loadMarkdown(file);
            console.log(`🟢 測試通過: ${file}`);
        } catch (error) {
            console.log(`🔴 測試失敗: ${file} - ${error.message}`);
        }
    }
    
    console.log('📊 快取資訊:', window.markdownLoader.getCacheInfo());
};

console.log('📚 Markdown 載入器已初始化');