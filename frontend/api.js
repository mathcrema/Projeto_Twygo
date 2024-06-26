const API_URL = 'http://localhost:8000/cursos/';

async function adicionarCurso(curso) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(curso)
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar curso');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

async function listarCursos() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao listar cursos');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

async function excluirCurso(cursoId) {
    try {
        const response = await fetch(`${API_URL}${cursoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir curso');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

async function atualizarCurso(cursoId, curso) {
    try {
        const response = await fetch(`${API_URL}${cursoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(curso)
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar curso');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

export { adicionarCurso, listarCursos, excluirCurso, atualizarCurso };
