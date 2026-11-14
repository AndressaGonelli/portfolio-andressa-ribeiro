// Validação simples do formulário de contato.
// Este formulário é apenas uma demonstração: não envia mensagens.
function validarContato(valores) {
  const nome = valores.nome.trim();
  const email = valores.email.trim();
  const mensagem = valores.mensagem.trim();
  const erros = { nome: '', email: '', mensagem: '' };

  if (!nome) {
    erros.nome = 'Informe seu nome.';
  } else if (nome.length > 100) {
    erros.nome = 'Use até 100 caracteres.';
  }

  if (!email) {
    erros.email = 'Informe seu e-mail.';
  } else if (email.length > 254 || !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email)) {
    erros.email = 'Informe um e-mail válido, como voce@exemplo.com.';
  }

  if (!mensagem) {
    erros.mensagem = 'Escreva uma mensagem.';
  } else if (mensagem.length > 2000) {
    erros.mensagem = 'Use até 2.000 caracteres.';
  }

  return erros;
}

// Menu para telas pequenas.
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');
const linksMenu = menu.querySelectorAll('a');

// Os links continuam acessíveis mesmo sem JavaScript.
document.querySelector('.cabecalho').classList.add('js-menu');
toggle.hidden = false;

function fecharMenu() {
  menu.classList.remove('aberto');
  toggle.setAttribute('aria-expanded', 'false');
}

toggle.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  toggle.setAttribute('aria-expanded', String(aberto));
});

linksMenu.forEach(link => {
  link.addEventListener('click', fecharMenu);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('aberto')) {
    fecharMenu();
    toggle.focus();
  }
});

// Marca o item do menu da seção que está aparecendo na tela.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      linksMenu.forEach(link => {
        if (link.hash === '#' + entry.target.id) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });

  document.querySelectorAll('main section[id]').forEach(section => {
    observer.observe(section);
  });
}

// Formulário de contato (simulação).
const formulario = document.querySelector('#form-contato');
const statusEnvio = document.querySelector('#status-envio');
const campos = ['nome', 'email', 'mensagem'];

function lerCampos() {
  const valores = {};
  campos.forEach(campo => {
    valores[campo] = formulario.elements[campo].value;
  });
  return valores;
}

function exibirErro(campo, mensagem) {
  document.querySelector('#erro-' + campo).textContent = mensagem;
  formulario.elements[campo].setAttribute('aria-invalid', String(Boolean(mensagem)));
}

campos.forEach(campo => {
  formulario.elements[campo].addEventListener('input', () => {
    statusEnvio.textContent = '';
    if (formulario.elements[campo].getAttribute('aria-invalid') === 'true') {
      exibirErro(campo, validarContato(lerCampos())[campo]);
    }
  });
});

formulario.addEventListener('submit', event => {
  event.preventDefault();
  const erros = validarContato(lerCampos());

  campos.forEach(campo => {
    exibirErro(campo, erros[campo]);
  });

  const primeiroInvalido = campos.find(campo => erros[campo]);
  if (primeiroInvalido) {
    statusEnvio.textContent = 'Revise os campos indicados antes de continuar.';
    formulario.elements[primeiroInvalido].focus();
    return;
  }

  formulario.reset();
  statusEnvio.textContent = 'Mensagem enviada com sucesso! Simulação concluída: nenhum dado foi transmitido ou armazenado.';
  statusEnvio.focus();
});