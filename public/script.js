// JavaScript Memes & Quotes Encyclopedia - 主要腳本
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeNavigation();
    initializeModal();
    initializeAnimations();
});

// 搜尋功能
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const cards = document.querySelectorAll('.card');

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterCards(searchTerm, cards);
    });
}

function filterCards(searchTerm, cards) {
    cards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
        const keywords = card.dataset.keywords?.toLowerCase() || '';
        const content = title + ' ' + description + ' ' + keywords;

        if (content.includes(searchTerm)) {
            card.style.display = 'block';
            highlightSearchTerm(card, searchTerm);
        } else {
            card.style.display = 'none';
        }
    });
}

function highlightSearchTerm(card, searchTerm) {
    if (!searchTerm) return;

    const textElements = card.querySelectorAll('.card-title, .card-description');
    textElements.forEach(element => {
        const originalText = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlightedText = originalText.replace(regex, '<span class="highlight">$1</span>');
        
        if (highlightedText !== originalText) {
            element.innerHTML = highlightedText;
        }
    });
}

// 導航功能
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 模態框功能
function initializeModal() {
    const modal = document.getElementById('contentModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC鍵關閉模態框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('contentModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 載入內容到模態框
async function loadContent(filePath) {
    const modal = document.getElementById('contentModal');
    const modalBody = document.getElementById('modalBody');
    
    try {
        // 顯示載入動畫
        modalBody.innerHTML = '<div class="loading-container"><div class="loading"></div><p>載入中...</p></div>';
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // 使用真實的markdown載入器
        const content = await window.markdownLoader.loadMarkdown(filePath);
        modalBody.innerHTML = content;
        
        // 添加程式碼高亮
        highlightCode();
        
        // 記錄載入成功
        console.log(`🟢 內容載入成功: ${filePath}`);
        
    } catch (error) {
        console.error(`🔴 內容載入失敗: ${filePath}`, error);
        modalBody.innerHTML = `
            <div class="error-message">
                <h2>載入失敗</h2>
                <p>無法載入內容：${filePath}</p>
                <p>錯誤：${error.message}</p>
                <button onclick="loadContent('${filePath}')" style="margin-top: 1rem;">重試</button>
            </div>
        `;
    }
}

// 添加載入狀態指示器
function showLoadingIndicator(message = '載入中...') {
    return `
        <div class="loading-container" style="text-align: center; padding: 2rem;">
            <div class="loading"></div>
            <p style="margin-top: 1rem; color: var(--color-text-muted);">${message}</p>
        </div>
    `;
}

// 程式碼語法高亮（簡化版）
function highlightCode() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        let code = block.textContent;
        
        // 簡單的JavaScript語法高亮
        code = code.replace(/(console\.log|function|return|var|let|const|if|else|for|while)/g, 
            '<span style="color: #61dafb; font-weight: bold;">$1</span>');
        code = code.replace(/(".*?"|'.*?')/g, 
            '<span style="color: #98c379;">$1</span>');
        code = code.replace(/(\/\/.*$)/gm, 
            '<span style="color: #7c7c7c; font-style: italic;">$1</span>');
        code = code.replace(/(\d+)/g, 
            '<span style="color: #d19a66;">$1</span>');
        
        block.innerHTML = code;
    });
}

