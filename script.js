/**
 * @constant {Date} INICIO_COVID - Data de início do período COVID.
 */
const INICIO_COVID = new Date(2020, 5, 29);

/**
 * @constant {Date} FIM_COVID - Data de fim do período COVID.
 */
const FIM_COVID = new Date(2021, 10, 13);

/**
 * @constant {Date} DATA_ALVO - Data alvo para cálculo.
 */
const DATA_ALVO = new Date(2021, 10, 14);

/**
 * Ajusta a data de acordo com o período COVID.
 * @param {Date} data - A data a ser ajustada.
 * @returns {Date} A data ajustada.
 */
function ajustarPeriodoCovid(data) {
    if (data >= INICIO_COVID && data <= FIM_COVID) {
        const diasAdicionais = Math.floor((DATA_ALVO - data) / (1000 * 60 * 60 * 24));
        return new Date(data.getTime() + diasAdicionais * 24 * 60 * 60 * 1000);
    }
    return data;
}

/**
 * Ajusta a data final conforme regras específicas.
 * @param {Date} dataFinal - A data final a ser ajustada.
 * @returns {Date} A data ajustada.
 */
function ajustarData(dataFinal) {
    if ((dataFinal.getMonth() === 11 && dataFinal.getDate() >= 20) || 
        (dataFinal.getMonth() === 0 && dataFinal.getDate() <= 20)) {
        const diasPassados = Math.floor((dataFinal - new Date(dataFinal.getFullYear(), 11, 20)) / (1000 * 60 * 60 * 24));
        const proximaData = new Date(
            dataFinal.getMonth() === 11 ? dataFinal.getFullYear() + 1 : dataFinal.getFullYear(),
            0,
            21
        );
        dataFinal = new Date(proximaData.getTime() + diasPassados * 24 * 60 * 60 * 1000);
    }
    return dataFinal;
}

/**
 * Adiciona dias à data inicial com consideração de períodos de suspensão.
 * @param {Date} dataInicial - A data inicial.
 * @param {number} dias - O número de dias a adicionar.
 * @param {boolean} considerarSuspensao - Flag para considerar períodos de suspensão.
 * @returns {Date} A data final após a adição.
 */
function adicionarDiasComSuspensao(dataInicial, dias, considerarSuspensao = false) {
    let dataAtual = new Date(dataInicial);
    let diasRestantes = dias;
    let ultimoAnoPeriodoSuspensao = null;

    while (diasRestantes > 0) {
        // Verifica se está em um período de suspensão
        let estaNoPeriodo = (dataAtual.getMonth() === 11 && dataAtual.getDate() >= 20) || 
                           (dataAtual.getMonth() === 0 && dataAtual.getDate() <= 20);
        
        // Identifica o ano do período atual
        let anoAtual = dataAtual.getFullYear();
        if (dataAtual.getMonth() === 0 && dataAtual.getDate() <= 20) {
            anoAtual--; // Se estiver em janeiro, considera o período do ano anterior
        }

        if (considerarSuspensao && estaNoPeriodo && anoAtual !== ultimoAnoPeriodoSuspensao) {
            // Novo período de suspensão encontrado
            ultimoAnoPeriodoSuspensao = anoAtual;
            
            // Armazena a data antes de adicionar os 32 dias
            let dataAntes = new Date(dataAtual);
            dataAtual.setDate(dataAtual.getDate() + 32);
            
            // Se a adição dos 32 dias levou a outro período de suspensão,
            // volta para a data anterior e avança dia a dia
            if ((dataAtual.getMonth() === 11 && dataAtual.getDate() >= 20) || 
                (dataAtual.getMonth() === 0 && dataAtual.getDate() <= 20)) {
                dataAtual = dataAntes;
                dataAtual.setDate(dataAtual.getDate() + 1);
                diasRestantes--;
            }
        } else {
            // Avança um dia e decrementa o contador
            dataAtual.setDate(dataAtual.getDate() + 1);
            diasRestantes--;
        }
    }

    return dataAtual;
}

/**
 * Adiciona anos à data inicial com consideração de períodos de suspensão e anos bissextos.
 * @param {Date} dataInicial - A data inicial.
 * @param {number} anos - O número de anos a adicionar.
 * @param {boolean} considerarSuspensao - Flag para considerar períodos de suspensão.
 * @returns {Date} A data final após a adição.
 */
