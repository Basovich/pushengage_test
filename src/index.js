import './styles.css';

(function (w, d) {
    w.PushEngage = w.PushEngage || [];
    w._peq = w._peq || [];
    PushEngage.push(['init', {
        appId: 'c2d99a3c-a5a2-432e-a417-d8e8b2015525'
    }]);

    var e = d.createElement('script');

    e.src = 'https://clientcdn.pushengage.com/sdks/pushengage-web-sdk.js';
    e.async = true;
    e.type = 'text/javascript';
    d.head.appendChild(e);
})(window, document);


window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');

    PushEngage.push(function () {
        PushEngage.getSubscriberId()
            .then(function (subscriberId) {
                console.log(subscriberId);
            })
            .catch(function (error) {
                console.log(error.message, error.details);
            });
    });
})
