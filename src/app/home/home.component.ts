import { Component, OnInit } from '@angular/core';
import { Contato } from '../../contato';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContatoServiceService } from '../contato-service.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  tiposelecionado: string = '';
  termoBusca: string = '';
  contato: Contato[] = [];
  formGroupContato: FormGroup;
  paginaAtual = 1;
  itensPorPagina = 5;
  mostrarEmail = false;
  mostrarTipo = false;


  constructor(private service: ContatoServiceService, private formBuilder: FormBuilder, private contatoService: ContatoServiceService) {
    this.formGroupContato = this.formBuilder.group({
      id: [''],
      nickname: [''],
      fullname: [''],
      occupation: [''],
      birthday: [''],
      address: [''],
      email: [''],
      number: [''],
      type: [''],
      favorite: ['']
    })

  }
  ngOnInit(): void {
    this.loadContatos();
  }

  loadContatos() {
    this.service.getAll().subscribe({
      next: json => this.contato = json
    });
  }



  buscar(): void {
    if (this.termoBusca.trim()) {
      this.contatoService.buscarPorTermo(this.termoBusca).subscribe({
        next: (resultado) => {
          this.contato = resultado;
          this.paginaAtual = 1;
        },
        error: (err) => {
          console.error('Erro ao buscar contatos:', err);
          this.contato = [];
          this.paginaAtual = 1;
        }
      });
    } else {
      this.loadContatos();
      this.paginaAtual = 1;
    }
  }


  get contatosFiltrados(): Contato[] {
    let filtrados = this.contato;


    if (this.tiposelecionado) {
      filtrados = filtrados.filter(c => c.type === this.tiposelecionado);
    }


    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.trim().toLowerCase();
      filtrados = filtrados.filter(c =>
        c.nickname?.toLowerCase().includes(termo) ||
        c.fullname?.toLowerCase().includes(termo) ||
        c.email?.toLowerCase().includes(termo) ||
        c.number?.toLowerCase().includes(termo) ||
        c.address?.toLowerCase().includes(termo)
      );
    }

    return filtrados;
  }

  get contatosPaginados(): Contato[] {
    const contatos = this.contatosFiltrados;
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return contatos.slice(inicio, inicio + this.itensPorPagina);
  }

  totalPaginas(): number[] {
    const total = Math.ceil(this.contatosFiltrados.length / this.itensPorPagina);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  mudarPagina(pagina: number) {
    const total = this.totalPaginas().length;
    this.paginaAtual = Math.min(Math.max(pagina, 1), total);
  }

  ordenarPor(campo: string) {
    this.contatoService.getAllOrdenado(campo).subscribe({
      next: (dados) => {
        this.contato = dados;
        this.atualizarExibicaoEmail(campo);
        this.paginaAtual = 1;
      }
    });
  }


  carregarFavoritosOrdenados(campo: string) {
    this.contatoService.getAllFavoritosOrdenado(campo).subscribe({
      next: (dados) => {
        this.contato = dados;
        this.paginaAtual = 1;
        this.mostrarEmail = false;
      }
    });
  }

  private atualizarExibicaoEmail(campo: string) {
    this.mostrarEmail = campo === 'email';
  }
  filtrarPorTipo(tipo: string) {
    this.tiposelecionado = tipo;;
    this.mostrarTipo = tipo !== '';
    this.paginaAtual = 1;
  }

  removerContato(id: number) {
    this.contato = this.contato.filter(c => c.id !== id);

    if (this.paginaAtual > this.totalPaginas().length) {
      this.paginaAtual = this.totalPaginas().length;
    }

    this.mudarPagina(this.paginaAtual);
  }

}
