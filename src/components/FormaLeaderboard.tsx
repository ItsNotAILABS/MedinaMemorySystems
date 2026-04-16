'use client';

import React, { useState, useEffect } from 'react';

// 𓂀 FORMA LEADERBOARD 𓂀
// Gamified achievement system with PHI-scaled rankings
// "FORMA Leaderboard"

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const PHI = 1.6180339887498948482;
const HEARTBEAT_MS = 873;

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  tier: FormatTier;
  score: number;
  resonanceLevel: number;
  kernelsCreated: number;
  documentsRead: number;
  collaborations: number;
  streakDays: number;
  badges: Badge[];
  joinedAt: string;
  lastActive: string;
}

type FormatTier = 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Initiate';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'legendary' | 'epic' | 'rare' | 'uncommon' | 'common';
  earnedAt: string;
}

interface LeaderboardCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
}

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const TIERS: { tier: FormatTier; minScore: number; color: string; icon: string }[] = [
  { tier: 'Diamond', minScore: 100000, color: '#b9f2ff', icon: '💎' },
  { tier: 'Platinum', minScore: 50000, color: '#e5e4e2', icon: '🏆' },
  { tier: 'Gold', minScore: 25000, color: '#ffd700', icon: '🥇' },
  { tier: 'Silver', minScore: 10000, color: '#c0c0c0', icon: '🥈' },
  { tier: 'Bronze', minScore: 5000, color: '#cd7f32', icon: '🥉' },
  { tier: 'Initiate', minScore: 0, color: '#8b8b8b', icon: '🌱' },
];

const CATEGORIES: LeaderboardCategory[] = [
  { id: 'overall', name: 'Overall', icon: '🏅', description: 'Combined score across all metrics' },
  { id: 'resonance', name: 'Resonance Masters', icon: '🔮', description: 'Highest cross-organism resonance' },
  { id: 'kernels', name: 'Kernel Architects', icon: '💫', description: 'Most kernels created' },
  { id: 'readers', name: 'Doctrine Scholars', icon: '📚', description: 'Most documents read' },
  { id: 'collaborators', name: 'Network Weavers', icon: '🕸️', description: 'Most collaborations' },
  { id: 'streak', name: 'Eternal Flame', icon: '🔥', description: 'Longest active streak' },
];

const BADGES: Badge[] = [
  { id: 'b1', name: 'First Kernel', icon: '⚡', description: 'Created your first kernel', rarity: 'common', earnedAt: '2024-01-15' },
  { id: 'b2', name: 'PHI Master', icon: 'φ', description: 'Achieved golden ratio resonance', rarity: 'legendary', earnedAt: '2024-02-20' },
  { id: 'b3', name: '100 Day Streak', icon: '🔥', description: 'Active for 100 consecutive days', rarity: 'epic', earnedAt: '2024-03-01' },
  { id: 'b4', name: 'Team Resonator', icon: '🎵', description: 'Participated in 50 team resonances', rarity: 'rare', earnedAt: '2024-03-15' },
  { id: 'b5', name: 'Document Oracle', icon: '📖', description: 'Read 1000 documents', rarity: 'epic', earnedAt: '2024-04-01' },
];

