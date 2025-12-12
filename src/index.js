import './styles.css';

/**
 * Displays a visual message on the page.
 * @param {string} message - The message to display.
 * @param {string} color - The color of the text.
 */
function displayMessage(message, color) {
    const app = document.body;
    const info = document.createElement('div');
    info.textContent = message;
    info.style.marginTop = '20px';
    info.style.color = color;
    app.appendChild(info);
}

/**
 * Updates the href of the link with data-pushengage-id attribute.
 * Appends pushengage-id query parameter.
 * @param {string} subscriberId - The subscriber ID.
 */
function updateLinkWithSubscriberId(subscriberId) {
    const link = document.querySelector('a[data-pushengage-id]');
    if (link) {
        try {
            const url = new URL(link.href);
            url.searchParams.set('pushengage-id', subscriberId);

            const sdkData = localStorage.getItem('PushEngageSDK');
            if (sdkData) {
                url.searchParams.set('pushengage-sdk-data', sdkData);
            }

            link.href = url.toString();
            console.log('PushEngage: Updated link href with subscriber ID:', subscriberId);
            displayMessage(`Updated Link with ID: ${subscriberId}`, 'blue');
        } catch (e) {
            console.error('PushEngage: Error updating link href', e);
        }
    } else {
        console.warn('PushEngage: Link with data-pushengage-id not found');
    }
}

/**
 * Handles logic when a subscriber ID is available.
 * @param {string} subscriberId - The subscriber ID.
 */
function handleSubscription(subscriberId) {
    console.log('PushEngage: Got Subscriber ID:', subscriberId);
    updateLinkWithSubscriberId(subscriberId);
}

/**
 * Main initialization function.
 */
function init() {
    console.log('Webpack project is running!');

    // Ensure PushEngage is loaded or wait for it
    window.PushEngage = window.PushEngage || [];

    window.PushEngage.push(function () {
        // 1. Check for existing subscription
        PushEngage.getSubscriberId().then(function (subscriberId) {
            if (subscriberId) {
                console.log('PushEngage: Existing subscription found');
                handleSubscription(subscriberId);
            } else {
                console.log('PushEngage: No existing subscription');
            }
        }).catch(function (err) {
            console.error('PushEngage: Error getting subscriber ID', err);
        });

        // 2. Listen for new subscriptions
        window.addEventListener('PushEngage.onSubscriptionChange', function (event) {
            console.log('PushEngage: Subscription changed', event.detail);
            // The event detail might vary, checking both common patterns
            const newSubscriberId = event.detail.subscriber_id || event.detail.subscriberId;
            if (newSubscriberId) {
                handleSubscription(newSubscriberId);
            }
        });
    });
}

// Run initialization
init();
