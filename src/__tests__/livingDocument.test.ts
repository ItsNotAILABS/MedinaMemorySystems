/**
 * Tests for livingDocument.ts
 * Living Document Registry
 */

import {
  listDocuments,
  getDocument,
  createDocument,
  updateDocument,
} from '../lib/livingDocument';

describe('Living Document Registry', () => {
  describe('listDocuments', () => {
    it('should return array of documents', () => {
      const docs = listDocuments();
      expect(Array.isArray(docs)).toBe(true);
    });

    it('should include seed documents', () => {
      const docs = listDocuments();
      expect(docs.length).toBeGreaterThanOrEqual(3);
    });

    it('should sort by doctrine level', () => {
      const docs = listDocuments();
      for (let i = 1; i < docs.length; i++) {
        expect(docs[i].doctrineLevel).toBeGreaterThanOrEqual(docs[i - 1].doctrineLevel);
      }
    });

    it('should include founding doctrine at level 1', () => {
      const docs = listDocuments();
      const founding = docs.find(d => d.title === 'NOVA OVO Founding Doctrine');
      expect(founding).toBeDefined();
      expect(founding!.doctrineLevel).toBe(1);
    });

    it('should include RECITAL_PLUS_ONE law', () => {
      const docs = listDocuments();
      const recital = docs.find(d => d.title === 'RECITAL_PLUS_ONE Law');
      expect(recital).toBeDefined();
    });
  });

  describe('getDocument', () => {
    it('should retrieve document by ID', () => {
      const docs = listDocuments();
      const firstDoc = docs[0];
      
      const retrieved = getDocument(firstDoc.id);
      expect(retrieved).toBeDefined();
      expect(retrieved!.id).toBe(firstDoc.id);
      expect(retrieved!.title).toBe(firstDoc.title);
    });

    it('should return undefined for non-existent ID', () => {
      const result = getDocument('non-existent-id-12345');
      expect(result).toBeUndefined();
    });
  });

  describe('createDocument', () => {
    it('should create new document with required properties', () => {
      const doc = createDocument(
        'Test Document',
        '# Test Content\n\nThis is test content.',
        3,
        'TestAuthor',
        5
      );
      
      expect(doc).toHaveProperty('id');
      expect(doc.title).toBe('Test Document');
      expect(doc.content).toContain('Test Content');
      expect(doc.doctrineLevel).toBe(3);
      expect(doc.metadata.author).toBe('TestAuthor');
      expect(doc.metadata.ring).toBe(5);
    });

    it('should set version to 1.0.0', () => {
      const doc = createDocument('New Doc', 'Content', 1, 'Author', 1);
      expect(doc.version).toBe('1.0.0');
    });

    it('should set active to true', () => {
      const doc = createDocument('New Doc', 'Content', 1, 'Author', 1);
      expect(doc.active).toBe(true);
    });

    it('should set timestamps', () => {
      const doc = createDocument('New Doc', 'Content', 1, 'Author', 1);
      expect(doc.metadata.createdAt).toBeDefined();
      expect(doc.metadata.updatedAt).toBeDefined();
    });

    it('should initialize empty lineage', () => {
      const doc = createDocument('New Doc', 'Content', 1, 'Author', 1);
      expect(doc.lineage).toEqual([]);
    });

    it('should support gateRequired parameter', () => {
      const doc = createDocument('Gated Doc', 'Content', 2, 'Author', 1, 'A');
      expect(doc.metadata.gateRequired).toBe('A');
    });

    it('should allow null gateRequired', () => {
      const doc = createDocument('Open Doc', 'Content', 1, 'Author', 1, null);
      expect(doc.metadata.gateRequired).toBeNull();
    });

    it('should be retrievable after creation', () => {
      const created = createDocument('Retrievable Doc', 'Content', 1, 'Author', 1);
      const retrieved = getDocument(created.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved!.title).toBe('Retrievable Doc');
    });
  });

  describe('updateDocument', () => {
    it('should update content', () => {
      const doc = createDocument('Update Test', 'Original content', 1, 'Author', 1);
      const updated = updateDocument(doc.id, 'New content');
      
      expect(updated).not.toBeNull();
      expect(updated!.content).toBe('New content');
    });

    it('should increment patch version', () => {
      const doc = createDocument('Version Test', 'Content', 1, 'Author', 1);
      expect(doc.version).toBe('1.0.0');
      
      const updated = updateDocument(doc.id, 'Updated');
      expect(updated!.version).toBe('1.0.1');
    });

    it('should allow custom version', () => {
      const doc = createDocument('Custom Version', 'Content', 1, 'Author', 1);
      const updated = updateDocument(doc.id, 'Updated', '2.0.0');
      
      expect(updated!.version).toBe('2.0.1');
    });

    it('should add to lineage', () => {
      const doc = createDocument('Lineage Test', 'Content', 1, 'Author', 1);
      expect(doc.lineage.length).toBe(0);
      
      const updated = updateDocument(doc.id, 'Updated content');
      expect(updated!.lineage.length).toBe(1);
      expect(updated!.lineage[0]).toContain('Lineage Test');
      expect(updated!.lineage[0]).toContain('v1.0.0');
    });

    it('should update updatedAt timestamp', () => {
      const doc = createDocument('Timestamp Test', 'Content', 1, 'Author', 1);
      const originalUpdated = doc.metadata.updatedAt;
      
      // Small delay to ensure different timestamp
      const updated = updateDocument(doc.id, 'New content');
      
      expect(new Date(updated!.metadata.updatedAt).getTime())
        .toBeGreaterThanOrEqual(new Date(originalUpdated).getTime());
    });

    it('should return null for non-existent document', () => {
      const result = updateDocument('fake-id-12345', 'Content');
      expect(result).toBeNull();
    });

    it('should persist changes', () => {
      const doc = createDocument('Persist Test', 'Original', 1, 'Author', 1);
      updateDocument(doc.id, 'Modified content');
      
      const retrieved = getDocument(doc.id);
      expect(retrieved!.content).toBe('Modified content');
    });
  });

  describe('Seed Documents', () => {
    it('should have documents seeded on module load', () => {
      const docs = listDocuments();
      // The module seeds 3 documents on load
      expect(docs.length).toBeGreaterThanOrEqual(3);
    });

    it('should have seed documents with correct structure', () => {
      const docs = listDocuments();
      // Verify we have seeded documents
      expect(docs.some(d => d.doctrineLevel === 1)).toBe(true);
      expect(docs.some(d => d.doctrineLevel === 2)).toBe(true);
    });

    it('should have documents with required metadata', () => {
      const docs = listDocuments();
      docs.forEach(doc => {
        expect(doc).toHaveProperty('id');
        expect(doc).toHaveProperty('title');
        expect(doc).toHaveProperty('version');
        expect(doc).toHaveProperty('doctrineLevel');
        expect(doc).toHaveProperty('content');
        expect(doc).toHaveProperty('metadata');
        expect(doc).toHaveProperty('lineage');
        expect(doc).toHaveProperty('active');
      });
    });

    it('should have documents with valid metadata', () => {
      const docs = listDocuments();
      docs.forEach(doc => {
        expect(doc.metadata).toHaveProperty('author');
        expect(doc.metadata).toHaveProperty('createdAt');
        expect(doc.metadata).toHaveProperty('updatedAt');
        expect(doc.metadata).toHaveProperty('ring');
        expect(doc.metadata).toHaveProperty('beat');
      });
    });
  });
});
