'use client';

import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import {
  registerDevice,
  requestAllPermissions,
  revokePermission,
  getAllDevices,
  getDeviceState,
  startSensorCollection,
  stopSensorCollection,
  deviceHeartbeat,
  type DeviceNode,
  type SensorPermission,
  type SensorType,
} from '@/lib/deviceSovereignty';

/**
 * 𓂀 DEVICES PANEL 𓂀
 * "A new Devices panel in Settings shows all connected devices,
 *  their live sensor states, permission toggles, and resonance strength"
 */
export default function DevicesPanel() {
  const [currentDevice, setCurrentDevice] = useState<DeviceNode | null>(null);
  const [allDevices, setAllDevices] = useState<DeviceNode[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);
  const [beat, setBeat] = useState(0);
  const [isSensorActive, setIsSensorActive] = useState(false);

  const refreshDevices = useCallback(() => {
    const state = getDeviceState();
    setCurrentDevice(state.device);
    setBeat(state.currentBeat);
    setAllDevices(getAllDevices());
  }, []);

  // Initial load and heartbeat
  useEffect(() => {
    refreshDevices();

    // Heartbeat interval (873ms)
    const interval = setInterval(() => {
      deviceHeartbeat();
      refreshDevices();
    }, 873);

    return () => clearInterval(interval);
  }, [refreshDevices]);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const device = registerDevice();
      setCurrentDevice(device);
      refreshDevices();
    } finally {
      setIsRegistering(false);
    }
  };

  const handleRequestPermissions = async () => {
    setIsRequestingPermissions(true);
    try {
      await requestAllPermissions();
      refreshDevices();
    } finally {
      setIsRequestingPermissions(false);
    }
  };

  const handleToggleSensors = () => {
    if (isSensorActive) {
      stopSensorCollection();
      setIsSensorActive(false);
    } else {
      startSensorCollection();
      setIsSensorActive(true);
    }
  };

  const handleRevokePermission = (sensor: SensorType) => {
    revokePermission(sensor);
    refreshDevices();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2e] bg-[#0d0d15] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 text-lg">📱</span>
          <h2 className="text-sm font-semibold text-slate-200">Device Sovereignty</h2>
          <span className="text-xs text-slate-500">
            {allDevices.length} device{allDevices.length !== 1 ? 's' : ''} registered
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs font-mono text-slate-500">
            Beat: <span className="text-cyan-400">{beat}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Current Device */}
        <section>
          <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wide">
            This Device
          </h3>

          {!currentDevice ? (
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6 text-center">
              <p className="text-slate-400 text-sm mb-4">
                Device not yet registered as a sovereign node
              </p>
              <button
                onClick={handleRegister}
                disabled={isRegistering}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {isRegistering ? 'Registering...' : '🔗 Register as Node'}
              </button>
            </div>
          ) : (
            <DeviceCard 
              device={currentDevice} 
              isCurrent={true}
              onRequestPermissions={handleRequestPermissions}
              onToggleSensors={handleToggleSensors}
              onRevokePermission={handleRevokePermission}
              isRequestingPermissions={isRequestingPermissions}
              isSensorActive={isSensorActive}
            />
          )}
        </section>

        {/* All Devices */}
        {allDevices.length > 1 && (
          <section>
            <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wide">
              Other Nodes in Mesh
            </h3>
            <div className="space-y-3">
              {allDevices
                .filter(d => d.id !== currentDevice?.id)
                .map(device => (
                  <DeviceCard 
                    key={device.id} 
                    device={device}
                    isCurrent={false}
                    onRequestPermissions={() => {}}
                    onToggleSensors={() => {}}
                    onRevokePermission={() => {}}
                    isRequestingPermissions={false}
                    isSensorActive={false}
                  />
                ))
              }
            </div>
          </section>
        )}

        {/* Sovereign Contract */}
        {currentDevice?.sovereignContract && (
          <section>
            <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wide">
              Sovereign Contract
            </h3>
            <ContractView contract={currentDevice.sovereignContract} />
          </section>
        )}
      </div>
    </div>
  );
}

