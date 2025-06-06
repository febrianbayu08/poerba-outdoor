// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPvEeTzlEmdV3n64v_jam8-h_RKnB97-k",
  authDomain: "poerba-outdoor.firebaseapp.com",
  databaseURL: "https://poerba-outdoor-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "poerba-outdoor",
  storageBucket: "poerba-outdoor.firebasestorage.app",
  messagingSenderId: "199336788731",
  appId: "1:199336788731:web:dd9b614adef11c1e8b665e",
  measurementId: "G-4RW6B9SY4Y"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database(); // Dapatkan referensi ke database

let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

let sectionLinks = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sectionLinks.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active')
            });
        }
    })
}

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Mencegah form dari reload halaman

    const name = nameInput.value;
    const email = emailInput.value;
    const message = messageInput.value;

    // Simpan data ke Firebase Realtime Database
    database.ref('messages').push({
      name: name,
      email: email,
      message: message,
      timestamp: new Date().toLocaleString()
    })
    .then(() => {
      alert('Pesan Anda telah terkirim!');
      contactForm.reset(); // Mengosongkan formulir setelah dikirim
    })
    .catch((error) => {
      console.error('Error saat mengirim pesan:', error);
      alert('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
    });
  });
}

const messagesContainer = document.getElementById('messagesContainer');

if (messagesContainer) {
  // Mendengarkan perubahan pada node 'messages' di Firebase
  database.ref('messages').on('value', (snapshot) => {
    messagesContainer.innerHTML = ''; // Kosongkan container sebelum memuat pesan baru

    if (snapshot.exists()) {
      const messages = snapshot.val();
      let hasMessages = false;
      for (let key in messages) {
        const message = messages[key];
        if (message.name && message.email && message.message) { // Pastikan data lengkap
          hasMessages = true;
          const messageBox = document.createElement('div');
          messageBox.classList.add('message-box');
          messageBox.innerHTML = `
            <h3>${message.name}</h3>
            <p class="email">${message.email}</p>
            <p class="content">${message.message}</p>
            <span class="timestamp">${message.timestamp}</span>
          `;
          messagesContainer.prepend(messageBox); // Tampilkan pesan terbaru di atas
        }
      }
      if (!hasMessages) {
        messagesContainer.innerHTML = '<p class="no-messages">Belum ada pesan.</p>';
      }
    } else {
      messagesContainer.innerHTML = '<p class="no-messages">Belum ada pesan.</p>';
    }
  });
}