const accounts = [];
const statuses = { active: 0, inactive: 0, warming: 0 };
let editIndex = null;

document.getElementById('account-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const status = document.getElementById('status').value;

    if (editIndex !== null) {
        // Edit account
        const oldStatus = accounts[editIndex].status;
        accounts[editIndex] = { username, password, status };
        statuses[oldStatus]--;
        statuses[status]++;
        updateStats();
        updateCards();
        closeModal();
        editIndex = null;
        document.getElementById('modal-title').textContent = 'Adicionar Conta';
        document.getElementById('edit-btn').style.display = 'none';
    } else {
        // Add new account
        accounts.push({ username, password, status });
        statuses[status]++;
        updateStats();
        updateCards();
        closeModal();
    }
});

document.getElementById('show-password').addEventListener('change', function() {
    const passwordInput = document.getElementById('password');
    passwordInput.type = this.checked ? 'text' : 'password';
});

function updateStats() {
    document.getElementById('active-count').textContent = statuses.active;
    document.getElementById('inactive-count').textContent = statuses.inactive;
    document.getElementById('warming-count').textContent = statuses.warming;
}

function updateCards() {
    const activeContainer = document.getElementById('active-cards');
    const inactiveContainer = document.getElementById('inactive-cards');
    const warmingContainer = document.getElementById('warming-cards');
    
    activeContainer.innerHTML = '';
    inactiveContainer.innerHTML = '';
    warmingContainer.innerHTML = '';

    accounts.forEach((account, index) => {
        const card = document.createElement('div');
        card.className = `card ${account.status}`;
        card.innerHTML = `
            <h3>${account.username}</h3>
            <p>Senha: <span class="password">${account.password}</span></p>
            <button onclick="togglePasswordVisibility(this)">Mostrar Senha</button>
            <button class="edit" onclick="openEditModal(${index})">Editar</button>
            <button onclick="deleteAccount(${index})">Excluir</button>
        `;

        if (account.status === 'active') {
            activeContainer.appendChild(card);
        } else if (account.status === 'inactive') {
            inactiveContainer.appendChild(card);
        } else if (account.status === 'warming') {
            warmingContainer.appendChild(card);
        }
    });
}

function deleteAccount(index) {
    const accountStatus = accounts[index].status;
    accounts.splice(index, 1);
    statuses[accountStatus]--;
    updateStats();
    updateCards();
}

function togglePasswordVisibility(button) {
    const passwordSpan = button.previousElementSibling;
    const isPasswordVisible = passwordSpan.style.display === 'block';
    
    // Toggle the display property of the password span
    passwordSpan.style.display = isPasswordVisible ? 'none' : 'block';
    button.textContent = isPasswordVisible ? 'Mostrar Senha' : 'Ocultar Senha';
}

function openModal() {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('edit-btn').style.display = 'none';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('edit-btn').style.display = 'none';
}

function openEditModal(index) {
    const account = accounts[index];
    document.getElementById('username').value = account.username;
    document.getElementById('password').value = account.password;
    document.getElementById('status').value = account.status;
    editIndex = index;
    document.getElementById('modal-title').textContent = 'Editar Conta';
    document.getElementById('edit-btn').style.display = 'inline-block';
    openModal();
}

function editAccount() {
    document.getElementById('account-form').dispatchEvent(new Event('submit'));
}
