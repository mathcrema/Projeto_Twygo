  import { adicionarCurso, listarCursos, excluirCurso, atualizarCurso } from './api.js';

  // Função para exibir os cursos na página
  async function exibirCursos() {
    const cursos = await listarCursos();
    const cursoLista = document.getElementById('curso-lista');
    cursoLista.innerHTML = '';

    cursos.forEach((curso) => {
      const cursoDiv = document.createElement('div');
      cursoDiv.classList.add('curso');
      cursoDiv.innerHTML = `
        <div class="curso-info">
              <div id="container-botao-editar">
                <div class="editar-icon-btn" data-id="${curso.id}">
                  <i class="bi bi-pencil"></i> <!-- Ícone de edição -->
                </div>
              </div>
          <div class="titulo-editar">
            <h2>${curso.titulo}</h2>
            <p>${curso.descricao}</p>
          </div>
          <button class="detalhes-btn">Clique aqui para saber mais</button>
        </div>
      `;
      cursoDiv.querySelector('.detalhes-btn').addEventListener('click', () => abrirDetalhes(curso));
      cursoDiv.querySelector('.editar-icon-btn').addEventListener('click', () => abrirModalEdicao(curso));
      cursoLista.appendChild(cursoDiv);
    });
  }

  // Função para exibir cursos filtrados
  function exibirCursosFiltrados(cursos) {
    const cursoLista = document.getElementById('curso-lista');
    cursoLista.innerHTML = '';

    cursos.forEach((curso) => {
      const cursoDiv = document.createElement('div');
      cursoDiv.classList.add('curso');
      cursoDiv.innerHTML = `
        <div class="curso-info">
          <div id="container-botao-editar">
            <div class="editar-icon-btn" data-id="${curso.id}">
              <i class="bi bi-pencil"></i> <!-- Ícone de edição -->
            </div>
          </div>
          <div class="titulo-editar">
            <h2>${curso.titulo}</h2>
            <p>${curso.descricao}</p>
          </div>
          <button class="detalhes-btn">Clique aqui para saber mais</button>
        </div>
      `;
      cursoDiv.querySelector('.detalhes-btn').addEventListener('click', () => abrirDetalhes(curso));
      cursoDiv.querySelector('.editar-icon-btn').addEventListener('click', () => abrirModalEdicao(curso));
      cursoLista.appendChild(cursoDiv);
    });
  }

  function abrirDetalhes(curso) {
    document.getElementById('detalhes-titulo').innerText = curso.titulo;
    document.getElementById('detalhes-descricao').innerText = curso.descricao;
    const dataFormatada = new Date(curso.data_termino).toISOString().split('T')[0];
    document.getElementById('detalhes-dataTermino').innerText = dataFormatada;

    const modalDetalhes = document.getElementById('detalhes-modal');
    modalDetalhes.style.display = 'block';  

    document.getElementById('btn-fechar-detalhes').onclick = function (event) {
      event.preventDefault();
      modalDetalhes.style.display = 'none';
    };
  }

  // Função para abrir modal de edição com os dados do curso
  function abrirModalEdicao(curso) {
    document.getElementById('edicao-titulo').value = curso.titulo;
    document.getElementById('edicao-descricao').value = curso.descricao;
    document.getElementById('edicao-dataTermino').value = curso.data_termino;

    const modalEdicao = document.getElementById('edicao-modal');
    modalEdicao.style.display = 'block';

    document.getElementById('btn-salvar-edicao').onclick = async function (event) {
      event.preventDefault();

      const cursoAtualizado = {
        id: curso.id,
        titulo: document.getElementById('edicao-titulo').value,
        descricao: document.getElementById('edicao-descricao').value,
        data_termino: new Date(document.getElementById('edicao-dataTermino').value).toISOString().split('T')[0],
      };

      await atualizarCurso(cursoAtualizado.id, cursoAtualizado);

      modalEdicao.style.display = 'none';
      exibirCursos();
    };

    document.getElementById('btn-fechar-edicao').onclick = function (event) {
      event.preventDefault();
      modalEdicao.style.display = 'none';
    };
  }

  // Função para cadastrar um novo curso
  function cadastrarNovoCurso() {
    const modalCadastro = document.getElementById('cadastro-modal');
    modalCadastro.style.display = 'block';

    document.getElementById('titulo').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('dataTermino').value = '';

    document.getElementById('cadastro-form').onsubmit = async function (event) {
      event.preventDefault();

      const titulo = document.getElementById('titulo').value;
      const descricao = document.getElementById('descricao').value;
      const dataTermino = new Date(document.getElementById('dataTermino').value).toISOString().split('T')[0] ;

      const novoCurso = { 
        titulo: titulo,
        descricao: descricao,
        data_termino:  new Date(dataTermino),
      };

      await adicionarCurso(novoCurso);

      modalCadastro.style.display = 'none';
      exibirCursos();
    };
  }

  // Função para ordenar os cursos por data de término
  async function ordenarCursosPorData(ordem) {
    const cursos = await listarCursos();
    cursos.sort((curso1, curso2) => {
      const data1 = new Date(curso1.data_termino);
      const data2 = new Date(curso2.data_termino);

      if (ordem === 'asc') {
        return data1 - data2;
      } else {
        return data2 - data1;
      }
    });

    exibirCursosFiltrados(cursos);
  }

  // Função para buscar cursos por data de término
  async function buscarCursosPorData() {
    const dataBusca = new Date(document.getElementById('data-busca').value);
    const cursos = await listarCursos();
    
    const cursosFiltrados = cursos.filter(curso => new Date(curso.data_termino) <= dataBusca);

    if (cursosFiltrados.length > 0) {
      exibirCursosFiltrados(cursosFiltrados);
    } else {
      alert('Não foram encontrados cursos com data de término até a data especificada.');
    }

    const modalBusca = document.getElementById('modal-busca');
    modalBusca.style.display = 'none';
  }

  // Event listener para o botão Cadastrar Curso
  document.getElementById('btn-cadastrar').addEventListener('click', cadastrarNovoCurso);

  // Event listener para o botão Ordenar por Data
  document.getElementById('btn-ordenar').addEventListener('click', () => {
    const modalOrdenar = document.getElementById('modal');
    modalOrdenar.style.display = 'block';
  });

  // Event listener para o botão de Ordenar dentro do modal de ordenação
  document.getElementById('btn-ordenar-modal').addEventListener('click', () => {
    const selectOrdem = document.getElementById('select-ordem');
    const ordem = selectOrdem.value;
    ordenarCursosPorData(ordem);

    const modalOrdenar = document.getElementById('modal');
    modalOrdenar.style.display = 'none';
  });

  // Event listener para o botão Buscar por Data
  document.getElementById('btn-buscar-data').addEventListener('click', () => {
    const modalBuscar = document.getElementById('modal-busca');
    modalBuscar.style.display = 'block';
  });

  // Event listener para o botão de Buscar dentro do modal de busca
  document.getElementById('btn-buscar').addEventListener('click', buscarCursosPorData);

  // Inicialização da página
  document.addEventListener('DOMContentLoaded', exibirCursos);

  document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      closeBtn.closest('.modal').style.display = 'none';
    });
  });
