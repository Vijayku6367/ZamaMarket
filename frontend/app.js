// DarkMarket FHE Main Application
class DarkMarketApp {
    constructor() {
        this.connected = false;
        this.walletAddress = null;
        this.contract = null;
        this.products = [];
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.loadMockProducts();
        this.setupWalletConnection();
        this.updateUI();
    }

    setupEventListeners() {
        // Wallet connection
        document.getElementById('connectWallet').addEventListener('click', () => this.connectWallet());
        
        // Encryption
        document.getElementById('encryptBtn').addEventListener('click', () => this.handleEncryption());
        document.getElementById('copyCiphertext').addEventListener('click', () => this.copyCiphertext());
        
        // Bidding
        document.getElementById('submitBid').addEventListener('click', () => this.submitBid());
        document.getElementById('clearBid').addEventListener('click', () => this.clearBid());
        
        // Winner reveal
        document.getElementById('revealWinner').addEventListener('click', () => this.revealWinner());
        
        // Navigation
        this.setupNavigation();
    }

    async connectWallet() {
        try {
            // Mock wallet connection for demo
            this.connected = true;
            this.walletAddress = this.generateMockAddress();
            
            // Animate connection
            const connectBtn = document.getElementById('connectWallet');
            gsap.to(connectBtn, {
                backgroundColor: '#00ff00',
                duration: 0.5,
                onComplete: () => {
                    gsap.to(connectBtn, {
                        backgroundColor: '',
                        duration: 0.5,
                        delay: 0.5
                    });
                }
            });
            
            // Update UI
            document.getElementById('walletInfo').style.display = 'block';
            document.getElementById('walletAddress').textContent = this.walletAddress;
            document.getElementById('ethBalance').textContent = (Math.random() * 10).toFixed(3);
            
            // Show success notification
            this.showNotification('Wallet connected successfully!', 'success');
            
        } catch (error) {
            this.showNotification('Failed to connect wallet', 'error');
            console.error(error);
        }
    }

    generateMockAddress() {
        const chars = '0123456789abcdef';
        let address = '0x';
        for (let i = 0; i < 40; i++) {
            address += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return address;
    }

    async handleEncryption() {
        const plainValue = document.getElementById('plainValue').value;
        
        if (!plainValue || isNaN(plainValue)) {
            this.showNotification('Please enter a valid number', 'error');
            return;
        }
        
        // Simulate encryption process
        const encryptedValue = this.simulateFHEEncryption(plainValue);
        
        // Display encrypted value with animation
        const display = document.getElementById('encryptedValue');
        display.innerHTML = `<span class="ciphertext">${encryptedValue}</span>`;
        
        // Update visualization
        this.updateEncryptionVisualization(plainValue, encryptedValue);
        
        this.showNotification('Value encrypted successfully!', 'success');
    }

    simulateFHEEncryption(value) {
        // Mock FHE encryption - in real app, use Zama SDK
        const hexValue = Math.floor(value * 1000).toString(16).padStart(64, '0');
        return `0x${hexValue}`;
    }

    updateEncryptionVisualization(plain, encrypted) {
        const plainBar = document.querySelector('.plain-bar');
        const encryptedBar = document.querySelector('.encrypted-bar');
        
        // Animate bars
        gsap.to(plainBar, {
            width: '100%',
            duration: 1,
            ease: 'power2.out'
        });
        
        gsap.to(encryptedBar, {
            width: '100%',
            duration: 1,
            delay: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                // Add glow effect
                encryptedBar.style.boxShadow = '0 0 20px #00d9ff';
                setTimeout(() => {
                    encryptedBar.style.boxShadow = '';
                }, 1000);
            }
        });
    }

