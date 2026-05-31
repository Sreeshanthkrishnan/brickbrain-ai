import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layers, Home, Bath, Bed, Utensils, ArrowLeft, Eye, Plus, Trash2, Sparkles, X, Sofa, Camera, Sliders, RefreshCw, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Import AI Interior Render Images
import livingModern1 from '@/assets/living_modern_1.png';
import livingModern2 from '@/assets/living_modern_2.png';
import livingModern3 from '@/assets/living_modern_3.png';

import kitchenModern1 from '@/assets/kitchen_modern_1.png';
import kitchenModern2 from '@/assets/kitchen_modern_2.png';
import kitchenModern3 from '@/assets/kitchen_modern_3.png';

import bedroomModern1 from '@/assets/bedroom_modern_1.png';
import bedroomModern2 from '@/assets/bedroom_modern_2.png';
import bedroomModern3 from '@/assets/bedroom_modern_3.png';

import bathroomModern1 from '@/assets/bathroom_modern_1.png';
import bathroomModern2 from '@/assets/bathroom_modern_2.png';
import bathroomModern3 from '@/assets/bathroom_modern_3.png';

import loungeModern1 from '@/assets/lounge_modern_1.png';
import loungeModern2 from '@/assets/lounge_modern_2.png';
import loungeModern3 from '@/assets/lounge_modern_3.png';

interface Room {
  id: string;
  name: string;
  area: string;
  icon: React.ComponentType<any>;
  type: 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'lounge';
}

interface AIImageSet {
  urls: string[];
  hotspots: {
    x: string;
    y: string;
    title: string;
    description: string;
  }[];
}