// 動畫初始化
function initializeAnimations() {
    // 滾動時的淡入動畫
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 觀察所有卡片
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// 顯示貢獻模態框
function showContributeModal() {
    const modal = document.getElementById('contentModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h1>🤝 貢獻內容</h1>
        <p>感謝您想要為JavaScript Memes & Quotes Encyclopedia做出貢獻！</p>
        
        <h2>如何貢獻</h2>
        <ol>
            <li>Fork這個專案的GitHub倉庫</li>
            <li>創建新的分支來添加您的內容</li>
            <li>按照現有格式添加新的memes、quotes或技術文檔</li>
            <li>提交Pull Request</li>
        </ol>
        
        <h2>內容指南</h2>
        <ul>
            <li><strong>Memes</strong>: 提供程式碼範例和詳細解釋</li>
            <li><strong>Quotes</strong>: 包含引用來源和背景說明</li>
            <li><strong>技術文檔</strong>: 確保準確性和實用性</li>
        </ul>
        
        <h2>文件格式</h2>
        <p>使用Markdown格式，參考現有文件的結構。</p>
        
        <div style="text-align: center; margin-top: 2rem;">
            <a href="https://github.com/yourproject/js-memes-encyclopedia" 
               target="_blank" 
               style="display: inline-block; background: var(--color-primary); color: var(--color-secondary); padding: 1rem 2rem; border-radius: 8px; font-weight: bold; text-decoration: none;">
                前往GitHub 📦
            </a>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 平滑滾動到頂部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 檢測滾動位置，顯示/隱藏返回頂部按鈕
window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
});

// 類型轉換演示器（互動功能）
function createTypeCoercionDemo() {
    return `
        <div class="demo-container">
            <h3>🧪 類型轉換實驗室</h3>
            <div class="demo-input">
                <input type="text" id="leftOperand" placeholder="左操作數" value="[]">
                <select id="operator">
                    <option value="+">+</option>
                    <option value="-">-</option>
                    <option value="==">==</option>
                    <option value="===">===</option>
                </select>
                <input type="text" id="rightOperand" placeholder="右操作數" value="{}">
                <button onclick="calculateDemo()">計算</button>
            </div>
            <div id="demoResult" class="demo-result"></div>
        </div>
    `;
}

function calculateDemo() {
    const left = document.getElementById('leftOperand').value;
    const operator = document.getElementById('operator').value;
    const right = document.getElementById('rightOperand').value;
    const resultDiv = document.getElementById('demoResult');
    
    try {
        // 這裡應該安全地評估表達式
        // 實際實現中需要更安全的方法
        const expression = `${left} ${operator} ${right}`;
        resultDiv.innerHTML = `
            <strong>表達式：</strong> ${expression}<br>
            <strong>結果：</strong> <span class="result-value">執行JavaScript計算...</span><br>
            <em>注意：這只是演示，實際結果可能因環境而異</em>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<span style="color: #ff6b6b;">錯誤：${error.message}</span>`;
    }
}

// 統計功能
function updateStats() {
    const memeCount = document.querySelectorAll('.meme-card').length;
    const quoteCount = document.querySelectorAll('.quote-card').length;
    const docCount = document.querySelectorAll('.doc-card').length;
    
    return {
        memes: memeCount,
        quotes: quoteCount,
        docs: docCount,
        total: memeCount + quoteCount + docCount
    };
}

// 在控制台顯示歡迎信息
console.log(`
%c  JS Memes & Quotes Encyclopedia  
%c  
%c  歡迎來到JavaScript的奇妙世界！
%c  
%c  👨‍💻 探索經典memes
%c  💬 閱讀名人語錄  
%c  📚 學習核心概念
%c  
%c  GitHub: https://github.com/yourproject/js-memes-encyclopedia
`,
'color: #f7df1e; font-size: 16px; font-weight: bold;',
'color: transparent;',
'color: #61dafb; font-size: 14px;',
'color: transparent;',
'color: #98c379; font-size: 12px;',
'color: #98c379; font-size: 12px;',
'color: #98c379; font-size: 12px;',
'color: transparent;',
'color: #7c7c7c; font-size: 10px;'
);

// 顯示統計信息
const stats = updateStats();
console.log(`📊 目前收錄：${stats.memes} 個memes，${stats.quotes} 個quotes，${stats.docs} 個技術文檔`);

// 程式碼執行器功能
let codeEditor = null;

function showCodeEditor() {
    const container = document.getElementById('codeEditorContainer');
    
    if (!codeEditor) {
        container.style.display = 'block';
        codeEditor = new CodeEditor('codeEditorContainer');
        
        // 滾動到程式碼執行器
        container.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        console.log('🧪 程式碼執行器已啟動');
    } else {
        // 如果已經存在，只是顯示/隱藏
        const isVisible = container.style.display !== 'none';
        container.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            container.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
}