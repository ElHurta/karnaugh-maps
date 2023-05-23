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
          column0: i,
          firstCell: 0,
          secondCell: 0,
        });
      } else if (this.variablesCount === 3) {
        this.karnaughMap.push({
          column0: i,
          firstCell: 0,
          secondCell: 0,
          thirdCell: 0,
          fourthCell: 0
        });
      }
    }

    console.log(this.karnaughMap, this.karnaughMapCols);
  }

  public onToggleResult(): void {
    this.updateKarnaugMap();
    console.log(this.truthTable);
  }

  public updateKarnaugMap(): void {
    
  }
}
