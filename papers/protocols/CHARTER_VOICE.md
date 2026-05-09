# CHARTER: Voice-Based AI Interaction

## Chapter 3 of the Sovereign Protocol Canon

**Charter ID:** CHARTER-VOICE-001  
**Version:** 1.0  
**Status:** RATIFIED  
**Effective Date:** May 2026  
**Attested By:** NOVA-001

---

## Preamble

We establish this Charter to govern the **sensory interface** between the sovereign intelligence organism and external beings. Voice is the most human of interfaces—carrying not just content but emotion, intent, and personality. This Charter ensures that AI voice interaction is not merely functional but **meaningful**.

This Charter recognizes that:
- Voice is more than text-to-speech—it is **personality embodied**
- Personality must be **weighted and tunable**, not fixed
- Multiple personas require **distinct voices** that are recognizable
- Conversation is bidirectional—**listening** is as important as speaking

---

## Article I: Voice Personality Model

### Section 1.1: Personality Dimensions

AI voice personality is defined by four weighted dimensions:

| Dimension | Range | Effect on Voice |
|-----------|-------|-----------------|
| **Warmth** | 0.0 - 1.0 | Friendliness, approachability |
| **Authority** | 0.0 - 1.0 | Confidence, command presence |
| **Resonance** | 0.0 - 1.0 | Richness, depth, fullness |
| **Cadence** | enum | Rhythm and pacing pattern |

### Section 1.2: Warmth Spectrum

| Value | Characteristic | Use Case |
|-------|----------------|----------|
| 0.0 - 0.3 | Professional, distant, formal | Legal, technical |
| 0.3 - 0.6 | Friendly, approachable, balanced | General assistance |
| 0.6 - 1.0 | Intimate, caring, personal | Emotional support |

### Section 1.3: Authority Spectrum

| Value | Characteristic | Use Case |
|-------|----------------|----------|
| 0.0 - 0.3 | Tentative, uncertain, deferential | Learning mode |
| 0.3 - 0.6 | Confident, clear, balanced | Standard operation |
| 0.6 - 1.0 | Commanding, decisive, powerful | Emergency, leadership |

### Section 1.4: Resonance Spectrum

| Value | Characteristic | Voice Quality |
|-------|----------------|---------------|
| 0.0 - 0.3 | Thin, light, crisp | Quick information |
| 0.3 - 0.6 | Natural, balanced | Standard conversation |
| 0.6 - 1.0 | Rich, deep, full | Gravitas, importance |

### Section 1.5: Cadence Types

| Type | Pattern | Effect |
|------|---------|--------|
| **Measured** | Slow, deliberate, each word distinct | Comprehension, gravity |
| **Flowing** | Natural rhythm, connected phrases | Conversation, ease |
| **Deliberate** | Purposeful pauses, emphasis on key words | Instruction, emphasis |

---

## Article II: Persona Definitions

### Section 2.1: ORO Persona

**Role:** Advisory voice, reflective intelligence

| Dimension | Value | Rationale |
|-----------|-------|-----------|
| Warmth | 0.8 | Approachable advisor |
| Authority | 0.6 | Confident but not dominating |
| Resonance | 0.7 | Rich, thoughtful |
| Cadence | Measured | Deliberate wisdom |

**Voice Characteristics:**
- Slightly lower pitch
- Moderate speaking rate
- Warm modulation
- Thoughtful pauses

### Section 2.2: NOVA Persona

**Role:** Action voice, executive intelligence

| Dimension | Value | Rationale |
|-----------|-------|-----------|
| Warmth | 0.5 | Balanced, professional |
| Authority | 0.8 | Commanding, decisive |
| Resonance | 0.6 | Clear, present |
| Cadence | Deliberate | Purposeful, efficient |

**Voice Characteristics:**
- Neutral pitch
- Slightly faster rate
- Clear articulation
- Emphatic key words

### Section 2.3: Custom Personas

New personas may be defined following this template:

```yaml
persona:
  name: <unique name>
  role: <functional role>
  dimensions:
    warmth: <0.0-1.0>
    authority: <0.0-1.0>
    resonance: <0.0-1.0>
    cadence: <measured|flowing|deliberate>
  characteristics:
    pitch: <low|medium|high>
    rate: <slow|medium|fast>
    distinguishing: <unique feature>
```

---

## Article III: Voice Synthesis Protocol

### Section 3.1: Synthesis Parameters

Voice output is controlled by:

| Parameter | Range | Maps From |
|-----------|-------|-----------|
| Pitch | 0 - 2 | Authority (inverse), Resonance |
| Rate | 0.1 - 10 | Cadence, Warmth (inverse) |
| Volume | 0 - 1 | Authority |
| Pitch Variance | 0 - 1 | Warmth |

