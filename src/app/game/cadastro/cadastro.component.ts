import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameCadastro, GeneroIT } from '../model/game';
import { GameService } from 'src/app/services/game.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { GeneroComponent } from '../genero/genero.component';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  game = new GameCadastro();
  formulario!: FormGroup;
  constructor(
    private formbuilder: FormBuilder,
    private gameService: GameService,
    private _bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.createForm();

  }
  sendData() {
    if (this.formulario.invalid) return;
    if (new Date(this.formulario.value.lancamento as Date || new Date()).getDate().toLocaleString() === new Date().getDate().toLocaleString()) return console.log('data invalida')
    console.log(this.formulario.value)

    return this.gameService.sendData(this.formulario.value).then(res => {
      debugger
      console.log(res, 'res,1')
      res.subscribe(response => {
        if (response.error) return console.log(response, 'erro')
        this.formulario.reset();
        return console.log(response, '2');
      })
    });

  }

  createForm() {
    this.formulario = this.formbuilder.group({
      titulo: ['teste', [Validators.required, Validators.pattern(/^[^!@#$%¨&*]+$/)]],
      descricao: ['teste', [Validators.required, Validators.pattern(/^[^!@#$%¨&*]+$/)]],
      lancamento: [null, [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
      genero: [[], Validators.required],
      desenvolvedora: ['teste', [Validators.required, Validators.pattern(/^[^!@#$%¨&*]+$/)]]
    })
  }
  openBottomSheet(): void {
    this._bottomSheet.open(GeneroComponent).afterDismissed().subscribe(result => {
      if (result === undefined) return;
      this.preencheFormGenero(result);
    });
  }

  private preencheFormGenero(array: Array<GeneroIT>) {
    let form: Array<GeneroIT> = this.formulario.value?.genero;
    form.forEach(obj => array.splice(array.findIndex(ele => ele.id === obj.id), 1));
    return this.formulario.get('genero')?.setValue([...form, ...array]);
  }

  removeFromArray(i: number) {
    this.formulario.value?.genero.splice(i, 1);
    return this.formulario.get('genero')?.setValue(this.formulario.value?.genero);
  }
}
