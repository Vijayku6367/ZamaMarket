// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MockDarkMarket {
    struct Listing {
        address seller;
        string encryptedPrice;
        uint256 listingId;
        uint256 timestamp;
        bool active;
    }
    
    struct Bid {
        address bidder;
        string encryptedBid;
        uint256 listingId;
        uint256 timestamp;
        bool revealed;
    }
    
    struct EncryptedWinner {
        address winner;
        string encryptedAmount;
        uint256 listingId;
        bool decrypted;
    }
    
    uint256 public listingCounter;
    uint256 public bidCounter;
    
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Bid) public bids;
    mapping(uint256 => EncryptedWinner) public winners;
    
    // Event declarations
    event ListingCreated(uint256 indexed listingId, address seller, string encryptedPrice);
    event BidSubmitted(uint256 indexed bidId, address bidder, uint256 listingId);
    event WinnerSelected(uint256 indexed listingId, address winner, string encryptedAmount);
    event WinnerRevealed(uint256 indexed listingId, address winner, uint256 amount);
    
    // Create encrypted listing
    function createListing(string memory _encryptedPrice) public {
        listingCounter++;
        
        listings[listingCounter] = Listing({
            seller: msg.sender,
            encryptedPrice: _encryptedPrice,
            listingId: listingCounter,
            timestamp: block.timestamp,
            active: true
        });
        
        emit ListingCreated(listingCounter, msg.sender, _encryptedPrice);
    }
    
    // Submit encrypted bid
    function submitBid(uint256 _listingId, string memory _encryptedBid) public {
        require(listings[_listingId].active, "Listing not active");
        
        bidCounter++;
        
        bids[bidCounter] = Bid({
            bidder: msg.sender,
            encryptedBid: _encryptedBid,
            listingId: _listingId,
            timestamp: block.timestamp,
            revealed: false
        });
        
        emit BidSubmitted(bidCounter, msg.sender, _listingId);
    }
    
    // Select winner (mock encrypted comparison)
    function selectWinner(uint256 _listingId, address _winner, string memory _encryptedAmount) public {
        require(listings[_listingId].seller == msg.sender, "Only seller can select winner");
        
        winners[_listingId] = EncryptedWinner({
            winner: _winner,
            encryptedAmount: _encryptedAmount,
            listingId: _listingId,
            decrypted: false
        });
        
        emit WinnerSelected(_listingId, _winner, _encryptedAmount);
    }
    
    // Reveal decrypted winner
    function revealWinner(uint256 _listingId, uint256 _decryptedAmount) public {
        require(winners[_listingId].winner == msg.sender, "Only winner can reveal");
        require(!winners[_listingId].decrypted, "Already revealed");
        
        winners[_listingId].decrypted = true;
        
        emit WinnerRevealed(_listingId, msg.sender, _decryptedAmount);
    }
    
    // Helper functions
    function getListing(uint256 _listingId) public view returns (
        address seller,
        string memory encryptedPrice,
        uint256 timestamp,
        bool active
    ) {
        Listing memory listing = listings[_listingId];
        return (
            listing.seller,
            listing.encryptedPrice,
            listing.timestamp,
            listing.active
        );
    }
    
    function getBid(uint256 _bidId) public view returns (
        address bidder,
        string memory encryptedBid,
        uint256 listingId,
        uint256 timestamp
    ) {
        Bid memory bid = bids[_bidId];
        return (
            bid.bidder,
            bid.encryptedBid,
            bid.listingId,
            bid.timestamp
        );
    }
    
    function getWinner(uint256 _listingId) public view returns (
        address winner,
        string memory encryptedAmount,
        bool decrypted
    ) {
        EncryptedWinner memory winnerInfo = winners[_listingId];
        return (
            winnerInfo.winner,
            winnerInfo.encryptedAmount,
            winnerInfo.decrypted
        );
    }
}