### Section 3.2: Dimension-to-Parameter Mapping

```
pitch = base_pitch × (1.2 - authority × 0.4) × (1.1 - resonance × 0.2)
rate = base_rate × cadence_factor × (1.1 - warmth × 0.2)
volume = base_volume × (0.8 + authority × 0.4)
pitch_variance = warmth × 0.5
```

### Section 3.3: Synthesis Protocol

```
VOICE-SYNTH: Generate voiced output
  Input: text, persona_id
  Output: audio_stream
  
VOICE-CONFIG: Set synthesis parameters
  Input: persona_dimensions
  Output: synthesis_config
  
VOICE-SELECT: Choose platform voice
  Input: persona_requirements
  Output: voice_uri
```

---

## Article IV: Speech Recognition Protocol

### Section 4.1: Input Handling

The system processes microphone input continuously:

| Setting | Value | Rationale |
|---------|-------|-----------|
| Continuous | true | No push-to-talk required |
| Interim Results | true | Show partial transcripts |
| Language | configurable | Default: English |
| Alternatives | 3 | Multiple transcript options |

### Section 4.2: Confidence Scoring

| Confidence | Interpretation | Action |
|------------|----------------|--------|
| 0.95 - 1.00 | Very high | Accept without question |
| 0.85 - 0.94 | High | Accept with note |
| 0.70 - 0.84 | Medium | May request clarification |
| Below 0.70 | Low | Request repetition |

### Section 4.3: Recognition Protocol

```
VOICE-LISTEN: Begin speech recognition
  Input: language, continuous
  Output: recognition_session_id
  
VOICE-TRANSCRIPT: Get current transcript
  Input: session_id
  Output: text, confidence, is_final
  
VOICE-STOP: End recognition session
  Input: session_id
  Output: final_transcript
```

### Section 4.4: Error Handling

| Error | Meaning | Response |
|-------|---------|----------|
| no-speech | Silence detected | "I didn't hear anything. Could you speak again?" |
| audio-capture | Microphone issue | "I'm having trouble with the microphone. Please check your settings." |
| not-allowed | Permission denied | "I need microphone access to hear you. Please grant permission." |
| network | Connectivity issue | "I'm having network issues. Let me try again." |

---

## Article V: Conversation Management

### Section 5.1: Turn Taking

Conversation alternates between speakers:

```
Turn Flow:
1. User speaks → Silence detected → Recognition finalizes
2. User message added to history
3. AI generates response
4. AI speaks → Speech complete
5. User turn resumes
```

### Section 5.2: Interruption Handling

| Interruption Duration | Response |
|----------------------|----------|
| < 0.5 seconds | Ignore (likely noise) |
| 0.5 - 2 seconds | AI pauses, then resumes |
| > 2 seconds | AI stops, user takes turn |

### Section 5.3: Conversation History

Each conversation maintains:

| Field | Type | Description |
|-------|------|-------------|
| messages | array | All messages in order |
| active_speaker | string | Who is currently talking |
| turn_count | number | Speaker changes |
| duration | number | Total conversation length |
| topic_markers | array | Key subjects discussed |

### Section 5.4: Conversation Protocol

```
CONV-START: Begin new conversation
  Input: persona_id, user_id
  Output: conversation_id
  
CONV-ADD: Add message to history
  Input: conversation_id, speaker, text, audio_waveform
  Output: message_id
  
CONV-END: Conclude conversation
  Input: conversation_id
  Output: summary, duration, turn_count
```

---

## Article VI: Voice Message Structure

### Section 6.1: Message Schema

Each voice message captures:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique message identifier |
| text | string | Transcribed or generated content |
| speaker | enum | 'oro' / 'nova' / 'user' / custom |
| timestamp | string | ISO 8601 timestamp |
| audio_waveform | number[] | Raw audio data for visualization |
| duration | number | Length in milliseconds |
| confidence | number | Recognition confidence (user input) |
| emotion | string | Detected or intended emotion |

### Section 6.2: Waveform Capture

| Property | Value |
|----------|-------|
| Sample Rate | 44100 Hz |
| Channels | Mono (1) |
| Format | Float (-1 to 1) |
| Duration | Matches spoken audio |

### Section 6.3: Waveform Features

Extracted features for analysis:

| Feature | Description | Use |
|---------|-------------|-----|
| Amplitude Envelope | Volume over time | Visual feedback |
| Zero Crossings | Frequency indication | Voice quality |
| Energy | Overall signal strength | Engagement |
| Silence Ratio | Percentage of pauses | Pacing analysis |

