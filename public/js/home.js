const homeAnimation = () => {
    const animationElement = document.getElementById('home-animation');
    if (animationElement) {
        animationElement.classList.add('animate');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    homeAnimation();

    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            window.location.href = '/login';
        });
    }

    if (registerButton) {
        registerButton.addEventListener('click', () => {
            window.location.href = '/register';
        });
    }
});