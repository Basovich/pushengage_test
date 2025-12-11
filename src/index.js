import './styles.css';

window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');

    PushEngage.push(function () {
        PushEngage.getSubscriberId()
            .then(function (subscriberId) {
                console.log('Webpack project is running!');

                window.addEventListener('PushEngage.onSubscriptionChange', function (event) {
                    console.log('PushEngage: Subscription changed', event.detail);
                    if (event.detail && event.detail.subscriber_id) {
                        console.log('PushEngage Subscriber ID:', event.detail.subscriber_id);
                        // You can also display it on the page or send it to your server here
                        const app = document.body;
                        const info = document.createElement('div');
                        info.textContent = `Subscriber ID: ${event.detail.subscriber_id}`;
                        info.style.marginTop = '20px';
                        info.style.color = 'green';
                        app.appendChild(info);
                    }
                });
            })
            .catch(function (error) {
                console.log(error.message, error.details);
            });
    });
})
