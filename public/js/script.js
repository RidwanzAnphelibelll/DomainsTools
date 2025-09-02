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
            const response = await fetch('/api/whois', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ domain: domainInput })
            });
            
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
            const response = await fetch('/api/hosttoip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ hostname: hostnameInput })
            });
            
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