const AI_RENDER_ASSETS: Record<string, Record<string, AIImageSet>> = {
  living: {
    modern: {
      urls: [
        livingModern1,
        livingModern2,
        livingModern3,
      ],
      hotspots: [
        { x: '35%', y: '65%', title: 'Minimalist Sectional Sofa', description: 'Premium linen fabric in soft beige with high-density foam filling. Est: ₹85,000' },
        { x: '75%', y: '45%', title: 'OLED Ambient TV Backlight', description: '65" Smart display with warm led perimeter backlight strip. Est: ₹75,000' },
        { x: '50%', y: '80%', title: 'Polished Travertine Coffee Table', description: 'Honed Italian travertine stone slab on cylindrical fluted bases. Est: ₹28,000' }
      ]
    },
    classic: {
      urls: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      ],
      hotspots: [
        { x: '30%', y: '70%', title: 'Chesterfield Tufted Armchair', description: 'Burgundy velvet upholstery with brass nailhead trim. Est: ₹42,000' },
        { x: '50%', y: '30%', title: 'Crystal Chandelier', description: '12-light classical structure with hand-cut crystal drops. Est: ₹65,000' },
        { x: '15%', y: '40%', title: 'Carved Teakwood Fireplace Surround', description: 'Solid teakwood mantle with custom molding designs. Est: ₹1,10,000' }
      ]
    },
    eco: {
      urls: [
        'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1618219944342-824e40a13285?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      ],
      hotspots: [
        { x: '40%', y: '70%', title: 'Bamboo-Rattan Sofa Set', description: 'Sustainable bamboo framing with organic cotton cushions. Est: ₹55,000' },
        { x: '80%', y: '40%', title: 'Vertical Plant Bio-Wall', description: 'Integrated automated drip irrigation system with air purifying plants. Est: ₹35,000' },
        { x: '25%', y: '85%', title: 'Jute Fiber Area Rug', description: '100% natural hand-braided jute fibers, biodegradable. Est: ₹14,000' }
      ]
    },
    brick: {
      urls: [
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      ],
      hotspots: [
        { x: '35%', y: '70%', title: 'Tan Leather Chesterfield', description: 'Full-grain distressed aniline leather with deep button tufting. Est: ₹1,20,000' },
        { x: '70%', y: '35%', title: 'Exposed Red Clay Brick Wall', description: 'Reclaimed brick slips with light gray mortar joints. Est: ₹45,000' },
        { x: '10%', y: '50%', title: 'Industrial Steel Frame Bookshelf', description: 'Matte black iron framework with distressed pine wooden shelves. Est: ₹22,000' }
      ]
    }
  },
  kitchen: {
    modern: {
      urls: [
        kitchenModern1,
        kitchenModern2,
        kitchenModern3,
      ],
      hotspots: [
        { x: '45%', y: '65%', title: 'Waterfall Quartz Island', description: 'Calacatta quartz countertop with dual-sink integration. Est: ₹1,40,000' },
        { x: '75%', y: '40%', title: 'Handleless Matte Cabinets', description: 'Soft-close mechanism with fingerprint-resistant finish. Est: ₹2,10,000' },
        { x: '20%', y: '45%', title: 'Integrated Smart Refrigerator', description: 'Counter-depth French door fridge with touch display interface. Est: ₹1,65,000' }
      ]
    },
    classic: {
      urls: [
        'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      ],
      hotspots: [
        { x: '40%', y: '70%', title: 'Raised Panel Cherrywood Cabinets', description: 'Hand-stained dark cherry wood with antique brass hardware. Est: ₹2,80,000' },
        { x: '60%', y: '40%', title: 'French Country Pendant Lamps', description: 'Forged iron pendants with clear seeded glass shades. Est: ₹18,000' },
        { x: '50%', y: '80%', title: 'Granite Countertops', description: 'Giallo Ornamental granite slabs with bullnose edges. Est: ₹95,000' }
      ]
    },
    eco: {
      urls: [
        'https://images.unsplash.com/photo-1556909212-d5b604dadb72?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      ],
      hotspots: [
        { x: '45%', y: '65%', title: 'Recycled Paper Composite Tops', description: 'Eco-friendly non-porous countertop material made of post-consumer glass. Est: ₹88,000' },
        { x: '70%', y: '35%', title: 'Reclaimed Timber Shelving', description: 'FSC-certified salvaged wood panels on iron brackets. Est: ₹15,000' },
        { x: '30%', y: '80%', title: 'Energy-Star Induction Cooktop', description: 'High efficiency electromagnetic induction cooktop. Est: ₹45,000' }
      ]
    },
    brick: {
      urls: [
        'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      ],
      hotspots: [
        { x: '50%', y: '65%', title: 'Concrete Cast Countertops', description: 'Hand-poured gray concrete surfaces sealed with food-grade epoxy. Est: ₹1,10,000' },
        { x: '80%', y: '30%', title: 'Exposed Ductwork & Brick', description: 'Industrial ventilation ducting alongside bare masonry. Est: ₹30,000' },
        { x: '35%', y: '80%', title: 'Black Iron Pipe Pot Rack', description: 'Ceiling-mounted industrial pipe structure with copper S-hooks. Est: ₹9,000' }
      ]
    }
  },
  bedroom: {
    modern: {
      urls: [
        bedroomModern1,
        bedroomModern2,
        bedroomModern3,
      ],
      hotspots: [
        { x: '50%', y: '60%', title: 'Floating Bed Platform', description: 'Engineered oak paneling with hidden structural supports and under-bed LED glow. Est: ₹75,000' },
        { x: '80%', y: '70%', title: 'Bouclé Lounge Chair', description: 'Cozy textured white bouclé fabric accent chair. Est: ₹24,000' },
        { x: '20%', y: '40%', title: 'Smart Dimmer Control Panel', description: 'Wireless scene controller with presets for sleeping, reading, and morning. Est: ₹12,000' }
      ]
    },
    classic: {
      urls: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
      ],
      hotspots: [
        { x: '45%', y: '60%', title: 'Four-Poster Teak Bed', description: 'Handcrafted solid teakwood frame with linen drape options. Est: ₹1,35,000' },
        { x: '85%', y: '35%', title: 'Gold-Leaf Framed Mirror', description: 'Victorian-style ornamental frame with beveled edge mirror glass. Est: ₹22,000' },
        { x: '15%', y: '75%', title: 'Persian Wool Carpet', description: 'Authentic hand-knotted floral motif wool rug. Est: ₹80,000' }
      ]
    },
    eco: {
      urls: [
        'https://images.unsplash.com/photo-1505693395321-883724634266?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=800&q=80',
      ],
      hotspots: [
        { x: '50%', y: '60%', title: '100% Organic Latex Mattress', description: 'Natural Dunlop latex mattress, hypoallergenic and GOTS certified. Est: ₹95,000' },
        { x: '75%', y: '45%', title: 'Clay Plaster Breathable Walls', description: 'Non-toxic, moisture-regulating wall finish with natural earth pigments. Est: ₹26,000' },
        { x: '20%', y: '80%', title: 'FSC Solid Ash Nightstands', description: 'Locally sourced ash hardwood with zero-VOC clear linseed oil seal. Est: ₹19,000' }
      ]
    },
    brick: {
      urls: [
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
      ],
      hotspots: [
        { x: '45%', y: '65%', title: 'Reclaimed Timber Bed Headboard', description: 'Made from old railway sleeper planks, retaining original textures. Est: ₹48,000' },
        { x: '75%', y: '30%', title: 'Exposed Steel Conduit & Pipes', description: 'Black metal conduit lines detailing power routing for wall lamps. Est: ₹12,000' },
        { x: '15%', y: '50%', title: 'Edison Bulb Wall Sconces', description: 'Industrial swivel sconces with warm amber filament bulbs. Est: ₹8,500' }
      ]
    }
  },
  bathroom: {
    modern: {
      urls: [
        bathroomModern1,
        bathroomModern2,
        bathroomModern3,
      ],
      hotspots: [
        { x: '55%', y: '65%', title: 'Terrazzo Floating Basin', description: 'Custom cast white marble chip terrazzo double washbasin. Est: ₹58,000' },
        { x: '30%', y: '50%', title: 'Frameless Backlit Mirror', description: 'LED boundary lights with built-in anti-fog heating pad. Est: ₹15,000' },
        { x: '80%', y: '75%', title: 'Wall-Hung Smart Commode', description: 'Integrated bidet system, auto-flush, and heated seating. Est: ₹82,000' }
      ]
    },
    classic: {
      urls: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
      ],
      hotspots: [
        { x: '45%', y: '65%', title: 'Clawfoot Cast Iron Bathtub', description: 'Porcelain enameled bath interior with chrome imperial feet. Est: ₹1,10,000' },
        { x: '80%', y: '50%', title: 'White Carrara Marble Wall', description: 'Polished white marble tiles with subtle gray veining. Est: ₹1,50,000' },
        { x: '25%', y: '75%', title: 'Brass Dual Faucet Mixer', description: 'Victorian-style telephone mixer set in brushed gold finish. Est: ₹28,000' }
      ]
    },
    eco: {
      urls: [
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      ],
      hotspots: [
        { x: '50%', y: '70%', title: 'Teak Wooden Slatted Floor', description: 'Water-resistant plantation teak wood decking for walk-in shower. Est: ₹36,000' },
        { x: '80%', y: '40%', title: 'Aerated Low-Flow Shower', description: 'Rain showerhead with water-conserving air injection technology. Est: ₹18,000' },
        { x: '20%', y: '80%', title: 'Hanging Air-Filtering Ferns', description: 'Thrives in high humidity, natural steam-activated air purifier. Est: ₹3,500' }
      ]
    },
    brick: {
      urls: [
        'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      ],
      hotspots: [
        { x: '40%', y: '70%', title: 'Slate-Black Ceramic Tiles', description: 'Hexagonal textured slate floor tiles with charcoal gray grout. Est: ₹48,000' },
        { x: '75%', y: '40%', title: 'Industrial Copper Pipe Radiator', description: 'Wall-mounted towel warmer rail made of polished copper plumbing lines. Est: ₹16,000' },
        { x: '25%', y: '60%', title: 'Crittall Style Black Framed Glass', description: 'Tempered safety glass screen with grid matte black framing. Est: ₹32,000' }
      ]
    }
  },
  lounge: {
    modern: {
      urls: [
        loungeModern1,
        loungeModern2,
        loungeModern3,
      ],
      hotspots: [
        { x: '35%', y: '70%', title: 'Ergonomic Task Chair', description: 'Aeron-style mesh office chair with high lumbar support adjustment. Est: ₹55,000' },
        { x: '70%', y: '65%', title: 'Electric Sit-to-Stand Desk', description: 'Solid oak desktop with dual-motor steel lifting columns. Est: ₹48,000' },
        { x: '50%', y: '35%', title: 'Acoustic Wall Panels', description: 'Sound dampening recycled felt hexagonal tile panels on backwall. Est: ₹14,000' }
      ]
    },
    classic: {
      urls: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      ],
      hotspots: [
        { x: '45%', y: '65%', title: 'Presidential Mahogany Desk', description: 'Solid mahogany desk with leather inlay and brass drawer pulls. Est: ₹1,80,000' },
        { x: '20%', y: '70%', title: 'Green Bankers Lamp', description: 'Classic emerald green glass shade on solid brass base. Est: ₹9,500' },
        { x: '80%', y: '40%', title: 'Floor-to-ceiling Wooden Bookcase', description: 'Custom fitted walnut timber bookcase shelves. Est: ₹2,20,000' }
      ]
    },
    eco: {
      urls: [
        'https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      ],
      hotspots: [
        { x: '50%', y: '70%', title: 'Cork Oak Linoleum Desk', description: 'All-natural biodegradable desk mat surface made of linseed oil and wood flour. Est: ₹8,000' },
        { x: '75%', y: '35%', title: 'Skylight Illumination', description: 'Natural daylight optimization layout reducing artificial light usage. Est: ₹60,000' },
        { x: '25%', y: '80%', title: 'Recycled Plastic Accent Chair', description: 'Molded seat shell made of 100% ocean plastic waste. Est: ₹16,000' }
      ]
    },
    brick: {
      urls: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=800&q=80',
      ],
      hotspots: [
        { x: '45%', y: '65%', title: 'Industrial Sawhorse Desk', description: 'Thick reclaimed pine slab tabletop resting on metal sawhorse frames. Est: ₹28,000' },
        { x: '75%', y: '70%', title: 'Iron Mesh Trash Basket', description: 'Matte black metal mesh office accessory. Est: ₹2,200' },
        { x: '15%', y: '35%', title: 'Exposed Steel I-Beam Support', description: 'Structural carbon steel I-beam coated in clear protective lacquer. Est: ₹40,000' }
      ]
    }
  }
};

export default function FloorPlanning3D() {
  const navigate = useNavigate();
  const { project, updateProject } = useApp();

  const area = project.plotSize * project.floors;
  
  // Space splits
  const groundArea = Math.round(area * 0.52);
  const firstArea = Math.round(area * 0.48);

  const [selectedRoomFor3D, setSelectedRoomFor3D] = useState<Room | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  // AI Render view specific modal states
  const [modalViewMode, setModalViewMode] = useState<'blueprint' | 'ai_render'>('blueprint');
  const [aiStyle, setAiStyle] = useState<'modern' | 'classic' | 'eco' | 'brick'>('modern');
  const [aiLighting, setAiLighting] = useState<'daylight' | 'warm_cozy' | 'evening_glow' | 'neon_accent'>('daylight');
  const [aiDensity, setAiDensity] = useState<'minimalist' | 'balanced' | 'luxury'>('balanced');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiStep, setAiStep] = useState('');
  const [selectedAngle, setSelectedAngle] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  // Generate dynamic rooms based on project configuration
  const totalBedrooms = project.bedrooms;
  const totalKitchens = project.kitchens;
  const totalRooms = project.rooms;

  const roomsList: Omit<Room, 'id'>[] = [];

  // 1. Living Room (Always)
  roomsList.push({
    name: 'Living Room',
    area: '320 sq.ft',
    icon: Sofa,
    type: 'living'
  });

  // 2. Kitchens
  for (let i = 0; i < totalKitchens; i++) {
    roomsList.push({
      name: i === 0 ? 'Kitchen & Pantry' : `Kitchen ${i + 1}`,
      area: '180 sq.ft',
      icon: Utensils,
      type: 'kitchen'
    });
  }

  // 3. Bedrooms
  for (let i = 0; i < totalBedrooms; i++) {
    roomsList.push({
      name: i === 0 ? 'Master Suite' : i === 1 ? 'Guest Bedroom' : `Kids Bedroom ${i - 1}`,
      area: i === 0 ? '290 sq.ft' : '210 sq.ft',
      icon: Bed,
      type: 'bedroom'
    });
  }

  // 4. Bathrooms (1 per 2 bedrooms/kitchens, min 1)
  const totalBaths = Math.max(1, Math.floor((totalBedrooms + totalKitchens) / 2));
  for (let i = 0; i < totalBaths; i++) {
    roomsList.push({
      name: `Bathroom ${i + 1}`,
      area: '80 sq.ft',
      icon: Bath,
      type: 'bathroom'
    });
  }

  // 5. Extra lounges/studios to align with project.rooms total
  const currentCount = 1 + totalKitchens + totalBedrooms;
  if (totalRooms > currentCount) {
    const extraNeeded = totalRooms - currentCount;
    for (let i = 0; i < extraNeeded; i++) {
      roomsList.push({
        name: i === 0 ? 'Upper Lounge' : i === 1 ? 'Study & Library' : `Home Office ${i}`,
        area: '220 sq.ft',
        icon: Home,
        type: 'lounge'
      });
    }
  }

  // Distribute rooms on floors
  const groundRooms: Room[] = [];
  const firstRooms: Room[] = [];

  roomsList.forEach((room, idx) => {
    const identifiedRoom = { ...room, id: `room-${idx}` } as Room;
    if (project.floors === 1) {
      groundRooms.push(identifiedRoom);
    } else {
      // Split logically
      if (room.type === 'living' || room.type === 'kitchen' || room.name === 'Bathroom 1' || room.name === 'Guest Bedroom') {
        groundRooms.push(identifiedRoom);
      } else {
        firstRooms.push(identifiedRoom);
      }
    }
  });

  // Helper to trigger context update on config change
  const syncContextChanges = (newRooms: number, newBedrooms: number, newKitchens: number) => {
    const qFactor = project.materialQuality === 'Basic' ? 1.0 : project.materialQuality === 'Standard' ? 1.35 : 1.7;
    const newBudget = Math.round((1800000 + (newRooms * 280000) + (newBedrooms * 350000) + (newKitchens * 420000)) * qFactor);
    const materials = Math.round(newBudget * 0.55);
    const labor = Math.round(newBudget * 0.28);
    const interior = Math.round(newBudget * 0.12);
    const tax = Math.round(newBudget * 0.05);

    updateProject({
      rooms: newRooms,
      bedrooms: newBedrooms,
      kitchens: newKitchens,
      totalCost: newBudget,
      breakdown: {
        materials,
        labor,
        interior,
        tax
      }
    });
  };

  const handleAddRoom = (type: 'bedroom' | 'kitchen' | 'lounge') => {
    if (type === 'bedroom') {
      syncContextChanges(totalRooms + 1, totalBedrooms + 1, totalKitchens);
    } else if (type === 'kitchen') {
      syncContextChanges(totalRooms + 1, totalBedrooms, totalKitchens + 1);
    } else {
      syncContextChanges(totalRooms + 1, totalBedrooms, totalKitchens);
    }
    setIsAddingRoom(false);
  };

  const handleDeleteRoom = (room: Room) => {
    if (room.type === 'living') {
      alert('The primary Living Room is mandatory and cannot be removed.');
      return;
    }

    if (confirm(`Are you sure you want to delete ${room.name} from the plan? This will automatically update your project estimates.`)) {
      if (room.type === 'bedroom') {
        syncContextChanges(Math.max(2, totalRooms - 1), Math.max(1, totalBedrooms - 1), totalKitchens);
      } else if (room.type === 'kitchen') {
        syncContextChanges(Math.max(2, totalRooms - 1), totalBedrooms, Math.max(1, totalKitchens - 1));
      } else {
        syncContextChanges(Math.max(2, totalRooms - 1), totalBedrooms, totalKitchens);
      }
    }
  };

  // Helper to open modal and pre-configure
  const handleSelectRoom = (room: Room) => {
    setSelectedRoomFor3D(room);
    setModalViewMode('blueprint');
    
    // Set default style matching the global project quality/type configuration
    const initialStyle = (
      project.materialQuality === 'Premium' 
        ? 'modern' 
        : project.materialQuality === 'Standard' 
          ? 'eco' 
          : 'brick'
    ) as 'modern' | 'classic' | 'eco' | 'brick';
    
    setAiStyle(initialStyle);
    setAiLighting('daylight');
    setAiDensity('balanced');
    setIsGeneratingAI(false);
    setAiProgress(0);
    setAiStep('');
    setSelectedAngle(0);
    setActiveHotspot(null);
  };

  // Simulated AI Render Generation sequence
  const handleGenerateAIRender = () => {
    setIsGeneratingAI(true);
    setAiProgress(0);
    setAiStep('Scanning room boundaries...');
    setActiveHotspot(null);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setAiProgress(progress);
      
      if (progress < 25) {
        setAiStep('Scanning architectural boundaries & load vectors...');
      } else if (progress < 50) {
        setAiStep('Placing custom furniture assets & fixtures...');
      } else if (progress < 75) {
        setAiStep('Computing light ray-tracing vectors & textures...');
      } else if (progress < 95) {
        setAiStep('Refining shaders & depth occlusion details...');
      } else {
        setAiStep('Finalizing interior design render...');
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGeneratingAI(false);
        }, 300);
      }
    }, 100);
  };

  // Get Room Category Key for AI assets lookup
  const getRoomTypeKey = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('kitchen')) return 'kitchen';
    if (lowerName.includes('bed') || lowerName.includes('suite')) return 'bedroom';
    if (lowerName.includes('bath')) return 'bathroom';
    if (lowerName.includes('lounge') || lowerName.includes('office') || lowerName.includes('study')) return 'lounge';
    return 'living';
  };

  // Helper to render high-fidelity 3D Room SVGs
  const render3DRoomSVG = (name: string) => {
    const isKitchen = name.toLowerCase().includes('kitchen');
    const isBed = name.toLowerCase().includes('bed') || name.toLowerCase().includes('suite');
    const isBath = name.toLowerCase().includes('bath');

    if (isKitchen) {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <polygon points="200,270 60,190 200,110 340,190" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <polygon points="60,190 200,110 200,20 60,100" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          <polygon points="200,110 340,190 340,100 200,20" fill="#020617" stroke="#334155" strokeWidth="1.5" />
          {/* Cabinets L-shape */}
          <polygon points="120,180 240,120 255,128 135,188" fill="#3F3F46" stroke="#94A3B8" />
          <polygon points="240,120 310,155 310,165 240,130" fill="#3F3F46" stroke="#94A3B8" />
          {/* Fridge */}
          <polygon points="80,175 105,162 105,95 80,108" fill="#E2E8F0" stroke="#475569" />
          <line x1="92" y1="130" x2="92" y2="170" stroke="#64748B" strokeWidth="1.5" />
          {/* Sink */}
          <polygon points="160,158 178,149 188,154 170,163" fill="#172554" stroke="#60A5FA" />
          {/* Stove */}
          <ellipse cx="270" cy="148" rx="6" ry="3" fill="#000" />
          <ellipse cx="285" cy="156" rx="6" ry="3" fill="#000" />
          {/* Hanging lights */}
          <line x1="200" y1="20" x2="200" y2="80" stroke="#FF6B00" strokeWidth="1.5" />
          <ellipse cx="200" cy="80" rx="10" ry="4" fill="#FF8F3D" />
        </svg>
      );
    }

    if (isBed) {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <polygon points="200,270 60,190 200,110 340,190" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <polygon points="60,190 200,110 200,20 60,100" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          <polygon points="200,110 340,190 340,100 200,20" fill="#020617" stroke="#334155" strokeWidth="1.5" />
          {/* Bed Frame */}
          <polygon points="110,200 210,150 240,165 140,215" fill="#78350F" stroke="#451A03" />
          <polygon points="115,197 210,150 232,161 137,208" fill="#F8FAFC" stroke="#E2E8F0" />
          {/* Pillows */}
          <polygon points="190,154 205,147 215,152 200,159" fill="#CBD5E1" />
          <polygon points="175,162 190,155 200,160 185,167" fill="#CBD5E1" />
          {/* Blue Comforter */}
          <polygon points="115,197 155,177 180,189 137,208" fill="#2563EB" />
          {/* Nightstand & Lamp */}
          <polygon points="238,145 258,135 268,140 248,150" fill="#78350F" />
          <line x1="248" y1="150" x2="248" y2="175" stroke="#78350F" strokeWidth="2" />
          <circle cx="253" cy="130" r="4" fill="#FBBF24" />
        </svg>
      );
    }

    if (isBath) {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <polygon points="200,270 60,190 200,110 340,190" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <polygon points="60,190 200,110 200,20 60,100" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          <polygon points="200,110 340,190 340,100 200,20" fill="#020617" stroke="#334155" strokeWidth="1.5" />
          {/* Bathtub */}
          <ellipse cx="140" cy="200" rx="40" ry="18" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
          <ellipse cx="140" cy="197" rx="32" ry="12" fill="#60A5FA" opacity="0.3" />
          {/* Vanity Counter */}
          <polygon points="260,150 300,170 300,135 260,115" fill="#475569" stroke="#94A3B8" />
          <rect x="270" y="90" width="20" height="25" fill="#FFF" opacity="0.8" stroke="#000" />
          {/* Toilet Commode */}
          <rect x="220" y="140" width="18" height="22" fill="#F8FAFC" stroke="#E2E8F0" />
        </svg>
      );
    }

    // Default: Living Room / Lounge
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <polygon points="200,270 60,190 200,110 340,190" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
        <polygon points="60,190 200,110 200,20 60,100" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
        <polygon points="200,110 340,190 340,100 200,20" fill="#020617" stroke="#334155" strokeWidth="1.5" />
        {/* Sofa */}
        <polygon points="90,195 160,160 175,168 105,203" fill="#FF6B00" stroke="#FFF" strokeWidth="1" />
        <polygon points="120,210 170,185 185,192 135,217" fill="#FF6B00" stroke="#FFF" strokeWidth="1" />
        {/* Coffee Table */}
        <polygon points="150,205 180,190 200,200 170,215" fill="#334155" stroke="#94A3B8" />
        {/* TV on right wall */}
        <polygon points="270,115 310,135 310,90 270,70" fill="#1E293B" stroke="#000" strokeWidth="2.5" />
        <polygon points="275,112 305,128 305,95 275,79" fill="#020617" />
        {/* Window on left wall */}
        <polygon points="90,110 130,90 130,135 90,155" fill="rgba(56,189,248,0.35)" stroke="#FFF" />
      </svg>
    );
  };

  const getFurnishingDetails = (name: string) => {
    const isKitchen = name.toLowerCase().includes('kitchen');
    const isBed = name.toLowerCase().includes('bed') || name.toLowerCase().includes('suite');
    const isBath = name.toLowerCase().includes('bath');

    if (isKitchen) {
      return [
        'Premium granite countertops',
        'Custom modular cabinets',
        'Stainless steel double basin sink',
        'Built-in gas stovetop and oven hub',
        'Integrated refrigerator slot',
        'Recessed LED ceiling lights'
      ];
    }
    if (isBed) {
      return [
        'Teak wood king-size bed frame',
        'Double bedside nightstands',
        'Built-in floor-to-ceiling wardrobe',
        'Dedicated study desk & computer layout',
        'Energy-saving warm yellow lamps',
        'Plush area carpet design'
      ];
    }
    if (isBath) {
      return [
        'Glazed porcelain wall tiles',
        'Stand-alone designer acrylic bathtub',
        'Dual-flush ceramic wall toilet commode',
        'Chrome brass taps and faucets',
        'Mirror with built-in perimeter LEDs',
        'Sleek glass partition panels'
      ];
    }
    return [
      'Multi-cushion sectional sofa set',
      'Engineered wood coffee table',
      '65" OLED smart TV screen configuration',
      'Potted air-purifying indoor plants',
      'Luxury designer wall painting panels',
      'Modern pendant lighting array'
    ];
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/app/3d-house')}
              className="glass p-2.5 rounded-xl text-white/70 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Layers className="w-8 h-8 text-[#FF6B00]" />
                3D Floor Planning
              </h1>
              <p className="text-white/70 mt-1">
                Spatial configurations for: <span className="text-[#FF6B00] font-semibold">{project.projectName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/app/3d-house')}
            className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all flex items-center gap-2 cursor-pointer font-semibold animate-pulse"
          >
            <Eye className="w-5 h-5" />
            View 3D Render
          </button>
        </div>

        {/* GROUND FLOOR GRID */}
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Home className="w-6 h-6 text-[#FF6B00]" />
              Ground Floor Layout <span className="text-white/50 text-sm font-normal">({groundArea.toLocaleString()} sq.ft)</span>
            </h2>
            <div className="relative">
              <button 
                onClick={() => setIsAddingRoom(!isAddingRoom)}
                className="text-[#FF6B00] text-sm hover:underline flex items-center gap-1.5 cursor-pointer bg-[#FF6B00]/10 py-1.5 px-3 rounded-lg border border-[#FF6B00]/20"
              >
                <Plus className="w-4 h-4" /> Add Room
              </button>

              {/* Add Room Dropdown Menu */}
              {isAddingRoom && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0B1F3A] border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden">
                  <button 
                    onClick={() => handleAddRoom('bedroom')} 
                    className="w-full text-left px-4 py-2.5 text-xs text-white hover:bg-[#FF6B00]/20 transition-all"
                  >
                    + Add Bedroom
                  </button>
                  <button 
                    onClick={() => handleAddRoom('kitchen')} 
                    className="w-full text-left px-4 py-2.5 text-xs text-white hover:bg-[#FF6B00]/20 transition-all"
                  >
                    + Add Kitchen
                  </button>
                  <button 
                    onClick={() => handleAddRoom('lounge')} 
                    className="w-full text-left px-4 py-2.5 text-xs text-white hover:bg-[#FF6B00]/20 transition-all"
                  >
                    + Add Lounge / Office
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {groundRooms.map((room) => (
              <div 
                key={room.id} 
                onClick={() => handleSelectRoom(room)}
                className="glass rounded-2xl p-5 hover:bg-white/5 hover:border-[#FF6B00]/40 transition-all relative group border border-white/5 cursor-pointer"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRoom(room);
                  }}
                  className="absolute top-4 right-4 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#FF6B00]/25 p-3 rounded-xl border border-[#FF6B00]/10">
                    <room.icon className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{room.name}</h3>
                    <p className="text-white/50 text-xs">{room.area}</p>
                  </div>
                </div>

                <div className="h-32 bg-black/35 rounded-xl border border-white/5 flex items-center justify-center p-2 group-hover:border-[#FF6B00]/20 transition-colors">
                  <div className="w-full h-full text-white/40 group-hover:text-[#FF8F3D] transition-colors">
                    {render3DRoomSVG(room.name)}
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-center text-[10px] text-white/40 font-semibold group-hover:text-white/80 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-[#FF8F3D] animate-bounce" /> Click to view furnished 3D
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FIRST FLOOR GRID */}
        {project.floors > 1 && firstRooms.length > 0 && (
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-blue-400" />
                First Floor Layout <span className="text-white/50 text-sm font-normal">({firstArea.toLocaleString()} sq.ft)</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {firstRooms.map((room) => (
                <div 
                  key={room.id} 
                  onClick={() => handleSelectRoom(room)}
                  className="glass rounded-2xl p-5 hover:bg-white/5 hover:border-blue-400/40 transition-all relative group border border-white/5 cursor-pointer"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRoom(room);
                    }}
                    className="absolute top-4 right-4 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-500/25 p-3 rounded-xl border border-blue-500/10">
                      <room.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">{room.name}</h3>
                      <p className="text-white/50 text-xs">{room.area}</p>
                    </div>
                  </div>

                  <div className="h-32 bg-black/35 rounded-xl border border-white/5 flex items-center justify-center p-2 group-hover:border-blue-400/20 transition-colors">
                    <div className="w-full h-full text-white/40 group-hover:text-blue-400 transition-colors">
                      {render3DRoomSVG(room.name)}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-center text-[10px] text-white/40 font-semibold group-hover:text-white/80 transition-colors">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-400 animate-bounce" /> Click to view furnished 3D
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* METRICS SUMMARY */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">Space & Budget Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-white/60 text-sm mb-1">Total Built-up</p>
              <p className="text-2xl font-bold text-white">{area.toLocaleString()} sq.ft</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Bedrooms</p>
              <p className="text-2xl font-bold text-[#FF6B00]">{project.bedrooms} Bed Units</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Kitchens</p>
              <p className="text-2xl font-bold text-[#FF6B00]">{project.kitchens} Mod Kitchen</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Total Estimate</p>
              <p className="text-2xl font-bold text-green-400">₹{(project.totalCost / 100000).toFixed(2)}L</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3D ROOM MODAL */}
      {selectedRoomFor3D && (
        <div className="fixed inset-0 bg-[#0B1F3A]/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass rounded-3xl p-6 lg:p-8 max-w-2xl w-full border border-white/10 space-y-5 max-h-[95vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[#FF6B00]" />
                  {selectedRoomFor3D.name} - 3D Visualizer
                </h2>
                <p className="text-white/60 text-xs mt-1">Realistic architectural visualization and planning specs</p>
              </div>
              <button 
                onClick={() => setSelectedRoomFor3D(null)}
                className="text-white/50 hover:text-white bg-white/5 p-2 rounded-xl border border-white/10 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* View Mode Tabs Selector */}
            <div className="flex justify-between items-center bg-white/5 p-1 rounded-xl border border-white/5 w-full">
              <div className="flex gap-1">
                <button
                  onClick={() => setModalViewMode('blueprint')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    modalViewMode === 'blueprint'
                      ? 'bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  3D Blueprint
                </button>
                <button
                  onClick={() => setModalViewMode('ai_render')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    modalViewMode === 'ai_render'
                      ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white shadow-md shadow-[#FF6B00]/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  AI Interior Render
                </button>
              </div>

              {/* Reset/Regenerate button for AI mode */}
              {modalViewMode === 'ai_render' && !isGeneratingAI && (
                <button
                  onClick={handleGenerateAIRender}
                  className="text-xs text-[#FF8F3D] hover:text-white transition-colors flex items-center gap-1 cursor-pointer bg-[#FF6B00]/10 px-2.5 py-1.5 rounded-lg border border-[#FF6B00]/20"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Re-Generate Design
                </button>
              )}
            </div>

            {/* Main Visualizer Content Canvas */}
            {modalViewMode === 'blueprint' ? (
              /* Blueprint View (Normal SVG) */
              <div className="aspect-video bg-black/45 rounded-2xl border border-white/5 flex items-center justify-center p-4 min-h-[320px]">
                <div className="w-80 h-80 text-white/90">
                  {render3DRoomSVG(selectedRoomFor3D.name)}
                </div>
              </div>
            ) : (
              /* AI Design Render View */
              <div className="space-y-4">
                {/* AI Generator Configuration deck */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/50 font-semibold uppercase tracking-wider block">Theme Style</label>
                    <select
                      value={aiStyle}
                      onChange={(e) => {
                        setAiStyle(e.target.value as any);
                        setSelectedAngle(0);
                      }}
                      disabled={isGeneratingAI}
                      className="w-full bg-[#0B1F3A] border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white cursor-pointer focus:outline-none focus:border-[#FF6B00]"
                    >
                      <option value="modern">Modern Glass</option>
                      <option value="classic">Classic Villa</option>
                      <option value="eco">Eco-Solar</option>
                      <option value="brick">Urban Brick</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/50 font-semibold uppercase tracking-wider block">Lighting Atmosphere</label>
                    <select
                      value={aiLighting}
                      onChange={(e) => setAiLighting(e.target.value as any)}
                      disabled={isGeneratingAI}
                      className="w-full bg-[#0B1F3A] border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white cursor-pointer focus:outline-none focus:border-[#FF6B00]"
                    >
                      <option value="daylight">Natural Daylight</option>
                      <option value="warm_cozy">Warm Cozy Glow</option>
                      <option value="evening_glow">Evening Dusk Mood</option>
                      <option value="neon_accent">Futuristic Accents</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/50 font-semibold uppercase tracking-wider block">Furnishing Level</label>
                    <select
                      value={aiDensity}
                      onChange={(e) => setAiDensity(e.target.value as any)}
                      disabled={isGeneratingAI}
                      className="w-full bg-[#0B1F3A] border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white cursor-pointer focus:outline-none focus:border-[#FF6B00]"
                    >
                      <option value="minimalist">Minimalist / Clean</option>
                      <option value="balanced">Standard / Cozy</option>
                      <option value="luxury">Luxury / Heavy-Fit</option>
                    </select>
                  </div>
                </div>

                {/* Render Canvas Wrapper */}
                <div className="aspect-video bg-black/60 rounded-2xl border border-white/10 relative overflow-hidden min-h-[320px] flex items-center justify-center group shadow-inner">
                  {isGeneratingAI ? (
                    /* AI Generation Progress Loader */
                    <div className="absolute inset-0 bg-[#0B1F3A]/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center space-y-4">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        {/* Shimmer spinning rings */}
                        <div className="absolute inset-0 border-4 border-[#FF6B00]/25 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-[#FF6B00] rounded-full animate-spin"></div>
                        <Sparkles className="w-6 h-6 text-[#FF8F3D] animate-pulse" />
                      </div>
                      
                      <div className="space-y-2 w-2/3">
                        <p className="text-[#FF8F3D] text-xs font-bold tracking-wide uppercase">AI Design Pipeline Active</p>
                        <p className="text-white text-sm animate-pulse font-medium h-5">{aiStep}</p>
                        
                        {/* Progress slider bar */}
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] h-full transition-all duration-100 ease-out" 
                            style={{ width: `${aiProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-white/40 block font-mono">{aiProgress}% Complete</span>
                      </div>
                    </div>
                  ) : (
                    /* Loaded AI Render Image with Hotspots Overlay */
                    <div className="w-full h-full relative">
                      <img 
                        src={AI_RENDER_ASSETS[getRoomTypeKey(selectedRoomFor3D.name)]?.[aiStyle]?.urls[selectedAngle] || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'} 
                        alt="AI Interior Render"
                        className="w-full h-full object-cover rounded-2xl select-none"
                      />

                      {/* Hotspots Mapping */}
                      {(AI_RENDER_ASSETS[getRoomTypeKey(selectedRoomFor3D.name)]?.[aiStyle]?.hotspots || []).map((hs, idx) => (
                        <div 
                          key={idx}
                          className="absolute"
                          style={{ left: hs.x, top: hs.y }}
                        >
                          <button
                            onMouseEnter={() => setActiveHotspot(idx)}
                            onMouseLeave={() => setActiveHotspot(null)}
                            onClick={() => setActiveHotspot(activeHotspot === idx ? null : idx)}
                            className="w-7 h-7 bg-[#FF6B00] hover:bg-[#FF8F3D] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg border border-white/50 cursor-pointer transition-all hover:scale-110 active:scale-95 focus:outline-none"
                          >
                            +
                          </button>

                          {/* Hover Tooltip Box */}
                          {activeHotspot === idx && (
                            <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-64 bg-slate-950/95 backdrop-blur-md border border-white/15 p-3 rounded-2xl shadow-2xl z-30 text-left pointer-events-none animate-fade-in space-y-1">
                              <h5 className="font-bold text-[#FF8F3D] flex items-center gap-1.5 text-xs">
                                <Info className="w-3.5 h-3.5" />
                                {hs.title}
                              </h5>
                              <p className="text-white/80 text-[10px] leading-relaxed">{hs.description}</p>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Camera Angle Selector Panel Overlay */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 gap-2 z-10">
                        <span className="text-[10px] text-white/50 font-semibold uppercase tracking-wider mr-1">Views</span>
                        {[0, 1, 2].map((angleIndex) => (
                          <button
                            key={angleIndex}
                            onClick={() => {
                              setSelectedAngle(angleIndex);
                              setActiveHotspot(null);
                            }}
                            className={`p-1.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                              selectedAngle === angleIndex
                                ? 'bg-[#FF6B00] text-white'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span className="text-[10px]">{angleIndex + 1}</span>
                          </button>
                        ))}
                      </div>

                      {/* Hotspots helper text overlay */}
                      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] text-white/70 border border-white/5 z-10">
                        Hover over <span className="text-[#FF8F3D] font-bold">+</span> hotspots for materials specifications
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Furnishing specs / context list */}
            <div className="bg-white/5 rounded-2xl p-4 text-xs text-white/70 space-y-2 border border-white/5">
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#FF6B00]" />
                Interior Furnishing Specifications included in Estimate:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-white/60">
                {getFurnishingDetails(selectedRoomFor3D.name).map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></span>
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

