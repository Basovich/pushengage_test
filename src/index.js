import './styles.css';

const COOKIE_NAME = 'push_engage_subscriber_id';

/**
 * Dynamically determines the domain for the cookie.
 * Strips 'www.' and returns the domain prefixed with a dot.
 * @returns {string} The domain string (e.g., ".example.com")
 */
function getDomain(hostname) {
    if (hostname === 'localhost' || hostname === '127.0.0.1' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
        return null;
    }

    // Special case for vercel.app to avoid "invalid domain" errors
    if (hostname.endsWith('.vercel.app')) {
        return null;
    }

    const parts = hostname.split('.');
    if (parts.length < 2) {
        return null;
    }

    const secondLevelTLDs = ['co', 'com', 'gov', 'net', 'org', 'ac', 'app'];
    if (parts.length >= 3 && secondLevelTLDs.includes(parts[parts.length - 2])) {
        return '.' + parts.slice(-3).join('.');
    } else {
        return '.' + parts.slice(-2).join('.');
    }
}

/**
 * Sets a cookie with the specified name, value, and options.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {Object} options - The options for the cookie.
 */
function setCookie(name, value, options = {}) {
    options = { ...options };

    if (!options.domain) {
        const domain = getDomain(window.location.hostname);
        if (domain) {
            options.domain = domain;
        }
    }

    if (!options.path) {
        options.path = '/';
    }

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += '; ' + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += '=' + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

/**
 * Retrieves a cookie by name.
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string|null} The cookie value or null if not found.
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

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
 * Handles logic when a subscriber ID already exists in the cookie.
 * @param {string} subscriberId - The existing subscriber ID.
 */
function handleExistingSubscriber(subscriberId) {
    console.log('PushEngage: Found existing subscriber ID in cookie:', subscriberId);

    // Correct usage: PushEngage.push(function() { ... })
    window.PushEngage = window.PushEngage || [];
    window.PushEngage.push(function () {
        PushEngage.setProfileId(subscriberId)
            .then(function (response) {
                console.log('PushEngage: Profile ID set successfully', response);
                displayMessage(`Loaded from Cookie & Set Profile ID: ${subscriberId}`, 'blue');
            })
            .catch(function (error) {
                console.error('PushEngage: Error setting profile ID', error);
                displayMessage(`Error setting Profile ID: ${error.message}`, 'red');
            });
    });
}

/**
 * Handles logic when a new subscription occurs.
 * @param {string} subscriberId - The new subscriber ID.
 */
function handleNewSubscription(subscriberId) {
    console.log('PushEngage: Got new Subscriber ID:', subscriberId);

    // Set cookie for 365 days
    setCookie(COOKIE_NAME, subscriberId, {
        expires: 365
    });
    console.log('PushEngage: Saved to cookie');

    displayMessage(`New Subscription! Saved to Cookie: ${subscriberId}`, 'green');
}

/**
 * Sets up the listener for PushEngage subscription changes.
 */
function setupSubscriptionListener() {
    console.log('PushEngage: No cookie found, listening for subscription...');
    window.addEventListener('PushEngage.onSubscriptionChange', function (event) {
        console.log('PushEngage: Subscription changed', event.detail);
        if (event.detail && event.detail.subscriber_id) {
            handleNewSubscription(event.detail.subscriber_id);
        }
    });
}

/**
 * Main initialization function.
 */
function init() {
    console.log('Webpack project is running!');

    // Wait for PushEngage to be ready (optional, but good practice if we were calling methods immediately)
    // For this logic, we just check the cookie first.

    // We wrap this in PushEngage.push to ensure the library is loaded if we were using getSubscriberId directly,
    // but here we are checking our own cookie first.

    // However, to be safe and follow the previous pattern:
    if (typeof window.PushEngage !== 'undefined') {
        window.PushEngage.push(function () {
            checkSubscriberStatus();
        });
    } else {
        // Fallback or just run immediately if script is async loaded
        checkSubscriberStatus();
    }
}

function checkSubscriberStatus() {
    const existingSubscriberId = getCookie(COOKIE_NAME);

    if (existingSubscriberId) {
        handleExistingSubscriber(existingSubscriberId);
    } else {
        setupSubscriptionListener();
    }
}

// Run initialization
init();