    copyCiphertext() {
        const ciphertext = document.querySelector('.ciphertext');
        if (!ciphertext) {
            this.showNotification('No ciphertext to copy', 'error');
            return;
        }
        
        navigator.clipboard.writeText(ciphertext.textContent)
            .then(() => {
                this.showNotification('Ciphertext copied to clipboard!', 'success');
                
                // Animate copy button
                const copyBtn = document.getElementById('copyCiphertext');
                const originalHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalHTML;
                }, 2000);
            })
            .catch(err => {
                this.showNotification('Failed to copy ciphertext', 'error');
                console.error(err);
            });
    }

    async submitBid() {
        if (!this.connected) {
            this.showNotification('Please connect your wallet first', 'error');
            return;
        }
        
        const bidInput = document.getElementById('bidAmount');
        const ciphertext = bidInput.value.trim();
        
        if (!ciphertext || !ciphertext.startsWith('0x')) {
            this.showNotification('Please enter a valid encrypted bid', 'error');
            return;
        }
        
        // Simulate bid submission
        this.showNotification('Submitting encrypted bid...', 'info');
        
        // Simulate blockchain transaction delay
        setTimeout(() => {
            this.addBidToTimeline(ciphertext);
            this.showNotification('Encrypted bid submitted successfully!', 'success');
            bidInput.value = '';
        }, 2000);
    }

    addBidToTimeline(ciphertext) {
        const timeline = document.querySelector('.bid-timeline');
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const bidItem = document.createElement('div');
        bidItem.className = 'timeline-item';
        bidItem.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <div class="bid-header">
                    <span class="bidder">${this.walletAddress.substring(0, 8)}...</span>
                    <span class="bid-time">${timeString}</span>
                </div>
                <div class="bid-value">
                    <i class="fas fa-lock"></i>
                    Encrypted Bid: ${ciphertext.substring(0, 16)}...
                </div>
                <div class="bid-status encrypted">🔒 Processing</div>
            </div>
        `;
        
        // Add with animation
        gsap.from(bidItem, {
            opacity: 0,
            x: -50,
            duration: 0.5,
            ease: 'power2.out'
        });
        
        timeline.insertBefore(bidItem, timeline.firstChild);
        
        // Limit number of items
        while (timeline.children.length > 5) {
            timeline.removeChild(timeline.lastChild);
        }
    }

    clearBid() {
        document.getElementById('bidAmount').value = '';
        this.showNotification('Bid cleared', 'info');
    }

    async revealWinner() {
        if (!this.connected) {
            this.showNotification('Please connect your wallet first', 'error');
            return;
        }
        
        this.showNotification('Decrypting winner... This may take a moment', 'info');
        
        // Simulate FHE decryption delay
        setTimeout(() => {
            const winnerAddress = this.generateMockAddress();
            const winningBid = (Math.random() * 5).toFixed(3);
            
            // Update UI with animation
            const winnerElement = document.querySelector('.winner-address');
            const bidElement = document.querySelector('.encrypted-amount');
            
            // Animate decryption
            this.animateDecryption(winnerElement, winnerAddress);
            this.animateDecryption(bidElement, `${winningBid} ETH`);
            
            this.showNotification('Winner decrypted successfully!', 'success');
        }, 3000);
    }

    animateDecryption(element, finalValue) {
        // Create decryption effect
        const originalText = element.textContent;
        let steps = 0;
        const maxSteps = 20;
        
        const interval = setInterval(() => {
            steps++;
            if (steps >= maxSteps) {
                element.textContent = finalValue;
                clearInterval(interval);
                
                // Add celebration effect
                gsap.from(element, {
                    scale: 1.5,
                    color: '#00ff00',
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            } else {
                // Show decryption progress
                const progress = Math.floor((steps / maxSteps) * 100);
                element.textContent = `Decrypting... ${progress}%`;
            }
        }, 100);
    }

    loadMockProducts() {
        // Mock product data
        this.products = [
            {
                id: 1,
                name: 'Digital Art NFT',
                description: 'Exclusive encrypted digital artwork',
                category: 'Art',
                encryptedPrice: '0x3a7d...c8f2'
            },
            {
                id: 2,
                name: 'Premium Domain',
                description: 'Crypto domain name (.eth)',
                category: 'Domains',
                encryptedPrice: '0x8b4e...d9a1'
            },
            {
                id: 3,
                name: 'AI Model',
                description: 'Encrypted machine learning model',
                category: 'AI',
                encryptedPrice: '0xf2c5...b7e3'
            },
            {
                id: 4,
                name: 'Data Set',
                description: 'Private encrypted data collection',
                category: 'Data',
                encryptedPrice: '0x9e8a...c4d2'
            }
        ];
        
        this.renderProducts();
    }

    renderProducts() {
        const grid = document.getElementById('productGrid');
        grid.innerHTML = '';
        
        this.products.forEach(product => {
            const card = this.createProductCard(product);
            grid.appendChild(card);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product-id', product.id);
        
        card.innerHTML = `
            <div class="product-image"></div>
            <div class="product-details">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="price-label">Encrypted Price:</span>
                    <span class="encrypted-price">${product.encryptedPrice}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-secondary view-details">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                    <button class="btn-primary place-bid">
                        <i class="fas fa-gavel"></i>
                        Place Encrypted Bid
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        card.querySelector('.place-bid').addEventListener('click', () => {
            this.selectProductForBid(product);
        });
        
        card.querySelector('.view-details').addEventListener('click', () => {
            this.viewProductDetails(product);
        });
        
        return card;
    }

    selectProductForBid(product) {
        // Update bid panel with selected product
        const preview = document.querySelector('.selected-product .product-preview');
        preview.innerHTML = `
            <div class="product-image" style="background: var(--gradient-glass);"></div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p>Category: ${product.category}</p>
                <p>Price: <span class="encrypted-price">${product.encryptedPrice}</span></p>
            </div>
        `;
        
        // Scroll to bid section
        document.querySelector('#encrypt').scrollIntoView({ behavior: 'smooth' });
        
        this.showNotification(`Selected ${product.name} for bidding`, 'info');
    }

    viewProductDetails(product) {
        // Create modal with product details
        const modal = this.createModal(product);
        document.body.appendChild(modal);
        
        // Animate modal entrance
        gsap.from(modal, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    }

    createModal(product) {
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="
                background: var(--glass-dark);
                border-radius: 20px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                border: 1px solid var(--primary);
                position: relative;
            ">
                <button class="modal-close" style="
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    color: var(--primary);
                    font-size: 1.5rem;
                    cursor: pointer;
                ">×</button>
                
                <h2 style="color: var(--primary); margin-bottom: 1rem;">${product.name}</h2>
                <p style="color: var(--gray); margin-bottom: 1.5rem;">${product.description}</p>
                
                <div class="modal-details" style="
                    background: rgba(0, 0, 0, 0.3);
                    padding: 1rem;
                    border-radius: 10px;
                    margin-bottom: 1.5rem;
                ">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Category:</span>
                        <span>${product.category}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Encrypted Price:</span>
                        <span class="encrypted-price">${product.encryptedPrice}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Listing ID:</span>
                        <span>#${product.id.toString().padStart(3, '0')}</span>
                    </div>
                </div>
                
                <button class="btn-primary" style="width: 100%;">
                    <i class="fas fa-lock"></i>
                    Place Encrypted Bid
                </button>
            </div>
        `;
        
        // Close modal on button click or outside click
        modal.querySelector('.modal-close').addEventListener('click', () => {
            gsap.to(modal, {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => modal.remove()
            });
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                gsap.to(modal, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => modal.remove()
                });
            }
        });
        
        return modal;
    }

    setupNavigation() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Highlight active section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => observer.observe(section));
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                           type === 'error' ? 'exclamation-circle' : 
                           'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(0, 255, 0, 0.1)' :
                         type === 'error' ? 'rgba(255, 0, 0, 0.1)' :
                         'rgba(0, 217, 255, 0.1)'};
            backdrop-filter: blur(10px);
            border: 1px solid ${type === 'success' ? '#00ff00' :
                             type === 'error' ? '#ff0000' :
                             '#00d9ff'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 3000;
            transform: translateX(150%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    updateUI() {
        // Update encrypted numbers
        const numbers = document.querySelectorAll('.encrypted-number[data-value]');
        numbers.forEach(element => {
            const value = element.getAttribute('data-value');
            element.textContent = value;
        });
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.darkMarketApp = new DarkMarketApp();
});