const MOCK_LEADERS: LeaderboardEntry[] = [
  { id: 'u1', name: 'Sarah Chen', avatar: '👩‍💻', rank: 1, tier: 'Diamond', score: 156789, resonanceLevel: 0.98, kernelsCreated: 892, documentsRead: 4521, collaborations: 234, streakDays: 156, badges: BADGES.slice(0, 5), joinedAt: '2023-06-15', lastActive: '2024-04-10' },
  { id: 'u2', name: 'Marcus Johnson', avatar: '👨‍🔬', rank: 2, tier: 'Diamond', score: 134567, resonanceLevel: 0.95, kernelsCreated: 756, documentsRead: 3892, collaborations: 198, streakDays: 134, badges: BADGES.slice(0, 4), joinedAt: '2023-07-20', lastActive: '2024-04-10' },
  { id: 'u3', name: 'Elena Rodriguez', avatar: '👩‍🎨', rank: 3, tier: 'Platinum', score: 98234, resonanceLevel: 0.91, kernelsCreated: 523, documentsRead: 3245, collaborations: 167, streakDays: 98, badges: BADGES.slice(0, 3), joinedAt: '2023-08-05', lastActive: '2024-04-09' },
  { id: 'u4', name: 'David Kim', avatar: '👨‍💼', rank: 4, tier: 'Platinum', score: 87654, resonanceLevel: 0.88, kernelsCreated: 445, documentsRead: 2987, collaborations: 145, streakDays: 87, badges: BADGES.slice(0, 3), joinedAt: '2023-08-15', lastActive: '2024-04-10' },
  { id: 'u5', name: 'Aisha Patel', avatar: '👩‍🚀', rank: 5, tier: 'Gold', score: 65432, resonanceLevel: 0.82, kernelsCreated: 312, documentsRead: 2345, collaborations: 98, streakDays: 65, badges: BADGES.slice(0, 2), joinedAt: '2023-09-01', lastActive: '2024-04-08' },
  { id: 'u6', name: 'James Wright', avatar: '👨‍🎓', rank: 6, tier: 'Gold', score: 54321, resonanceLevel: 0.78, kernelsCreated: 267, documentsRead: 1987, collaborations: 78, streakDays: 54, badges: BADGES.slice(0, 2), joinedAt: '2023-09-15', lastActive: '2024-04-10' },
  { id: 'u7', name: 'Maria Santos', avatar: '👩‍🔬', rank: 7, tier: 'Gold', score: 43210, resonanceLevel: 0.74, kernelsCreated: 198, documentsRead: 1654, collaborations: 67, streakDays: 43, badges: BADGES.slice(0, 2), joinedAt: '2023-10-01', lastActive: '2024-04-07' },
  { id: 'u8', name: 'Alex Thompson', avatar: '🧑‍💻', rank: 8, tier: 'Silver', score: 32109, resonanceLevel: 0.69, kernelsCreated: 145, documentsRead: 1234, collaborations: 45, streakDays: 32, badges: BADGES.slice(0, 1), joinedAt: '2023-10-15', lastActive: '2024-04-09' },
  { id: 'u9', name: 'Yuki Tanaka', avatar: '👩‍💻', rank: 9, tier: 'Silver', score: 21098, resonanceLevel: 0.64, kernelsCreated: 98, documentsRead: 987, collaborations: 34, streakDays: 21, badges: BADGES.slice(0, 1), joinedAt: '2023-11-01', lastActive: '2024-04-10' },
  { id: 'u10', name: 'Omar Hassan', avatar: '👨‍🔬', rank: 10, tier: 'Silver', score: 15432, resonanceLevel: 0.58, kernelsCreated: 76, documentsRead: 765, collaborations: 23, streakDays: 15, badges: [], joinedAt: '2023-11-15', lastActive: '2024-04-06' },
];

