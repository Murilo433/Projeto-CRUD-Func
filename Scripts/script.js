
let form = [...document.getElementsByClassName('formControl')]

//Função para verificar se o input está vazio
function error() {
    form.map((i) => {
        if (i.value == "") {
            i.classList.add('error')
        } else {
            i.classList.remove('error')
        }
    })
}

//Função para verificar se o input está vazio
function errorHome() {
    let formCadastro = [...document.getElementById('formCadastro')]
    let erro = 0

    formCadastro.map((i) => {
        if (i.hasAttribute('required') && i.value == "") {
            i.classList.add('error')
            erro++
        } else {
            i.classList.remove('error')
        }
        event.preventDefault();
    })
    if (erro == 0) {
        return true
    } else {
        return false
    }
}

function confirmaSenha() {
    if (document.getElementById('inputPassword').value !== (document.getElementById('inputPasswordConfirma').value)) {
        swal('A senha deve ser a mesma', '', 'error')
        document.getElementById('inputPasswordConfirma').value = '';
    } else {
        novoUsuario(document.getElementById('inputEmail').value,
            document.getElementById('inputPassword').value)
    }
}

//Funcao para verificar se o cpf está correto
function validaCPF(cpf) {
    var numeros, digitos, soma, i, resultado, digitos_iguais;
    digitos_iguais = 1;
    const CPF = cpf.replace('.', '').replace('.', '').replace('-', '')
    //Verifica o comprimento
    if (CPF.length < 11) {
        swal("Cpf incorreto! ", {
            icon: "error",
        })
        document.getElementById('cpf').value = ''
        return false;
    }
    for (i = 0; i < CPF.length - 1; i++)
        //Verifiar os digitos iguais
        if (CPF.charAt(i) != CPF.charAt(i + 1)) {
            digitos_iguais = 0;
            break;
        }
    if (!digitos_iguais) {
        numeros = CPF.substring(0, 9);
        digitos = CPF.substring(9);
        soma = 0;
        for (i = 10; i > 1; i--)
            soma += numeros.charAt(10 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) {
            swal("Cpf incorreto! ", {
                icon: "error",
            })
            document.getElementById('cpf').value = ''
            return false;
        }
        numeros = CPF.substring(0, 10);
        soma = 0;
        for (i = 11; i > 1; i--)
            soma += numeros.charAt(11 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) {
            swal("Cpf incorreto! ", {
                icon: "error",
            })
            document.getElementById('cpf').value = ''
            return false;
        }
        return true;
    }
    else
        swal("Cpf incorreto!: ", {
            icon: "error",
        })
    document.getElementById('cpf').value = ''
    return false;
}

//Mascara de cpf

const input = document.getElementById('cpf')
if (input != null) {
    input.addEventListener('keypress', () => {
        let inputlenght = input.value.length

        if (inputlenght === 3 || inputlenght === 7) {
            input.value += '.'
        } else if (inputlenght === 11) {
            input.value += '-'
        }
    })
}
