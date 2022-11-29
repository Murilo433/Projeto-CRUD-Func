
function salvar(event, collection) {
    if (errorHome() === true) {
        event.preventDefault();
        incluir(event, collection)
    } else {
        swal('Preencha todos os campos obrigatorios!', '', 'error')
    }


}

function incluir(event, collection) {
    event.preventDefault()
    const form = document.forms[0]
    const data = new FormData(form)
    const values = Object.fromEntries(data.entries())

    return firebase.database().ref(collection).push(values)
        .then(() => {
            swal("Registro cadastrado com sucesso", {
                icon: "success",
            });
            document.getElementById('formCadastro').reset()
        })
        .catch(error => {
            // console.error(`Ocorreu um erro: ${error.code} - ${error.message}`)
            swal(`Falha ao incluir: ${error.message}`, {
                icon: 'error',
            })
        })
}

/**
 * ObtemDados
 * Obtém os dados da collection a partir do Firebase.
 * @param {string} collection - Nome da Collection no Firebase
 * @return {object} - Uma tabela com os dados obtidos
 */

function obtemDados(collection) {
    var tabela = document.getElementById('tabelaDados')
    firebase.database().ref(collection).on('value', (snapshot) => {
        tabela.innerHTML = ''
        let cabecalho = tabela.insertRow()
        cabecalho.className = ''
        //Inserindo Celulas do cabelaho da tabela
        cabecalho.insertCell().textContent = 'Nome'
        cabecalho.insertCell().textContent = 'Nascimento'
        cabecalho.insertCell().textContent = 'Salário'
        cabecalho.insertCell().textContent = 'Sexo'
        cabecalho.insertCell().textContent = 'CPF'
        cabecalho.insertCell().textContent = 'Rua'
        cabecalho.insertCell().textContent = 'Bairro'
        cabecalho.insertCell().textContent = 'País'
        cabecalho.insertCell().textContent = 'Município'
        cabecalho.insertCell().textContent = 'UF'
        cabecalho.insertCell().textContent = 'Ações'


        snapshot.forEach(item => {
            //Dados do firebase
            let db = item.ref.path.pieces_[0] // Nome da collection
            let id = item.ref.path.pieces_[1] // Id
            let registro = JSON.parse(JSON.stringify(item.val()))
            console.log(registro)
            //Criando as novas linhas na tabela
            let novaLinha = tabela.insertRow()
            novaLinha.className = "table-primary table-bordered text-dark text-center align-bottom tr"
            novaLinha.setAttribute('id', 'tFuncionarios' + id);
            novaLinha.insertCell().textContent = item.val().nome
            novaLinha.insertCell().textContent = item.val().nascimento
            novaLinha.insertCell().textContent = 'R$ ' + item.val().salario
            novaLinha.insertCell().textContent = item.val().sexo
            novaLinha.insertCell().textContent = item.val().cpf
            novaLinha.insertCell().textContent = item.val().rua
            novaLinha.insertCell().textContent = item.val().bairro
            novaLinha.insertCell().textContent = item.val().paisNasc
            novaLinha.insertCell().textContent = item.val().municipio
            novaLinha.insertCell().textContent = item.val().uf
            novaLinha.insertCell().innerHTML =
                `
                <button tittle="remove o registro" class = 'btn btn-danger' onclick=remover('${db}','${id}')>🗑️ Excluir </button>
                <button tittle="edita o registro" class = 'btn btn-warning' onclick=carregaDadosAlteracao('${db}','${id}')>💻 Editar </button>
                `
        })
        let rodape = tabela.insertRow()
        rodape.className = ' table-borderless'
        rodape.insertCell().innerHTML = ''
        rodape.insertCell().innerHTML = ''
        rodape.insertCell().innerHTML = ''
        rodape.insertCell().innerHTML = ''
        rodape.insertCell().innerHTML = ''
        rodape.insertCell().innerHTML = ''
        rodape.insertCell().innerHTML = totalRegistros(collection)
        rodape.insertCell().innerHTML = ''
        rodape.insertCell().innerHTML = ''
        rodape.insertCell().innerHTML = ''
        // rodape.insertCell().setAttribute("colspan",'12');
    })
}


/**
 * Total de registros 
 * Retorna a contagem total do numero de registro da collection informada
 * @param {string} collection - Nome da collection no firebase 
 * @returns {string} - Texto com total de registros 
 */

function totalRegistros(collection) {
    var registro = '...'
    firebase.database().ref(collection).on('value', (snapshot) => {
        if (snapshot.numChildren() == 0) {
            registro = 'Nenhum registro'
        } else {
            registro = `Total de registros: ${snapshot.numChildren()}`
        }
    })
    return registro
}

/**
 * remover
 * Remove os dados da collection a partir do id informado
 * @param {string} db - Nome da collection no Firebase
 * @param {integer} id - Id do registro do Firebase
 * @return {null} - Snapshot atualizado dos dados
 */

function remover(db, id) {
    swal({
        title: "Deseja realmente excluir esse(s) registro?",
        text: "Esse processo será irreversível!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                let exclusao = firebase.database().ref().child(db + "/" + id)
                exclusao.remove()
                    .then(() => {
                        swal("Registro removido com sucesso!", {
                            icon: "success",
                        });
                    })
                    .catch(error => {
                        swal('Falha ao excluir: ' + error.message, {
                            icon: "error",
                        });
                    })
            }
        });
}