function DeviceCard({
  device,
  isCurrent,
  onRequestPermissions,
  onToggleSensors,
  onRevokePermission,
  isRequestingPermissions,
  isSensorActive,
}: {
  device: DeviceNode;
  isCurrent: boolean;
  onRequestPermissions: () => void;
  onToggleSensors: () => void;
  onRevokePermission: (sensor: SensorType) => void;
  isRequestingPermissions: boolean;
  isSensorActive: boolean;
}) {
  const statusColors = {
    connected: 'bg-green-500',
    degraded: 'bg-amber-500',
    disconnected: 'bg-red-500',
    pending: 'bg-blue-500',
  };

  const deviceIcons = {
    phone: '📱',
    tablet: '📱',
    laptop: '💻',
    desktop: '🖥️',
    tv: '📺',
    wearable: '⌚',
    iot: '🔌',
    unknown: '❓',
  };

  const grantedPermissions = device.permissions.filter(p => p.granted);
  const deniedPermissions = device.permissions.filter(p => !p.granted);

  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg overflow-hidden">
      {/* Device Header */}
      <div className="px-4 py-3 bg-[#0f0f18] border-b border-[#1e1e2e] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{deviceIcons[device.fingerprint.type]}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-200">
                {device.fingerprint.type.charAt(0).toUpperCase() + device.fingerprint.type.slice(1)}
              </span>
              {isCurrent && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  THIS DEVICE
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {device.fingerprint.hash}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Resonance Strength */}
          <div className="text-right">
            <div className="text-[10px] text-slate-500">Resonance</div>
            <div className="text-sm font-mono text-cyan-400">
              {(device.resonanceStrength * 100).toFixed(0)}%
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className={clsx('w-2.5 h-2.5 rounded-full', statusColors[device.status])} />
            <span className="text-xs text-slate-400 capitalize">{device.status}</span>
          </div>
        </div>
      </div>

      {/* Device Info */}
      <div className="px-4 py-3 grid grid-cols-4 gap-4 text-xs border-b border-[#1e1e2e]">
        <div>
          <div className="text-slate-500">Screen</div>
          <div className="text-slate-300 font-mono">
            {device.fingerprint.screenWidth}×{device.fingerprint.screenHeight}
          </div>
        </div>
        <div>
          <div className="text-slate-500">Platform</div>
          <div className="text-slate-300 font-mono truncate">
            {device.fingerprint.platform || 'Unknown'}
          </div>
        </div>
        <div>
          <div className="text-slate-500">Cores</div>
          <div className="text-slate-300 font-mono">
            {device.fingerprint.hardwareConcurrency}
          </div>
        </div>
        <div>
          <div className="text-slate-500">Touch</div>
          <div className="text-slate-300 font-mono">
            {device.fingerprint.touchPoints} points
          </div>
        </div>
      </div>

      {/* Permissions */}
      {isCurrent && (
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Sensor Permissions</span>
            <div className="flex gap-2">
              {device.permissions.length === 0 && (
                <button
                  onClick={onRequestPermissions}
                  disabled={isRequestingPermissions}
                  className="px-2 py-1 rounded text-[10px] bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 border border-cyan-500/30 transition-colors disabled:opacity-50"
                >
                  {isRequestingPermissions ? 'Requesting...' : 'Request All'}
                </button>
              )}
              {device.permissions.some(p => p.granted) && (
                <button
                  onClick={onToggleSensors}
                  className={clsx(
                    'px-2 py-1 rounded text-[10px] transition-colors',
                    isSensorActive
                      ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                      : 'bg-slate-600/20 text-slate-400 border border-slate-500/30'
                  )}
                >
                  {isSensorActive ? '🟢 Sensors Active' : '⚪ Sensors Off'}
                </button>
              )}
            </div>
          </div>

          {device.permissions.length > 0 && (
            <div className="space-y-1.5">
              {device.permissions.map(perm => (
                <PermissionRow 
                  key={perm.sensor} 
                  permission={perm}
                  onRevoke={() => onRevokePermission(perm.sensor)}
                />
              ))}
            </div>
          )}

          {device.permissions.length === 0 && (
            <div className="text-center py-4 text-slate-500 text-xs">
              No permissions requested yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PermissionRow({ 
  permission, 
  onRevoke 
}: { 
  permission: SensorPermission;
  onRevoke: () => void;
}) {
  const sensorIcons: Record<SensorType, string> = {
    motion: '📳',
    orientation: '🧭',
    location: '📍',
    battery: '🔋',
    network: '📶',
    bluetooth: '🔵',
    camera: '📷',
    microphone: '🎤',
    storage: '💾',
  };

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded bg-[#0a0a0f]">
      <div className="flex items-center gap-2">
        <span>{sensorIcons[permission.sensor] || '❓'}</span>
        <span className="text-xs text-slate-300 capitalize">{permission.sensor}</span>
      </div>

      <div className="flex items-center gap-2">
        {permission.reRequestCount > 0 && (
          <span className="text-[10px] text-amber-400 font-mono">
            re-req: {permission.reRequestCount}
          </span>
        )}
        
        <span 
          className={clsx(
            'px-1.5 py-0.5 rounded text-[10px] font-mono',
            permission.granted
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          )}
        >
          {permission.granted ? 'GRANTED' : 'DENIED'}
        </span>

        {permission.granted && (
          <button
            onClick={onRevoke}
            className="text-slate-500 hover:text-red-400 transition-colors text-xs"
            title="Revoke permission"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function ContractView({ contract }: { contract: DeviceNode['sovereignContract'] }) {
  if (!contract) return null;

  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-[#0f0f18] border-b border-[#1e1e2e] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-400">📜</span>
          <span className="text-xs font-mono text-slate-300">{contract.id}</span>
        </div>
        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
          {contract.format}
        </span>
      </div>

      <div className="px-4 py-3 space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-slate-500">Created</div>
            <div className="text-slate-300 font-mono">
              {new Date(contract.createdAt).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Beat</div>
            <div className="text-slate-300 font-mono">{contract.createdBeat}</div>
          </div>
        </div>

        <div>
          <div className="text-slate-500 mb-1">Signature</div>
          <div className="text-cyan-400 font-mono text-[10px] bg-[#0a0a0f] px-2 py-1 rounded">
            {contract.signature}
          </div>
        </div>

        <div>
          <div className="text-slate-500 mb-1">Permissions</div>
          <div className="flex flex-wrap gap-1">
            {contract.permissions.map(perm => (
              <span 
                key={perm}
                className="px-1.5 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 font-mono"
              >
                {perm}
              </span>
            ))}
          </div>
        </div>

        {contract.auditLog.length > 0 && (
          <div>
            <div className="text-slate-500 mb-1">Audit Log</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {contract.auditLog.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-slate-600">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={clsx(
                    entry.action === 'revoke' ? 'text-red-400' :
                    entry.action === 'grant' ? 'text-green-400' :
                    entry.action === 're-request' ? 'text-amber-400' :
                    'text-slate-400'
                  )}>
                    {entry.action}
                  </span>
                  {entry.sensor && (
                    <span className="text-slate-500">{entry.sensor}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
