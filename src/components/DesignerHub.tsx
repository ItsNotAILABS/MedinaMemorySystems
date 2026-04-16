'use client';

import React, { useState, useEffect } from 'react';

// 𓂀 DESIGNER HUB 𓂀
// Manufacturer catalog, project intelligence, CEU tracker, and design team presets
// "Designer Hub with manufacturer catalog, project intelligence, CEU tracker, and design team presets"

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface Manufacturer {
  id: string;
  name: string;
  category: ManufacturerCategory;
  products: number;
  ceuCredits: number;
  rating: number;
  logo: string;
  featured: boolean;
  specSheets: number;
  cadFiles: number;
  revitFamilies: number;
}

type ManufacturerCategory = 
  | 'furniture'
  | 'lighting'
  | 'flooring'
  | 'textiles'
  | 'finishes'
  | 'plumbing'
  | 'hardware'
  | 'acoustics'
  | 'technology';

interface Project {
  id: string;
  name: string;
  client: string;
  type: ProjectType;
  status: ProjectStatus;
  intelligence: ProjectIntelligence;
  team: TeamMember[];
  deadline: string;
  budget: number;
  progress: number;
}

type ProjectType = 'residential' | 'commercial' | 'hospitality' | 'healthcare' | 'education' | 'retail';
type ProjectStatus = 'concept' | 'schematic' | 'development' | 'documentation' | 'construction' | 'complete';

interface ProjectIntelligence {
  specificationHealth: number;
  scheduleRisk: number;
  budgetVariance: number;
  changeOrderRisk: number;
  clientSatisfaction: number;
  recommendations: string[];
}

interface TeamMember {
  id: string;
  name: string;
  role: DesignerRole;
  avatar: string;
  ceuCredits: number;
  projects: number;
}

type DesignerRole = 'principal' | 'senior' | 'designer' | 'junior' | 'intern';

interface CEUCourse {
  id: string;
  title: string;
  provider: string;
  credits: number;
  duration: string;
  category: CEUCategory;
  completed: boolean;
  dueDate?: string;
}

type CEUCategory = 'health-safety' | 'sustainability' | 'barrier-free' | 'codes' | 'professional-practice';

interface DesignPreset {
  id: string;
  name: string;
  category: string;
  items: PresetItem[];
  createdBy: string;
  usageCount: number;
}

interface PresetItem {
  productId: string;
  productName: string;
  manufacturer: string;
  quantity: number;
}

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const MOCK_MANUFACTURERS: Manufacturer[] = [
  { id: 'm1', name: 'Herman Miller', category: 'furniture', products: 1250, ceuCredits: 12, rating: 4.9, logo: '🪑', featured: true, specSheets: 890, cadFiles: 450, revitFamilies: 320 },
  { id: 'm2', name: 'Knoll', category: 'furniture', products: 980, ceuCredits: 8, rating: 4.8, logo: '🛋️', featured: true, specSheets: 720, cadFiles: 380, revitFamilies: 280 },
  { id: 'm3', name: 'Artemide', category: 'lighting', products: 560, ceuCredits: 6, rating: 4.7, logo: '💡', featured: true, specSheets: 420, cadFiles: 280, revitFamilies: 190 },
  { id: 'm4', name: 'Interface', category: 'flooring', products: 340, ceuCredits: 10, rating: 4.8, logo: '🔲', featured: true, specSheets: 280, cadFiles: 150, revitFamilies: 120 },
  { id: 'm5', name: 'Maharam', category: 'textiles', products: 890, ceuCredits: 4, rating: 4.6, logo: '🧵', featured: false, specSheets: 620, cadFiles: 80, revitFamilies: 45 },
  { id: 'm6', name: 'Benjamin Moore', category: 'finishes', products: 4200, ceuCredits: 5, rating: 4.5, logo: '🎨', featured: false, specSheets: 1800, cadFiles: 20, revitFamilies: 15 },
  { id: 'm7', name: 'Kohler', category: 'plumbing', products: 2100, ceuCredits: 7, rating: 4.7, logo: '🚿', featured: true, specSheets: 1650, cadFiles: 890, revitFamilies: 720 },
  { id: 'm8', name: 'Crestron', category: 'technology', products: 450, ceuCredits: 9, rating: 4.6, logo: '📺', featured: false, specSheets: 380, cadFiles: 240, revitFamilies: 180 },
];

