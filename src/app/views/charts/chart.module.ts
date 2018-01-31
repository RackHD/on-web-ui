import { NgModule } from '@angular/core';
import { DonutComponent } from './donut.component';
import { LineChartComponent } from './line-chart.component';

@NgModule({
  declarations: [
    DonutComponent,
    LineChartComponent
  ],
  exports: [
    DonutComponent,
    LineChartComponent
  ]
})

export class ChartModule {}
