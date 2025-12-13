
import { Card } from "./interfaces/card.interface";

const img1 = 'https://riseofgods.store/wp-content/uploads/2024/06/Sello-Jupiter.png';
const img2 = 'https://riseofgods.store/wp-content/uploads/2024/06/ESTRUCTURA-4-Canon-de-Zagh-733x1024.png';
const img3 = 'https://riseofgods.store/wp-content/uploads/2025/09/Marte-44-Juez-del-volcan-733x1024.png';

export const testCards: Card[] = [
  { id: '1',  name: 'León de Marte', faction: 'marte', rarity: 'common',     img: img1, factionCost: 1, cost: 2, banned: false, isSeal: true, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },
  { id: '2',  name: 'Hechicera Solar', faction: 'jupiter', rarity: 'rare',    img: img2, factionCost: 2, cost: 3, banned: false, isSeal: false, isQuickSpell: false,  isSlowSpell: false, isArtifact: false, isToken: true },
  { id: '3',  name: 'Gólem Terrestre', faction: 'tierra', rarity: 'common',   img: img3, factionCost: 1, cost: 4, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },

  { id: '4',  name: 'Sello de Marte', faction: 'marte', rarity: 'unlimited',  img: img1, factionCost: 1, cost: 1, banned: false, isSeal: true,  isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },
  { id: '5',  name: 'Explosión de Plasma', faction: 'jupiter', rarity: 'rare', img: img2, factionCost: 2, cost: 2, banned: true, isSeal: false, isQuickSpell: true,  isSlowSpell: false, isArtifact: false, isToken: false },
  { id: '6',  name: 'Arpón de Neptuno', faction: 'neptuno', rarity: 'epic',    img: img3, factionCost: 2, cost: 5, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: true,  isArtifact: false, isToken: false },

  { id: '7',  name: 'Titan del Vacío', faction: 'pluton', rarity: 'legendary', img: img1, factionCost: 3, cost: 7, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },
  { id: '8',  name: 'Sello de Júpiter', faction: 'jupiter', rarity: 'common',  img: img2, factionCost: 1, cost: 1, banned: false, isSeal: true,  isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },
  { id: '9',  name: 'Bestia del Océano', faction: 'neptuno', rarity: 'unlimited', img: img3, factionCost: 1, cost: 6, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },

  { id: '10', name: 'Constructo Sagrado', faction: 'saturno', rarity: 'epic', img: img1, factionCost: 2, cost: 3, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: true,  isToken: false },
  { id: '11', name: 'Llama Carmesí', faction: 'marte', rarity: 'common',     img: img2, factionCost: 1, cost: 2, banned: false, isSeal: false, isQuickSpell: true,  isSlowSpell: false, isArtifact: false, isToken: false },
  { id: '12', name: 'Monje del Aire Dorado', faction: 'jupiter', rarity: 'rare', img: img3, factionCost: 2, cost: 3, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: true,  isArtifact: false, isToken: false },

  { id: '13', name: 'Centinela de Saturno', faction: 'saturno', rarity: 'epic', img: img1, factionCost: 2, cost: 5, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: true,  isToken: false },
  { id: '14', name: 'Destructor de Plutón', faction: 'pluton', rarity: 'rare', img: img2, factionCost: 2, cost: 4, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },
  { id: '15', name: 'Tiburón del Hielo', faction: 'neptuno', rarity: 'common', img: img3, factionCost: 1, cost: 3, banned: true, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },

  { id: '16', name: 'Luciérnaga Solar', faction: 'jupiter', rarity: 'unlimited', img: img1, factionCost: 1, cost: 1, banned: false, isSeal: false, isQuickSpell: true,  isSlowSpell: false, isArtifact: false, isToken: true  },
  { id: '17', name: 'Guardián Rocoso', faction: 'tierra', rarity: 'unlimited', img: img2, factionCost: 1, cost: 4, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },
  { id: '18', name: 'Maldición Carmesí', faction: 'marte', rarity: 'rare', img: img3, factionCost: 2, cost: 2, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: true,  isArtifact: false, isToken: false },

  { id: '19', name: 'Ecos del Vacío', faction: 'pluton', rarity: 'epic', img: img1, factionCost: 2, cost: 6, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },
  { id: '20', name: 'Sello de Saturno', faction: 'saturno', rarity: 'common', img: img2, factionCost: 1, cost: 1, banned: false, isSeal: true,  isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },

  // ============================
  // NUEVAS (21–30) CON IMÁGENES
  // ============================

  { id: '21', name: 'Arquera de la Aurora', faction: 'jupiter', rarity: 'common', img: img3, factionCost: 1, cost: 2, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },
  { id: '22', name: 'Runa del Colapso', faction: 'pluton', rarity: 'rare', img: img1, factionCost: 2, cost: 3, banned: false, isSeal: true,  isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },
  { id: '23', name: 'Efigie de Cristal Lunar', faction: 'neptuno', rarity: 'epic', img: img2, factionCost: 2, cost: 4, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: true,  isToken: false },

  { id: '24', name: 'Serpiente del Vacío', faction: 'pluton', rarity: 'legendary', img: img3, factionCost: 3, cost: 8, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },
  { id: '25', name: 'Canto de Rejuvenecimiento', faction: 'saturno', rarity: 'rare', img: img1, factionCost: 1, cost: 1, banned: false, isSeal: false, isQuickSpell: true,  isSlowSpell: false, isArtifact: false, isToken: false },
  { id: '26', name: 'Guardián de las Dunas Eternas', faction: 'tierra', rarity: 'common', img: img2, factionCost: 1, cost: 3, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },

  { id: '27', name: 'Sello del Fragmento Leviatán', faction: 'neptuno', rarity: 'epic', img: img3, factionCost: 2, cost: 4, banned: false, isSeal: true,  isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: false },
  { id: '28', name: 'Mago del Horizonte Carmesí', faction: 'marte', rarity: 'rare', img: img1, factionCost: 2, cost: 5, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: true,  isArtifact: false, isToken: false },
  { id: '29', name: 'Gólem del Núcleo Helado', faction: 'neptuno', rarity: 'unlimited', img: img2, factionCost: 1, cost: 6, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: false, isToken: true },

  { id: '30', name: 'Reliquia del Sol Oscuro', faction: 'jupiter', rarity: 'legendary', img: img3, factionCost: 3, cost: 2, banned: false, isSeal: false, isQuickSpell: false, isSlowSpell: false, isArtifact: true,  isToken: false }
];