function adicionarAnosComSuspensao(dataInicial, anos, considerarSuspensao = false) {
    let dataAtual = new Date(dataInicial);
    let anosRestantes = anos;
    let ultimoAnoPeriodoSuspensao = null;

    while (anosRestantes > 0) {
        // Verifica se está em um período de suspensão
        let estaNoPeriodo = (dataAtual.getMonth() === 11 && dataAtual.getDate() >= 20) || 
                           (dataAtual.getMonth() === 0 && dataAtual.getDate() <= 20);

        // Identifica o ano do período atual
        let anoAtual = dataAtual.getFullYear();
        if (dataAtual.getMonth() === 0 && dataAtual.getDate() <= 20) {
            anoAtual--; // Se estiver em janeiro, considera o período do ano anterior
        }

        if (considerarSuspensao && estaNoPeriodo && anoAtual !== ultimoAnoPeriodoSuspensao) {
            // Novo período de suspensão encontrado
            ultimoAnoPeriodoSuspensao = anoAtual;
            dataAtual.setFullYear(dataAtual.getFullYear() + 1);
            anosRestantes--;
        } else {
            // Verifica se o ano atual é bissexto
            let ehBissexto = (anoAtual % 400 === 0) || (anoAtual % 4 === 0 && anoAtual % 100 !== 0);
            if (ehBissexto) {
                // Adiciona um dia extra em anos bissextos
                dataAtual.setDate(dataAtual.getDate() + 1);
            }
            dataAtual.setFullYear(dataAtual.getFullYear() + 1);
            anosRestantes--;
        }
    }

    return dataAtual;
}

/**
 * Adiciona dias a uma data inicial.
 * @param {Date} dataInicial - A data inicial. 
 * @param {number} dias - O número de dias a adicionar.
 * @param {boolean} considerarSuspensao - Flag para considerar períodos de suspensão.
 * @returns {Date} A data final após a adição.
 */
function adicionarDias(dataInicial, dias, considerarSuspensao = false) {
    const dataFinal = adicionarDiasComSuspensao(dataInicial, dias, considerarSuspensao);
    return ajustarPeriodoCovid(dataFinal);
}

/**
 * Verifica se a data está entre 02/07 e 31/07.
 * @param {Date} data - A data a ser verificada.
 * @returns {boolean} Verdadeiro se a data estiver no intervalo, falso caso contrário.
 */
function estaEntre02e31Julho(data) {
    const mes = data.getMonth(); // 0 = Janeiro, 6 = Julho
    const dia = data.getDate();

    return (mes === 6) && (dia >= 2 && dia <= 31);
}

/**
 * Calcula a prescrição com base na data inicial.
 * @param {Date} dataInicial - A data inicial.
 * @returns {Object} Um objeto contendo as datas de prescrição.
 */
function calcularPrescricao(dataInicial) {
    // Adiciona 140 dias à data inicial sem considerar suspensão
    let dataPrescricao = adicionarDias(dataInicial, 140, false);

    // Verifica se a data inicial está entre 02/08 e 13/08
    const dataInicio = new Date(dataInicial.getFullYear(), 7, 2); // 02/08
    const dataFim = new Date(dataInicial.getFullYear(), 7, 13); // 13/08
    if (dataInicial >= dataInicio && dataInicial <= dataFim) {
        dataPrescricao.setFullYear(dataPrescricao.getFullYear() + 1); // Adiciona um ano
    }

    // Verifica se a data cai entre 20/12 e 20/01 e ajusta para 21/01 se necessário
    if ((dataPrescricao.getMonth() === 11 && dataPrescricao.getDate() >= 20) || 
        (dataPrescricao.getMonth() === 0 && dataPrescricao.getDate() <= 20)) {
        dataPrescricao = new Date(dataPrescricao.getFullYear(), 0, 21); // Ajusta para 21/01
    }

    // Agora, adiciona os dias adicionais (365, 730, 1826) com suspensão
    const resultados = {};
    const diasAdicionais = [365, 730, 1826];

    diasAdicionais.forEach((dias, index) => {
        let dataFinal = adicionarDias(dataPrescricao, dias, true);
        dataFinal = ajustarData(dataFinal); // Ajusta a data final conforme regras específicas

        // Aplica a redução de 32 dias para Infração Média (2 anos) se dataInicial está entre 02/07 e 31/07
        if (index === 1) { // resultado2 corresponde à Infração Média
            if (estaEntre02e31Julho(dataInicial)) {
                dataFinal.setDate(dataFinal.getDate() - 32);
            }
        }

        // Armazena o resultado
        resultados[`resultado${index + 1}`] = dataFinal;
    });

    return resultados;
}

