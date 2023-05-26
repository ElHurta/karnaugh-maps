import { Component } from '@angular/core';
import { TruthTable } from 'src/app/interfaces/karnaugh.interfaces';

@Component({
  selector: 'app-truth-table',
  templateUrl: './truth-table.component.html',
  styleUrls: ['./truth-table.component.scss']
})
export class TruthTableComponent {

  public variablesCount: number = 2;
  public variables: string[] = ['A', 'B'];

  public truthTable: TruthTable[] = []
  public truthTableCols: any = []

  public karnaughMap: any[] = [];
  public karnaughMapCols: any = [];

  public solutionMethods: string[] = ['Sum of Products (SOP)', 'Product of Sums (POS)'];
  public selectedSolutionMethod: string = 'Sum of Products (SOP)';

  public patternsList = [
    '#f54545',
    '#f5a845',
    '#f5f545',
    '#a8f545',
  ]

  constructor() {
    this.initializeTables();
  }

  public changeVariablesCount(): void {
    this.variables = [];
    for (let i = 0; i < this.variablesCount; i++) {
      this.variables.push(String.fromCharCode(65 + i));
    }
    this.initializeTables();
  }

  public initializeTables(): void {
    this.initializeTruthTable();
    this.initializeKarnaughMap();
  }

  public initializeTruthTable(): void {
    this.truthTable = [];

    if (this.variablesCount === 2) {
      this.truthTableCols = [
        { field: 'firstVariable', header: this.variables[0] },
        { field: 'secondVariable', header: this.variables[1] },
        { field: 'result', header: 'Result' }
      ];
    } else if (this.variablesCount === 3) {
      this.truthTableCols = [
        { field: 'firstVariable', header: this.variables[0] },
        { field: 'secondVariable', header: this.variables[1] },
        { field: 'thirdVariable', header: this.variables[2] },
        { field: 'result', header: 'Result' }
      ];
    }

    for (let i = 0; i < Math.pow(2, this.variablesCount); i++) {

      // 2 variables
      if (this.variablesCount === 2) {

        this.truthTable.push({
          firstVariable: Math.floor(i / 2) % 2,
          secondVariable: i % 2,
          result: false
        });

        // 3 variables
      } else if (this.variablesCount === 3) {

        this.truthTable.push({
          firstVariable: Math.floor(i / 4) % 2,
          secondVariable: Math.floor(i / 2) % 2,
          thirdVariable: i % 2,
          result: false
        });
      }
    }
  }

  public initializeKarnaughMap(): void {
    this.karnaughMap = [];

    if (this.variablesCount === 2) {
      this.karnaughMapCols = [
        { field: 'column0', header: this.variables[0] + '\\' + this.variables[1] },
        { field: 'firstCell', header: '00' },
        { field: 'secondCell', header: '01'}
      ];
    } else if (this.variablesCount === 3) {
      this.karnaughMapCols = [
        { field: 'column0', header: this.variables[0] + '\\' + this.variables[1] + '' + this.variables[2]},
        { field: 'firstCell', header: '00' },
        { field: 'secondCell', header: '01' },
        { field: 'thirdCell', header: '11'},
        { field: 'fourthCell', header: '10'}
      ];
    }

    for (let i = 0; i < 2; i++) {
      if (this.variablesCount === 2) {
        this.karnaughMap.push({
          column0: {
            currentValue: i,
          },
          firstCell: {
            currentValue: 0,
            currentPatterns: {},
          },
          secondCell: {
            currentValue: 0,
            currentPatterns: {},
          },
        });
      } else if (this.variablesCount === 3) {
        this.karnaughMap.push({
          column0: {
            currentValue: i,
          },
          firstCell: {
            currentValue: 0,
            currentPatterns: {},
          },
          secondCell: {
            currentValue: 0,
            currentPatterns: {},
          },
          thirdCell: {
            currentValue: 0,
            currentPatterns: {},
          },
          fourthCell: {
            currentValue: 0,
            currentPatterns: {},
          }
        });
      }
    }
  }

  public onToggleResult(): void {
    this.updateKarnaugMap();
  }

