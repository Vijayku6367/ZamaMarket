// Mock FHE Implementation for Development
class MockFHE {
    constructor() {
        this.publicKey = this.generateMockKey();
        this.privateKey = this.generateMockKey();
    }

    generateMockKey() {
        let key = '0x';
        const chars = '0123456789abcdef';
        for (let i = 0; i < 64; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return key;
    }

    encrypt(plaintext) {
        // Mock encryption - just convert to hex and add noise
        const hexValue = Math.floor(plaintext * 1000).toString(16).padStart(64, '0');
        const noise = Math.floor(Math.random() * 999999).toString(16).padStart(6, '0');
        return {
            ciphertext: `0x${hexValue}${noise}`,
            publicKey: this.publicKey
        };
    }

    decrypt(ciphertext) {
        // Mock decryption - extract first part of hex
        if (!ciphertext.startsWith('0x')) {
            throw new Error('Invalid ciphertext format');
        }
        
        const hexValue = ciphertext.substring(2, 66); // First 64 hex chars
        const plaintext = parseInt(hexValue, 16) / 1000;
        return plaintext;
    }

    addEncrypted(ciphertext1, ciphertext2) {
        // Mock encrypted addition
        const val1 = this.decrypt(ciphertext1);
        const val2 = this.decrypt(ciphertext2);
        const sum = val1 + val2;
        return this.encrypt(sum).ciphertext;
    }

    compareEncrypted(ciphertext1, ciphertext2) {
        // Mock encrypted comparison
        const val1 = this.decrypt(ciphertext1);
        const val2 = this.decrypt(ciphertext2);
        
        if (val1 > val2) return 1;
        if (val1 < val2) return -1;
        return 0;
    }

    generateKeyPair() {
        return {
            publicKey: this.publicKey,
            privateKey: this.privateKey
        };
    }

    // Utility function for UI
    formatCiphertext(ciphertext, maxLength = 20) {
        if (!ciphertext) return '';
        if (ciphertext.length <= maxLength) return ciphertext;
        return `${ciphertext.substring(0, maxLength - 3)}...`;
    }
}

// Export singleton instance
window.mockFHE = new MockFHE();
