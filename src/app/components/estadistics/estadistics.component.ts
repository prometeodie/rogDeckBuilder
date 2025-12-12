import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import { Card } from 'src/app/interfaces/card.interface';

@Component({
  selector: 'estadistics',
  templateUrl: './estadistics.component.html',
  styleUrls: ['./estadistics.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
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
  public  FACTION_COLORS: Record<string, string> = {
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

  ngOnChanges(changes: SimpleChanges) {
    if (this.ready) {
      setTimeout(() => this.renderSelectedChart(), 20);
    }
  }

  /** ======================================================
   *   CAMBIAR DE CHART
   * ====================================================== */
  onSelectChart(type: 'cost' | 'type' | 'faction' | 'rarity') {
    this.selectedChart = type;

    // Esperar a que el nuevo canvas se renderice
    setTimeout(() => this.renderSelectedChart(), 20);
  }

  /** ======================================================
   *   RENDERIZAR SOLO EL CHART SELECCIONADO
   * ====================================================== */
  private renderSelectedChart() {
    if (!this.ready) return;

    // Destruir gráfico anterior (evita fugas y duplicados)
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

  /** ======================================================
   *   PREPARAR CARTAS
   * ====================================================== */
  get cardsOnly(): Card[] {
    return this.maindeck.reduce((acc: Card[], item) => {
      if (item.data) {
        acc.push(item.data);
      }
      return acc;
    }, []);
  }

  /** ======================================================
   *   CHART: COSTO
   * ====================================================== */
  private renderCostChart(): Chart | null {
    if (!this.costChart) return null;
    const ctx = this.costChart.nativeElement.getContext('2d');
    if (!ctx) return null;

    const cards = this.cardsOnly;
    const totalCosts = cards.map(c => c.cost + c.factionCost);

    const costMap: Record<number, number> = {};
    for (const cost of totalCosts) {
      costMap[cost] = (costMap[cost] || 0) + 1;
    }

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(costMap),
        datasets: [
          { label: 'Cantidad', data: Object.values(costMap) }
        ]
      }
    });
  }

  /** ======================================================
   *   CHART: TIPO
   * ====================================================== */
  private renderTypeChart(): Chart | null {
    if (!this.typeChart) return null;
    const ctx = this.typeChart.nativeElement.getContext('2d');
    if (!ctx) return null;

    const cards = this.cardsOnly;

    const getType = (c: Card): string => {
      if (c.isSeal) return 'sello';
      if (c.isToken) return 'Token';
      if (c.isQuickSpell) return 'Hechizo Rapido';
      if (c.isSlowSpell) return 'Hechizo Lento';
      if (c.isArtifact) return 'Artefacto';
      return 'Criatura';
    };

    const typeMap: Record<string, number> = {};
    for (const card of cards) {
      const t = getType(card);
      typeMap[t] = (typeMap[t] || 0) + 1;
    }

    return new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(typeMap),
        datasets: [
          { data: Object.values(typeMap) }
        ]
      }
    });
  }

  /** ======================================================
   *   CHART: FACCIÓN
   * ====================================================== */
 private renderFactionChart(): Chart | null {
  if (!this.factionChart) return null;

  const ctx = this.factionChart.nativeElement.getContext('2d');
  if (!ctx) return null;

  const cards = this.cardsOnly;

  // Conteo por facción
  const factionMap: Record<string, number> = {};
  for (const card of cards) {
    factionMap[card.faction] = (factionMap[card.faction] || 0) + 1;
  }

  const labels = Object.keys(factionMap);
  const values = Object.values(factionMap);

  // Colores basados en tu propiedad pública FACTION_COLORS
  const colors = labels.map(faction =>
    this.FACTION_COLORS[faction] ?? '#999'
  );

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Cantidad',
          data: values,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


  /** ======================================================
   *   CHART: RAREZA
   * ====================================================== */
 private renderRarityChart(): Chart | null {
  if (!this.rarityChart) return null;
  const ctx = this.rarityChart.nativeElement.getContext('2d');
  if (!ctx) return null;

  const cards = this.cardsOnly;

  // Conteo por rareza
  const rarityMap: Record<string, number> = {};
  for (const card of cards) {
    rarityMap[card.rarity] = (rarityMap[card.rarity] || 0) + 1;
  }

  // Mapa de traducciones
  const rarityTranslations: Record<string, string> = {
    common: 'Común',
    uncommon: 'Infrecuente',
    rare: 'Rara',
    epic: 'Épica',
    legendary: 'Legendaria',
    mythic: 'Mítica'
  };

  const originalLabels = Object.keys(rarityMap);
  const translatedLabels = originalLabels.map(r =>
    rarityTranslations[r] ?? r
  );

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: translatedLabels,
      datasets: [
        { data: Object.values(rarityMap) }
      ]
    }
  });
}

}