  public updateKarnaugMap(): void {
   
    let resultArray: number[] = this.truthTable.map((item: TruthTable) => item.result ? 1 : 0);

    // Actulizar mapa de Karnaugh dependiendo de la cantidad de variables
    if (this.variablesCount === 2) {
      this.karnaughMap[0].firstCell.currentValue = resultArray[0];
      this.karnaughMap[0].secondCell.currentValue = resultArray[1];
      this.karnaughMap[1].firstCell.currentValue = resultArray[2];
      this.karnaughMap[1].secondCell.currentValue = resultArray[3];
    } else if (this.variablesCount === 3) {
      this.karnaughMap[0].firstCell.currentValue = resultArray[0];
      this.karnaughMap[0].secondCell.currentValue = resultArray[1];
      this.karnaughMap[0].thirdCell.currentValue = resultArray[3];
      this.karnaughMap[0].fourthCell.currentValue = resultArray[2];
      this.karnaughMap[1].firstCell.currentValue = resultArray[4];
      this.karnaughMap[1].secondCell.currentValue = resultArray[5];
      this.karnaughMap[1].thirdCell.currentValue = resultArray[7];
      this.karnaughMap[1].fourthCell.currentValue = resultArray[6];
    }
  }

  public solveKarNaughMap(): void {
    this.cleanPatterns();
    if (this.selectedSolutionMethod === 'Sum of Products (SOP)') {
      this.solveKarNaughMapSOP();
    } else if (this.selectedSolutionMethod === 'Product of Sums (POS)') {
      this.solveKarNaughMapPOS();
    }
  }

