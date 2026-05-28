import { NextRequest, NextResponse } from 'next/server';
import {
  registerDevice,
  getCurrentDevice,
  getAllDevices,
  requestAllPermissions,
  revokePermission,
  startSensorCollection,
  stopSensorCollection,
  deviceHeartbeat,
  getDeviceState,
  getPermissionsNeedingReRequest,
  type SensorType,
} from '@/lib/deviceSovereignty';
import { senseEdge, checkBrowserSupport } from '@/lib/organismEdgeModel';

interface RequestBody {
  action: string;
  sensor?: SensorType;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as RequestBody;

    const { action } = body;

    switch (action) {
      case 'register': {
        const device = registerDevice();
        return NextResponse.json({ 
          success: true, 
          device,
          message: 'Device registered as sovereign node',
        });
      }

      case 'request-permissions': {
        const permissions = await requestAllPermissions();
        return NextResponse.json({ 
          success: true, 
          permissions,
          granted: permissions.filter(p => p.granted).length,
          total: permissions.length,
        });
      }

      case 'revoke-permission': {
        const { sensor } = body;
        if (!sensor) {
          return NextResponse.json({ error: 'Sensor type required' }, { status: 400 });
        }
        revokePermission(sensor);
        return NextResponse.json({ 
          success: true, 
          message: `Permission for ${sensor} revoked`,
        });
      }

      case 'start-collection': {
        startSensorCollection();
        return NextResponse.json({ 
          success: true, 
          message: 'Sensor collection started',
        });
      }

      case 'stop-collection': {
        stopSensorCollection();
        return NextResponse.json({ 
          success: true, 
          message: 'Sensor collection stopped',
        });
      }

      case 'heartbeat': {
        deviceHeartbeat();
        const state = getDeviceState();
        return NextResponse.json({ 
          success: true, 
          beat: state.currentBeat,
          device: state.device,
        });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

  } catch (error) {
    senseEdge('api-error', 'devices', String(error), 'warning');
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'status';

    switch (action) {
      case 'status': {
        const state = getDeviceState();
        return NextResponse.json({ 
          device: state.device,
          currentBeat: state.currentBeat,
          batchWindowMs: state.batchWindowMs,
        });
      }

      case 'current': {
        const device = getCurrentDevice();
        if (!device) {
          return NextResponse.json({ 
            error: 'No device registered',
            action: 'Call POST with action: "register" to register this device',
          }, { status: 404 });
        }
        return NextResponse.json({ device });
      }

      case 'all': {
        const devices = getAllDevices();
        return NextResponse.json({ 
          devices,
          count: devices.length,
        });
      }

      case 're-request': {
        const permissions = getPermissionsNeedingReRequest();
        return NextResponse.json({ 
          permissions,
          count: permissions.length,
        });
      }

      case 'capabilities': {
        // Check browser capabilities
        const capabilities = {
          speechRecognition: checkBrowserSupport('speech-recognition'),
          speechSynthesis: checkBrowserSupport('speech-synthesis'),
          deviceMotion: checkBrowserSupport('device-motion'),
          deviceOrientation: checkBrowserSupport('device-orientation'),
          geolocation: checkBrowserSupport('geolocation'),
          mediaDevices: checkBrowserSupport('media-devices'),
          bluetooth: checkBrowserSupport('bluetooth'),
          localStorage: checkBrowserSupport('local-storage'),
          indexedDB: checkBrowserSupport('indexed-db'),
          webWorkers: checkBrowserSupport('web-workers'),
          serviceWorkers: checkBrowserSupport('service-workers'),
        };
        return NextResponse.json({ capabilities });
      }

      default:
        return NextResponse.json({
          endpoints: {
            GET: ['status', 'current', 'all', 're-request', 'capabilities'],
            POST: ['register', 'request-permissions', 'revoke-permission', 'start-collection', 'stop-collection', 'heartbeat'],
          },
          description: 'Device sovereignty management - register devices as sovereign nodes',
        });
    }

  } catch (error) {
    senseEdge('api-error', 'devices', String(error), 'warning');
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
