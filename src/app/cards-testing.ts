import { Card } from "./interfaces/card.interface";

const img1 = 'https://riseofgods.store/wp-content/uploads/2024/06/Sello-Jupiter.png';
const img2 = 'https://riseofgods.store/wp-content/uploads/2024/06/ESTRUCTURA-4-Canon-de-Zagh-733x1024.png';
const img3 = 'https://riseofgods.store/wp-content/uploads/2025/09/Marte-44-Juez-del-volcan-733x1024.png';

export const testCards: Card[] = [
  { id: '1', name: 'León de Marte', faction: 'marte', rarity: 'common', img: img1, factionCost: 1, cost: 2, banned: false, isSeal: true, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Asalto', 'Al atacar'] },

  { id: '2', name: 'Hechicera Solar', faction: 'jupiter', rarity: 'rare', img: img2, factionCost: 2, cost: 3, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: true, tags: ['Token', 'Vínculo'] },

  { id: '3', name: 'Gólem Terrestre', faction: 'tierra', rarity: 'common', img: img3, factionCost: 1, cost: 4, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Provocar', 'Regeneración'] },

  { id: '4', name: 'Sello de Marte', faction: 'marte', rarity: 'unlimited', img: img1, factionCost: 1, cost: 1, banned: false, isSeal: true, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Inicio del turno'] },

  { id: '5', name: 'Explosión de Plasma', faction: 'jupiter', rarity: 'rare', img: img2, factionCost: 2, cost: 2, banned: true, isSeal: false, isQuickSpell: true, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Ataque rápido', 'Aniquilar'] },

  { id: '6', name: 'Arpón de Neptuno', faction: 'neptuno', rarity: 'epic', img: img3, factionCost: 2, cost: 5, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: true, isArtifact: false, isToken: false, tags: ['Atrapo', 'Al golpear'] },

  { id: '7', name: 'Titan del Vacío', faction: 'pluton', rarity: 'legendary', img: img1, factionCost: 3, cost: 7, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Aniquilar', 'Venganza'] },

  { id: '8', name: 'Sello de Júpiter', faction: 'jupiter', rarity: 'common', img: img2, factionCost: 1, cost: 1, banned: false, isSeal: true, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Amanecer'] },

  { id: '9', name: 'Bestia del Océano', faction: 'neptuno', rarity: 'unlimited', img: img3, factionCost: 1, cost: 6, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Cargar', 'Ataque 360'] },

  { id: '10', name: 'Constructo Sagrado', faction: 'saturno', rarity: 'epic', img: img1, factionCost: 2, cost: 3, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: true, isToken: false, tags: ['Escudo mágico'] },

  { id: '11', name: 'Llama Carmesí', faction: 'marte', rarity: 'common', img: img2, factionCost: 1, cost: 2, banned: false, isSeal: false, isQuickSpell: true, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Ataque rápido', 'Drenar'] },

  { id: '12', name: 'Monje del Aire Dorado', faction: 'jupiter', rarity: 'rare', img: img3, factionCost: 2, cost: 3, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: true, isArtifact: false, isToken: false, tags: ['Silencio', 'Vínculo'] },

  { id: '13', name: 'Centinela de Saturno', faction: 'saturno', rarity: 'epic', img: img1, factionCost: 2, cost: 5, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: true, isToken: false, tags: ['Provocar', 'Escudo mágico'] },

  { id: '14', name: 'Destructor de Plutón', faction: 'pluton', rarity: 'rare', img: img2, factionCost: 2, cost: 4, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Puñalada', 'Al golpear'] },

  { id: '15', name: 'Tiburón del Hielo', faction: 'neptuno', rarity: 'common', img: img3, factionCost: 1, cost: 3, banned: true, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Atrapo', 'Enfermedad X'] },

  { id: '16', name: 'Luciérnaga Solar', faction: 'jupiter', rarity: 'unlimited', img: img1, factionCost: 1, cost: 1, banned: false, isSeal: false, isQuickSpell: true, isSlowSpell: false, isArtifact: false, isToken: true, tags: ['Token', 'Amanecer'] },

  { id: '17', name: 'Guardián Rocoso', faction: 'tierra', rarity: 'unlimited', img: img2, factionCost: 1, cost: 4, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Provocar', 'Regeneración'] },

  { id: '18', name: 'Maldición Carmesí', faction: 'marte', rarity: 'rare', img: img3, factionCost: 2, cost: 2, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: true, isArtifact: false, isToken: false, tags: ['Ofrenda tenebrosa X', 'Enfermedad X'] },

  { id: '19', name: 'Ecos del Vacío', faction: 'pluton', rarity: 'epic', img: img1, factionCost: 2, cost: 6, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Último suspiro', 'Venganza'] },

  { id: '20', name: 'Sello de Saturno', faction: 'saturno', rarity: 'common', img: img2, factionCost: 1, cost: 1, banned: false, isSeal: true, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Inicio del turno'] },

  { id: '31', name: 'Invocador del Núcleo Ígneo', faction: 'marte', rarity: 'epic', img: img3, factionCost: 2, cost: 6, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: true, isArtifact: false, isToken: false, tags: ['Sobrecarga', 'Al atacar'] },

  { id: '32', name: 'Sello del Juicio Celeste', faction: 'jupiter', rarity: 'legendary', img: img1, factionCost: 3, cost: 3, banned: false, isSeal: true, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Adivinar X'] },

  { id: '33', name: 'Bestia de Raíces Eternas', faction: 'tierra', rarity: 'rare', img: img2, factionCost: 2, cost: 4, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Regeneración', 'Provocar'] },

  { id: '34', name: 'Oráculo del Abismo', faction: 'pluton', rarity: 'epic', img: img3, factionCost: 2, cost: 5, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Adivinar X', 'Silencio'] },

  { id: '35', name: 'Reliquia del Tiempo Marchito', faction: 'saturno', rarity: 'legendary', img: img1, factionCost: 3, cost: 2, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: true, isToken: false, tags: ['Comerciable', 'Inicio del turno'] },

  { id: '36', name: 'Vigía del Oleaje Profundo', faction: 'neptuno', rarity: 'rare', img: img2, factionCost: 2, cost: 4, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Al golpear', 'Drenar'] },

  { id: '37', name: 'Chispa del Primer Sol', faction: 'jupiter', rarity: 'common', img: img3, factionCost: 1, cost: 2, banned: false, isSeal: false, isQuickSpell: true, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Ataque rápido', 'Amanecer'] },

  { id: '38', name: 'Coloso del Cráter Carmesí', faction: 'marte', rarity: 'legendary', img: img1, factionCost: 3, cost: 8, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false, tags: ['Aniquilar', 'Ataque 360'] },

  { id: '39', name: 'Espiral del Vacío Silente', faction: 'pluton', rarity: 'unlimited', img: img2, factionCost: 1, cost: 5, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: true, tags: ['Token', 'Último suspiro'] },

  { id: '40', name: 'Ancla de las Mareas Antiguas', faction: 'neptuno', rarity: 'epic', img: img3, factionCost: 2, cost: 6, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: true, isToken: false, tags: ['Atrapo', 'Provocar'] },
];