  public solveKarNaughMapSOP(): void {

    let currentPatternIndex = 0;
    if(this.variablesCount==2){
      for(let i = 0; i < this.karnaughMap.length; i++){
        if(this.karnaughMap[i].firstCell.currentValue==1){

          this.karnaughMap[i].firstCell.currentPatterns.borderLeft = `3px solid ${this.patternsList[currentPatternIndex]}`;
          
          if(this.karnaughMap[i].secondCell.currentValue==1){

            // Conjunto Horizontal (Puede ser cualquier fila)
            this.karnaughMap[i].firstCell.currentPatterns.borderTop = `3px solid ${this.patternsList[currentPatternIndex]}`;
            this.karnaughMap[i].firstCell.currentPatterns.borderBottom = `3px solid ${this.patternsList[currentPatternIndex]}`;

            this.karnaughMap[i].secondCell.currentPatterns.borderTop = `3px solid ${this.patternsList[currentPatternIndex]}`;
            this.karnaughMap[i].secondCell.currentPatterns.borderRight = `3px solid ${this.patternsList[currentPatternIndex]}`;
            this.karnaughMap[i].secondCell.currentPatterns.borderBottom = `3px solid ${this.patternsList[currentPatternIndex]}`;

            if(i==1){
              // Completo (Dos horizontales, se remueven los bordes que los separan)
              if(this.karnaughMap[i-1].firstCell.currentValue==1 && this.karnaughMap[i-1].secondCell.currentValue==1){
                this.karnaughMap[i-1].firstCell.currentPatterns.borderBottom = ``;
                this.karnaughMap[i-1].secondCell.currentPatterns.borderBottom = ``;
  
                this.karnaughMap[i].firstCell.currentPatterns.borderTop = ``;
                this.karnaughMap[i].secondCell.currentPatterns.borderTop = ``;
                break;
              } else{
                // Dos Patrones: Horizontal Abajo, Primera Columna
                if(this.karnaughMap[i-1].firstCell.currentValue==1){
                  currentPatternIndex++;
                  this.karnaughMap[i-1].firstCell.currentPatterns.borderLeft = `3px solid ${this.patternsList[currentPatternIndex]}`;
                  this.karnaughMap[i-1].firstCell.currentPatterns.borderTop = `3px solid ${this.patternsList[currentPatternIndex]}`;
                  this.karnaughMap[i-1].firstCell.currentPatterns.borderRight = `3px solid ${this.patternsList[currentPatternIndex]}`;
                  this.karnaughMap[i].firstCell.currentPatterns.borderRight = `3px solid ${this.patternsList[currentPatternIndex]}`;
                  break;
                }

                // Dos Patrones: Horizontal Abajo, Segunda Columna
                if(this.karnaughMap[i-1].secondCell.currentValue==1){
                  currentPatternIndex++;
                  this.karnaughMap[i-1].secondCell.currentPatterns.borderLeft = `3px solid ${this.patternsList[currentPatternIndex]}`;
                  this.karnaughMap[i-1].secondCell.currentPatterns.borderTop = `3px solid ${this.patternsList[currentPatternIndex]}`;
                  this.karnaughMap[i-1].secondCell.currentPatterns.borderRight = `3px solid ${this.patternsList[currentPatternIndex]}`;
                  this.karnaughMap[i].secondCell.currentPatterns.borderLeft = `3px solid ${this.patternsList[currentPatternIndex]}`;
                  break;
                }
              }
            } else {
              if(this.karnaughMap[i+1].firstCell.currentValue==1 && this.karnaughMap[i+1].secondCell.currentValue==0){
                currentPatternIndex++;
                // Dos Patrones: Horizontal arriba, primera columna
                this.karnaughMap[i].firstCell.currentPatterns.borderRight = `3px solid ${this.patternsList[currentPatternIndex]}`;
                this.karnaughMap[i+1].firstCell.currentPatterns.borderRight = `3px solid ${this.patternsList[currentPatternIndex]}`;
                this.karnaughMap[i+1].firstCell.currentPatterns.borderBottom = `3px solid ${this.patternsList[currentPatternIndex]}`;
                this.karnaughMap[i+1].firstCell.currentPatterns.borderLeft = `3px solid ${this.patternsList[currentPatternIndex]}`;
                break;
              } else if(this.karnaughMap[i+1].firstCell.currentValue==0 && this.karnaughMap[i+1].secondCell.currentValue==1){
                currentPatternIndex++;
                // Dos Patrones: Horizontal arriba, segunda columna
                this.karnaughMap[i+1].secondCell.currentPatterns.borderLeft = `3px solid ${this.patternsList[currentPatternIndex]}`;
                this.karnaughMap[i+1].secondCell.currentPatterns.borderBottom = `3px solid ${this.patternsList[currentPatternIndex]}`;
                this.karnaughMap[i+1].secondCell.currentPatterns.borderRight = `3px solid ${this.patternsList[currentPatternIndex]}`;
                this.karnaughMap[i].secondCell.currentPatterns.borderLeft = `3px solid ${this.patternsList[currentPatternIndex]}`;
                break;
              }
            }
          } else if(i==1){
            if(this.karnaughMap[i-1].firstCell.currentValue==1){
              // Conjunto Vertical Primera Columna
              this.karnaughMap[i-1].firstCell.currentPatterns.borderTop = `3px solid ${this.patternsList[currentPatternIndex]}`;
              this.karnaughMap[i-1].firstCell.currentPatterns.borderRight = `3px solid ${this.patternsList[currentPatternIndex]}`;
  
              this.karnaughMap[i].firstCell.currentPatterns.borderBottom = `3px solid ${this.patternsList[currentPatternIndex]}`;
              this.karnaughMap[i].firstCell.currentPatterns.borderRight = `3px solid ${this.patternsList[currentPatternIndex]}`;
            } else {
              // Bloque Solo Fila Abajo
              this.karnaughMap[i].firstCell.currentPatterns.borderBottom = `3px solid ${this.patternsList[currentPatternIndex]}`;
              this.karnaughMap[i].firstCell.currentPatterns.borderRight = `3px solid ${this.patternsList[currentPatternIndex]}`;
              this.karnaughMap[i].firstCell.currentPatterns.borderTop = `3px solid ${this.patternsList[currentPatternIndex]}`;

              if(this.karnaughMap[i-1].secondCell.currentValue==1){
                // Dos patrones: Bloques solos Diagonal Abajo Izquierda Arriba Derecha
                currentPatternIndex++;
                this.karnaughMap[i-1].secondCell.currentPatterns.borderLeft = `3px solid ${this.patternsList[currentPatternIndex]}`;
                this.karnaughMap[i-1].secondCell.currentPatterns.borderTop = `3px solid ${this.patternsList[currentPatternIndex]}`;
                this.karnaughMap[i-1].secondCell.currentPatterns.borderRight = `3px solid ${this.patternsList[currentPatternIndex]}`;
                this.karnaughMap[i-1].secondCell.currentPatterns.borderBottom = `3px solid ${this.patternsList[currentPatternIndex]}`;
                break;
              }
            }
          } else {
            if(this.karnaughMap[i+1].firstCell.currentValue==0){
              // Bloque Solo Fila Arriba
              this.karnaughMap[i].firstCell.currentPatterns.borderTop = `3px solid ${this.patternsList[currentPatternIndex]}`;
              this.karnaughMap[i].firstCell.currentPatterns.borderRight = `3px solid ${this.patternsList[currentPatternIndex]}`;
              this.karnaughMap[i].firstCell.currentPatterns.borderBottom = `3px solid ${this.patternsList[currentPatternIndex]}`;

              if(this.karnaughMap[i+1].secondCell.currentValue==1){
                // Dos patrones: Bloques solos Diagonal Arriba Izquierda Abajo Derecha
                currentPatternIndex++;
                this.karnaughMap[i+1].secondCell.currentPatterns.borderLeft = `3px solid ${this.patternsList[currentPatternIndex]}`;
                this.karnaughMap[i+1].secondCell.currentPatterns.borderTop = `3px solid ${this.patternsList[currentPatternIndex]}`;
                this.karnaughMap[i+1].secondCell.currentPatterns.borderRight = `3px solid ${this.patternsList[currentPatternIndex]}`;
                this.karnaughMap[i+1].secondCell.currentPatterns.borderBottom = `3px solid ${this.patternsList[currentPatternIndex]}`;
                break;
              }
            }
          }
        } else if (this.karnaughMap[i].secondCell.currentValue==1){
          this.karnaughMap[i].secondCell.currentPatterns.borderRight = `3px solid ${this.patternsList[currentPatternIndex]}`;

          if(i==1){
            if(this.karnaughMap[i-1].secondCell.currentValue==1){
              // Conjunto Vertical Segunda Columna
              this.karnaughMap[i-1].secondCell.currentPatterns.borderTop = `3px solid ${this.patternsList[currentPatternIndex]}`;
              this.karnaughMap[i-1].secondCell.currentPatterns.borderLeft = `3px solid ${this.patternsList[currentPatternIndex]}`;

              this.karnaughMap[i].secondCell.currentPatterns.borderBottom = `3px solid ${this.patternsList[currentPatternIndex]}`;
              this.karnaughMap[i].secondCell.currentPatterns.borderLeft = `3px solid ${this.patternsList[currentPatternIndex]}`;
              
            } else {
              // Bloque Solo Abajo Derecha
              this.karnaughMap[i].secondCell.currentPatterns.borderBottom = `3px solid ${this.patternsList[currentPatternIndex]}`;
              this.karnaughMap[i].secondCell.currentPatterns.borderLeft = `3px solid ${this.patternsList[currentPatternIndex]}`;
              this.karnaughMap[i].secondCell.currentPatterns.borderTop = `3px solid ${this.patternsList[currentPatternIndex]}`;
            }
          } else {
            if(this.karnaughMap[i+1].secondCell.currentValue==0){
              // Bloque Solo Arriba Derecha
              this.karnaughMap[i].secondCell.currentPatterns.borderTop = `3px solid ${this.patternsList[currentPatternIndex]}`;
              this.karnaughMap[i].secondCell.currentPatterns.borderLeft = `3px solid ${this.patternsList[currentPatternIndex]}`;
              this.karnaughMap[i].secondCell.currentPatterns.borderBottom = `3px solid ${this.patternsList[currentPatternIndex]}`;
            }
          }
        }
      }
    }
  }

  public solveKarNaughMapPOS(): void {
  }

  public cleanPatterns(): void {
    if (this.variablesCount === 2) {
      for(let i = 0; i < this.karnaughMap.length; i++){
        this.karnaughMap[i].firstCell.currentPatterns = {};
        this.karnaughMap[i].secondCell.currentPatterns = {};
      }
    } else if (this.variablesCount === 3) {
      for(let i = 0; i < this.karnaughMap.length; i++){
        this.karnaughMap[i].firstCell.currentPatterns = {};
        this.karnaughMap[i].secondCell.currentPatterns = {};
        this.karnaughMap[i].thirdCell.currentPatterns = {};
        this.karnaughMap[i].fourthCell.currentPatterns = {};
      }
    }
  }
}
