import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

import { UsuariosService } from '../../services/usuarios.service';
import { environment } from '../../../environments/environment';
import { DataTableDirective } from 'angular-datatables';

declare var $: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnDestroy, OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  // public dtOptions: DataTables.Settings = {};
  public dtOptions: any = {};
  public dtTrigger = new Subject();
  public data: any;
  public base_url = environment.base_url;

  public forma: FormGroup;


  constructor(private fb: FormBuilder, private usuariosService: UsuariosService) { }

  ngOnInit(): void {

    this.crearFormulario();

    const self = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      // destroy: true,
      // Declare the use of the extension in the dom parameter
      dom: 'Bfrtip',
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json'
      },
      columns: [
        { title: 'ID', data: 'id' },
        { title: 'Nombre', data: 'nombre' },
        { title: 'Correo', data: 'email' },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        // const self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        // Note: In newer jQuery v3 versions, `unbind` and `bind` are 
        // deprecated in favor of `off` and `on`
        $('td', row).off('click');
        $('td', row).on('click', () => {
          self.obtenerUsuario(data);
        });
        return row;
      },
      // Configure the buttons
      buttons: [
        { extend: 'excel' },
        { extend: 'columnsToggle' },
        { extend: 'colvis' },
        { extend: 'copy' },
        { extend: 'print' },
        {
          text: 'Registro',
          key: '1',
          action: function (e, dt, node, config) {
            self.showModal()
          }
        }
      ]
    };
    
    this.obtenerUsuarios();

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.dtTrigger.unsubscribe();
  }

  showModal() {
    this.forma.reset();
    $('#mdlUsuarios').modal('show');
  }

  // rerender(): void {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     // Destroy the table first
  //     dtInstance.destroy();
  //     // Call the dtTrigger to rerender again
  //     this.dtTrigger.next();
  //   });
  // }

  obtenerUsuario(data: any) {

    this.forma.reset();

    console.log(data);
    // this.forma.get('nombre').setValue(data.nombre);
    this.forma.setValue({
      nombre: data.nombre, 
      email: data.email,
      id: data.id
    });

    $('#mdlUsuarios').modal('show');

  }

  obtenerUsuarios() {
    this.usuariosService.obtenerUsuarios().subscribe( (resp: any) => {
      this.data = resp.usuarios;
      this.dtTrigger.next();
    });
  }

  guardarUsuario() {
    
    if (this.forma.invalid) {
      Swal.fire({ title: 'Campos obligatorios!', html: 'Por favor llena los campos correctamente', timer: 2000, timerProgressBar: true, icon: 'warning' });
      return;
    }

    let objData = Object.assign({}, this.forma.value);
    
    this.usuariosService.postearUsuario(objData).subscribe( (resp: any) => {
      
      console.log(resp);

      Swal.fire({
        title: 'Guardado correctamente', icon: 'success',
      }).then( (result) => {
        
        if (result.isConfirmed) {
          $('#mdlUsuarios').modal('hide');
          this.forma.reset();
          // this.obtenerUsuarios();
        }

      });

      // Swal.fire({ title: 'Error', html: resp.error.msg, icon: 'error' });

    });

  }

  crearFormulario() {

    this.forma = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    });

  }

}
