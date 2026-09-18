const form = document.querySelector('#contactForm');
const nome = document.querySelector('#nome');
const email = document.querySelector('#email');
const telefone = document.querySelector('#telefone');
const servico = document.querySelector('#servico');
const mensagem = document.querySelector('#mensagem');
const submitButton = document.querySelector('#submitButton');
const sucesso = document.querySelector('#sucesso');

const campos = [nome, email, telefone, servico, mensagem];
const camposTocados = new Set();

function somenteLetras(valor) {
    return valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' -]/g, '');
}

function aplicarMascaraTelefone(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 2) {
        return numeros.length ? `(${numeros}` : '';
    }

    if (numeros.length <= 6) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    if (numeros.length <= 10) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
}

function validarCampo(campo) {
    const valor = campo.value.trim();

    if (!valor) {
        return 'Campo obrigatório.';
    }

    if (campo === nome) {
        if (valor.length < 2) {
            return 'Digite pelo menos 2 caracteres.';
        }

        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(valor)) {
            return 'Use apenas letras no nome.';
        }
    }

    if (campo === email && !emailValido(valor)) {
        return 'Digite um e-mail válido.';
    }

    if (campo === telefone) {
        const numeros = valor.replace(/\D/g, '');
        if (numeros.length !== 11) {
            return 'Digite um telefone com DDD e 11 dígitos.';
        }
    }

    if (campo === mensagem && valor.length < 10) {
        return 'Digite uma mensagem com pelo menos 10 caracteres.';
    }

    return '';
}

function exibirEstadoDoCampo(campo, forcar = false) {
    const mensagemErro = validarCampo(campo);
    const errorMessage = campo.parentElement.querySelector('.error-message');
    const deveExibir = forcar || camposTocados.has(campo);

    campo.classList.toggle('erro', Boolean(mensagemErro) && deveExibir);
    campo.classList.toggle('valido', !mensagemErro && Boolean(campo.value.trim()));

    if (errorMessage) {
        errorMessage.textContent = deveExibir ? mensagemErro : '';
    }

    return !mensagemErro;
}

function formularioValido() {
    return campos.every((campo) => validarCampo(campo) === '');
}

function atualizarBotao() {
    submitButton.disabled = !formularioValido();
}

nome.addEventListener('input', () => {
    nome.value = somenteLetras(nome.value);
    exibirEstadoDoCampo(nome);
    atualizarBotao();
});

telefone.addEventListener('input', () => {
    telefone.value = aplicarMascaraTelefone(telefone.value);
    exibirEstadoDoCampo(telefone);
    atualizarBotao();
});

[email, mensagem].forEach((campo) => {
    campo.addEventListener('input', () => {
        exibirEstadoDoCampo(campo);
        atualizarBotao();
    });
});

servico.addEventListener('change', () => {
    camposTocados.add(servico);
    exibirEstadoDoCampo(servico);
    atualizarBotao();
});

campos.forEach((campo) => {
    campo.addEventListener('blur', () => {
        camposTocados.add(campo);
        exibirEstadoDoCampo(campo);
        atualizarBotao();
    });
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    campos.forEach((campo) => {
        camposTocados.add(campo);
        exibirEstadoDoCampo(campo, true);
    });

    if (!formularioValido()) {
        atualizarBotao();
        return;
    }

    submitButton.disabled = true;
    submitButton.classList.add('loading');
    form.classList.add('enviando');

    setTimeout(() => {
        form.style.display = 'none';
        sucesso.classList.add('mostrar');
    }, 1000);
});

atualizarBotao();
