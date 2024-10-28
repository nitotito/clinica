import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'] // Corrección aquí
})
export class PrincipalComponent implements OnInit {
  public isVisible: boolean[] = Array(3).fill(false); // Cambia el número al total de bloques que tienes

  ngOnInit() {
    this.showBlocksInSequence();
  }

  showBlocksInSequence() {
    this.isVisible.forEach((_, index) => {
      setTimeout(() => {
        this.isVisible[index] = true; // Muestra cada bloque secuencialmente
      }, index * 700); // Ajusta el tiempo entre apariciones según sea necesario
    });
  }
}