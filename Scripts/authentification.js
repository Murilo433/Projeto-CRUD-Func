// const baseURL = "http://127.0.0.1:5500"




const baseURL = ""

/** 
*loginFirebase
*Realiza a autentificação do usuário no Firebase
* @param {string} email - email do usuário
* @param {string} senha - senha do usuário
* @return {object} - Objeto com o usuário logado

*/
function loginFirebase(email, senha) {
    firebase
        .auth()
        .signInWithEmailAndPassword(email, senha)
        .then(result => {
            swal(`Bem Vindo, ${JSON.stringify(result.user.email)}`)
            window.location.href = `${baseURL}/Home.html`
        })
        .catch(error => {
            let erro = ''
            switch (error.code) {
                case 'auth/user-not-found':
                    erro = "Não há registro de usuário existente correspondente."
                case 'auth/invalid-email':
                    erro = "E-mail invalido"
                    break;
                case 'auth/invalid-email-already-exists':
                    erro = 'O e-mail ja existe'
                    break;
                case 'auth/wrong-password':
                    erro = 'Senha invalida'
                    break;
                default:
                    erro = error.message
            }
            swal(`Erro ao efetuar o login: ${erro}`,'','error')
        })
}

/**
 * novoUsuario.
 * Cria um novo usuário no Firebase.
 * @param {string} email - e-mail do usuário
 * @param {string} senha - Senha do usuário
 * @return {object} - O usuário criado
 */

function novoUsuario(email, senha) {
    firebase.auth().createUserWithEmailAndPassword(email, senha)
        .then(result => {
            swal(`Bem vindo, ${JSON.stringify(result.user.email)}`)
            
            //Direcionamento do usuario para a tela inicial
            window.location.href = `${baseURL}/home.html`
        })
        .catch(error => {
            let erro = ''
            switch (error.code) {
                case 'auth/user-not-found':
                    erro = "Não há registro de usuário existente correspondente."
                case 'auth/invalid-email':
                    erro = "E-mail invalido"
                    break;
                case 'auth/email-already-in-use':
                    erro = 'O e-mail ja existe'
                    break;
                case 'auth/wrong-password':
                    erro = 'Senha invalida'
                case 'auth/weak-password':
                    erro = 'Senha deverá ter no mínimo 6 caracteres'
                    break;
                default:
                    erro = error.message
            }
            swal(`Não foi possível cadastrar o usuário, ${erro}`,'','error')
        })
}




/**
 * verificarlogado
 * verificar se o usuario está logado no sistema
 * @return {null}
 */

 function verificaLogado() {
    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            console.log('Acesso inválido. Redirecionando...')
            window.location.href = `${baseURL}/index.html` //URL Inicial
        }
    })
}

function logOut() {
    firebase.auth().signOut().then(() => {
        window.location.href = `${baseURL}/index.html`;
    })
}
