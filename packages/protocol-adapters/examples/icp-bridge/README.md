# ICP Bridge Example
## Connect Legacy Systems to MEDINA on Internet Computer

A production example demonstrating how to bridge existing enterprise systems (databases, REST APIs, message queues) to MEDINA organisms running on the Internet Computer Protocol.

## Architecture

```
Legacy System                Protocol Bridge               MEDINA Organism (ICP)
    │                              │                              │
    ├──── REST API ───────────► HttpAdapter ──────────────► ICP canister
    │                              │                              │
    ├──── PostgreSQL ─────────► DbAdapter ────────────────► Memory storage
    │                              │                              │
    ├──── RabbitMQ ───────────► AmqpAdapter ─────────────► Workforce queue
    │                              │                              │
    └──── Kafka ──────────────► KafkaAdapter ────────────► Intelligence stream
```

## Setup

```bash
npm install @medina/protocol-adapters
```

## Basic ICP Bridge

```typescript
import { IcpAdapter, HttpAdapter, AmqpAdapter } from '@medina/protocol-adapters';

// 1. Connect to your MEDINA organism on ICP
const icp = new IcpAdapter({
    canisterId: process.env.ORGANISM_CANISTER_ID!,
    host: 'https://ic0.app',
    identity: await createIdentityFromPem(process.env.ICP_IDENTITY_PEM!),
});

await icp.connect();
console.log('Connected to ICP organism ✓');

// 2. Bridge your existing REST API
const restBridge = new HttpAdapter({
    baseUrl: 'https://legacy.mycompany.com/api',
    headers: {
        'Authorization': `Bearer ${process.env.LEGACY_API_KEY}`,
    },
});

// Sync data from legacy REST API to organism memory every 873ms (φ⁴-tuned)
setInterval(async () => {
    const customers = await restBridge.get('/customers?updated=last_minute');

    for (const customer of customers.data) {
        await icp.update('storeMemory', [{
            key: `customer:${customer.id}`,
            value: JSON.stringify(customer),
            timestamp: Date.now(),
            priority: 8, // Fibonacci priority
        }]);
    }

    console.log(`Synced ${customers.data.length} customers to organism`);
}, 873);

// 3. Forward organism intelligence to legacy system
icp.subscribe('intelligence', async (insight) => {
    await restBridge.post('/insights', {
        source: 'MEDINA-organism',
        insight: insight.content,
        confidence: insight.confidence,
        timestamp: insight.timestamp,
    });
});
```

## Database Bridge

```typescript
import { DbAdapter } from '@medina/protocol-adapters';

const db = new DbAdapter({
    type: 'postgresql',
    connectionString: process.env.DATABASE_URL!,
});

await db.connect();

// Mirror organism memory to PostgreSQL for reporting
icp.subscribe('memory:store', async (event) => {
    await db.query(`
        INSERT INTO organism_memory (key, value, timestamp, priority)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (key) DO UPDATE
        SET value = EXCLUDED.value,
            timestamp = EXCLUDED.timestamp
    `, [event.key, event.value, event.timestamp, event.priority]);
});

// Load historical data into organism on startup
const existingData = await db.query(
    'SELECT * FROM operational_data WHERE created_at > NOW() - INTERVAL \'30 days\''
);

console.log(`Loading ${existingData.rows.length} records into organism...`);
for (const row of existingData.rows) {
    await icp.update('storeMemory', [{
        key: row.id.toString(),
        value: JSON.stringify(row),
        timestamp: row.created_at.getTime(),
        priority: 5,
    }]);
}
console.log('Historical data loaded ✓');
```

## Message Queue Bridge (AMQP)

```typescript
import { AmqpAdapter } from '@medina/protocol-adapters';

const amqp = new AmqpAdapter({
    url: process.env.RABBITMQ_URL!,
    exchange: 'medina-bridge',
    queues: {
        incoming: 'organism-tasks',
        outgoing: 'organism-results',
    },
});

await amqp.connect();

// Route enterprise tasks to organism workforce
amqp.consume('organism-tasks', async (msg) => {
    const task = JSON.parse(msg.content.toString());

    // Route to appropriate workforce type
    const workforceType = selectWorkforce(task.type);
    const result = await icp.update('invokeWorkforce', [{
        type: workforceType,
        task: task.action,
        data: task.payload,
    }]);

    // Publish result back to enterprise queue
    await amqp.publish('organism-results', {
        taskId: task.id,
        result,
        workforceUsed: workforceType,
        timestamp: Date.now(),
    });

    amqp.ack(msg);
});

function selectWorkforce(taskType: string): string {
    const mapping: Record<string, string> = {
        'analyze':   'W-ANALYST',
        'strategize':'W-STRATEGIST',
        'build':     'W-BUILDER',
        'govern':    'W-GOVERNANCE',
        'remember':  'W-MEMORY',
        'assess':    'W-RISK',
        'project':   'W-PROJECTION',
        'operate':   'W-OPERATIONS',
    };
    return mapping[taskType] || 'W-ANALYST';
}
```

## Running This Example

```bash
# Clone and install
cd icp-bridge
npm install

# Configure environment
cat > .env << 'EOF'
ORGANISM_CANISTER_ID=rrkah-fqaaa-aaaaa-aaaaq-cai
ICP_IDENTITY_PEM=path/to/identity.pem
LEGACY_API_KEY=your-api-key
DATABASE_URL=postgresql://user:pass@host/db
RABBITMQ_URL=amqp://localhost
EOF

# Run the bridge
npx ts-node icp-bridge.ts
```

## Production Notes

- The bridge runs as a sidecar service alongside your legacy application
- Use PM2 or systemd for process management in production
- The 873ms sync interval is φ-tuned for optimal organism rhythm alignment
- All messages are logged for audit compliance

---

**MEDINA TECH | Protocol Adapters | ICP Bridge | 2026**
