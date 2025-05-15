import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDoHdSILGIuwEKKhGBqakW6FCnq3d_a25g",
    authDomain: "tehnolife-28881.firebaseapp.com",
    projectId: "tehnolife-28881",
    storageBucket: "tehnolife-28881.appspot.com",
    messagingSenderId: "1066453028101",
    appId: "1:1066453028101:web:18f612a71cde8462a23b6c",
    measurementId: "G-Y10QNEVDV9"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Функция переключения видимости пароля
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const icon = document.querySelector('.toggle-password i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Показ уведомлений
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    notification.style.display = 'block';

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Обработка формы входа
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists() && userSnap.data().password === password) {
        const user = userSnap.data();
        // Создаем токен авторизации
        const token = btoa(JSON.stringify({
            userId: user.email,
            name: user.name,
            exp: Date.now() + (7 * 24 * 60 * 60 * 1000)
        }));
        localStorage.setItem('auth_token', token);
        localStorage.setItem('currentUser', JSON.stringify({
            name: user.name,
            email: user.email
        }));
        showNotification('Вход выполнен успешно!');
        setTimeout(() => {
            window.location.href = 'personal-account.html';
        }, 1000);
    } else {
        showNotification('Неверный email или пароль', 'error');
    }
}

// Проверка авторизации при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        try {
            const tokenData = JSON.parse(atob(token));
            if (tokenData.exp > Date.now()) {
                // Если токен действителен, перенаправляем в личный кабинет
                window.location.href = 'personal-account.html';
            }
        } catch (e) {
            localStorage.removeItem('auth_token');
        }
    }
});