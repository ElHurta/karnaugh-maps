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
  public karnaughMap: number[] = [];

  public cols: any = []
  public solutionMethods: string[] = ['Sum of Products (SOP)', 'Product of Sums (POS)'];
  public selectedSolutionMethod: string = 'Sum of Products (SOP)';
  public seletectedResults: number[] = [0, 0, 0, 0];

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
  }

  public initializeTruthTable(): void {
    this.truthTable = [];

    for (let i = 0; i < Math.pow(2, this.variablesCount); i++) {
      if (this.variablesCount === 2) {

        this.truthTable.push({
          firstVariable: Math.floor(i / 2) % 2,
          secondVariable: i % 2,
          result: false
        });

        this.cols = [
          { field: 'firstVariable', header: this.variables[0] },
          { field: 'secondVariable', header: this.variables[1] },
          { field: 'result', header: 'Result' }
        ];

      } else if (this.variablesCount === 3) {

        this.truthTable.push({
          firstVariable: Math.floor(i / 4) % 2,
          secondVariable: Math.floor(i / 2) % 2,
          thirdVariable: i % 2,
          result: false
        });

        this.cols = [
          { field: 'firstVariable', header: this.variables[0] },
          { field: 'secondVariable', header: this.variables[1] },
          { field: 'thirdVariable', header: this.variables[2] },
          { field: 'result', header: 'Result' }
        ];
      }
    }
  }

  public onToggleResult(): void {
    console.log(this.truthTable);
  }
}
