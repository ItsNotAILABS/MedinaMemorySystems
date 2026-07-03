/**
 * Stack template generators — Motoko / Rust / Python CRUD + React / Node / Java
 */

import type { AppProject, CrudEntity, GeneratedFile } from '@/types/appBuilder';
import { vaultImportBlock, vaultModulesForStack } from '@/lib/companyVault';

function entityFieldsTs(entity: CrudEntity): string {
  return entity.fields.map((f) => `  ${f.name}${f.required ? '' : '?'}: ${f.type === 'number' ? 'number' : 'string'};`).join('\n');
}

function entityFieldsPy(entity: CrudEntity): string {
  const map: Record<string, string> = { string: 'str', number: 'float', boolean: 'bool', text: 'str', timestamp: 'datetime' };
  return entity.fields.map((f) => `    ${f.name}: ${map[f.type] ?? 'str'}`).join('\n');
}

export function generateMotokoBackend(project: AppProject): GeneratedFile[] {
  const vault = vaultModulesForStack(project.backend, project.frontend, project.proStack);
  const entity = project.entities[0] ?? { name: 'Item', fields: [{ name: 'title', type: 'string', required: true }] };
  const vaultBlock = vaultImportBlock(vault, 'mo');

  return [{
    path: `src/backend/main.mo`,
    language: 'motoko',
    content: `${vaultBlock}
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

actor ${project.name.replace(/\W/g, '')}Canister {
  type ${entity.name} = {
${entity.fields.map((f) => `    ${f.name}: ${f.type === 'number' ? 'Nat' : 'Text'};`).join('\n')}
    createdAt: Int;
  };

  stable var nextId: Nat = 0;
  var store = HashMap.HashMap<Nat, ${entity.name}>(10, Nat.equal, Nat.hash);

  public func create(input: ${entity.name}) : async Nat {
    let id = nextId;
    nextId += 1;
    store.put(id, { input with createdAt = Time.now() });
    id
  };

  public query func list() : async [${entity.name}] {
    Iter.toArray(store.vals())
  };

  public query func get(id: Nat) : async ?${entity.name} {
    store.get(id)
  };
};
`,
  }];
}

export function generateRustBackend(project: AppProject): GeneratedFile[] {
  const vault = vaultModulesForStack(project.backend, project.frontend, project.proStack);
  const entity = project.entities[0] ?? { name: 'Item', fields: [{ name: 'title', type: 'string', required: true }] };

  return [{
    path: 'src/main.rs',
    language: 'rust',
    content: `${vaultImportBlock(vault, 'rs')}
use axum::{routing::get, Router, Json};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};

#[derive(Clone, Serialize, Deserialize)]
struct ${entity.name} {
${entity.fields.map((f) => `    ${f.name}: ${f.type === 'number' ? 'f64' : 'String'},`).join('\n')}
}

#[tokio::main]
async fn main() {
    let state = Arc::new(Mutex::new(Vec::<${entity.name}>::new()));
    let app = Router::new()
        .route("/api/${entity.name.toLowerCase()}s", get(list_items));
    axum::serve(tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap(), app).await.unwrap();
}

async fn list_items() -> Json<Vec<${entity.name}>> {
    Json(vec![])
}
`,
  }];
}

export function generatePythonBackend(project: AppProject): GeneratedFile[] {
  const vault = vaultModulesForStack(project.backend, project.frontend, project.proStack);
  const entity = project.entities[0] ?? { name: 'Item', fields: [{ name: 'title', type: 'string', required: true }] };

  return [{
    path: 'app/main.py',
    language: 'python',
    content: `${vaultImportBlock(vault, 'py')}
from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(title="${project.name}")

class ${entity.name}Create(BaseModel):
${entityFieldsPy(entity)}

class ${entity.name}(${entity.name}Create):
    id: str
    created_at: datetime

_STORE: list[${entity.name}] = []

@app.get("/api/${entity.name.toLowerCase()}s")
def list_${entity.name.toLowerCase()}s():
    return _STORE

@app.post("/api/${entity.name.toLowerCase()}s")
def create_${entity.name.toLowerCase()}(body: ${entity.name}Create):
    item = ${entity.name}(id=str(len(_STORE)+1), created_at=datetime.utcnow(), **body.dict())
    _STORE.append(item)
    return item
`,
  }];
}

