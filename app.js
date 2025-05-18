// app.js
function iniciarResta() {
    const minuendoInput = document.getElementById('minuendo').value;
    const sustraendoInput = document.getElementById('sustraendo').value;
    
    if (!minuendoInput || !sustraendoInput) {
        alert("¡Ingresa ambos números!");
        return;
    }

    const numMinuendo = parseInt(minuendoInput);
    const numSustraendo = parseInt(sustraendoInput);
    let esNegativo = false;
    let minuendo, sustraendo;

    if (numMinuendo < numSustraendo) {
        esNegativo = true;
        minuendo = sustraendoInput.padStart(minuendoInput.length, '0');
        sustraendo = minuendoInput.padStart(sustraendoInput.length, '0');
    } else {
        minuendo = minuendoInput;
        sustraendo = sustraendoInput;
    }

    const proceso = restaConPrestamos(minuendo, sustraendo);
    proceso.resultado = esNegativo ? `-${proceso.resultado}` : proceso.resultado;
    
    mostrarProceso(proceso);
}

function restaConPrestamos(minuendo, sustraendo) {
    const maxLen = Math.max(minuendo.length, sustraendo.length);
    minuendo = minuendo.padStart(maxLen, '0');
    sustraendo = sustraendo.padStart(maxLen, '0');

    const digitosM = minuendo.split('').reverse().map(Number);
    const digitosS = sustraendo.split('').reverse().map(Number);
    const pasos = [];
    const resultado = [];

    for (let i = 0; i < maxLen; i++) {
        let m = digitosM[i];
        let s = digitosS[i];

        pasos.push({
            tipo: 'analisis',
            pos: i,
            m: m,
            s: s
        });

        if (m < s) {
            let j = i + 1;
            while (j < maxLen && digitosM[j] === 0) {
                digitosM[j] = 9;
                j++;
            }
            if (j < maxLen) {
                digitosM[j]--;
                m += 10;
            }

            pasos.push({
                tipo: 'prestamo',
                desde: j,
                hacia: i,
                nuevoValor: m
            });
        }

        resultado.push(m - s);
    }

    let resultadoFinal = resultado.reverse().join('').replace(/^0+/, '') || '0';
    return { pasos, resultado: resultadoFinal };
}

// Resto de funciones igual que antes...

 function mostrarProceso(proceso) {
            const contenedor = document.getElementById('proceso');
            contenedor.innerHTML = '';
            
            proceso.pasos.forEach((paso, index) => {
                const div = document.createElement('div');
                div.className = 'paso';
                
                if (paso.tipo === 'analisis') {
                    div.innerHTML = `
                        <strong>Paso ${index + 1}:</strong> Analizando ${nombrePosicion(paso.pos)}<br>
                        ${paso.m} - ${paso.s} ${paso.m < paso.s ? '(¡Necesitamos préstamo!)' : ''}
                    `;
                } else {
                    div.innerHTML = `
                        <strong>Paso ${index + 1}:</strong> Préstamo de ${nombrePosicion(paso.desde)}<br>
                        Nueva cantidad en ${nombrePosicion(paso.hacia)}: ${paso.nuevoValor}
                    `;
                }
                contenedor.appendChild(div);
            });

            document.getElementById('resultado').innerHTML = `
                <h3>Resultado: ${proceso.resultado}</h3>
            `;
        }

        function nombrePosicion(pos) {
            const posiciones = ['unidades', 'decenas', 'centenas'];
            return posiciones[pos] || `posición ${pos + 1}`;
        }

        function reiniciar() {
            document.getElementById('minuendo').value = '';
            document.getElementById('sustraendo').value = '';
            document.getElementById('proceso').innerHTML = '';
            document.getElementById('resultado').innerHTML = '';
        }