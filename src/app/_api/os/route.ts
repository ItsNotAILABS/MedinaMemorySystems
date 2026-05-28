import { NextResponse } from 'next/server';
import { getOSManifest, listSaaSProducts, getProtocolOptions, listAddresses } from '@/lib/medinaOS';
import { allModels } from '@/lib/sovereign-model';
import { bootSovereignRegistry } from '@/lib/sovereign-registry';

let booted = false;
function ensureBoot() {
  if (!booted) { bootSovereignRegistry(); booted = true; }
}

export async function GET() {
  ensureBoot();

  const manifest = getOSManifest();
  const products = listSaaSProducts();
  const protocolOptions = getProtocolOptions();
  const addresses = listAddresses();
  const models = allModels().map((m) => ({
    id: m.id,
    name: m.name,
    kind: m.kind,
    description: m.description,
    capabilities: m.capabilities,
    color: m.color,
  }));

  return NextResponse.json({
    os: manifest,
    products,
    protocolOptions,
    addresses,
    sovereignModels: models,
    totalModels: models.length,
    timestamp: new Date().toISOString(),
  });
}
