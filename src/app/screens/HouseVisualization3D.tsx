import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Boxes, Eye, Package, Shield, Zap, Droplet, Layout, Paintbrush, Sliders, Info, DollarSign, Clock, Plus, Minus, Cpu, Sparkles, Camera, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

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
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
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
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
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
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505693395321-883724634266?auto=format&fit=crop&w=800&q=80',
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
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
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
  }
};

type HouseStyle = 'modern' | 'classic' | 'eco' | 'brick';
type RoofType = 'flat' | 'pitched' | 'curved';
type ColorTheme = 'terracotta' | 'slate' | 'white' | 'sage';
type ViewMode = 'elevation' | 'furnished' | 'top';

export default function HouseVisualization3D() {
  const navigate = useNavigate();
  const { project, updateProject } = useApp();

  // DRAFT STATES (Modified immediately by inputs, but NOT shown in SVG/Costs until 'Generate' is clicked)
  const [draftStyle, setDraftStyle] = useState<HouseStyle>((project.constructionType === 'Commercial' ? 'modern' : 'classic') as HouseStyle);
  const [draftFloors, setDraftFloors] = useState<number>(project.floors || 2);
  const [draftRoof, setDraftRoof] = useState<RoofType>('pitched');
  const [draftColor, setDraftColor] = useState<ColorTheme>('white');
  const [draftGarden, setDraftGarden] = useState<boolean>(true);
  const [draftSolar, setDraftSolar] = useState<boolean>(true);
  const [draftQuality, setDraftQuality] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [draftRooms, setDraftRooms] = useState<number>(project.rooms || 4);
  const [draftBedrooms, setDraftBedrooms] = useState<number>(project.bedrooms || 2);
  const [draftKitchens, setDraftKitchens] = useState<number>(project.kitchens || 1);

  // APPLIED STATES (Used to draw SVG & calculate stats, updated ONLY on "Generate")
  const [appliedStyle, setAppliedStyle] = useState<HouseStyle>('modern');
  const [appliedFloors, setAppliedFloors] = useState<number>(2);
  const [appliedRoof, setAppliedRoof] = useState<RoofType>('pitched');
  const [appliedColor, setAppliedColor] = useState<ColorTheme>('white');
  const [appliedGarden, setAppliedGarden] = useState<boolean>(true);
  const [appliedSolar, setAppliedSolar] = useState<boolean>(true);
  const [appliedQuality, setAppliedQuality] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [appliedRooms, setAppliedRooms] = useState<number>(4);
  const [appliedBedrooms, setAppliedBedrooms] = useState<number>(2);
  const [appliedKitchens, setAppliedKitchens] = useState<number>(1);

  // AI Generation Sequence states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  // Furnished View Mode (Elevation, Furnished, Top View)
  const [viewMode, setViewMode] = useState<ViewMode>('elevation');

  // AI Render view specific states for 3D Visualizer room selection
  const [selectedInteriorRoom, setSelectedInteriorRoom] = useState<'all' | 'living' | 'kitchen' | 'bedroom' | 'bathroom'>('all');
  const [selectedInteriorAngle, setSelectedInteriorAngle] = useState<number>(0);
  const [activeInteriorHotspot, setActiveInteriorHotspot] = useState<number | null>(null);

  // Initialize applied states from global context on load
  useEffect(() => {
    if (project) {
      setAppliedFloors(project.floors);
      setAppliedRooms(project.rooms);
      setAppliedBedrooms(project.bedrooms);
      setAppliedKitchens(project.kitchens);
      
      setDraftFloors(project.floors);
      setDraftRooms(project.rooms);
      setDraftBedrooms(project.bedrooms);
      setDraftKitchens(project.kitchens);
    }
  }, []);

  // Trigger AI Estimation Generation
  const handleGenerate = () => {
    setIsGenerating(true);
    
    const steps = [
      'Scanning architectural envelope parameters...',
      'Computing floor loads and concrete requirements...',
      'Positioning furniture assets in spatial coordinate layout...',
      'Drafting structural plumbing and conduit line vectors...',
      'Synthesizing realistic sketch viewport renders...'
    ];

    let currentStep = 0;
    setGenerationStep(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setGenerationStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        
        // Apply all draft parameters
        setAppliedStyle(draftStyle);
        setAppliedFloors(draftFloors);
        setAppliedRoof(draftRoof);
        setAppliedColor(draftColor);
        setAppliedGarden(draftGarden);
        setAppliedSolar(draftSolar);
        setAppliedQuality(draftQuality);
        setAppliedRooms(draftRooms);
        setAppliedBedrooms(draftBedrooms);
        setAppliedKitchens(draftKitchens);

        // Calculate new budget
        const qFactor = draftQuality === 'basic' ? 1.0 : draftQuality === 'standard' ? 1.35 : 1.7;
        const newBudget = Math.round((1800000 + (draftRooms * 280000) + (draftBedrooms * 350000) + (draftKitchens * 420000)) * qFactor);
        const materials = Math.round(newBudget * 0.55);
        const labor = Math.round(newBudget * 0.28);
        const interior = Math.round(newBudget * 0.12);
        const tax = Math.round(newBudget * 0.05);

        // Sync to global context
        updateProject({
          floors: draftFloors,
          rooms: draftRooms,
          bedrooms: draftBedrooms,
          kitchens: draftKitchens,
          materialQuality: draftQuality === 'basic' ? 'Basic' : draftQuality === 'standard' ? 'Standard' : 'Premium',
          totalCost: newBudget,
          breakdown: {
            materials,
            labor,
            interior,
            tax
          }
        });

        setIsGenerating(false);
        alert('AI Rendering Generated Successfully! Construction costs, material limits, and floor plan maps updated.');
      }
    }, 450);
  };

  // Applied values Calculations
  const qFactor = appliedQuality === 'basic' ? 1.0 : appliedQuality === 'standard' ? 1.35 : 1.7;
  const calculatedBudget = (1800000 + (appliedRooms * 280000) + (appliedBedrooms * 350000) + (appliedKitchens * 420000)) * qFactor;
  const materialCost = Math.round(calculatedBudget * 0.55);
  const cementCost = Math.round(materialCost * 0.3);
  const steelCost = Math.round(materialCost * 0.25);
  const bricksCost = Math.round(materialCost * 0.2);
  const sandCost = Math.round(materialCost * 0.25);

  const totalDays = 120 + (appliedRooms * 15) + (appliedBedrooms * 20) + (appliedKitchens * 25);
  const timelineMonths = Math.floor(totalDays / 30);
  const timelineDays = totalDays % 30;

  // Counter draft adjustments
  const adjustRooms = (amount: number) => {
    const nextVal = draftRooms + amount;
    if (nextVal >= 2 && nextVal <= 8) {
      setDraftRooms(nextVal);
      if (draftBedrooms + draftKitchens > nextVal) {
        if (draftBedrooms > 1) setDraftBedrooms(draftBedrooms - 1);
        else if (draftKitchens > 1) setDraftKitchens(draftKitchens - 1);
      }
    }
  };

  const adjustBedrooms = (amount: number) => {
    const nextVal = draftBedrooms + amount;
    if (nextVal >= 1 && nextVal <= 5) {
      if (nextVal + draftKitchens > draftRooms) {
        setDraftRooms(nextVal + draftKitchens);
      }
      setDraftBedrooms(nextVal);
    }
  };

  const adjustKitchens = (amount: number) => {
    const nextVal = draftKitchens + amount;
    if (nextVal >= 1 && nextVal <= 3) {
      if (draftBedrooms + nextVal > draftRooms) {
        setDraftRooms(draftBedrooms + nextVal);
      }
      setDraftKitchens(nextVal);
    }
  };

  // Color Mapping
  const themeColors = {
    terracotta: { leftWall: '#B45309', rightWall: '#D97706', roof: '#78350F', trim: '#FCD34D', bgGradient: 'from-amber-950/40 via-[#0B1F3A] to-black' },
    slate: { leftWall: '#334155', rightWall: '#475569', roof: '#0F172A', trim: '#94A3B8', bgGradient: 'from-slate-800/30 via-[#0B1F3A] to-black' },
    white: { leftWall: '#CBD5E1', rightWall: '#E2E8F0', roof: '#1E293B', trim: '#FF6B00', bgGradient: 'from-[#FF6B00]/15 via-[#0B1F3A] to-black' },
    sage: { leftWall: '#4B5C4D', rightWall: '#607362', roof: '#1F2920', trim: '#A7C0A9', bgGradient: 'from-emerald-950/30 via-[#0B1F3A] to-black' }
  }[appliedColor];

  // Check if drafts differ from applied settings
  const hasUnsavedChanges = 
    draftStyle !== appliedStyle ||
    draftFloors !== appliedFloors ||
    draftRoof !== appliedRoof ||
    draftColor !== appliedColor ||
    draftGarden !== appliedGarden ||
    draftSolar !== appliedSolar ||
    draftQuality !== appliedQuality ||
    draftRooms !== appliedRooms ||
    draftBedrooms !== appliedBedrooms ||
    draftKitchens !== appliedKitchens;

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Boxes className="w-8 h-8 text-[#FF6B00]" />
              Furnished 3D House Visualizer
            </h1>
            <p className="text-white/70 mt-1">Project: <span className="text-[#FF6B00] font-semibold">{project.projectName}</span> • {project.location}</p>
          </div>
          <button
            onClick={() => navigate('/app/3d-floor')}
            className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all flex items-center gap-2 cursor-pointer font-semibold"
          >
            <Eye className="w-5 h-5" />
            Floor Plan
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: CUSTOMIZER DECK (4 Columns) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Architectural Config Card */}
            <div className="glass rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Sliders className="w-5 h-5 text-[#FF6B00]" />
                <h2 className="text-white font-bold text-base">Architectural Config</h2>
              </div>

              {/* Style selector */}
              <div className="space-y-1">
                <label className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'modern', label: 'Modern Glass' },
                    { id: 'classic', label: 'Classic Villa' },
                    { id: 'eco', label: 'Eco-Solar' },
                    { id: 'brick', label: 'Urban Brick' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setDraftStyle(s.id as HouseStyle)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        draftStyle === s.id
                          ? 'bg-[#FF6B00]/20 border-[#FF6B00] text-white'
                          : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Floors and Quality */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Floors</label>
                  <select
                    value={draftFloors}
                    onChange={(e) => setDraftFloors(Number(e.target.value))}
                    className="w-full bg-[#0B1F3A] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="1">1 Floor</option>
                    <option value="2">2 Floors</option>
                    <option value="3">3 Floors</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Materials</label>
                  <select
                    value={draftQuality}
                    onChange={(e) => setDraftQuality(e.target.value as any)}
                    className="w-full bg-[#0B1F3A] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="basic">Basic Class</option>
                    <option value="standard">Standard Quality</option>
                    <option value="premium">Premium Quality</option>
                  </select>
                </div>
              </div>

              {/* Roof and color */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Roof Design</label>
                  <select
                    value={draftRoof}
                    onChange={(e) => setDraftRoof(e.target.value as RoofType)}
                    className="w-full bg-[#0B1F3A] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="flat">Flat Roof</option>
                    <option value="pitched">Pitched Gable</option>
                    <option value="curved">Curved Vault</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Exterior Finish</label>
                  <select
                    value={draftColor}
                    onChange={(e) => setDraftColor(e.target.value as ColorTheme)}
                    className="w-full bg-[#0B1F3A] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="white">Snow White</option>
                    <option value="slate">Slate Gray</option>
                    <option value="terracotta">Terracotta</option>
                    <option value="sage">Sage Green</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Room configuration card */}
            <div className="glass rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Sliders className="w-5 h-5 text-[#FF6B00]" />
                <h2 className="text-white font-bold text-base">Rooms Config</h2>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs font-semibold">Total Space Rooms</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => adjustRooms(-1)} className="p-1 rounded-md bg-white/5 border border-white/10 text-white"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="text-white font-bold text-xs w-4 text-center">{draftRooms}</span>
                    <button onClick={() => adjustRooms(1)} className="p-1 rounded-md bg-white/5 border border-white/10 text-white"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-xs font-semibold">Bedrooms</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => adjustBedrooms(-1)} className="p-1 rounded-md bg-white/5 border border-white/10 text-white"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="text-white font-bold text-xs w-4 text-center">{draftBedrooms}</span>
                    <button onClick={() => adjustBedrooms(1)} className="p-1 rounded-md bg-white/5 border border-white/10 text-white"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-xs font-semibold">Kitchens</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => adjustKitchens(-1)} className="p-1 rounded-md bg-white/5 border border-white/10 text-white"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="text-white font-bold text-xs w-4 text-center">{draftKitchens}</span>
                    <button onClick={() => adjustKitchens(1)} className="p-1 rounded-md bg-white/5 border border-white/10 text-white"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2 border-t border-white/5 text-[11px] text-white/80">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={draftSolar} onChange={(e) => setDraftSolar(e.target.checked)} className="rounded border-white/20 text-[#FF6B00]" />
                  Solar
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={draftGarden} onChange={(e) => setDraftGarden(e.target.checked)} className="rounded border-white/20 text-[#FF6B00]" />
                  Garden
                </label>
              </div>
            </div>

            {/* GENERATE ACTION BUTTON (Pulse glow when drafts differ from applied) */}
            <button
              onClick={handleGenerate}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all duration-300 border ${
                hasUnsavedChanges
                  ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white border-[#FF6B00] shadow-lg shadow-[#FF6B00]/40 animate-pulse scale-[1.01]'
                  : 'bg-white/5 border-white/10 text-white/40 cursor-default'
              }`}
              disabled={isGenerating}
            >
              <Cpu className="w-5 h-5 text-[#FF6B00]" />
              Generate AI Design & Cost
            </button>
          </div>

          {/* RIGHT: VIEWPORT & COST CARDS (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Cost stats deck */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass rounded-2xl p-5 flex items-center gap-3.5 border border-white/10">
                <div className="bg-[#FF6B00]/20 p-3 rounded-xl"><DollarSign className="w-5 h-5 text-[#FF6B00]" /></div>
                <div>
                  <p className="text-white/50 text-[10px] uppercase font-semibold">Total Budget</p>
                  <p className="text-xl font-bold text-white">₹{(calculatedBudget / 100000).toFixed(2)}L</p>
                </div>
              </div>
              <div className="glass rounded-2xl p-5 flex items-center gap-3.5 border border-white/10">
                <div className="bg-blue-500/20 p-3 rounded-xl"><Package className="w-5 h-5 text-blue-400" /></div>
                <div>
                  <p className="text-white/50 text-[10px] uppercase font-semibold">Material Cost</p>
                  <p className="text-xl font-bold text-white">₹{(materialCost / 100000).toFixed(2)}L</p>
                </div>
              </div>
              <div className="glass rounded-2xl p-5 flex items-center gap-3.5 border border-white/10">
                <div className="bg-green-500/20 p-3 rounded-xl"><Clock className="w-5 h-5 text-green-400" /></div>
                <div>
                  <p className="text-white/50 text-[10px] uppercase font-semibold">Timeline Estimate</p>
                  <p className="text-xl font-bold text-white">{timelineMonths}m {timelineDays}d</p>
                </div>
              </div>
            </div>

            {/* SVG Render viewport */}
            <div className="glass rounded-3xl p-6 aspect-video flex flex-col justify-between relative overflow-hidden min-h-[460px] border border-white/10">
              
              {/* Overlay rendering steps spinner */}
              {isGenerating && (
                <div className="absolute inset-0 bg-[#0B1F3A]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <h3 className="text-white font-bold text-lg">AI Construction Generator</h3>
                    <p className="text-[#FF8F3D] text-sm animate-pulse mt-1">{generationStep}</p>
                  </div>
                </div>
              )}

              {/* Sky Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${themeColors.bgGradient}`}></div>

              {/* Room selector for furnished view */}
              {viewMode === 'furnished' && (
                <div className="flex bg-black/40 backdrop-blur-sm p-1 rounded-xl border border-white/10 gap-1 mx-auto my-1.5 z-10 relative overflow-x-auto max-w-full">
                  {[
                    { id: 'all', label: 'All Spaces (Cutaway)' },
                    { id: 'living', label: 'Living Room' },
                    { id: 'kitchen', label: 'Kitchen' },
                    { id: 'bedroom', label: 'Master Suite' },
                    { id: 'bathroom', label: 'Bathroom' }
                  ].map((room) => (
                    <button
                      key={room.id}
                      onClick={() => {
                        setSelectedInteriorRoom(room.id as any);
                        setSelectedInteriorAngle(0);
                        setActiveInteriorHotspot(null);
                      }}
                      className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        selectedInteriorRoom === room.id
                          ? 'bg-[#FF6B00] text-white shadow-sm'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {room.label}
                    </button>
                  ))}
                </div>
              )}

              {/* View swapper */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 z-10 relative">
                <span className="text-white font-bold text-sm tracking-wide">Furnished 3D Viewport</span>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                  {[
                    { id: 'elevation', label: 'Front View' },
                    { id: 'furnished', label: 'Interior View' },
                    { id: 'top', label: 'Top View' }
                  ].map(v => (
                    <button
                      key={v.id}
                      onClick={() => setViewMode(v.id as ViewMode)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        viewMode === v.id
                          ? 'bg-[#FF6B00] text-white shadow'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic SVG Construction Rendering */}
              <div className="flex-1 flex items-center justify-center relative z-0">
                <div className="w-96 h-96">
                  
                  {/* VIEW 1: ELEVATION (Front facade Sketch with porch furniture) */}
                  {viewMode === 'elevation' && (
                    <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible drop-shadow-[0_20px_45px_rgba(0,0,0,0.5)]">
                      {/* Grass / Base Yard */}
                      {appliedGarden && <ellipse cx="200" cy="340" rx="165" ry="22" fill="#166534" opacity="0.85" />}
                      <ellipse cx="200" cy="340" rx="140" ry="14" fill="#1E293B" />

                      {/* MODERN GLASS STYLE */}
                      {appliedStyle === 'modern' && (
                        <g>
                          {/* Ground Floor Slab */}
                          <rect x="110" y="240" width="180" height="90" fill={themeColors.leftWall} stroke="#64748B" strokeWidth="1.5" />
                          {/* Giant Glass Panel Walls */}
                          <rect x="120" y="250" width="160" height="80" fill="rgba(14, 165, 233, 0.25)" stroke="#38BDF8" strokeWidth="1.5" />
                          {/* Diagonal Glass Reflection Shines */}
                          <line x1="130" y1="330" x2="210" y2="250" stroke="#FFF" strokeWidth="1" opacity="0.4" />
                          <line x1="170" y1="330" x2="250" y2="250" stroke="#FFF" strokeWidth="1" opacity="0.4" />
                          <line x1="210" y1="330" x2="270" y2="270" stroke="#FFF" strokeWidth="1" opacity="0.4" />
                          
                          {/* Modern Entrance Sliding Door */}
                          <rect x="180" y="270" width="40" height="60" fill="rgba(15, 23, 42, 0.8)" stroke="#FFF" strokeWidth="1.5" />
                          <line x1="200" y1="270" x2="200" y2="330" stroke="#FFF" strokeWidth="1.5" />
                          
                          {/* Upper Floor (if 2+ floors) */}
                          {appliedFloors >= 2 && (
                            <g>
                              <rect x="110" y="150" width="180" height="90" fill={themeColors.rightWall} stroke="#64748B" strokeWidth="1.5" />
                              <rect x="120" y="160" width="160" height="80" fill="rgba(14, 165, 233, 0.25)" stroke="#38BDF8" strokeWidth="1.5" />
                              <line x1="130" y1="240" x2="210" y2="160" stroke="#FFF" strokeWidth="1" opacity="0.4" />
                              <line x1="180" y1="240" x2="260" y2="160" stroke="#FFF" strokeWidth="1" opacity="0.4" />
                              {/* Balcony Chrome Glass Railings */}
                              <rect x="115" y="215" width="170" height="25" fill="rgba(255,255,255,0.15)" stroke="#E2E8F0" strokeWidth="1" rx="1" />
                              <line x1="115" y1="225" x2="285" y2="225" stroke="#E2E8F0" strokeWidth="1.5" />
                            </g>
                          )}

                          {/* Third Floor (if 3 floors) */}
                          {appliedFloors >= 3 && (
                            <g>
                              <rect x="110" y="60" width="180" height="90" fill={themeColors.leftWall} stroke="#64748B" strokeWidth="1.5" />
                              <rect x="120" y="70" width="160" height="80" fill="rgba(14, 165, 233, 0.25)" stroke="#38BDF8" strokeWidth="1.5" />
                              <line x1="130" y1="150" x2="210" y2="70" stroke="#FFF" strokeWidth="1" opacity="0.4" />
                              {/* Balcony Railings */}
                              <rect x="115" y="125" width="170" height="25" fill="rgba(255,255,255,0.15)" stroke="#E2E8F0" strokeWidth="1" rx="1" />
                            </g>
                          )}

                          {/* Flat Modern Roof with Chrome Trim */}
                          <rect x="100" y={appliedFloors === 1 ? 230 : appliedFloors === 2 ? 140 : 50} width="200" height="12" fill={themeColors.roof} stroke="#94A3B8" strokeWidth="2" rx="2" />
                          
                          {/* Porch Lounge Furniture */}
                          <g>
                            <path d="M 125,320 L 140,312 L 145,324 L 128,328 Z" fill="#1E293B" stroke="#64748B" />
                            <path d="M 255,320 L 270,312 L 275,324 L 258,328 Z" fill="#1E293B" stroke="#64748B" />
                          </g>
                        </g>
                      )}

                      {/* CLASSIC VILLA STYLE */}
                      {appliedStyle === 'classic' && (
                        <g>
                          {/* Ground Floor Columns & Masonry */}
                          <rect x="110" y="240" width="180" height="90" fill={themeColors.leftWall} stroke={themeColors.trim} strokeWidth="2" />
                          {/* Arched Windows */}
                          <path d="M 130,290 L 130,270 A 15,15 0 0 1 160,270 L 160,290 Z" fill="rgba(56,189,248,0.3)" stroke="#FFF" strokeWidth="2" />
                          <path d="M 240,290 L 240,270 A 15,15 0 0 1 270,270 L 270,290 Z" fill="rgba(56,189,248,0.3)" stroke="#FFF" strokeWidth="2" />
                          
                          {/* Villa Entrance Double Door with Arch */}
                          <path d="M 185,330 L 185,280 A 15,15 0 0 1 215,280 L 215,330 Z" fill="#78350F" stroke={themeColors.trim} strokeWidth="2" />
                          <line x1="200" y1="280" x2="200" y2="330" stroke={themeColors.trim} strokeWidth="1.5" />
                          <circle cx="196" cy="305" r="2" fill="#F59E0B" />
                          <circle cx="204" cy="305" r="2" fill="#F59E0B" />

                          {/* Grand Neoclassical White Columns */}
                          <g fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5">
                            {/* Column 1 */}
                            <rect x="112" y="238" width="10" height="92" />
                            <rect x="109" y="235" width="16" height="5" />
                            <rect x="109" y="328" width="16" height="5" />
                            {/* Column 2 */}
                            <rect x="278" y="238" width="10" height="92" />
                            <rect x="275" y="235" width="16" height="5" />
                            <rect x="275" y="328" width="16" height="5" />
                          </g>

                          {/* Upper Floor (if 2+ floors) */}
                          {appliedFloors >= 2 && (
                            <g>
                              <rect x="110" y="150" width="180" height="90" fill={themeColors.rightWall} stroke={themeColors.trim} strokeWidth="2" />
                              {/* Balcony Balustrade railing */}
                              <rect x="120" y="220" width="160" height="20" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
                              <line x1="120" y1="220" x2="280" y2="220" stroke={themeColors.trim} strokeWidth="2" />
                              {/* Classical upper windows */}
                              <path d="M 135,195 L 135,180 A 12,12 0 0 1 159,180 L 159,195 Z" fill="rgba(56,189,248,0.3)" stroke="#FFF" strokeWidth="1.5" />
                              <path d="M 241,195 L 241,180 A 12,12 0 0 1 265,180 L 265,195 Z" fill="rgba(56,189,248,0.3)" stroke="#FFF" strokeWidth="1.5" />
                            </g>
                          )}

                          {/* Third Floor (if 3 floors) */}
                          {appliedFloors >= 3 && (
                            <g>
                              <rect x="110" y="60" width="180" height="90" fill={themeColors.leftWall} stroke={themeColors.trim} strokeWidth="2" />
                              <path d="M 135,105 L 135,90 A 12,12 0 0 1 159,90 L 159,105 Z" fill="rgba(56,189,248,0.3)" stroke="#FFF" strokeWidth="1.5" />
                              <path d="M 241,105 L 241,90 A 12,12 0 0 1 265,90 L 265,105 Z" fill="rgba(56,189,248,0.3)" stroke="#FFF" strokeWidth="1.5" />
                            </g>
                          )}

                          {/* Classical Pitched Gable Roof with Clay Tiling pattern */}
                          <polygon 
                            points={`92,${appliedFloors === 1 ? 240 : appliedFloors === 2 ? 150 : 60} 200,${appliedFloors === 1 ? 180 : appliedFloors === 2 ? 90 : 5} 308,${appliedFloors === 1 ? 240 : appliedFloors === 2 ? 150 : 60}`} 
                            fill={themeColors.roof} 
                            stroke={themeColors.trim} 
                            strokeWidth="2" 
                          />
                          {/* Classic Ridge Cap */}
                          <line x1="200" y1={appliedFloors === 1 ? 180 : appliedFloors === 2 ? 90 : 5} x2="200" y2={appliedFloors === 1 ? 240 : appliedFloors === 2 ? 150 : 60} stroke={themeColors.trim} strokeWidth="2" />
                          
                          {/* Traditional Armchairs */}
                          <g fill="#D97706" stroke="#451A03" strokeWidth="0.5">
                            <rect x="135" y="310" width="12" height="15" rx="1" />
                            <rect x="253" y="310" width="12" height="15" rx="1" />
                          </g>
                        </g>
                      )}

                      {/* ECO-SOLAR STYLE */}
                      {appliedStyle === 'eco' && (
                        <g>
                          {/* Timber Horizontal Plank Wall */}
                          <rect x="110" y="240" width="180" height="90" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
                          {/* Plank Lines */}
                          <g stroke="#78350F" strokeWidth="1" opacity="0.6">
                            <line x1="110" y1="258" x2="290" y2="258" />
                            <line x1="110" y1="276" x2="290" y2="276" />
                            <line x1="110" y1="294" x2="290" y2="294" />
                            <line x1="110" y1="312" x2="290" y2="312" />
                          </g>
                          
                          {/* Large wood-framed double windows */}
                          <rect x="125" y="260" width="40" height="45" fill="rgba(56,189,248,0.3)" stroke="#F59E0B" strokeWidth="2" />
                          <rect x="235" y="260" width="40" height="45" fill="rgba(56,189,248,0.3)" stroke="#F59E0B" strokeWidth="2" />
                          
                          {/* Wooden Deck Door */}
                          <rect x="185" y="265" width="30" height="65" fill="#78350F" stroke="#F59E0B" strokeWidth="2" />
                          
                          {/* Leafy Greenery climbing on left wall */}
                          <path d="M 95,330 Q 110,290 108,260 T 115,220" fill="none" stroke="#22C55E" strokeWidth="2.5" />
                          <circle cx="106" cy="285" r="4" fill="#15803D" />
                          <circle cx="110" cy="255" r="4" fill="#15803D" />
                          <circle cx="112" cy="235" r="4" fill="#15803D" />

                          {/* Upper Floor (if 2+ floors) */}
                          {appliedFloors >= 2 && (
                            <g>
                              <rect x="110" y="150" width="180" height="90" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
                              <g stroke="#78350F" strokeWidth="1" opacity="0.6">
                                <line x1="110" y1="168" x2="290" y2="168" />
                                <line x1="110" y1="186" x2="290" y2="186" />
                                <line x1="110" y1="204" x2="290" y2="204" />
                              </g>
                              <rect x="135" y="165" width="35" height="40" fill="rgba(56,189,248,0.3)" stroke="#F59E0B" strokeWidth="1.5" />
                              <rect x="230" y="165" width="35" height="40" fill="rgba(56,189,248,0.3)" stroke="#F59E0B" strokeWidth="1.5" />
                              {/* Bamboo Balcony Railing */}
                              <rect x="110" y="210" width="180" height="30" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                              <line x1="125" y1="210" x2="125" y2="240" stroke="#F59E0B" strokeWidth="1.5" />
                              <line x1="145" y1="210" x2="145" y2="240" stroke="#F59E0B" strokeWidth="1.5" />
                              <line x1="165" y1="210" x2="165" y2="240" stroke="#F59E0B" strokeWidth="1.5" />
                              <line x1="235" y1="210" x2="235" y2="240" stroke="#F59E0B" strokeWidth="1.5" />
                              <line x1="255" y1="210" x2="255" y2="240" stroke="#F59E0B" strokeWidth="1.5" />
                            </g>
                          )}

                          {/* Third Floor (if 3 floors) */}
                          {appliedFloors >= 3 && (
                            <g>
                              <rect x="110" y="60" width="180" height="90" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
                              <rect x="135" y="75" width="35" height="40" fill="rgba(56,189,248,0.3)" stroke="#F59E0B" strokeWidth="1.5" />
                              <rect x="230" y="75" width="35" height="40" fill="rgba(56,189,248,0.3)" stroke="#F59E0B" strokeWidth="1.5" />
                            </g>
                          )}

                          {/* Slanted Solar Canopy Roof */}
                          <polygon 
                            points={`95,${appliedFloors === 1 ? 230 : appliedFloors === 2 ? 140 : 50} 305,${appliedFloors === 1 ? 210 : appliedFloors === 2 ? 120 : 30} 305,${appliedFloors === 1 ? 222 : appliedFloors === 2 ? 132 : 42} 95,${appliedFloors === 1 ? 242 : appliedFloors === 2 ? 152 : 62}`} 
                            fill="#1E3A8A" 
                            stroke="#60A5FA" 
                            strokeWidth="2" 
                          />
                          {/* Solar Panel grid lines */}
                          <line x1="147" y1={appliedFloors === 1 ? 225 : appliedFloors === 2 ? 135 : 45} x2="147" y2={appliedFloors === 1 ? 237 : appliedFloors === 2 ? 147 : 57} stroke="#60A5FA" />
                          <line x1="200" y1={appliedFloors === 1 ? 220 : appliedFloors === 2 ? 130 : 40} x2="200" y2={appliedFloors === 1 ? 232 : appliedFloors === 2 ? 142 : 52} stroke="#60A5FA" />
                          <line x1="252" y1={appliedFloors === 1 ? 215 : appliedFloors === 2 ? 125 : 35} x2="252" y2={appliedFloors === 1 ? 227 : appliedFloors === 2 ? 137 : 47} stroke="#60A5FA" />
                          
                          {/* Potted shrubs on deck */}
                          <g fill="#22C55E">
                            <rect x="115" y="322" width="10" height="8" fill="#78350F" />
                            <circle cx="120" cy="316" r="6" />
                            <rect x="275" y="322" width="10" height="8" fill="#78350F" />
                            <circle cx="280" cy="316" r="6" />
                          </g>
                        </g>
                      )}

                      {/* URBAN BRICK STYLE */}
                      {appliedStyle === 'brick' && (
                        <g>
                          {/* Detailed Red Brick walls */}
                          <rect x="110" y="240" width="180" height="90" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
                          {/* Brick line grids */}
                          <g stroke="#7F1D1D" strokeWidth="0.5" opacity="0.8">
                            {[248, 256, 264, 272, 280, 288, 296, 304, 312, 320].map((y) => (
                              <line key={y} x1="110" y1={y} x2="290" y2={y} />
                            ))}
                            {/* Dash offset vertical patterns */}
                            {[240, 256, 272, 288, 304, 320].map((y) => (
                              <g key={y}>
                                <line x1="130" y1={y} x2="130" y2={y + 8} />
                                <line x1="170" y1={y} x2="170" y2={y + 8} />
                                <line x1="210" y1={y} x2="210" y2={y + 8} />
                                <line x1="250" y1={y} x2="250" y2={y + 8} />
                              </g>
                            ))}
                            {[248, 264, 280, 296, 312].map((y) => (
                              <g key={y}>
                                <line x1="150" y1={y} x2="150" y2={y + 8} />
                                <line x1="190" y1={y} x2="190" y2={y + 8} />
                                <line x1="230" y1={y} x2="230" y2={y + 8} />
                                <line x1="270" y1={y} x2="270" y2={y + 8} />
                              </g>
                            ))}
                          </g>

                          {/* Industrial Grid Windows (Black frame) */}
                          <rect x="125" y="260" width="40" height="45" fill="rgba(30, 41, 59, 0.4)" stroke="#1E293B" strokeWidth="2.5" />
                          <line x1="145" y1="260" x2="145" y2="305" stroke="#1E293B" strokeWidth="1.5" />
                          <line x1="125" y1="282" x2="165" y2="282" stroke="#1E293B" strokeWidth="1.5" />

                          <rect x="235" y="260" width="40" height="45" fill="rgba(30, 41, 59, 0.4)" stroke="#1E293B" strokeWidth="2.5" />
                          <line x1="255" y1="260" x2="255" y2="305" stroke="#1E293B" strokeWidth="1.5" />
                          <line x1="235" y1="282" x2="275" y2="282" stroke="#1E293B" strokeWidth="1.5" />

                          {/* Heavy Industrial Iron Gate/Door */}
                          <rect x="185" y="270" width="30" height="60" fill="#1F2937" stroke="#111827" strokeWidth="2" />
                          <rect x="190" y="278" width="20" height="15" fill="rgba(30, 41, 59, 0.2)" stroke="#111827" strokeWidth="1" />
                          
                          {/* Upper Floor (if 2+ floors) */}
                          {appliedFloors >= 2 && (
                            <g>
                              <rect x="110" y="150" width="180" height="90" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
                              {/* Brick grids for floor 2 */}
                              <g stroke="#7F1D1D" strokeWidth="0.5" opacity="0.8">
                                {[158, 166, 174, 182, 190, 198, 206, 214, 222].map((y) => (
                                  <line key={y} x1="110" y1={y} x2="290" y2={y} />
                                ))}
                              </g>
                              {/* Industrial Balcony with Wrought Iron style */}
                              <rect x="115" y="215" width="170" height="25" fill="none" stroke="#111827" strokeWidth="2" />
                              {[125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275].map((x) => (
                                <line key={x} x1={x} y1="215" x2={x} y2="240" stroke="#111827" strokeWidth="1" />
                              ))}
                              {/* Upper Grid Windows */}
                              <rect x="135" y="170" width="30" height="35" fill="rgba(30, 41, 59, 0.4)" stroke="#1E293B" strokeWidth="2" />
                              <line x1="150" y1="170" x2="150" y2="205" stroke="#1E293B" />
                              <rect x="235" y="170" width="30" height="35" fill="rgba(30, 41, 59, 0.4)" stroke="#1E293B" strokeWidth="2" />
                              <line x1="250" y1="170" x2="250" y2="205" stroke="#1E293B" />
                            </g>
                          )}

                          {/* Third Floor (if 3 floors) */}
                          {appliedFloors >= 3 && (
                            <g>
                              <rect x="110" y="60" width="180" height="90" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
                              <g stroke="#7F1D1D" strokeWidth="0.5" opacity="0.8">
                                {[68, 76, 84, 92, 100, 108, 116, 124, 132, 140].map((y) => (
                                  <line key={y} x1="110" y1={y} x2="290" y2={y} />
                                ))}
                              </g>
                              {/* Top Windows */}
                              <rect x="135" y="80" width="30" height="35" fill="rgba(30, 41, 59, 0.4)" stroke="#1E293B" strokeWidth="2" />
                              <rect x="235" y="80" width="30" height="35" fill="rgba(30, 41, 59, 0.4)" stroke="#1E293B" strokeWidth="2" />
                            </g>
                          )}

                          {/* Dark Charcoal Mansard Slate Roof */}
                          <polygon 
                            points={`95,${appliedFloors === 1 ? 240 : appliedFloors === 2 ? 150 : 60} 120,${appliedFloors === 1 ? 210 : appliedFloors === 2 ? 120 : 30} 280,${appliedFloors === 1 ? 210 : appliedFloors === 2 ? 120 : 30} 305,${appliedFloors === 1 ? 240 : appliedFloors === 2 ? 150 : 60}`} 
                            fill="#1E293B" 
                            stroke="#0F172A" 
                            strokeWidth="2" 
                          />
                          
                          {/* Industrial metal bench */}
                          <rect x="140" y="320" width="20" height="6" fill="#1F2937" />
                          <line x1="142" y1="326" x2="142" y2="330" stroke="#1F2937" strokeWidth="2" />
                          <line x1="158" y1="326" x2="158" y2="330" stroke="#1F2937" strokeWidth="2" />
                        </g>
                      )}
                    </svg>
                  )}

                  {/* VIEW 2: INTERIOR (Furnished cross-section, showing couch, TV, beds, kitchen details) */}
                  {viewMode === 'furnished' && (
                    selectedInteriorRoom === 'all' ? (
                      <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible drop-shadow-[0_20px_45px_rgba(0,0,0,0.5)]">
                      {/* Structure backdrop grids */}
                      <polygon points="50,300 200,220 350,300 200,380" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />

                      {/* Style-specific back walls */}
                      <polygon 
                        points="80,290 200,230 200,340 80,390" 
                        fill={appliedStyle === 'brick' ? '#7F1D1D' : appliedStyle === 'eco' ? '#27272A' : '#1E293B'} 
                        stroke={appliedStyle === 'classic' ? '#D97706' : '#475569'} 
                      />
                      <polygon 
                        points="200,230 320,290 320,390 200,340" 
                        fill={appliedStyle === 'brick' ? '#991B1B' : appliedStyle === 'eco' ? '#18181B' : '#0F172A'} 
                        stroke={appliedStyle === 'classic' ? '#D97706' : '#475569'} 
                      />

                      {/* Brick Wall details for Brick style in interior cutaway */}
                      {appliedStyle === 'brick' && (
                        <g opacity="0.3" stroke="#FFF" strokeWidth="0.5">
                          <line x1="80" y1="310" x2="200" y2="250" />
                          <line x1="80" y1="340" x2="200" y2="280" />
                          <line x1="80" y1="370" x2="200" y2="310" />
                          <line x1="200" y1="260" x2="320" y2="320" />
                          <line x1="200" y1="290" x2="320" y2="350" />
                          <line x1="200" y1="320" x2="320" y2="380" />
                        </g>
                      )}

                      {/* Classic wallpaper lines for Classic Style */}
                      {appliedStyle === 'classic' && (
                        <g opacity="0.25" stroke="#FBBF24" strokeWidth="0.5">
                          <line x1="110" y1="275" x2="110" y2="375" />
                          <line x1="140" y1="260" x2="140" y2="360" />
                          <line x1="170" y1="245" x2="170" y2="345" />
                          <line x1="230" y1="245" x2="230" y2="345" />
                          <line x1="260" y1="260" x2="260" y2="360" />
                          <line x1="290" y1="275" x2="290" y2="375" />
                        </g>
                      )}

                      {/* GROUND FLOOR FURNISHINGS */}
                      {/* Living Room details on left side */}
                      <g id="living-room-furnished">
                        {/* Area Rug */}
                        <polygon 
                          points="100,340 150,315 170,325 120,350" 
                          fill={appliedStyle === 'modern' ? '#3B82F6' : appliedStyle === 'classic' ? '#991B1B' : appliedStyle === 'eco' ? '#059669' : '#D97706'} 
                          opacity="0.8" 
                        />
                        
                        {/* Style-specific Sofa */}
                        {appliedStyle === 'modern' && (
                          /* Sleek minimalist sofa */
                          <g fill="#F1F5F9" stroke="#94A3B8" strokeWidth="0.5">
                            <polygon points="105,335 140,318 148,323 113,340" />
                            <polygon points="105,335 113,340 113,343 105,338" />
                          </g>
                        )}
                        {appliedStyle === 'classic' && (
                          /* Velvet rolled-arm gold/red sofa */
                          <g fill="#B91C1C" stroke="#FBBF24" strokeWidth="1">
                            <polygon points="105,335 140,318 148,323 113,340" />
                            <circle cx="107" cy="336" r="3.5" fill="#FBBF24" />
                            <circle cx="142" cy="319" r="3.5" fill="#FBBF24" />
                          </g>
                        )}
                        {appliedStyle === 'eco' && (
                          /* Organic bamboo frame sofa */
                          <g fill="#059669" stroke="#78350F" strokeWidth="1">
                            <polygon points="105,335 140,318 148,323 113,340" />
                            <line x1="105" y1="335" x2="105" y2="341" stroke="#78350F" strokeWidth="1.5" />
                            <line x1="140" y1="318" x2="140" y2="324" stroke="#78350F" strokeWidth="1.5" />
                          </g>
                        )}
                        {appliedStyle === 'brick' && (
                          /* Brown chesterfield leather sofa */
                          <g fill="#78350F" stroke="#1E293B" strokeWidth="1">
                            <polygon points="105,335 140,318 148,323 113,340" />
                          </g>
                        )}

                        {/* Flat TV Unit on wall */}
                        <polygon points="175,275 195,265 195,295 175,305" fill="#020617" stroke="#94A3B8" strokeWidth="0.5" />
                        <polygon points="178,277 192,270 192,290 178,297" fill="#1E293B" />
                        
                        {/* Floor Lamp */}
                        <line x1="90" y1="335" x2="90" y2="280" stroke={appliedStyle === 'brick' ? '#4B5563' : '#FBBF24'} strokeWidth="2.5" />
                        <ellipse cx="90" cy="280" rx="8" ry="4" fill={appliedStyle === 'eco' ? '#10B981' : '#F59E0B'} />
                      </g>

                      {/* Kitchen layout on the right side */}
                      {appliedKitchens >= 1 && (
                        <g id="kitchen-furnished">
                          {/* Refrigerator */}
                          <polygon 
                            points="210,310 230,320 230,265 210,255" 
                            fill={appliedStyle === 'modern' ? '#E2E8F0' : appliedStyle === 'classic' ? '#78350F' : appliedStyle === 'eco' ? '#CBD5E1' : '#374151'} 
                            stroke="#475569" 
                            strokeWidth="1" 
                          />
                          
                          {/* Kitchen cabinet counter */}
                          <polygon 
                            points="240,325 300,355 300,325 240,295" 
                            fill={appliedStyle === 'classic' ? '#451A03' : appliedStyle === 'eco' ? '#065F46' : '#1F2937'} 
                            stroke="#64748B" 
                          />
                          <polygon points="240,295 300,325 300,320 240,290" fill={appliedStyle === 'modern' ? '#FFF' : '#334155'} /> {/* Countertop */}
                          
                          {/* Stove burners */}
                          <ellipse cx="260" cy="309" rx="4" ry="2" fill="#000" />
                          <ellipse cx="280" cy="319" rx="4" ry="2" fill="#000" />
                        </g>
                      )}

                      {/* FIRST FLOOR FURNISHINGS (Drawn if floors >= 2) */}
                      {appliedFloors >= 2 && (
                        <g id="first-floor-furnished">
                          {/* Floor divider slab */}
                          <polygon points="80,200 200,140 320,200 200,260" fill="rgba(255,255,255,0.06)" stroke={themeColors.trim} strokeWidth="1.5" />
                          {/* Back walls */}
                          <polygon 
                            points="80,200 200,140 200,230 80,290" 
                            fill={appliedStyle === 'brick' ? '#7F1D1D' : appliedStyle === 'eco' ? '#27272A' : '#1E293B'} 
                            stroke="#475569" 
                          />
                          <polygon 
                            points="200,140 320,200 320,290 200,230" 
                            fill={appliedStyle === 'brick' ? '#991B1B' : appliedStyle === 'eco' ? '#18181B' : '#0F172A'} 
                            stroke="#475569" 
                          />

                          {/* Master Bedroom Setup (drawn if bedrooms count >= 1) */}
                          {appliedBedrooms >= 1 && (
                            <g id="master-bed">
                              {/* Wood / Metal headboard frame */}
                              <polygon 
                                points="220,230 280,200 300,210 240,240" 
                                fill={appliedStyle === 'modern' ? '#1E293B' : appliedStyle === 'classic' ? '#78350F' : appliedStyle === 'eco' ? '#14532D' : '#111827'} 
                              />
                              {/* Mattress & white sheets */}
                              <polygon points="225,227 278,201 295,209 242,235" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.5" />
                              
                              {/* Pillows */}
                              <polygon points="268,203 280,197 288,201 276,207" fill="#E2E8F0" />
                              <polygon points="256,209 268,203 276,207 264,213" fill="#E2E8F0" />
                              
                              {/* Style-specific Double blanket */}
                              <polygon 
                                points="225,227 252,213 262,218 235,232" 
                                fill={appliedStyle === 'modern' ? '#3B82F6' : appliedStyle === 'classic' ? '#DC2626' : appliedStyle === 'eco' ? '#10B981' : '#6B7280'} 
                              />
                            </g>
                          )}

                          {/* Wardrobe closet unit */}
                          <g id="closet">
                            <polygon 
                              points="95,230 120,218 120,165 95,177" 
                              fill={appliedStyle === 'classic' ? '#451A03' : appliedStyle === 'eco' ? '#064E3B' : '#334155'} 
                              stroke={themeColors.trim} 
                              strokeWidth="1" 
                            />
                            <line x1="107.5" y1="223" x2="107.5" y2="173" stroke="#FFF" strokeWidth="1" opacity="0.3" />
                          </g>
                        </g>
                      )}

                      {/* SECOND FLOOR FURNISHINGS (Drawn if floors >= 3) */}
                      {appliedFloors >= 3 && (
                        <g id="second-floor-furnished">
                          {/* Floor divider slab */}
                          <polygon points="80,105 200,45 320,105 200,165" fill="rgba(255,255,255,0.06)" stroke={themeColors.trim} strokeWidth="1.5" />
                          {/* Back walls */}
                          <polygon 
                            points="80,105 200,45 200,140 80,200" 
                            fill={appliedStyle === 'brick' ? '#7F1D1D' : appliedStyle === 'eco' ? '#27272A' : '#1E293B'} 
                            stroke="#475569" 
                          />
                          <polygon 
                            points="200,45 320,105 320,200 200,140" 
                            fill={appliedStyle === 'brick' ? '#991B1B' : appliedStyle === 'eco' ? '#18181B' : '#0F172A'} 
                            stroke="#475569" 
                          />

                          {/* Study / Work Desk Setup */}
                          <g id="study-desk">
                            <polygon 
                              points="120,135 160,115 180,125 140,145" 
                              fill={appliedStyle === 'classic' ? '#78350F' : '#334155'} 
                              stroke="#000" 
                              strokeWidth="0.5" 
                            />
                            <line x1="120" y1="135" x2="120" y2="155" stroke="#000" strokeWidth="1.5" />
                            <line x1="140" y1="145" x2="140" y2="165" stroke="#000" strokeWidth="1.5" />
                            <line x1="180" y1="125" x2="180" y2="145" stroke="#000" strokeWidth="1.5" />
                            
                            {/* Computer/Laptop screen */}
                            <polygon points="142,130 157,122 162,124 147,132" fill="#E2E8F0" />
                            <line x1="157" y1="122" x2="157" y2="114" stroke="#FFF" strokeWidth="1" />
                          </g>
                        </g>
                      )}
                      </svg>
                    ) : (
                      /* High-Fidelity Room AI Render Showcase */
                      <div className="w-full h-full absolute inset-0 z-0 flex items-center justify-center">
                        <img
                          src={AI_RENDER_ASSETS[selectedInteriorRoom]?.[appliedStyle]?.urls[selectedInteriorAngle] || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'}
                          alt="AI Room Design"
                          className="w-full h-full object-cover rounded-3xl select-none"
                        />

                        {/* Pulsing Hotspots Layer */}
                        {(AI_RENDER_ASSETS[selectedInteriorRoom]?.[appliedStyle]?.hotspots || []).map((hs, idx) => (
                          <div
                            key={idx}
                            className="absolute"
                            style={{ left: hs.x, top: hs.y }}
                          >
                            <button
                              onMouseEnter={() => setActiveInteriorHotspot(idx)}
                              onMouseLeave={() => setActiveInteriorHotspot(null)}
                              onClick={() => setActiveInteriorHotspot(activeInteriorHotspot === idx ? null : idx)}
                              className="w-6 h-6 bg-[#FF6B00] hover:bg-[#FF8F3D] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg border border-white/50 cursor-pointer transition-all hover:scale-110 active:scale-95 focus:outline-none"
                            >
                              +
                            </button>

                            {/* Hotspot details tooltip card */}
                            {activeInteriorHotspot === idx && (
                              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-60 bg-slate-950/95 backdrop-blur-md border border-white/15 p-3 rounded-2xl shadow-2xl z-30 text-left pointer-events-none animate-fade-in space-y-1">
                                <h5 className="font-bold text-[#FF8F3D] flex items-center gap-1.5 text-[10px]">
                                  <Info className="w-3.5 h-3.5" />
                                  {hs.title}
                                </h5>
                                <p className="text-white/80 text-[9px] leading-relaxed">{hs.description}</p>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Perspective angle switches overlay */}
                        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 gap-1.5 z-10">
                          <span className="text-[9px] text-white/50 font-semibold uppercase tracking-wider mr-1">Angles</span>
                          {[0, 1, 2].map((angleIndex) => (
                            <button
                              key={angleIndex}
                              onClick={() => {
                                setSelectedInteriorAngle(angleIndex);
                                setActiveInteriorHotspot(null);
                              }}
                              className={`p-1 rounded-lg text-[10px] transition-colors flex items-center justify-center gap-0.5 cursor-pointer ${
                                selectedInteriorAngle === angleIndex
                                  ? 'bg-[#FF6B00] text-white'
                                  : 'text-white/60 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <Camera className="w-3 h-3" />
                              <span className="text-[9px]">{angleIndex + 1}</span>
                            </button>
                          ))}
                        </div>

                        {/* Interactive prompt message */}
                        <div className="absolute top-16 left-4 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] text-white/70 border border-white/5 z-10">
                          Hover <span className="text-[#FF8F3D] font-bold">+</span> for specifications
                        </div>
                      </div>
                    )
                  )}

                  {/* VIEW 3: TOP VIEW (Top-down blueprint, showing furnished space division outline) */}
                  {viewMode === 'top' && (
                    <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible drop-shadow-[0_20px_45px_rgba(0,0,0,0.5)]">
                      {/* Outer Wall Boundary */}
                      <rect x="50" y="50" width="300" height="300" fill="#0F172A" stroke={themeColors.trim} strokeWidth="3" rx="8" />

                      {/* Internal Room Partitions */}
                      <line x1="200" y1="50" x2="200" y2="350" stroke="#334155" strokeWidth="3" />
                      <line x1="50" y1="200" x2="200" y2="200" stroke="#334155" strokeWidth="3" />
                      <line x1="200" y1="180" x2="350" y2="180" stroke="#334155" strokeWidth="3" />

                      {/* Room Name Labels */}
                      <text x="125" y="90" fill="#FFF" fontSize="12" fontWeight="bold" textAnchor="middle">Living Room</text>
                      <text x="125" y="105" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">Studio Lounge</text>
                      
                      <text x="275" y="90" fill="#FFF" fontSize="12" fontWeight="bold" textAnchor="middle">Master Suite</text>
                      <text x="275" y="105" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">{appliedBedrooms} Bedrooms Config</text>

                      <text x="125" y="240" fill="#FFF" fontSize="12" fontWeight="bold" textAnchor="middle">Guest Bed / Bath</text>
                      
                      <text x="275" y="240" fill="#FFF" fontSize="12" fontWeight="bold" textAnchor="middle">Kitchen & Diner</text>
                      <text x="275" y="255" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">{appliedKitchens} Modular Setup</text>

                      {/* Furniture layouts shaped/colored based on style */}
                      {/* Living Room Sectional Couch */}
                      <g stroke={appliedStyle === 'modern' ? '#38BDF8' : appliedStyle === 'classic' ? '#DC2626' : appliedStyle === 'eco' ? '#10B981' : '#F59E0B'} strokeWidth="1.5" fill="none">
                        <rect x="70" y="125" width="100" height="22" rx="3" />
                        <line x1="100" y1="125" x2="100" y2="147" />
                        <line x1="140" y1="125" x2="140" y2="147" />
                        {/* Coffee table */}
                        <rect x="100" y="160" width="40" height="15" rx="1" stroke="#FFF" opacity="0.3" />
                      </g>

                      {/* Master Suite Bed */}
                      <g stroke={appliedStyle === 'classic' ? '#DC2626' : '#60A5FA'} strokeWidth="1.5" fill="none">
                        <rect x="240" y="120" width="70" height="48" rx="2" />
                        {/* Pillows */}
                        <rect x="245" y="125" width="15" height="12" rx="1" />
                        <rect x="245" y="150" width="15" height="12" rx="1" />
                        {/* Blanket line */}
                        <line x1="275" y1="120" x2="275" y2="168" stroke="#FFF" opacity="0.4" />
                      </g>

                      {/* Kitchen Dining table */}
                      <g stroke={appliedStyle === 'eco' ? '#10B981' : '#34D399'} strokeWidth="1.5" fill="none">
                        <circle cx="275" cy="300" r="14" />
                        <circle cx="275" cy="280" r="3" fill="#34D399" />
                        <circle cx="275" cy="320" r="3" fill="#34D399" />
                        <circle cx="255" cy="300" r="3" fill="#34D399" />
                        <circle cx="295" cy="300" r="3" fill="#34D399" />
                      </g>
                    </svg>
                  )}

                </div>
              </div>

              {/* HUD */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 z-10">
                <span className="text-white/60 text-[10px] uppercase font-semibold">Rendered Design</span>
                <span className="text-white text-xs font-bold capitalize">
                  {appliedStyle} Facade • {appliedFloors} Floors ({appliedRooms} Rooms)
                </span>
              </div>
            </div>

            {/* Dynamic Materials Weight List */}
            <div className="glass rounded-3xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#FF6B00]" />
                Estimated Materials Weight & Count
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                  <p className="text-white/40 text-[10px] uppercase font-semibold">OPC Cement</p>
                  <p className="text-lg font-bold text-white mt-1">₹{cementCost.toLocaleString()}</p>
                  <p className="text-[#FF8F3D] text-xs font-bold">~{Math.round(cementCost / 420)} bags</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                  <p className="text-white/40 text-[10px] uppercase font-semibold">Steel Rebars</p>
                  <p className="text-lg font-bold text-white mt-1">₹{steelCost.toLocaleString()}</p>
                  <p className="text-[#FF8F3D] text-xs font-bold">~{Math.round(steelCost / 68)} kg</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                  <p className="text-white/40 text-[10px] uppercase font-semibold">Red Bricks</p>
                  <p className="text-lg font-bold text-white mt-1">₹{bricksCost.toLocaleString()}</p>
                  <p className="text-[#FF8F3D] text-xs font-bold">~{Math.round(bricksCost / 9)} pcs</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                  <p className="text-white/40 text-[10px] uppercase font-semibold">Sand / Coarse</p>
                  <p className="text-lg font-bold text-white mt-1">₹{sandCost.toLocaleString()}</p>
                  <p className="text-[#FF8F3D] text-xs font-bold">~{Math.round(sandCost / 55)} cu.ft</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
