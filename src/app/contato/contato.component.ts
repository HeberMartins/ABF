import { Component, OnInit } from '@angular/core';
import { Contato } from '../../contato';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ContatoServiceService } from '../contato-service.service';
import { ActivatedRoute } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';



@Component({
    selector: 'app-contato',
    standalone: false,
    templateUrl: './contato.component.html',
    styleUrl: './contato.component.css'
})
export class ContatoComponent implements OnInit {

    @Output() contatoExcluido = new EventEmitter<number>();

    selectedContato?: Contato;
    formGroupContato: FormGroup;
    IsEditing: boolean = false;
    fieldEditing: { [key: string]: boolean } = {};
    excluir: boolean = true;

    constructor(
        private service: ContatoServiceService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute
    ) {
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
        });
    }


    ngOnInit(): void {
        console.log('ContatoComponent - ngOnInit chamado.');
        this.route.paramMap.subscribe(params => {
            const idParam = params.get('id');
            console.log('ContatoComponent - paramMap subscrito. ID lido:', idParam);
            if (idParam) {
                const contatoId = +idParam;
                this.ViewDetails(contatoId);
            } else {
                console.warn('ContatoComponent - ID do contato não encontrado na URL.');
            }
        });
    }

    ViewDetails(id: number) {
        this.service.getById(id).subscribe({
            next: contato => {
                console.log("Dados recebidos do serviço:", contato);
                this.selectedContato = contato;
                this.formGroupContato.setValue(contato);
                console.log('ContatoComponent - Dados do contato recebidos e atribuídos:', contato);


                this.editableFields.forEach(field => this.fieldEditing[field.name] = false);
            },
            error: err => {
                console.error('ContatoComponent - Erro ao carregar detalhes do contato:', err);
                this.selectedContato = undefined;
            }
        });
    }

    delete(contato: Contato) {
        this.service.delete(contato).subscribe({
            next: () => {
                this.selectedContato = undefined;
                this.contatoExcluido.emit(contato.id);
            },
            error: err => console.error('Erro ao excluir contato:', err)
        });
    }

    update() {
        this.service.update(this.formGroupContato.value).subscribe(
            {
                next: () => {
                    this.clear();
                    if (this.selectedContato?.id) {
                        this.ViewDetails(this.selectedContato.id);
                    }
                    this.IsEditing = false;
                }
            }
        );
    }
    editableFields = [
        { name: 'nickname', label: 'Apelido', type: 'text' },
        { name: 'fullname', label: 'Nome Completo', type: 'text' },
        { name: 'occupation', label: 'Ocupação', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'number', label: 'Número', type: 'phone' },
        { name: 'birthday', label: 'Aniversário', type: 'date' },
        { name: 'address', label: 'Endereço', type: 'text' },
        { name: 'type', label: 'Tipo', type: 'select' },
        { name: 'favorite', label: 'Favorito', type: 'select' },
    ];

    enableAllEdits() {
        this.editableFields.forEach(field => this.fieldEditing[field.name] = true);
        this.IsEditing = true;
        this.excluir = false;
    }


    clear() {
        this.IsEditing = false;
        this.formGroupContato.reset();
    }



    toggleFieldEdit(fieldName: string) {
        this.fieldEditing[fieldName] = !this.fieldEditing[fieldName];

        if (!this.fieldEditing[fieldName]) {

            console.log(`Campo "${fieldName}" atualizado:`, this.formGroupContato.get(fieldName)?.value);
        }
    }

    cancelar() {
        this.IsEditing = false;
        this.excluir = true;
        this.fieldEditing = {};
        this.formGroupContato.reset();
        if (this.selectedContato?.id) {
            this.ViewDetails(this.selectedContato.id);
        }
    }

    selectType(tipo: string, event: Event) {
        event.preventDefault(); 
        this.formGroupContato.get('type')?.setValue(tipo);
    }
}