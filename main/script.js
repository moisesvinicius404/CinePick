class Movie {
  constructor(titulo, genero, nota) {
    this.titulo = titulo
    this.genero = genero
    this.nota = nota
  }
}

class MovieModel extends Movie {
  constructor(titulo, genero, nota, container, capaInput) {
    super(titulo, genero, nota)
    this.container = container
    this.capaInput = capaInput
    this.salvar = JSON.parse(localStorage.getItem('escolha')) || []
    this.renderisar()
  }

  adicionarInfo() {
    const titulo = this.titulo.value.trim()
    const genero = this.genero.value.trim()
    const notaNum = Number(this.nota.value.trim())
    const capaInput = this.capaInput

    if (!titulo || !genero || !notaNum && notaNum !== 0) {
      alert('Ops, você precisa preencher todos os campos.')
      return
    }

    if (notaNum < 0 || notaNum > 10) {
      alert('Nota inválida. A nota deve ser entre 0 e 10.')
      return
    }

    // Se há imagem, aguarda carregar antes de salvar
    if (capaInput.files && capaInput.files[0]) {
      const reader = new FileReader()
      reader.onload = () => {
        const capa = reader.result
        this.salvarFilme(titulo, genero, notaNum, capa)
      }
      reader.readAsDataURL(capaInput.files[0])
    } else {
      this.salvarFilme(titulo, genero, notaNum, '')
    }

    // Limpa os campos som  DEPOIS de salvar
    this.titulo.value = ''
    this.genero.value = ''
    this.nota.value = ''
    this.capaInput.value = ''
  }

  salvarFilme(titulo, genero, notaNum, capa) {
    const dadosInfo = { titulo, genero, nota: notaNum, capa }
    this.salvar.push(dadosInfo)
    localStorage.setItem('escolha', JSON.stringify(this.salvar))
    this.renderisar()
  }

  renderisar() {
    this.container.innerHTML = ''
    this.salvar.forEach((item, index) => {
      const div = document.createElement('div')
      div.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'text-black', 'relative')

      div.innerHTML = `
        <img src="${item.capa || 'https://cdn-icons-png.flaticon.com/512/16/16410.png'}"
             alt="Capa do Filme"
             class="w-full h-48 object-cover rounded-md mb-2">
        <h2 class="text-green-600 font-bold">Título: ${item.titulo}</h2>
        <p class="text-gray-600">Gênero: ${item.genero}</p>
        <span class="text-black font-semibold">Nota: ${item.nota.toFixed(1)}</span><br>
        <button data-index="${index}" class="bg-red-500 text-white px-2 py-1 rounded-md mt-2 hover:bg-red-600">Remover</button>
      `
      this.container.appendChild(div)
    })

    // Evento dos botões de remover
    const botoes = this.container.querySelectorAll('button[data-index]')
    botoes.forEach(btn => {
      btn.addEventListener('click', () => {
        const i = btn.getAttribute('data-index')
        this.salvar.splice(i, 1)
        localStorage.setItem('escolha', JSON.stringify(this.salvar))
        this.renderisar()
      })
    })
  }
}


const tituloMovie = document.getElementById('title')
const generoMovie = document.getElementById('genre')
const notaMovie = document.getElementById('rating')
const container = document.getElementById('movieList')
const capaInput = document.getElementById('cover')

// Instancia 
const movie = new MovieModel(tituloMovie, generoMovie, notaMovie, container, capaInput)

// Evento de envio do formulário
document.getElementById('movieForm').addEventListener('submit', (e) => {
  e.preventDefault()
  movie.adicionarInfo()
})

// Permite enviar com Enter em qualquer campo
document.getElementById('movieForm').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    movie.adicionarInfo()
  }
})
