import './styles.css';

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