const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', name: 'First Steps', description: 'Create your first kernel', icon: '🌟', progress: 1, target: 1, reward: 100, completed: true },
  { id: 'a2', name: 'Kernel Creator', description: 'Create 100 kernels', icon: '💫', progress: 67, target: 100, reward: 1000, completed: false },
  { id: 'a3', name: 'Avid Reader', description: 'Read 500 documents', icon: '📚', progress: 345, target: 500, reward: 500, completed: false },
  { id: 'a4', name: 'Team Player', description: 'Collaborate with 50 users', icon: '🤝', progress: 23, target: 50, reward: 750, completed: false },
  { id: 'a5', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', progress: 7, target: 7, reward: 200, completed: true },
  { id: 'a6', name: 'Month Master', description: 'Maintain a 30-day streak', icon: '🏆', progress: 21, target: 30, reward: 1500, completed: false },
  { id: 'a7', name: 'Resonance Initiate', description: 'Achieve 0.5 resonance level', icon: '🔮', progress: 0.64, target: 0.5, reward: 300, completed: true },
  { id: 'a8', name: 'PHI Aligned', description: 'Achieve 0.618 resonance level', icon: 'φ', progress: 0.64, target: 0.618, reward: 1000, completed: true },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function FormaLeaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>(MOCK_LEADERS);
  const [selectedCategory, setSelectedCategory] = useState<string>('overall');
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
  const [currentUserRank, setCurrentUserRank] = useState<number>(8);
  const [view, setView] = useState<'leaderboard' | 'achievements' | 'badges'>('leaderboard');
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all');

  // Animate score changes
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({});

  useEffect(() => {
    // Initialize animated scores
    const initial: Record<string, number> = {};
    leaders.forEach(l => { initial[l.id] = l.score; });
    setAnimatedScores(initial);
  }, [leaders]);

  // Heartbeat pulse effect
  const [pulseOpacity, setPulseOpacity] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseOpacity(prev => prev === 1 ? 0.7 : 1);
    }, HEARTBEAT_MS);
    return () => clearInterval(interval);
  }, []);

  const getTierInfo = (tier: FormatTier) => {
    return TIERS.find(t => t.tier === tier) || TIERS[TIERS.length - 1];
  };

  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'from-amber-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      case 'uncommon': return 'from-green-400 to-emerald-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const sortedLeaders = [...leaders].sort((a, b) => {
    switch (selectedCategory) {
      case 'resonance': return b.resonanceLevel - a.resonanceLevel;
      case 'kernels': return b.kernelsCreated - a.kernelsCreated;
      case 'readers': return b.documentsRead - a.documentsRead;
      case 'collaborators': return b.collaborations - a.collaborations;
      case 'streak': return b.streakDays - a.streakDays;
      default: return b.score - a.score;
    }
  });

  return (
    <div className="relative w-full h-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Glassmorphism Container */}
      <div className="absolute inset-4 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl" style={{ opacity: pulseOpacity, transition: 'opacity 0.3s' }}>🏆</span>
                FORMA LEADERBOARD
              </h1>
              <p className="text-white/60 mt-1">PHI-Scaled Achievement System × Cross-Organism Rankings</p>
            </div>
            
            {/* Current User Stats */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <span className="text-4xl">🧑‍💻</span>
              <div>
                <div className="text-white font-semibold">Your Rank: #{currentUserRank}</div>
                <div className="text-purple-300 text-sm">Silver Tier • 32,109 points</div>
              </div>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { id: 'leaderboard', label: 'Leaderboard', icon: '📊' },
              { id: 'achievements', label: 'Achievements', icon: '🎯' },
              { id: 'badges', label: 'Badge Collection', icon: '🏅' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as 'leaderboard' | 'achievements' | 'badges')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  view === tab.id
                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-500/50'
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
          {/* LEADERBOARD VIEW */}
          {view === 'leaderboard' && (
            <div>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Timeframe Filter */}
              <div className="flex gap-2 mb-6">
                {[
                  { id: 'all', label: 'All Time' },
                  { id: 'month', label: 'This Month' },
                  { id: 'week', label: 'This Week' },
                ].map(tf => (
                  <button
                    key={tf.id}
                    onClick={() => setTimeframe(tf.id as 'all' | 'month' | 'week')}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      timeframe === tf.id
                        ? 'bg-purple-500/30 text-purple-300'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              {/* Top 3 Podium */}
              <div className="flex justify-center gap-4 mb-8">
                {sortedLeaders.slice(0, 3).map((leader, index) => {
                  const positions = [1, 0, 2]; // Order: 2nd, 1st, 3rd
                  const actualIndex = positions[index];
                  const l = sortedLeaders[actualIndex];
                  const tierInfo = getTierInfo(l.tier);
                  const heights = ['h-32', 'h-40', 'h-28'];
                  
                  return (
                    <div key={l.id} className="flex flex-col items-center">
                      <div className="text-5xl mb-2">{l.avatar}</div>
                      <div className="text-white font-semibold">{l.name}</div>
                      <div className={`w-24 ${heights[index]} rounded-t-xl bg-gradient-to-t from-white/10 to-white/5 flex flex-col items-center justify-end pb-4 mt-2`}>
                        <div className="text-4xl">{actualIndex === 0 ? '🥇' : actualIndex === 1 ? '🥈' : '🥉'}</div>
                        <div className="text-white/80 text-sm mt-2">{l.score.toLocaleString()}</div>
                        <div className="text-xs mt-1" style={{ color: tierInfo.color }}>
                          {tierInfo.icon} {l.tier}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Full Leaderboard */}
              <div className="space-y-2">
                {sortedLeaders.map((leader, index) => {
                  const tierInfo = getTierInfo(leader.tier);
                  const isCurrentUser = index + 1 === currentUserRank;
                  
                  return (
                    <div
                      key={leader.id}
                      onClick={() => setSelectedUser(leader)}
                      className={`p-4 rounded-xl backdrop-blur-xl border transition-all cursor-pointer ${
                        isCurrentUser 
                          ? 'bg-purple-500/20 border-purple-500/40' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          index < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-white/10 text-white/60'
                        }`}>
                          {index + 1}
                        </div>
                        
                        {/* Avatar & Name */}
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-3xl">{leader.avatar}</span>
                          <div>
                            <div className="text-white font-semibold flex items-center gap-2">
                              {leader.name}
                              {isCurrentUser && <span className="text-xs bg-purple-500/30 px-2 py-0.5 rounded-full text-purple-300">You</span>}
                            </div>
                            <div className="text-sm flex items-center gap-1" style={{ color: tierInfo.color }}>
                              {tierInfo.icon} {leader.tier}
                            </div>
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="hidden md:flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="text-white/80">{leader.resonanceLevel.toFixed(2)}</div>
                            <div className="text-white/40">Resonance</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white/80">{leader.kernelsCreated}</div>
                            <div className="text-white/40">Kernels</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white/80">{leader.documentsRead}</div>
                            <div className="text-white/40">Docs Read</div>
                          </div>
                          <div className="text-center">
                            <div className="text-amber-400">{leader.streakDays}🔥</div>
                            <div className="text-white/40">Streak</div>
                          </div>
                        </div>
                        
                        {/* Score */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-white">{leader.score.toLocaleString()}</div>
                          <div className="text-white/40 text-xs">points</div>
                        </div>
                        
                        {/* Badges */}
                        <div className="flex -space-x-1">
                          {leader.badges.slice(0, 3).map(badge => (
                            <div key={badge.id} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                              {badge.icon}
                            </div>
                          ))}
                          {leader.badges.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60">
                              +{leader.badges.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS VIEW */}
          {view === 'achievements' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACHIEVEMENTS.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl backdrop-blur-xl border transition-all ${
                      achievement.completed 
                        ? 'bg-emerald-500/10 border-emerald-500/30' 
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`text-3xl ${achievement.completed ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-semibold">{achievement.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            achievement.completed 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-white/10 text-white/50'
                          }`}>
                            +{achievement.reward} pts
                          </span>
                        </div>
                        <p className="text-white/50 text-sm mt-1">{achievement.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-white/40">Progress</span>
                            <span className="text-white/60">
                              {typeof achievement.progress === 'number' && achievement.progress < 1 
                                ? `${(achievement.progress * 100).toFixed(0)}%` 
                                : achievement.progress} / {achievement.target}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                achievement.completed 
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
                              }`}
                              style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BADGES VIEW */}
          {view === 'badges' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {BADGES.map(badge => (
                  <div
                    key={badge.id}
                    className="p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center"
                  >
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center text-3xl mb-3`}>
                      {badge.icon}
                    </div>
                    <h4 className="text-white font-semibold">{badge.name}</h4>
                    <p className="text-white/50 text-xs mt-1">{badge.description}</p>
                    <div className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${getRarityColor(badge.rarity)} bg-opacity-20`}>
                      {badge.rarity.toUpperCase()}
                    </div>
                  </div>
                ))}
                
                {/* Locked badges placeholder */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={`locked-${i}`}
                    className="p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 text-center opacity-50"
                  >
                    <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center text-3xl mb-3">
                      🔒
                    </div>
                    <h4 className="text-white/50 font-semibold">???</h4>
                    <p className="text-white/30 text-xs mt-1">Keep exploring to unlock</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Modal */}
        {selectedUser && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8 z-50">
            <div className="w-full max-w-2xl p-6 rounded-2xl backdrop-blur-xl bg-slate-800/90 border border-white/20">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-6xl">{selectedUser.avatar}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span style={{ color: getTierInfo(selectedUser.tier).color }}>
                        {getTierInfo(selectedUser.tier).icon} {selectedUser.tier}
                      </span>
                      <span className="text-white/50">•</span>
                      <span className="text-white/60">Rank #{selectedUser.rank}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-white/50 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-white/5 text-center">
                  <div className="text-2xl font-bold text-white">{selectedUser.score.toLocaleString()}</div>
                  <div className="text-white/50 text-sm">Total Score</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 text-center">
                  <div className="text-2xl font-bold text-purple-400">{selectedUser.resonanceLevel.toFixed(2)}</div>
                  <div className="text-white/50 text-sm">Resonance Level</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 text-center">
                  <div className="text-2xl font-bold text-amber-400">{selectedUser.streakDays}🔥</div>
                  <div className="text-white/50 text-sm">Day Streak</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 rounded-lg bg-white/5 text-center">
                  <div className="text-xl font-semibold text-white">{selectedUser.kernelsCreated}</div>
                  <div className="text-white/50 text-xs">Kernels Created</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 text-center">
                  <div className="text-xl font-semibold text-white">{selectedUser.documentsRead}</div>
                  <div className="text-white/50 text-xs">Documents Read</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 text-center">
                  <div className="text-xl font-semibold text-white">{selectedUser.collaborations}</div>
                  <div className="text-white/50 text-xs">Collaborations</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-3">Badges ({selectedUser.badges.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.badges.map(badge => (
                    <div 
                      key={badge.id}
                      className={`px-3 py-1 rounded-full bg-gradient-to-r ${getRarityColor(badge.rarity)} bg-opacity-20 flex items-center gap-2`}
                    >
                      <span>{badge.icon}</span>
                      <span className="text-white text-sm">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tier Legend */}
        <div className="absolute bottom-8 right-8 p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10">
          <h4 className="text-white/80 text-sm font-semibold mb-2">Tier Ranks</h4>
          <div className="space-y-1 text-xs">
            {TIERS.map(tier => (
              <div key={tier.tier} className="flex items-center gap-2">
                <span>{tier.icon}</span>
                <span style={{ color: tier.color }}>{tier.tier}</span>
                <span className="text-white/40">{tier.minScore.toLocaleString()}+</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