const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Skyline Tower Penthouse',
    client: 'Private Client',
    type: 'residential',
    status: 'development',
    intelligence: {
      specificationHealth: 87,
      scheduleRisk: 15,
      budgetVariance: -2.3,
      changeOrderRisk: 22,
      clientSatisfaction: 94,
      recommendations: ['Review lighting specs', 'Confirm custom millwork lead times'],
    },
    team: [],
    deadline: '2024-08-15',
    budget: 2500000,
    progress: 65,
  },
  {
    id: 'p2',
    name: 'Meridian Hotel Lobby',
    client: 'Meridian Hospitality Group',
    type: 'hospitality',
    status: 'schematic',
    intelligence: {
      specificationHealth: 72,
      scheduleRisk: 35,
      budgetVariance: 5.8,
      changeOrderRisk: 45,
      clientSatisfaction: 82,
      recommendations: ['Update FF&E schedule', 'Review acoustic treatments', 'Confirm brand standards compliance'],
    },
    team: [],
    deadline: '2024-12-01',
    budget: 8500000,
    progress: 28,
  },
  {
    id: 'p3',
    name: 'TechCorp HQ Workplace',
    client: 'TechCorp Inc.',
    type: 'commercial',
    status: 'documentation',
    intelligence: {
      specificationHealth: 94,
      scheduleRisk: 8,
      budgetVariance: -0.5,
      changeOrderRisk: 12,
      clientSatisfaction: 98,
      recommendations: ['Finalize wayfinding package'],
    },
    team: [],
    deadline: '2024-06-30',
    budget: 4200000,
    progress: 88,
  },
];

const MOCK_CEU_COURSES: CEUCourse[] = [
  { id: 'c1', title: 'Biophilic Design Principles', provider: 'Herman Miller', credits: 1.5, duration: '1.5 hrs', category: 'health-safety', completed: true },
  { id: 'c2', title: 'Sustainable Material Selection', provider: 'Interface', credits: 2.0, duration: '2 hrs', category: 'sustainability', completed: true },
  { id: 'c3', title: 'ADA Compliance Updates 2024', provider: 'IDCEC', credits: 1.0, duration: '1 hr', category: 'barrier-free', completed: false, dueDate: '2024-05-15' },
  { id: 'c4', title: 'Fire & Life Safety Codes', provider: 'NFPA', credits: 2.0, duration: '2 hrs', category: 'codes', completed: false, dueDate: '2024-06-01' },
  { id: 'c5', title: 'Ethics in Design Practice', provider: 'ASID', credits: 1.0, duration: '1 hr', category: 'professional-practice', completed: true },
];

