const dashboard = (() => {
    const bidForm = document.getElementById('bid-form');
    const bidAmountInput = document.getElementById('bid-amount');
    const assignmentCards = document.querySelectorAll('.assignment-card');

    const placeBid = async (assignmentId) => {
        const bidAmount = bidAmountInput.value;

        if (bidAmount <= 0) {
            alert('Bid amount must be greater than zero.');
            return;
        }

        try {
            const response = await fetch(`/api/assignments/${assignmentId}/bid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bidAmount }),
            });

            if (!response.ok) {
                throw new Error('Failed to place bid');
            }

            const result = await response.json();
            alert(result.message);
            location.reload(); // Reload to see updated bids
        } catch (error) {
            console.error('Error placing bid:', error);
            alert('Error placing bid. Please try again.');
        }
    };

    const setupBidding = () => {
        assignmentCards.forEach(card => {
            const bidButton = card.querySelector('.bid-button');
            const assignmentId = card.dataset.assignmentId;

            bidButton.addEventListener('click', (event) => {
                event.preventDefault();
                placeBid(assignmentId);
            });
        });
    };

    const init = () => {
        setupBidding();
    };

    return {
        init,
    };
})();

document.addEventListener('DOMContentLoaded', dashboard.init);