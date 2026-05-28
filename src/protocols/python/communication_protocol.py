"""
PROTO-332 — Communication Protocol (Python)
Multi-agent communication and message passing for MEDINA Memory Systems.

Charter: PROTO-332
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
import uuid
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Callable
from collections import defaultdict, deque
from enum import Enum

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI


class MessageType(Enum):
    """Types of messages."""
    INFORM = "inform"
    REQUEST = "request"
    QUERY = "query"
    REPLY = "reply"
    BROADCAST = "broadcast"
    SUBSCRIBE = "subscribe"
    ACKNOWLEDGE = "acknowledge"
    ERROR = "error"


class Priority(Enum):
    """Message priority levels."""
    CRITICAL = 4
    HIGH = 3
    NORMAL = 2
    LOW = 1


@dataclass
class Message:
    """A communication message."""
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    sender_id: str = ""
    receiver_id: str = ""
    message_type: MessageType = MessageType.INFORM
    priority: Priority = Priority.NORMAL
    content: Any = None
    timestamp: float = field(default_factory=time.time)
    reply_to: Optional[str] = None
    ttl: float = 60.0  # Time to live in seconds
    delivered: bool = False
    acknowledged: bool = False
    
    def is_expired(self) -> bool:
        """Check if message has expired."""
        return time.time() - self.timestamp > self.ttl
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "id": self.id,
            "sender": self.sender_id,
            "receiver": self.receiver_id,
            "type": self.message_type.value,
            "priority": self.priority.value,
            "content": self.content,
            "timestamp": self.timestamp
        }


@dataclass
class Channel:
    """A communication channel."""
    id: str
    name: str
    subscribers: Set[str] = field(default_factory=set)
    message_queue: deque = field(default_factory=lambda: deque(maxlen=1000))
    created_at: float = field(default_factory=time.time)
    
    def subscribe(self, agent_id: str) -> bool:
        """Subscribe an agent to this channel."""
        self.subscribers.add(agent_id)
        return True
    
    def unsubscribe(self, agent_id: str) -> bool:
        """Unsubscribe an agent from this channel."""
        self.subscribers.discard(agent_id)
        return True
    
    def publish(self, message: Message) -> int:
        """Publish message to all subscribers."""
        self.message_queue.append(message)
        return len(self.subscribers)


@dataclass
class Agent:
    """A communicating agent."""
    id: str
    name: str
    inbox: deque = field(default_factory=lambda: deque(maxlen=1000))
    outbox: deque = field(default_factory=lambda: deque(maxlen=1000))
    subscriptions: Set[str] = field(default_factory=set)
    handlers: Dict[MessageType, Callable[[Message], Any]] = field(default_factory=dict)
    active: bool = True
    
    def receive(self, message: Message) -> bool:
        """Receive a message."""
        if not self.active:
            return False
        message.delivered = True
        self.inbox.append(message)
        return True
    
    def send(self, message: Message) -> None:
        """Queue a message for sending."""
        message.sender_id = self.id
        self.outbox.append(message)
    
    def process_inbox(self) -> List[Any]:
        """Process all messages in inbox."""
        results = []
        while self.inbox:
            message = self.inbox.popleft()
            if message.message_type in self.handlers:
                result = self.handlers[message.message_type](message)
                results.append(result)
        return results


class CommunicationEngine:
    """
    Multi-agent communication engine with φ-coherent message passing.
    """
    
    def __init__(self, max_queue_size: int = 10000):
        self.agents: Dict[str, Agent] = {}
        self.channels: Dict[str, Channel] = {}
        self.message_log: deque = deque(maxlen=max_queue_size)
        self.pending_messages: deque = deque(maxlen=max_queue_size)
        self.delivery_stats: Dict[str, int] = defaultdict(int)
        self.beat_count = 0
    
    def register_agent(self, id: str, name: str) -> Agent:
        """Register a new agent."""
        agent = Agent(id=id, name=name)
        self.agents[id] = agent
        return agent
    
    def create_channel(self, id: str, name: str) -> Channel:
        """Create a communication channel."""
        channel = Channel(id=id, name=name)
        self.channels[id] = channel
        return channel
    
    def subscribe_to_channel(self, agent_id: str, channel_id: str) -> bool:
        """Subscribe an agent to a channel."""
        if agent_id not in self.agents or channel_id not in self.channels:
            return False
        
        channel = self.channels[channel_id]
        agent = self.agents[agent_id]
        channel.subscribe(agent_id)
        agent.subscriptions.add(channel_id)
        return True
    
    def send_message(self, sender_id: str, receiver_id: str,
                     message_type: MessageType, content: Any,
                     priority: Priority = Priority.NORMAL,
                     reply_to: Optional[str] = None) -> Message:
        """Send a direct message."""
        message = Message(
            sender_id=sender_id,
            receiver_id=receiver_id,
            message_type=message_type,
            priority=priority,
            content=content,
            reply_to=reply_to
        )
        
        self.pending_messages.append(message)
        self.message_log.append(message)
        return message
    
    def broadcast(self, sender_id: str, channel_id: str,
                  content: Any, priority: Priority = Priority.NORMAL) -> int:
        """Broadcast to a channel."""
        if channel_id not in self.channels:
            return 0
        
        channel = self.channels[channel_id]
        message = Message(
            sender_id=sender_id,
            receiver_id=channel_id,
            message_type=MessageType.BROADCAST,
            priority=priority,
            content=content
        )
        
        # Deliver to all subscribers
        delivered = 0
        for subscriber_id in channel.subscribers:
            if subscriber_id != sender_id and subscriber_id in self.agents:
                msg_copy = Message(
                    id=f"{message.id}_{subscriber_id}",
                    sender_id=sender_id,
                    receiver_id=subscriber_id,
                    message_type=MessageType.BROADCAST,
                    priority=priority,
                    content=content
                )
                if self.agents[subscriber_id].receive(msg_copy):
                    delivered += 1
        
        channel.publish(message)
        self.message_log.append(message)
        self.delivery_stats["broadcast"] += delivered
        return delivered
    
    def query(self, sender_id: str, receiver_id: str, query: Any,
              timeout: float = 5.0) -> Message:
        """Send a query and wait for reply."""
        message = self.send_message(
            sender_id=sender_id,
            receiver_id=receiver_id,
            message_type=MessageType.QUERY,
            content=query,
            priority=Priority.HIGH
        )
        return message
    
    def reply(self, original_message: Message, content: Any) -> Message:
        """Reply to a message."""
        return self.send_message(
            sender_id=original_message.receiver_id,
            receiver_id=original_message.sender_id,
            message_type=MessageType.REPLY,
            content=content,
            reply_to=original_message.id
        )
    
    def acknowledge(self, message: Message) -> Message:
        """Send acknowledgment for a message."""
        message.acknowledged = True
        return self.send_message(
            sender_id=message.receiver_id,
            receiver_id=message.sender_id,
            message_type=MessageType.ACKNOWLEDGE,
            content={"message_id": message.id},
            priority=Priority.LOW
        )
    
    def process_pending(self) -> int:
        """Process and deliver pending messages."""
        delivered = 0
        
        while self.pending_messages:
            message = self.pending_messages.popleft()
            
            if message.is_expired():
                self.delivery_stats["expired"] += 1
                continue
            
            if message.receiver_id in self.agents:
                agent = self.agents[message.receiver_id]
                if agent.receive(message):
                    delivered += 1
                    self.delivery_stats["delivered"] += 1
            else:
                self.delivery_stats["undeliverable"] += 1
        
        self.beat_count += 1
        return delivered
    
    def process_agent_outboxes(self) -> int:
        """Process all agent outboxes."""
        total = 0
        for agent in self.agents.values():
            while agent.outbox:
                message = agent.outbox.popleft()
                self.pending_messages.append(message)
                self.message_log.append(message)
                total += 1
        return total
    
    def get_messages_for_agent(self, agent_id: str,
                                message_type: Optional[MessageType] = None) -> List[Message]:
        """Get messages for an agent from log."""
        messages = []
        for msg in self.message_log:
            if msg.receiver_id == agent_id:
                if message_type is None or msg.message_type == message_type:
                    messages.append(msg)
        return messages
    
    def get_channel_history(self, channel_id: str, limit: int = 100) -> List[Message]:
        """Get message history for a channel."""
        if channel_id not in self.channels:
            return []
        return list(self.channels[channel_id].message_queue)[-limit:]
    
    def compute_message_rate(self, window_seconds: float = 60.0) -> float:
        """Compute message rate."""
        now = time.time()
        cutoff = now - window_seconds
        recent = sum(1 for m in self.message_log if m.timestamp >= cutoff)
        return recent / window_seconds
    
    def get_stats(self) -> Dict[str, Any]:
        """Get communication statistics."""
        message_types = defaultdict(int)
        for msg in self.message_log:
            message_types[msg.message_type.value] += 1
        
        return {
            "total_agents": len(self.agents),
            "active_agents": sum(1 for a in self.agents.values() if a.active),
            "total_channels": len(self.channels),
            "total_messages": len(self.message_log),
            "pending_messages": len(self.pending_messages),
            "message_rate": self.compute_message_rate(),
            "messages_by_type": dict(message_types),
            "delivery_stats": dict(self.delivery_stats),
            "beat_count": self.beat_count,
            "phi_coherence": self.delivery_stats.get("delivered", 0) / 
                            (sum(self.delivery_stats.values()) + 1) * PHI_INV
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_comm_engine: Optional[CommunicationEngine] = None

def get_communication_engine() -> CommunicationEngine:
    """Get or create the global communication engine."""
    global _comm_engine
    if _comm_engine is None:
        _comm_engine = CommunicationEngine()
    return _comm_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "MessageType", "Priority", "Message", "Channel", "Agent",
    "CommunicationEngine", "get_communication_engine"
]
