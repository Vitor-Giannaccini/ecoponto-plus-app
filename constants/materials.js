// constants/materials.js

import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';

export const MATERIAL_CATEGORIES = [
  { 
    name: 'Recicláveis Comuns', 
    icon: { library: 'MaterialCommunityIcons', name: 'recycle' },
    items: [
      { name: 'Papéis e Papelão', icon: { library: 'Ionicons', name: 'newspaper-outline' } },
      { name: 'Plásticos', icon: { library: 'MaterialCommunityIcons', name: 'toy-brick' } },
      { name: 'Vidros', icon: { library: 'MaterialCommunityIcons', name: 'bottle-wine-outline' } },
      { name: 'Metais', icon: { library: 'MaterialCommunityIcons', name: 'magnet-on' } },
    ]
  },
  { 
    name: 'Construção Civil', 
    icon: { library: 'Ionicons', name: 'hammer' },
    items: [
      { name: 'Entulho', icon: { library: 'FontAwesome6', name: 'bucket' } },
      { name: 'Madeiras', icon: { library: 'FontAwesome6', name: 'tree' } },
      { name: 'Cerâmicas', icon: { library: 'MaterialCommunityIcons', name: 'texture-box' } },
    ]
  },
  { 
    name: 'Móveis e Eletrodomésticos',
    icon: { library: 'Ionicons', name: 'home' },
    items: [
      { name: 'Móveis', icon: { library: 'MaterialCommunityIcons', name: 'sofa' } },
      { name: 'Eletrodomésticos', icon: { library: 'MaterialCommunityIcons', name: 'washing-machine' } },
    ]
  },
  { 
    name: 'Pneus', 
    icon: { library: 'MaterialCommunityIcons', name: 'tire' },
    items: [
      { name: 'Pneus Usados', icon: { library: 'MaterialCommunityIcons', name: 'tire' } },
    ]
  },
  { 
    name: 'Resíduos Eletrônicos',
    icon: { library: 'FontAwesome6', name: 'computer-mouse' },
    items: [
      { name: 'Celulares', icon: { library: 'Ionicons', name: 'phone-portrait-outline' } },
      { name: 'Computadores', icon: { library: 'FontAwesome6', name: 'computer' } },
      { name: 'TVs e Rádios', icon: { library: 'FontAwesome6', name: 'radio' } },
    ]
  }
];