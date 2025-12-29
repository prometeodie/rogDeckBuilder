import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import { Card } from 'src/app/interfaces/card.interface';

@Component({
  selector: 'estadistics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estadistics.component.html',
  styleUrls: ['./estadistics.component.scss']
})
export class EstadisticsComponent implements AfterViewInit, OnChanges {

  @Input() maindeck: { data: Card | null; amount: number }[] = [];

  @ViewChild('costChart') costChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('typeChart') typeChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('factionChart') factionChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rarityChart') rarityChart!: ElementRef<HTMLCanvasElement>;

  private ready = false;
  private activeChartInstance: Chart | null = null;

  public selectedChart: 'cost' | 'type' | 'faction' | 'rarity' = 'cost';

  public FACTION_COLORS: Record<string, string> = {
    marte: '#d7161e',
    tierra: '#a4a37c',
    pluton: '#6662c1',
    saturno: '#059c6a',
    neptuno: '#0c9bc1',
    jupiter: '#d49f43'
  };

  ngAfterViewInit() {
    this.ready = true;
    this.renderSelectedChart();
  }

  ngOnChanges(_: SimpleChanges) {
    if (this.ready) {
      setTimeout(() => this.renderSelectedChart(), 20);
    }
  }

  onSelectChart(type: 'cost' | 'type' | 'faction' | 'rarity') {
    this.selectedChart = type;
    setTimeout(() => this.renderSelectedChart(), 20);
  }

  private renderSelectedChart() {
    if (this.activeChartInstance) {
      this.activeChartInstance.destroy();
      this.activeChartInstance = null;
    }

    switch (this.selectedChart) {
      case 'cost':
        this.activeChartInstance = this.renderCostChart();
        break;
      case 'type':
        this.activeChartInstance = this.renderTypeChart();
        break;
      case 'faction':
        this.activeChartInstance = this.renderFactionChart();
        break;
      case 'rarity':
        this.activeChartInstance = this.renderRarityChart();
        break;
    }
  }


  /* ================= COSTO ================= */
 private renderCostChart(): Chart | null {
  const ctx = this.costChart?.nativeElement.getContext('2d');
  if (!ctx) return null;

  const costMap: Record<number, number> = {};

  for (const item of this.maindeck) {
    if (!item.data) continue;

    const cost = item.data.cost + item.data.factionCost;
    costMap[cost] = (costMap[cost] || 0) + item.amount;
  }

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(costMap),
      datasets: [{ label: 'Cantidad', data: Object.values(costMap) }]
    },
    options: { responsive: true, maintainAspectRatio: true }
  });
}


  /* ================= TIPO ================= */
 private renderTypeChart(): Chart | null {
  const ctx = this.typeChart?.nativeElement.getContext('2d');
  if (!ctx) return null;

  const typeMap: Record<string, number> = {};

  for (const item of this.maindeck) {
    if (!item.data) continue;

    const c = item.data;
    const type =
      c.isSeal ? 'Sello' :
      c.isToken ? 'Token' :
      c.isQuickSpell ? 'Hechizo Rápido' :
      c.isSlowSpell ? 'Hechizo Lento' :
      c.isEstructure ? 'Estructura' :
      c.isArtifact ? 'Artefacto' :
      'Criatura';

    typeMap[type] = (typeMap[type] || 0) + item.amount;
  }

  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(typeMap),
      datasets: [{ data: Object.values(typeMap) }]
    },
    options: { responsive: true, maintainAspectRatio: true }
  });
}


  /* ================= FACCIÓN ================= */
  private renderFactionChart(): Chart | null {
  const ctx = this.factionChart?.nativeElement.getContext('2d');
  if (!ctx) return null;

  const factionMap: Record<string, number> = {};

  for (const item of this.maindeck) {
    if (!item.data) continue;

    factionMap[item.data.faction] =
      (factionMap[item.data.faction] || 0) + item.amount;
  }

  const labels = Object.keys(factionMap);
  const values = Object.values(factionMap);
  const colors = labels.map(f => this.FACTION_COLORS[f] ?? '#999');

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Cantidad',
        data: values,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}


  /* ================= RAREZA ================= */
  private renderRarityChart(): Chart | null {
  const ctx = this.rarityChart?.nativeElement.getContext('2d');
  if (!ctx) return null;

  const rarityMap: Record<string, number> = {};

  for (const item of this.maindeck) {
    if (!item.data) continue;

    rarityMap[item.data.rarity] =
      (rarityMap[item.data.rarity] || 0) + item.amount;
  }

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(rarityMap),
      datasets: [{ data: Object.values(rarityMap) }]
    },
    options: { responsive: true, maintainAspectRatio: true }
  });
}

}