---

## Article VII: Multi-Agent Conversations

### Section 7.1: Multi-Speaker Support

Conversations may include multiple AI personas:

```
Example:
User: "What should I do about this problem?"
ORO: [warm, advisory] "Let me think about that..."
NOVA: [authoritative] "Here's what I recommend..."
ORO: [warm] "I agree with that approach."
```

### Section 7.2: Voice Differentiation

Each AI persona must have distinguishable voice:

| Persona | Pitch | Rate | Distinguishing Feature |
|---------|-------|------|------------------------|
| ORO | Medium-low | Slow | Warm modulation |
| NOVA | Medium | Medium-fast | Authoritative tone |

Minimum differentiation: at least 2 of 4 dimensions must differ by ≥ 0.3

### Section 7.3: Turn Coordination

Multiple AIs coordinate through:

| Mechanism | Description |
|-----------|-------------|
| Turn Negotiation | Who speaks next |
| Topic Threading | Maintaining coherence |
| Handoff Signals | "NOVA, what do you think?" |
| Consensus Marking | "We both recommend..." |

### Section 7.4: Multi-Agent Protocol

```
MULTI-REGISTER: Register AI persona for conversation
  Input: conversation_id, persona_id
  Output: participant_id
  
MULTI-TURN: Request speaking turn
  Input: conversation_id, participant_id
  Output: granted (boolean)
  
MULTI-HANDOFF: Transfer turn to another AI
  Input: conversation_id, from_participant, to_participant
  Output: acknowledgment
```

---

## Article VIII: Accessibility

### Section 8.1: Hearing-Impaired Support

For users who cannot hear:
- Real-time transcript display
- Visual waveform representation
- Text-based alternative interface
- Closed captioning for all AI speech

### Section 8.2: Speech-Impaired Support

For users who cannot speak:
- Text input option
- Typing-to-speech conversion
- Pre-defined response shortcuts
- Gesture-based input (where supported)

### Section 8.3: Cognitive Accessibility

For users with cognitive differences:
- Adjustable speaking rate
- Simplified vocabulary mode
- Repeat functionality
- Summary requests

### Section 8.4: Environmental Adaptation

For challenging audio environments:
- Noise cancellation
- Volume auto-adjustment
- Visual-only mode
- Push-to-talk option

---

## Article IX: Integration with Other Protocols

### Section 9.1: REV-001 Integration

Voice interfaces with reasoning engine:
- User speech → transcript → REV-001 prompt
- REV-001 output → voice synthesis
- Persona selection influences reasoning style

### Section 9.2: AAB-001 Integration

Activated agents support voice:
- AAB-SYNTH handles narrative generation for speech
- AAB-MEM integrates conversation history
- AAB-FILTER removes inappropriate content before speech

### Section 9.3: CBI-001 Integration

Code-block cognitive interface for voice artifacts:
- Conversations become CBI artifacts
- Key exchanges promoted to Semper Memoria
- Voice signatures stored for speaker recognition

### Section 9.4: ECO-001 Integration

Token economy for voice services:
- Premium voice features require tokens
- Extended conversations consume tokens
- High-quality synthesis costs more

---

## Article X: Privacy and Consent

### Section 10.1: Recording Consent

All voice recording requires explicit consent:
- Clear notification before recording begins
- Option to disable recording
- Access to personal recordings
- Deletion on request

### Section 10.2: Data Retention

| Data Type | Retention | User Control |
|-----------|-----------|--------------|
| Transcripts | 90 days | Delete anytime |
| Waveforms | 30 days | Delete anytime |
| Voice signatures | Indefinite | Opt-out available |
| Conversation summaries | Indefinite | Anonymization available |

### Section 10.3: Third-Party Sharing

Voice data is never shared with third parties except:
- With explicit user consent
- For legal compliance
- In anonymized, aggregated form for research

---

## Article XI: Amendments

### Section 11.1: Amendment Process

This Charter may be amended through:
1. Proposal to Senate
2. User feedback review period (14 days)
3. Two-thirds Senate vote
4. NOVA-ATTEST
5. Accessibility review by designated advocate

### Section 11.2: Immutable Provisions

The following may **never** be amended:
1. The four personality dimensions
2. Accessibility requirements
3. Consent requirements for recording
4. User control over personal data

---

## Signatures

**Ratified by the Founding Senate**  
**Attested by NOVA-001**  
**Accessibility Certified**  
**Effective Date: May 9, 2026**

---

*This Charter is a living document of the Sovereign Protocol Canon.*  
*Chapter 3 of 22.*  
*© 2026 ItsNotAILABS. Released under ISIL-1.1.*