function alterar(event, collection, id, db) {
    event.preventDefault()
    // tive que mudar a forma de de pegar os dados porque não é mais um formularios
    const form = [...document.getElementsByClassName('formControl')]
    const values = form.map((el) =>
        el.value)
    return firebase.database().ref().child(collection + '/' + id).update({
        nome: values[0],
        nascimento: values[1],
        salario: values[2],
        sexo: values[3],
        cpf: values[4],
        rua: values[5],
        bairro: values[6],
        paisNasc: values[7],
        municipio: values[8],
        uf: values[9]
    })
        .then(() => {
            swal("Registro alterado com sucesso!", {
                icon: "success",
            });
            //Coloquei um Timer para recarregar a página
            setTimeout(() => { window.location.reload(); }, 1500);
        })
        .catch(error => {
            swal("Falha ao alterar: " + error.message, {
                icon: "error",
            });
        })

}

//Irá mudar os dados da tabela para inputs para eu conseguir alterar 
function carregaDadosAlteracao(db, id) {
    firebase.database().ref(db).on('value', (snapshot) => {
        snapshot.forEach(item => {
            if (item.ref.path.pieces_[1] === id) {
                let id = item.ref.path.pieces_[1]
                let nome = item.val().nome
                let nascimento = item.val().nascimento
                let salario = item.val().salario
                let sexo = item.val().sexo
                let rua = item.val().rua
                let bairro = item.val().bairro
                let cpf = item.val().cpf
                let paisDeNascimento = item.val().paisNasc
                let municipio = item.val().municipio
                let uf = item.val().uf

                document.getElementById('tId').value = id
                document.getElementById('tNome').value = nome
                document.getElementById('tNasc').value = nascimento
                document.getElementById('tSalario').value = salario
                document.getElementById('tSexo').value = sexo
                document.getElementById('tRua').value = rua
                document.getElementById('tCPF').value = cpf
                document.getElementById('tPaisNasc').value = paisDeNascimento
                document.getElementById('tMun').value = municipio
                document.getElementById('tUF').value = uf

                let tabela = document.getElementById('tFuncionarios' + id);


                tabela.children[0].outerHTML = ` <td><input type="text" class="formControl" value="${nome}" name="nome" id="nome" placeholder="Nome Completo"
                autofocus required></td>`
                tabela.children[1].outerHTML = ` <td><input type="date" class="formControl" value="${nascimento}" name="nome" id="nome" placeholder="Data de nascimento"
                autofocus required></td>`
                tabela.children[2].outerHTML = ` <td><input type="number" min="0" step="0.01" class="formControl" value="${salario}" name="nome" id="nome" placeholder="Nome Completo"
                autofocus required></td>`
                tabela.children[3].outerHTML = ` <td>
                <select class="formControl valid input-sm" id="sexo" name="sexo" required>
                    <option value="${sexo}">${sexo == 'M' ? 'Masculino' : 'Feminino'}</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                </select></td>`
                tabela.children[4].outerHTML = ` <td><input type="text" class="formControl" value="${cpf}" name="nome" id="nome" placeholder="Nome Completo"
                autofocus required></td>`
                tabela.children[5].outerHTML = ` <td><input type="text" class="formControl" value="${rua}" name="nome" id="nome" placeholder="Nome Completo"
                autofocus required></td>`
                tabela.children[6].outerHTML = ` <td><input type="text" class="formControl" value="${bairro}" name="nome" id="nome" placeholder="Nome Completo"
                autofocus required></td>`
                tabela.children[7].outerHTML = ` <td><input type="text" class="formControl" value="${paisDeNascimento}" name="nome" id="nome" placeholder="Nome Completo"
                autofocus required></td>`
                tabela.children[8].outerHTML = ` <td><input type="text" class="formControl" value="${municipio}" name="nome" id="nome" placeholder="Nome Completo"
                autofocus required></td>`
                tabela.children[9].outerHTML = ` <td><input type="text" class="formControl" value="${uf}" name="nome" id="nome" placeholder="Nome Completo"
                autofocus required></td>`

                tabela.children[10].outerHTML = ` <td> 
                <button tittle="remove o registro" class = 'btn btn-success my-2' onclick=alterar(event,'funcionarios','${id}','${db}')>💾 Salvar </button>
                <button tittle="edita o registro" class = 'btn btn-primary' onclick=cancelaAlteração('${db}','${id}')>❌ Cancelar </button></td>`
            }
        })
    })
}


function cancelaAlteração(db, id) {
    firebase.database().ref(db).on('value', (snapshot) => {
        snapshot.forEach(item => {
            if (item.ref.path.pieces_[1] === id) {

                let tabela = document.getElementById('tFuncionarios' + id);


                tabela.children[0].outerHTML = ` <td>${item.val().nome}</td>`
                tabela.children[1].outerHTML = ` <td>${item.val().nascimento}</td>`
                tabela.children[2].outerHTML = ` <td>${item.val().salario}</td>`
                tabela.children[3].outerHTML = ` <td>${item.val().sexo}</td>`
                tabela.children[4].outerHTML = ` <td>${item.val().cpf}</td>`
                tabela.children[5].outerHTML = ` <td>${item.val().rua}</td>`
                tabela.children[6].outerHTML = ` <td>${item.val().bairro}</td>`
                tabela.children[7].outerHTML = ` <td>${item.val().paisDeNascimento}</td>`
                tabela.children[8].outerHTML = ` <td>${item.val().municipio}</td>`
                tabela.children[9].outerHTML = ` <td>${item.val().uf}</td>`

                tabela.children[10].outerHTML = ` <td> 
                <button tittle="remove o registro" class = 'btn btn-danger my-2' onclick=remover('${db}','${id}')>🗑️ Excluir </button>
                <button tittle="cancela o registro" class = 'btn btn-warning' onclick=carregaDadosAlteracao('${db}','${id}')>💻 Editar </button> 
            </td>`
            }
        })
    })
}
