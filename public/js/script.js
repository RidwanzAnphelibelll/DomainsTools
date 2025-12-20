
const API_BASE_URL = 'https://api-domains-tools.vercel.app/';

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('year').textContent = new Date().getFullYear();
    
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    
    hamburgerMenu.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });
    
    document.addEventListener('click', function(event) {
        if (!hamburgerMenu.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('show');
        }
    });
    
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    function setupClearButton(clearBtnId, inputId, loaderId, resultId) {
        const clearBtn = document.getElementById(clearBtnId);
        const input = document.getElementById(inputId);
        const loader = document.getElementById(loaderId);
        const result = document.getElementById(resultId);
        
        clearBtn.addEventListener('click', function() {
            input.value = '';
            loader.style.display = 'none';
            result.style.display = 'none';
            input.focus();
        });
    }
    
    setupClearButton('clear-whois-input', 'domain-input', 'whois-loader', 'whois-result');
    setupClearButton('clear-subfinder-input', 'subfinder-input', 'subfinder-loader', 'subfinder-result');
    setupClearButton('clear-hostname-input', 'hostname-input', 'dns-loader', 'dns-result');
    
    function setupCopyButton(buttonId, contentId) {
        const copyBtn = document.getElementById(buttonId);
        copyBtn.addEventListener('click', function() {
            const content = document.getElementById(contentId).textContent;
            navigator.clipboard.writeText(content).then(() => {
                const originalHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalHTML;
                    copyBtn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        });
    }
    
    setupCopyButton('whois-copy-btn', 'whois-result-content');
    setupCopyButton('subfinder-copy-btn', 'subfinder-result-content');
    setupCopyButton('dns-copy-btn', 'dns-result-content');
    
    const whoisForm = document.getElementById('whois-form');
    const whoisLoader = document.getElementById('whois-loader');
    const whoisResult = document.getElementById('whois-result');
    const whoisResultContent = document.getElementById('whois-result-content');
    
    whoisForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const domainInput = document.getElementById('domain-input').value.trim();
        if (!domainInput) return;
        
        whoisLoader.style.display = 'block';
        whoisResult.style.display = 'none';
        
        try {
            const response = await fetch(`${API_BASE_URL}api/whois?domain=${encodeURIComponent(domainInput)}`);
            const data = await response.json();
            
            whoisLoader.style.display = 'none';          
            whoisResult.style.display = 'block';
            whoisResultContent.textContent = data.message;
            
            if (data.success) {
                whoisResult.classList.add('success');
                whoisResult.classList.remove('error');
            } else {
                whoisResult.classList.add('error');
                whoisResult.classList.remove('success');
            }
        } catch (error) {
            whoisLoader.style.display = 'none';
            whoisResult.style.display = 'block';  
            whoisResult.classList.add('error');
            whoisResult.classList.remove('success');
            whoisResultContent.textContent = "An error occurred while processing your request.";
        }
    });
    
    const subfinderForm = document.getElementById('subfinder-form');
    const subfinderLoader = document.getElementById('subfinder-loader');
    const subfinderResult = document.getElementById('subfinder-result');
    const subfinderResultContent = document.getElementById('subfinder-result-content');
    
    subfinderForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const domainInput = document.getElementById('subfinder-input').value.trim();
        if (!domainInput) return;
        
        subfinderLoader.style.display = 'block';
        subfinderResult.style.display = 'none';
        
        try {
            const response = await fetch(`${API_BASE_URL}api/subfinder?domain=${encodeURIComponent(domainInput)}`);
            const data = await response.json();
            
            subfinderLoader.style.display = 'none';           
            subfinderResult.style.display = 'block';
            subfinderResultContent.textContent = data.message;
            
            if (data.success) {
                subfinderResult.classList.add('success');
                subfinderResult.classList.remove('error');
            } else {
                subfinderResult.classList.add('error');
                subfinderResult.classList.remove('success');
            }
        } catch (error) {
            subfinderLoader.style.display = 'none';
            subfinderResult.style.display = 'block';
            subfinderResult.classList.add('error');
            subfinderResult.classList.remove('success');
            subfinderResultContent.textContent = "An error occurred while processing your request.";
        }
    });
    
    const dnsForm = document.getElementById('dns-form');
    const dnsLoader = document.getElementById('dns-loader');
    const dnsResult = document.getElementById('dns-result');
    const dnsResultContent = document.getElementById('dns-result-content');
    
    dnsForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const hostnameInput = document.getElementById('hostname-input').value.trim();
        if (!hostnameInput) return;
        
        dnsLoader.style.display = 'block';
        dnsResult.style.display = 'none';
        
        try {
            const response = await fetch(`${API_BASE_URL}api/hosttoip?hostname=${encodeURIComponent(hostnameInput)}`);
            const data = await response.json();
            
            dnsLoader.style.display = 'none';
            
            dnsResult.style.display = 'block';
            dnsResultContent.textContent = data.message;
            
            if (data.success) {
                dnsResult.classList.add('success');
                dnsResult.classList.remove('error');
            } else {
                dnsResult.classList.add('error');
                dnsResult.classList.remove('success');
            }
        } catch (error) {
            dnsLoader.style.display = 'none';
            dnsResult.style.display = 'block';                    
            dnsResult.classList.add('error');
            dnsResult.classList.remove('success');
            dnsResultContent.textContent = "An error occurred while processing your request.";
        }
    });
});
