const meses = ['janeiro','fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const tableDay = document.getElementById('dias');
let date = new Date();
const mesatual = date.getMonth();
const ano = 2024;

const firebaseConfig = {
    apiKey: "AIzaSyCLX5W8fSrF_ZsR77RzdpykXR1_sapyAFE",
    authDomain: "calendario-24b21.firebaseapp.com",
    databaseURL: "https://calendario-24b21-default-rtdb.firebaseio.com",
    projectId: "calendario-24b21",
    storageBucket: "calendario-24b21.appspot.com",
    messagingSenderId: "51710976227",
    appId: "1:51710976227:web:68dcf232c867d41fb525d6"
};
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function pegarmes(mesatual, meses) {
    const mesescrito = meses[mesatual];
    console.log(mesescrito);
    const mesdisplay = document.querySelector('.mesatual');
    mesdisplay.innerHTML = mesescrito;
}

function adicionarEventoFirebase(diaSelecionado, evento) {
    const key = "Evento_" + diaSelecionado;
    database.ref(key).push({
        eventos: evento,
        dia: diaSelecionado
    });
}

function limparEventosFirebase() {
    // Para limpar todos os eventos
    database.ref().remove();
}

function modais(dias) {
    dias.addEventListener("click", function() {
        const diaSelecionado = parseInt(dias.innerHTML);
        const modal = document.createElement('div');
        modal.classList.add('modal');
        const countedo = document.querySelector('.conteudo');
        countedo.appendChild(modal);

        const adicionarumatarefa = document.createElement('h3');
        adicionarumatarefa.classList.add('texto');
        modal.appendChild(adicionarumatarefa);

        const divBotoes = document.createElement('div');
        divBotoes.classList.add('botoes-container');
        modal.appendChild(divBotoes);

        const botaocreate = document.createElement('button');
        botaocreate.innerText = 'Criar';
        botaocreate.classList.add('botaocriar');

        const botaofechar = document.createElement('button');
        botaofechar.innerText = 'Fechar';
        botaofechar.classList.add('botaofechar');
        modal.appendChild(botaofechar);

        divBotoes.appendChild(botaocreate);
        divBotoes.appendChild(botaofechar);

        botaocreate.addEventListener('click', function() {
            const modal2 = document.createElement('div');
            modal2.classList.add('modal2');
            const conteudo = document.querySelector('.conteudo');
            conteudo.appendChild(modal2);

            const title2 = document.createElement('h3');
            title2.innerHTML = 'Adicione um dever';
            title2.classList.add('texto2');
            modal2.appendChild(title2);

            const input = document.createElement('textarea');
            input.classList.add('input');
            modal2.appendChild(input);

            const botaocreate2 = document.createElement('button');
            botaocreate2.innerText = 'Criar';
            botaocreate2.classList.add('botaocriar2');
            modal2.appendChild(botaocreate2);

            const botaofechar2 = document.createElement('button');
            botaofechar2.innerText = 'Fechar';
            botaofechar2.classList.add('botaocriar3');
            modal2.appendChild(botaofechar2);

            modal.style.visibility = 'hidden';

            botaofechar.addEventListener('click', function() {
                modal.remove(); 
            });

            botaofechar2.addEventListener('click', function() {
                modal2.remove();
            });

            botaocreate2.addEventListener('click', function() {
                const evento = input.value;
                const diaSelecionado = parseInt(dias.innerHTML);

                if (evento.trim() !== "") {
                    adicionarEventoFirebase(diaSelecionado, evento);
                    alert("Evento registrado com sucesso");
                    input.value = "";
                    // Não precisa definir adicionarumatarefa aqui, pois já está definido
                    adicionarumatarefa.innerHTML = evento;
                } else {
                    alert("Por favor, insira um evento válido.");
                }
            });
        });

        carregarEventosFirebase(diaSelecionado, adicionarumatarefa); // Passar adicionarumatarefa para a função carregarEventosFirebase

        const botaolimparevento = document.createElement('button');
        botaolimparevento.innerText = 'Excluir';
        divBotoes.appendChild(botaolimparevento);

        botaolimparevento.addEventListener('click', function(){
            const confirmacao = confirm("Tem certeza de que deseja excluir todos os eventos?");
            if (confirmacao) {
                limparEventosFirebase();
                adicionarumatarefa.innerHTML = 'Não há nenhum agendamento';
            }
        });

        botaofechar.addEventListener('click', function() {
            modal.remove();
        });

    });
}

function carregarEventosFirebase(diaSelecionado, adicionarumatarefa) { // Adicionar adicionarumatarefa como parâmetro
    const key = "Evento_" + diaSelecionado;
    const eventosRef = database.ref(key);
    eventosRef.once('value', (snapshot) => {
        const eventosExist = snapshot.val();
        if (eventosExist) {
            adicionarumatarefa.innerHTML = Object.values(eventosExist).map(evento => evento.eventos).join("<br>");
        } else {
            adicionarumatarefa.innerHTML = 'Nenhum evento registrado';
        }
    });
}

function pegardiasmes(ano, mes) {
    const primeirodiasemana = new Date(ano, mes, 1).getDay() - 1; 
    const ultimodiames = new Date(ano, mes + 1, 0).getDate(); 

    for (let i = -primeirodiasemana, index = 0; i < (42 - primeirodiasemana); i++, index++) {
        const dt = new Date(ano, mes, i);
        const dayTable = tableDay.getElementsByTagName('td')[i];
        dayTable.innerHTML = dt.getDate();

        if (i < 1) {
            dayTable.classList.add('mes-anterior');
        }
        if (i > ultimodiames) {
            dayTable.classList.add('mes-posterior');
        }
        modais(dayTable);
    }
}

pegardiasmes(ano, mesatual);
pegarmes(mesatual, meses);
