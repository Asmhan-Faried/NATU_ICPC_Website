const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
    history.pushState(null, null, '/Account/User?mode=signup');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
    history.pushState(null, null, '/Account/User?mode=login');
});