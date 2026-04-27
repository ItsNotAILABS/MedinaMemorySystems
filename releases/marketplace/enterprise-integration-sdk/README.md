# 𓂀 @medina/enterprise-integration-sdk

![Version](https://img.shields.io/badge/version-1.0.0-gold) ![License](https://img.shields.io/badge/license-Proprietary-red) ![φ](https://img.shields.io/badge/φ-1.618033988749895-purple)

> **Plug any enterprise into a sovereign intelligence substrate.** Connectors, onboarding, campaigns, and messaging in one SDK.

---

## Features

- **Company Onboarding** — Three modes: CONNECT, INTERNALIZE, HYBRID
- **8 Connector Templates** — Salesforce, SAP, Google, Slack, HubSpot, Stripe, Twilio, Shopify
- **Campaign Management** — Full CRUD with events, metrics, and lifecycle tracking
- **Multi-Channel Messaging** — Email, in-app, push, SMS with template system
- **Message Templates & Approval** — Doctrine-aligned communication workflows
- **Multi-Format Export** — PDF, Excel, CSV, JSON with φ-encoded metadata
- **Enterprise Data Ingest** — Structured pipeline for external data absorption
- **Workforce Management** — Role-based work packet creation and tracking

## Quick Start

```bash
npm install @medina/enterprise-integration-sdk
```

```typescript
import { onboardCompany, createCampaign, sendMessage } from '@medina/enterprise-integration-sdk';

// Onboard a new company
const company = onboardCompany({
  name: 'Acme Corp',
  mode: 'hybrid',
  connectors: ['salesforce', 'slack', 'stripe'],
});

// Create a campaign
const campaign = createCampaign({
  name: 'Q4 Outreach',
  description: 'Sovereign intelligence rollout',
  channels: ['email', 'in-app'],
});

// Send a message
sendMessage({
  channel: 'email',
  template: 'onboarding-welcome',
  recipients: ['team@acme.com'],
});
```

## API Reference

| Latin Name | Function | Description |
|---|---|---|
| ADMISSIO SOCIETATIS | `onboardCompany` | Onboard new company |
| CONNEXIO SOCIETATIS | `connectCompany` | Connect via connector |
| INTERNALIZATIO | `internalizeCompany` | Full internalization |
| CREATOR EXPEDITIONIS | `createCampaign` | Create campaign |
| MISSIO NUNTII | `sendMessage` | Send message |
| EXPORTATIO DOCUMENTORUM | `exportDocuments` | Multi-format export |

## Connectors

| Connector | Provider | Capabilities |
|---|---|---|
| Salesforce | CRM | Contacts, Leads, Opportunities |
| SAP | ERP | Finance, HR, Supply Chain |
| Google | Workspace | Drive, Calendar, Gmail |
| Slack | Communication | Channels, Messages, Files |
| HubSpot | Marketing | Contacts, Campaigns, Analytics |
| Stripe | Payments | Subscriptions, Invoices, Charges |
| Twilio | Communication | SMS, Voice, Video |
| Shopify | Commerce | Products, Orders, Customers |

## Pricing

Per-seat or per-connector licensing. Contact sales@itsnotailabs.com for enterprise pricing.

## License

Proprietary — Commercial License. All rights reserved.

---

*Developed by ItsNotAILABS — Alfredo Medina Hernandez — Dallas, TX*
