import { Component } from '@angular/core';
import { Contato } from '../../contato';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContatoServiceService } from '../contato-service.service';

@Component({
  selector: 'app-novocontato',
  standalone: false,
  templateUrl: './novocontato.component.html',
  styleUrl: './novocontato.component.css'
})
export class NovocontatoComponent {

  selectedContato?: Contato;
  formGroupContato: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private service: ContatoServiceService,
    private formBuilder: FormBuilder,
  ) {
    this.formGroupContato = this.formBuilder.group({
      id: [''],
      nickname: [''],
      fullname: [''],
      occupation: [''],
      birthday: [''],
      address: [''],
      email: [''],
      number: ['', [Validators.required]],
      type: [''],
      favorite: ['']
    });
  }

  toggleFavorite() {
    const currentValue = this.formGroupContato.get('favorite')?.value;
    this.formGroupContato.get('favorite')?.setValue(!currentValue);
  }

  save() {
    this.errorMessage = null;

    this.service.save(this.formGroupContato.value).subscribe({
      next: json => {
        if (json && json.id && json.nickname) {
          this.selectedContato = json;
          alert('Contato salvo com sucesso!');
        }
        this.clear();
      },
      error: error => {
        this.errorMessage = error;
        this.clear();
      }
    });
  }

  clear() {
    this.formGroupContato.reset();
  }
}