const MOCK_PRESETS: DesignPreset[] = [
  { id: 'pr1', name: 'Executive Office Standard', category: 'office', items: [], createdBy: 'Sarah Chen', usageCount: 45 },
  { id: 'pr2', name: 'Open Workspace Module', category: 'office', items: [], createdBy: 'Marcus Johnson', usageCount: 78 },
  { id: 'pr3', name: 'Hospitality Suite Package', category: 'hospitality', items: [], createdBy: 'Elena Rodriguez', usageCount: 23 },
  { id: 'pr4', name: 'Healthcare Patient Room', category: 'healthcare', items: [], createdBy: 'David Kim', usageCount: 34 },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

type TabId = 'catalog' | 'projects' | 'ceu' | 'presets' | 'team';

export default function DesignerHub() {
  const [activeTab, setActiveTab] = useState<TabId>('catalog');
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>(MOCK_MANUFACTURERS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [ceuCourses, setCeuCourses] = useState<CEUCourse[]>(MOCK_CEU_COURSES);
  const [presets, setPresets] = useState<DesignPreset[]>(MOCK_PRESETS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Calculate CEU progress
  const ceuProgress = {
    earned: ceuCourses.filter(c => c.completed).reduce((sum, c) => sum + c.credits, 0),
    required: 10,
    categories: {
      'health-safety': ceuCourses.filter(c => c.completed && c.category === 'health-safety').reduce((sum, c) => sum + c.credits, 0),
      'sustainability': ceuCourses.filter(c => c.completed && c.category === 'sustainability').reduce((sum, c) => sum + c.credits, 0),
    },
  };

  const filteredManufacturers = manufacturers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative w-full h-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Glassmorphism Container */}
      <div className="absolute inset-4 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">✏️</span>
                DESIGNER HUB
              </h1>
              <p className="text-white/60 mt-1">Manufacturer Catalog × Project Intelligence × CEU Tracker × Team Presets</p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center px-4 py-2 rounded-lg bg-white/5">
                <div className="text-2xl font-mono text-amber-400">{manufacturers.length}</div>
                <div className="text-xs text-white/50">MANUFACTURERS</div>
              </div>
              <div className="text-center px-4 py-2 rounded-lg bg-white/5">
                <div className="text-2xl font-mono text-emerald-400">{projects.length}</div>
                <div className="text-xs text-white/50">ACTIVE PROJECTS</div>
              </div>
              <div className="text-center px-4 py-2 rounded-lg bg-white/5">
                <div className="text-2xl font-mono text-purple-400">{ceuProgress.earned}/{ceuProgress.required}</div>
                <div className="text-xs text-white/50">CEU CREDITS</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6">
            {[
              { id: 'catalog', label: 'Manufacturer Catalog', icon: '📦' },
              { id: 'projects', label: 'Project Intelligence', icon: '📊' },
              { id: 'ceu', label: 'CEU Tracker', icon: '🎓' },
              { id: 'presets', label: 'Design Presets', icon: '⚡' },
              { id: 'team', label: 'Team Management', icon: '👥' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-220px)]">
          {/* MANUFACTURER CATALOG TAB */}
          {activeTab === 'catalog' && (
            <div>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search manufacturers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="furniture">Furniture</option>
                  <option value="lighting">Lighting</option>
                  <option value="flooring">Flooring</option>
                  <option value="textiles">Textiles</option>
                  <option value="finishes">Finishes</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="technology">Technology</option>
                </select>
              </div>

              {/* Manufacturer Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredManufacturers.map(manufacturer => (
                  <div
                    key={manufacturer.id}
                    className="p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{manufacturer.logo}</span>
                      <div>
                        <h3 className="text-white font-semibold">{manufacturer.name}</h3>
                        <p className="text-white/50 text-sm capitalize">{manufacturer.category}</p>
                      </div>
                      {manufacturer.featured && (
                        <span className="ml-auto px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs">Featured</span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center text-xs mt-4">
                      <div className="p-2 rounded-lg bg-white/5">
                        <div className="text-white font-semibold">{manufacturer.products}</div>
                        <div className="text-white/50">Products</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5">
                        <div className="text-white font-semibold">{manufacturer.specSheets}</div>
                        <div className="text-white/50">Specs</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5">
                        <div className="text-white font-semibold">{manufacturer.revitFamilies}</div>
                        <div className="text-white/50">Revit</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400">★</span>
                        <span className="text-white/80">{manufacturer.rating}</span>
                      </div>
                      <div className="text-emerald-400 text-sm">{manufacturer.ceuCredits} CEU Available</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECT INTELLIGENCE TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              {projects.map(project => (
                <div
                  key={project.id}
                  className="p-6 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                      <p className="text-white/50">{project.client} • {project.type.charAt(0).toUpperCase() + project.type.slice(1)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        project.status === 'complete' ? 'bg-emerald-500/20 text-emerald-400' :
                        project.status === 'documentation' ? 'bg-blue-500/20 text-blue-400' :
                        project.status === 'development' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-white/10 text-white/60'
                      }`}>
                        {project.status.toUpperCase()}
                      </span>
                      <p className="text-white/50 text-sm mt-1">Due: {new Date(project.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Progress</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Intelligence Metrics */}
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <div className={`text-xl font-semibold ${project.intelligence.specificationHealth >= 80 ? 'text-emerald-400' : project.intelligence.specificationHealth >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                        {project.intelligence.specificationHealth}%
                      </div>
                      <div className="text-white/50 text-xs">Spec Health</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <div className={`text-xl font-semibold ${project.intelligence.scheduleRisk <= 20 ? 'text-emerald-400' : project.intelligence.scheduleRisk <= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                        {project.intelligence.scheduleRisk}%
                      </div>
                      <div className="text-white/50 text-xs">Schedule Risk</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <div className={`text-xl font-semibold ${project.intelligence.budgetVariance <= 0 ? 'text-emerald-400' : project.intelligence.budgetVariance <= 5 ? 'text-amber-400' : 'text-red-400'}`}>
                        {project.intelligence.budgetVariance > 0 ? '+' : ''}{project.intelligence.budgetVariance}%
                      </div>
                      <div className="text-white/50 text-xs">Budget Var</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <div className={`text-xl font-semibold ${project.intelligence.changeOrderRisk <= 20 ? 'text-emerald-400' : project.intelligence.changeOrderRisk <= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                        {project.intelligence.changeOrderRisk}%
                      </div>
                      <div className="text-white/50 text-xs">CO Risk</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <div className={`text-xl font-semibold ${project.intelligence.clientSatisfaction >= 90 ? 'text-emerald-400' : project.intelligence.clientSatisfaction >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                        {project.intelligence.clientSatisfaction}%
                      </div>
                      <div className="text-white/50 text-xs">Client Sat</div>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  {project.intelligence.recommendations.length > 0 && (
                    <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <h4 className="text-purple-400 text-sm font-semibold mb-2">🤖 AI Recommendations</h4>
                      <ul className="space-y-1">
                        {project.intelligence.recommendations.map((rec, i) => (
                          <li key={i} className="text-white/70 text-sm flex items-center gap-2">
                            <span className="text-purple-400">→</span> {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CEU TRACKER TAB */}
          {activeTab === 'ceu' && (
            <div>
              {/* CEU Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-6 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10">
                  <h3 className="text-white/60 text-sm mb-2">Total CEU Progress</h3>
                  <div className="text-4xl font-bold text-white mb-2">{ceuProgress.earned} / {ceuProgress.required}</div>
                  <div className="h-3 rounded-full bg-white/10">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      style={{ width: `${(ceuProgress.earned / ceuProgress.required) * 100}%` }}
                    />
                  </div>
                  <p className="text-white/50 text-sm mt-2">{ceuProgress.required - ceuProgress.earned} credits remaining this cycle</p>
                </div>
                
                <div className="p-6 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10">
                  <h3 className="text-white/60 text-sm mb-2">Courses Completed</h3>
                  <div className="text-4xl font-bold text-emerald-400">{ceuCourses.filter(c => c.completed).length}</div>
                  <p className="text-white/50 text-sm mt-2">out of {ceuCourses.length} enrolled</p>
                </div>
                
                <div className="p-6 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10">
                  <h3 className="text-white/60 text-sm mb-2">Upcoming Deadlines</h3>
                  <div className="text-4xl font-bold text-amber-400">{ceuCourses.filter(c => !c.completed && c.dueDate).length}</div>
                  <p className="text-white/50 text-sm mt-2">courses with due dates</p>
                </div>
              </div>

              {/* Course List */}
              <h3 className="text-white font-semibold mb-4">CEU Courses</h3>
              <div className="space-y-3">
                {ceuCourses.map(course => (
                  <div
                    key={course.id}
                    className={`p-4 rounded-xl backdrop-blur-xl border transition-all ${
                      course.completed 
                        ? 'bg-emerald-500/5 border-emerald-500/20' 
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          course.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'
                        }`}>
                          {course.completed ? '✓' : '○'}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{course.title}</h4>
                          <p className="text-white/50 text-sm">{course.provider} • {course.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">{course.credits} CEU</div>
                        <div className={`text-sm ${
                          course.completed ? 'text-emerald-400' : 
                          course.dueDate ? 'text-amber-400' : 'text-white/50'
                        }`}>
                          {course.completed ? 'Completed' : course.dueDate ? `Due: ${new Date(course.dueDate).toLocaleDateString()}` : 'Not Started'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DESIGN PRESETS TAB */}
          {activeTab === 'presets' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold">Design Team Presets</h3>
                <button className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all">
                  + Create Preset
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {presets.map(preset => (
                  <div
                    key={preset.id}
                    className="p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold">{preset.name}</h4>
                        <p className="text-white/50 text-sm capitalize">{preset.category}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                        {preset.usageCount} uses
                      </span>
                    </div>
                    <div className="text-white/60 text-sm">
                      Created by {preset.createdBy}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 px-3 py-1 rounded-lg bg-white/10 text-white/80 text-sm hover:bg-white/20 transition-all">
                        View
                      </button>
                      <button className="flex-1 px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-sm hover:bg-purple-500/30 transition-all">
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEAM MANAGEMENT TAB */}
          {activeTab === 'team' && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">👥</span>
              <h3 className="text-white text-xl font-semibold mb-2">Team Management</h3>
              <p className="text-white/50">Manage your design team, roles, and permissions</p>
              <p className="text-white/30 text-sm mt-4">Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