export function generateReactFrontend(project: AppProject): GeneratedFile[] {
  const vault = vaultModulesForStack(project.backend, project.frontend, project.proStack);
  const entity = project.entities[0] ?? { name: 'Item', fields: [{ name: 'title', type: 'string' }] };
  const color = project.design.primaryColor;

  return [{
    path: 'src/app/page.tsx',
    language: 'typescript',
    content: `${vaultImportBlock(vault, 'ts')}
'use client';

export default function ${entity.name}Page() {
  return (
    <main style={{ background: '#0a0a0f', color: '#e2e8f0', minHeight: '100vh', padding: 24 }}>
      <h1 style={{ color: '${color}' }}>${project.name}</h1>
      <p>${project.description}</p>
      <section className="grid gap-4 mt-8">
        {/* ${entity.name} CRUD — ${project.design.layout} */}
      </section>
    </main>
  );
}
`,
  }, {
    path: 'src/app/layout.tsx',
    language: 'typescript',
    content: `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: '${project.design.fontFamily}', margin: 0 }}>{children}</body>
    </html>
  );
}`,
  }];
}

export function generateNodeApi(project: AppProject): GeneratedFile[] {
  const vault = vaultModulesForStack(project.backend, project.frontend, 'node');
  const entity = project.entities[0] ?? { name: 'Item', fields: [{ name: 'title', type: 'string' }] };

  return [{
    path: 'server/index.js',
    language: 'javascript',
    content: `${vaultImportBlock(vault, 'ts')}
const express = require('express');
const app = express();
app.use(express.json());

const store = [];

app.get('/api/${entity.name.toLowerCase()}s', (_, res) => res.json(store));
app.post('/api/${entity.name.toLowerCase()}s', (req, res) => {
  store.push({ id: store.length + 1, ...req.body });
  res.status(201).json(store.at(-1));
});

app.listen(3001, () => console.log('${project.name} API on :3001'));
`,
  }];
}

export function generateJavaBackend(project: AppProject): GeneratedFile[] {
  const vault = vaultModulesForStack(project.backend, project.frontend, 'java');
  const entity = project.entities[0] ?? { name: 'Item', fields: [{ name: 'title', type: 'string' }] };

  return [{
    path: `src/main/java/com/medina/${project.name.toLowerCase()}/${entity.name}Controller.java`,
    language: 'java',
    content: `${vaultImportBlock(vault, 'java')}
package com.medina.${project.name.toLowerCase()};

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/${entity.name.toLowerCase()}s")
public class ${entity.name}Controller {
    private final List<Map<String, Object>> store = new ArrayList<>();

    @GetMapping
    public List<Map<String, Object>> list() { return store; }

    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> body) {
        body.put("id", store.size() + 1);
        store.add(body);
        return body;
    }
}
`,
  }];
}

export function generateDesignTokens(project: AppProject): GeneratedFile[] {
  return [{
    path: 'design/tokens.json',
    language: 'json',
    content: JSON.stringify({
      theme: project.design.theme,
      colors: { primary: project.design.primaryColor, background: '#0a0a0f', surface: '#12121a' },
      typography: { fontFamily: project.design.fontFamily },
      layout: project.design.layout,
      components: project.design.components,
    }, null, 2),
  }, {
    path: 'design/ui-spec.md',
    language: 'markdown',
    content: `# ${project.name} — UI/UX Spec\n\n- Layout: ${project.design.layout}\n- Theme: ${project.design.theme}\n- Components: ${project.design.components.join(', ')}\n`,
  }];
}

export function scaffoldProject(project: AppProject): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  switch (project.backend) {
    case 'motoko': files.push(...generateMotokoBackend(project)); break;
    case 'rust': files.push(...generateRustBackend(project)); break;
    case 'python': files.push(...generatePythonBackend(project)); break;
  }
  if (project.frontend === 'react') files.push(...generateReactFrontend(project));
  if (project.proStack === 'node') files.push(...generateNodeApi(project));
  if (project.proStack === 'java') files.push(...generateJavaBackend(project));
  files.push(...generateDesignTokens(project));
  return files;
}
