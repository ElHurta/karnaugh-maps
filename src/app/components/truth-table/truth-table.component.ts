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

  public solvedKarnaughArray: any[] = [];

  public foundPatterns: any[] = [];
  // Pattern example: { type: 'row', cells:[{cell}], state: 'open' }

  public colorsList = [
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

    // Nuevo Método:
    this.solverKarnaughMapAlgorithm(this.selectedSolutionMethod);
  }

 
  public solverKarnaughMapAlgorithm(solutionMethod: string): void {
    let karnaughArray = this.transformKarnaughMapInto2DArray();
    let currentPatternIndex = -1;
    let filledCell = 1;

    if (solutionMethod == 'Product of Sums (POS)') {
      filledCell = 0;
    }
    console.log(filledCell);
    this.foundPatterns = [];

    this.karnaughRecursiveSolver(karnaughArray, filledCell, currentPatternIndex)

    // Delete duplicated patterns
    this.foundPatterns = this.foundPatterns.filter((pattern, index, self) =>
      index === self.findIndex((t) => (
        t.type === pattern.type && JSON.stringify(t.cells) === JSON.stringify(pattern.cells)
      ))
    )

    // For each column type pattern found, find the adjacent cells and merge their patterns into one of type 'sqr'
    let iterablePatterns = this.foundPatterns;
    for (let i = 0; i < iterablePatterns.length; i++) {
      if (iterablePatterns[i].type == 'column'){

        let nextIndex = i+1;
        
        if(this.foundPatterns[i].cells[0].row==karnaughArray.length-1 && this.variablesCount>2){
          nextIndex = 0;
        }

        let adjacentPatternRight = this.findPatternByCellCoordinates(this.foundPatterns[i].cells[0].row, this.foundPatterns[i].cells[0].column+1)
        if(nextIndex==0){
          adjacentPatternRight = this.findPatternByCellCoordinates(this.foundPatterns[i].cells[0].row, 0)
        }
        
        if(adjacentPatternRight?.type === 'column'){
          this.foundPatterns[i].type = 'sqr';
          this.foundPatterns[i].cells.push(adjacentPatternRight.cells[0]);
          this.foundPatterns[i].cells.push(adjacentPatternRight.cells[1]);
          this.foundPatterns.splice(nextIndex, 1);

          // Delete the row type patterns that included the cells that are now part of the new square pattern
          for (let j = 0; j < iterablePatterns.length; j++) {
            if (iterablePatterns[j].type == 'row'){
              for(let k = 0; k < 2; k++){
                if(this.foundPatterns[i].cells.includes(iterablePatterns[j].cells[k])){
                  this.foundPatterns.splice(j, 1);
                }
              }
            }
          }
        }
      }
    }

    // Find the cells that have value 1 and are not part of any pattern
    for(let i=0; i<karnaughArray.length; i++){
      for(let j=0; j<karnaughArray[i].length; j++){
        if(karnaughArray[i][j].value == filledCell){
          let found = false;
          for(let k=0; k<this.foundPatterns.length; k++){
            if(this.foundPatterns[k].cells.includes(karnaughArray[i][j])){
              found = true;
              break;
            }
          }
          if(!found){
            this.foundPatterns.push({type: 'single', cells: [karnaughArray[i][j]]});
          }
        }
      }
    }

    this.drawFoundPatternsIntoKarnaughMap();
  }

  public karnaughRecursiveSolver(karnaughArray: any[], filledCell: number, currentPatternIndex: number): void {

    // Caso base
    if (karnaughArray.length === 1 && karnaughArray[0].length === 1) {
      return;
    }

    // Dividir a la mitad en columnas
    let midCol = Math.floor(karnaughArray[0].length / 2);
    if(midCol!=0){
      let leftHalf = [];
      let rightHalf = [];
  
      for (let i = 0; i < karnaughArray.length; i++) {
        leftHalf.push(karnaughArray[i].slice(0, midCol));
        rightHalf.push(karnaughArray[i].slice(midCol));
      }
  
      // Recursively solve each half
      this.karnaughRecursiveSolver(leftHalf, filledCell, currentPatternIndex);
      this.karnaughRecursiveSolver(rightHalf, filledCell, currentPatternIndex);

    } else {
      let valueCounter = 0;
      for(let i=0; i<karnaughArray.length; i++){
        if(karnaughArray[i][0].value==filledCell){
          valueCounter++;
        }
      }

      if(valueCounter!=karnaughArray.length){
        return;
      }

      if(valueCounter==karnaughArray.length){
        currentPatternIndex++;
        this.foundPatterns.push({
          'type': 'column',
          'cells': [
            karnaughArray[0][0],
            karnaughArray[1][0]
          ],
          'state': 'closed'
        });
        return;
      }
    }

    // Dividir a la mitad en filas
    let midRow = Math.floor(karnaughArray.length / 2);
    if(midRow!=0){
      let topHalf = karnaughArray.slice(0, midRow);
      let bottomHalf = karnaughArray.slice(midRow);
  
      // Recursively solve each half
      this.karnaughRecursiveSolver(topHalf, filledCell, currentPatternIndex);
      this.karnaughRecursiveSolver(bottomHalf, filledCell, currentPatternIndex);
    } else {
      let valueCounter = 0;
      for(let i=0; i<karnaughArray[0].length; i++){
        if(karnaughArray[0][i].value==filledCell){
          valueCounter++;
        }
      }

      if(valueCounter!=karnaughArray[0].length){
        return;
      }

      if(valueCounter==karnaughArray[0].length){
        currentPatternIndex++;
        this.foundPatterns.push({
          'type': 'row',
          'cells': [
            karnaughArray[0][0],
            karnaughArray[0][1]
          ],
          'state': 'closed'
        });
        return;
      }
    }
  }

  public transformKarnaughMapInto2DArray(): any[] {
    let karnaughArray: any[] = [];

    if (this.variablesCount === 2) {
      //Transform karnaughMap into a 2D array
      for (let i = 0; i < 2; i++) {
        karnaughArray.push([]);
        for (let j = 0; j < 2; j++) {
          if(j==0){
            karnaughArray[i].push({
              'value': this.karnaughMap[i].firstCell.currentValue,
              'row': i,
              'column': j
            });
          } else {
            karnaughArray[i].push({
              'value': this.karnaughMap[i].secondCell.currentValue,
              'row': i,
              'column': j
            });
          }
        }
      }
    } else if (this.variablesCount === 3) {
      //Transform karnaughMap into a 2D array
      for (let i = 0; i < 2; i++) {
        karnaughArray.push([]);
        for (let j = 0; j < 4; j++) {
          if(j==0){
            karnaughArray[i].push({
              'value': this.karnaughMap[i].firstCell.currentValue,
              'row': i,
              'column': j
            });
          } else if(j==1){
            karnaughArray[i].push({
              'value': this.karnaughMap[i].secondCell.currentValue,
              'row': i,
              'column': j
            });
          } else if(j==2){
            karnaughArray[i].push({
              'value': this.karnaughMap[i].thirdCell.currentValue,
              'row': i,
              'column': j
            });
          } else if(j==3){
            karnaughArray[i].push({
              'value': this.karnaughMap[i].fourthCell.currentValue,
              'row': i,
              'column': j
            });
          }
        }
      }
    }

    console.log(karnaughArray);
    return karnaughArray;
  }

  public drawFoundPatternsIntoKarnaughMap(): void {
    for (let i = 0; i < this.foundPatterns.length; i++) {
      console.log(this.foundPatterns[i]);

      if (this.foundPatterns[i].type === 'column') {

        let selectedCell = 'firstCell'
        switch(this.foundPatterns[i].cells[0].column){
          case 1:
            selectedCell = 'secondCell';
            break;
          case 2:
            selectedCell = 'thirdCell';
            break;
          case 3:
            selectedCell = 'fourthCell';
            break;
          default:
            selectedCell = 'firstCell';
            break;
        }

        this.karnaughMap[this.foundPatterns[i].cells[0].row][selectedCell].currentPatterns.borderTop = `3px solid ${this.colorsList[i]}`;
        this.karnaughMap[this.foundPatterns[i].cells[0].row][selectedCell].currentPatterns.borderRight = `3px solid ${this.colorsList[i]}`;
        this.karnaughMap[this.foundPatterns[i].cells[0].row][selectedCell].currentPatterns.borderLeft = `3px solid ${this.colorsList[i]}`;

        this.karnaughMap[this.foundPatterns[i].cells[1].row][selectedCell].currentPatterns.borderBottom = `3px solid ${this.colorsList[i]}`;
        this.karnaughMap[this.foundPatterns[i].cells[1].row][selectedCell].currentPatterns.borderRight = `3px solid ${this.colorsList[i]}`;
        this.karnaughMap[this.foundPatterns[i].cells[1].row][selectedCell].currentPatterns.borderLeft = `3px solid ${this.colorsList[i]}`;
      
      } else if (this.foundPatterns[i].type === 'row'){

        let selectedCell = 'firstCell'
        switch(this.foundPatterns[i].cells[0].column){
          case 1:
            selectedCell = 'secondCell';
            break;
          case 2:
            selectedCell = 'thirdCell';
            break;
          case 3:
            selectedCell = 'fourthCell';
            break;
          default:
            selectedCell = 'firstCell';
            break;
        }

        this.karnaughMap[this.foundPatterns[i].cells[0].row][selectedCell].currentPatterns.borderTop = `3px solid ${this.colorsList[i]}`;
        this.karnaughMap[this.foundPatterns[i].cells[0].row][selectedCell].currentPatterns.borderBottom = `3px solid ${this.colorsList[i]}`;
        this.karnaughMap[this.foundPatterns[i].cells[0].row][selectedCell].currentPatterns.borderLeft = `3px solid ${this.colorsList[i]}`;

        switch(this.foundPatterns[i].cells[1].column){
          case 1:
            selectedCell = 'secondCell';
            break;
          case 2:
            selectedCell = 'thirdCell';
            break;
          case 3:
            selectedCell = 'fourthCell';
            break;
          default:
            selectedCell = 'firstCell';
            break;
        }

        this.karnaughMap[this.foundPatterns[i].cells[1].row][selectedCell].currentPatterns.borderTop = `3px solid ${this.colorsList[i]}`;
        this.karnaughMap[this.foundPatterns[i].cells[1].row][selectedCell].currentPatterns.borderBottom = `3px solid ${this.colorsList[i]}`;
        this.karnaughMap[this.foundPatterns[i].cells[1].row][selectedCell].currentPatterns.borderRight = `3px solid ${this.colorsList[i]}`;

      } else if (this.foundPatterns[i].type=="sqr"){

        let selectedCell = 'firstCell'
        switch(this.foundPatterns[i].cells[0].column){
          case 1:
            selectedCell = 'secondCell';
            break;
          case 2:
            selectedCell = 'thirdCell';
            break;
          case 3:
            selectedCell = 'fourthCell';
            break;
          default:
            selectedCell = 'firstCell';
            break;
        }

        this.karnaughMap[this.foundPatterns[i].cells[0].row][selectedCell].currentPatterns.borderTop = `3px solid ${this.colorsList[i]}`;
        this.karnaughMap[this.foundPatterns[i].cells[0].row][selectedCell].currentPatterns.borderLeft = `3px solid ${this.colorsList[i]}`;

        this.karnaughMap[this.foundPatterns[i].cells[1].row][selectedCell].currentPatterns.borderBottom = `3px solid ${this.colorsList[i]}`;
        this.karnaughMap[this.foundPatterns[i].cells[1].row][selectedCell].currentPatterns.borderLeft = `3px solid ${this.colorsList[i]}`;

        switch(this.foundPatterns[i].cells[2].column){
          case 1:
            selectedCell = 'secondCell';
            break;
          case 2:
            selectedCell = 'thirdCell';
            break;
          case 3:
            selectedCell = 'fourthCell';
            break;
          default:
            selectedCell = 'firstCell';
            break;
        }

        this.karnaughMap[this.foundPatterns[i].cells[2].row][selectedCell].currentPatterns.borderTop = `3px solid ${this.colorsList[i]}`;
        this.karnaughMap[this.foundPatterns[i].cells[2].row][selectedCell].currentPatterns.borderRight = `3px solid ${this.colorsList[i]}`;

        this.karnaughMap[this.foundPatterns[i].cells[3].row][selectedCell].currentPatterns.borderBottom = `3px solid ${this.colorsList[i]}`;
        this.karnaughMap[this.foundPatterns[i].cells[3].row][selectedCell].currentPatterns.borderRight = `3px solid ${this.colorsList[i]}`;
      
      } else if (this.foundPatterns[i].type=="single"){
        let selectedCell = 'firstCell'
        switch(this.foundPatterns[i].cells[0].column){
          case 1:
            selectedCell = 'secondCell';
            break;
          case 2:
            selectedCell = 'thirdCell';
            break;
          case 3:
            selectedCell = 'fourthCell';
            break;
          default:
            selectedCell = 'firstCell';
            break;
        }

        this.karnaughMap[this.foundPatterns[i].cells[0].row][selectedCell].currentPatterns.borderTop = `3px solid ${this.colorsList[i]}`;
        this.karnaughMap[this.foundPatterns[i].cells[0].row][selectedCell].currentPatterns.borderBottom = `3px solid ${this.colorsList[i]}`;
        this.karnaughMap[this.foundPatterns[i].cells[0].row][selectedCell].currentPatterns.borderLeft = `3px solid ${this.colorsList[i]}`;
        this.karnaughMap[this.foundPatterns[i].cells[0].row][selectedCell].currentPatterns.borderRight = `3px solid ${this.colorsList[i]}`;
      }
    }
  }

  public findPatternByCellCoordinates(row: number, column: number): any {
    for (let i = 0; i < this.foundPatterns.length; i++) {
      if (this.foundPatterns[i].cells[0].row === row && this.foundPatterns[i].cells[0].column === column) {
        return this.foundPatterns[i];
      }
    }
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