/**
 * Calcula as datas de prescrição com base na entrada do usuário.
 */
function calcular() {
    const dataInput = document.getElementById('data-inicial');
    const dataStr = dataInput.value;

    if (!validarData(dataStr)) {
        mostrarErro('Por favor, insira uma data válida no formato DD/MM/AAAA.');
        return;
    }

    try {
        const [dia, mes, ano] = dataStr.split('/').map(Number);
        let dataInicial = new Date(ano, mes - 1, dia);
        dataInicial = ajustarPeriodoCovid(dataInicial);

        const resultados = calcularPrescricao(dataInicial);

        mostrarResultado('resultado-1', 'Infração leve (1 ano)', resultados.resultado1);
        mostrarResultado('resultado-2', 'Infração média (2 anos)', resultados.resultado2);
        mostrarResultado('resultado-3', 'Infração grave (5 anos)', resultados.resultado3);
    } catch (e) {
        mostrarErro(`Ocorreu um erro: ${e.message}`);
    }
}

/**
 * Valida a data fornecida pelo usuário.
 * @param {string} dataStr - A data no formato DD/MM/AAAA.
 * @returns {boolean} Verdadeiro se a data for válida, falso caso contrário.
 */
function validarData(dataStr) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dataStr)) return false;
    
    const [, dia, mes, ano] = dataStr.match(regex);
    const data = new Date(ano, mes - 1, dia);

    // Verifica se a data criada é válida
    return data.getDate() == dia && data.getMonth() == mes - 1 && data.getFullYear() == ano;
}

/**
 * Mostra o resultado da prescrição na interface.
 * @param {string} elementId - O ID do elemento onde o resultado será exibido.
 * @param {string} titulo - O título do resultado.
 * @param {Date} data - A data limite de prescrição.
 */
function mostrarResultado(elementId, titulo, data) {
    const elemento = document.getElementById(elementId);
    elemento.innerHTML = `
        <strong>${titulo}</strong><br>
        Data limite de prescrição: ${formatarData(data)}
    `;
    elemento.style.display = 'block';
}

/**
 * Mostra uma mensagem de erro na interface.
 * @param {string} mensagem - A mensagem de erro a ser exibida.
 */
function mostrarErro(mensagem) {
    const erroContainer = document.getElementById('erro-container');
    erroContainer.innerText = mensagem;
    erroContainer.style.display = 'block'; // Exibe a mensagem de erro
}

/**
 * Formata uma data no formato DD/MM/AAAA.
 * @param {Date} data - A data a ser formatada.
 * @returns {string} A data formatada.
 */
function formatarData(data) {
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
}

/**
 * Formata a entrada de data do usuário.
 * @param {Event} event - O evento de entrada.
 */
function formatarEntradaData(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 4) value = value.slice(0, 4) + '/' + value.slice(4);
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    input.value = value;

    // Limpa a mensagem de erro ao digitar uma nova data
    const erroContainer = document.getElementById('erro-container');
    erroContainer.style.display = 'none'; // Oculta a mensagem de erro
}

// Eventos
document.getElementById('calcular').addEventListener('click', calcular);
document.getElementById('data-inicial').addEventListener('input', formatarEntradaData);
document.getElementById('data-inicial').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        calcular();
    }
});

// Limpar resultados ao focar no campo de entrada
document.getElementById('data-inicial').addEventListener('focus', function() {
    document.querySelectorAll('.resultado').forEach(el => el.style.display = 'none');
    document.getElementById('erro-container').style.display = 'none'; // Limpa a mensagem de erro
});
