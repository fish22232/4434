// --- Firebase: подключение и инициализация ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

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

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

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

async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }

    // Проверка уникальности email через Firestore
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        showNotification('Пользователь с таким email уже существует', 'error');
        return;
    }

    // Создаем нового пользователя в Firestore
    await setDoc(userRef, {
        name: name,
        surname: surname,
        email: email,
        password: password
    });

    showNotification('Регистрация успешна!');

    // Перенаправляем на страницу входа
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}