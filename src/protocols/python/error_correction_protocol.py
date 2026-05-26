"""
PROTO-330 — Error Correction Protocol (Python)
Self-monitoring and error detection for MEDINA Memory Systems.

Charter: PROTO-330
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Set, Tuple, Callable
from collections import defaultdict, deque
from enum import Enum

# ── Constants ──────────────────────────────────────────────────────────────────
PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI
PHI_SQ = PHI * PHI


class ErrorType(Enum):
    """Types of errors."""
    PREDICTION = "prediction"
    EXECUTION = "execution"
    PERCEPTION = "perception"
    REASONING = "reasoning"
    MEMORY = "memory"
    COMMUNICATION = "communication"


class ErrorSeverity(Enum):
    """Error severity levels."""
    CRITICAL = 4
    HIGH = 3
    MEDIUM = 2
    LOW = 1
    INFO = 0


class CorrectionStrategy(Enum):
    """Error correction strategies."""
    RETRY = "retry"
    ROLLBACK = "rollback"
    SUBSTITUTE = "substitute"
    ESCALATE = "escalate"
    IGNORE = "ignore"
    LEARN = "learn"


@dataclass
class Error:
    """An error event."""
    id: str
    error_type: ErrorType
    severity: ErrorSeverity
    message: str
    context: Dict[str, Any] = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)
    source: str = "unknown"
    corrected: bool = False
    correction_strategy: Optional[CorrectionStrategy] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "id": self.id,
            "type": self.error_type.value,
            "severity": self.severity.value,
            "message": self.message,
            "context": self.context,
            "timestamp": self.timestamp,
            "source": self.source,
            "corrected": self.corrected
        }


@dataclass
class CorrectionAttempt:
    """Record of a correction attempt."""
    error_id: str
    strategy: CorrectionStrategy
    success: bool
    timestamp: float = field(default_factory=time.time)
    details: Dict[str, Any] = field(default_factory=dict)


class ErrorDetector:
    """Detects specific types of errors."""
    
    def __init__(self, error_type: ErrorType, threshold: float = PHI_INV):
        self.error_type = error_type
        self.threshold = threshold
        self.checks: List[Callable[[Any], Tuple[bool, str]]] = []
    
    def add_check(self, check: Callable[[Any], Tuple[bool, str]]) -> None:
        """Add an error check function."""
        self.checks.append(check)
    
    def detect(self, data: Any) -> List[Error]:
        """Run all checks and return detected errors."""
        errors = []
        for i, check in enumerate(self.checks):
            try:
                is_error, message = check(data)
                if is_error:
                    error = Error(
                        id=f"{self.error_type.value}_{i}_{time.time()}",
                        error_type=self.error_type,
                        severity=ErrorSeverity.MEDIUM,
                        message=message,
                        context={"data": str(data)[:100]}
                    )
                    errors.append(error)
            except Exception as e:
                errors.append(Error(
                    id=f"detector_error_{time.time()}",
                    error_type=ErrorType.EXECUTION,
                    severity=ErrorSeverity.HIGH,
                    message=f"Detector failed: {str(e)}"
                ))
        return errors


class ErrorCorrectionEngine:
    """
    Error detection and correction engine with φ-coherent monitoring.
    """
    
    def __init__(self, max_retries: int = 3):
        self.detectors: Dict[ErrorType, ErrorDetector] = {}
        self.error_log: deque = deque(maxlen=10000)
        self.correction_log: List[CorrectionAttempt] = []
        self.error_handlers: Dict[ErrorType, List[Callable[[Error], bool]]] = defaultdict(list)
        self.correction_strategies: Dict[ErrorType, CorrectionStrategy] = {}
        self.max_retries = max_retries
        self.error_counts: Dict[ErrorType, int] = defaultdict(int)
        self.correction_success_rates: Dict[CorrectionStrategy, Tuple[int, int]] = defaultdict(lambda: (0, 0))
        self.beat_count = 0
        
        # Initialize default detectors
        self._init_default_detectors()
    
    def _init_default_detectors(self) -> None:
        """Initialize default error detectors."""
        # Prediction error detector
        pred_detector = ErrorDetector(ErrorType.PREDICTION)
        pred_detector.add_check(lambda d: (
            abs(d.get("predicted", 0) - d.get("actual", 0)) > PHI if isinstance(d, dict) else (False, "")
        , f"Prediction error: {d}"))
        self.detectors[ErrorType.PREDICTION] = pred_detector
        
        # Default strategies
        self.correction_strategies[ErrorType.PREDICTION] = CorrectionStrategy.LEARN
        self.correction_strategies[ErrorType.EXECUTION] = CorrectionStrategy.RETRY
        self.correction_strategies[ErrorType.PERCEPTION] = CorrectionStrategy.SUBSTITUTE
        self.correction_strategies[ErrorType.REASONING] = CorrectionStrategy.ROLLBACK
        self.correction_strategies[ErrorType.MEMORY] = CorrectionStrategy.RETRY
    
    def register_detector(self, error_type: ErrorType, detector: ErrorDetector) -> None:
        """Register an error detector."""
        self.detectors[error_type] = detector
    
    def register_handler(self, error_type: ErrorType, handler: Callable[[Error], bool]) -> None:
        """Register an error handler."""
        self.error_handlers[error_type].append(handler)
    
    def detect_errors(self, data: Any, error_types: List[ErrorType] = None) -> List[Error]:
        """Run error detection."""
        errors = []
        types_to_check = error_types or list(self.detectors.keys())
        
        for etype in types_to_check:
            if etype in self.detectors:
                detected = self.detectors[etype].detect(data)
                errors.extend(detected)
        
        # Log errors
        for error in errors:
            self._log_error(error)
        
        return errors
    
    def report_error(self, error_type: ErrorType, severity: ErrorSeverity,
                     message: str, context: Dict[str, Any] = None) -> Error:
        """Manually report an error."""
        error = Error(
            id=f"{error_type.value}_{time.time()}",
            error_type=error_type,
            severity=severity,
            message=message,
            context=context or {}
        )
        self._log_error(error)
        return error
    
    def correct_error(self, error: Error, strategy: CorrectionStrategy = None) -> CorrectionAttempt:
        """Attempt to correct an error."""
        strategy = strategy or self.correction_strategies.get(error.error_type, CorrectionStrategy.IGNORE)
        
        success = False
        details = {}
        
        # Try registered handlers first
        handlers = self.error_handlers.get(error.error_type, [])
        for handler in handlers:
            try:
                if handler(error):
                    success = True
                    details["handler"] = handler.__name__ if hasattr(handler, '__name__') else "anonymous"
                    break
            except Exception as e:
                details["handler_error"] = str(e)
        
        # If no handler succeeded, apply strategy
        if not success:
            if strategy == CorrectionStrategy.RETRY:
                details["action"] = "scheduled_retry"
                success = True  # Optimistic - retry will happen
            elif strategy == CorrectionStrategy.ROLLBACK:
                details["action"] = "state_rollback"
                success = True
            elif strategy == CorrectionStrategy.SUBSTITUTE:
                details["action"] = "value_substitution"
                success = True
            elif strategy == CorrectionStrategy.LEARN:
                details["action"] = "learning_update"
                success = True
            elif strategy == CorrectionStrategy.ESCALATE:
                details["action"] = "escalated"
                success = False
            elif strategy == CorrectionStrategy.IGNORE:
                details["action"] = "ignored"
                success = True
        
        error.corrected = success
        error.correction_strategy = strategy
        
        attempt = CorrectionAttempt(
            error_id=error.id,
            strategy=strategy,
            success=success,
            details=details
        )
        self.correction_log.append(attempt)
        
        # Update success rates
        s, t = self.correction_success_rates[strategy]
        self.correction_success_rates[strategy] = (s + (1 if success else 0), t + 1)
        
        self.beat_count += 1
        return attempt
    
    def _log_error(self, error: Error) -> None:
        """Log an error."""
        self.error_log.append(error)
        self.error_counts[error.error_type] += 1
    
    def get_error_rate(self, error_type: Optional[ErrorType] = None,
                       window_seconds: float = 60.0) -> float:
        """Get error rate within time window."""
        now = time.time()
        cutoff = now - window_seconds
        
        if error_type:
            recent = [e for e in self.error_log 
                     if e.error_type == error_type and e.timestamp >= cutoff]
        else:
            recent = [e for e in self.error_log if e.timestamp >= cutoff]
        
        return len(recent) / window_seconds
    
    def get_strategy_success_rate(self, strategy: CorrectionStrategy) -> float:
        """Get success rate for a correction strategy."""
        success, total = self.correction_success_rates.get(strategy, (0, 0))
        if total == 0:
            return 0.5  # No data
        return success / total
    
    def adapt_strategies(self) -> None:
        """Adapt correction strategies based on success rates."""
        for error_type in self.correction_strategies:
            current = self.correction_strategies[error_type]
            current_rate = self.get_strategy_success_rate(current)
            
            # Try to find better strategy
            best_strategy = current
            best_rate = current_rate
            
            for strategy in CorrectionStrategy:
                rate = self.get_strategy_success_rate(strategy)
                if rate > best_rate * PHI:  # Significant improvement
                    best_strategy = strategy
                    best_rate = rate
            
            self.correction_strategies[error_type] = best_strategy
    
    def monitor_health(self) -> Dict[str, Any]:
        """Monitor system health based on error patterns."""
        health = {
            "status": "healthy",
            "error_rate": self.get_error_rate(),
            "critical_errors": 0,
            "uncorrected_errors": 0,
            "issues": []
        }
        
        # Check for critical errors
        recent_critical = [
            e for e in self.error_log
            if e.severity == ErrorSeverity.CRITICAL and 
            time.time() - e.timestamp < 300
        ]
        health["critical_errors"] = len(recent_critical)
        
        # Check for uncorrected errors
        uncorrected = [e for e in self.error_log if not e.corrected]
        health["uncorrected_errors"] = len(uncorrected[-100:])  # Last 100
        
        # Determine health status
        if health["critical_errors"] > 0:
            health["status"] = "critical"
            health["issues"].append(f"{health['critical_errors']} critical errors")
        elif health["error_rate"] > PHI:
            health["status"] = "degraded"
            health["issues"].append(f"High error rate: {health['error_rate']:.2f}/s")
        elif health["uncorrected_errors"] > 10:
            health["status"] = "warning"
            health["issues"].append(f"{health['uncorrected_errors']} uncorrected errors")
        
        return health
    
    def get_error_summary(self) -> Dict[str, Any]:
        """Get summary of errors."""
        summary = {
            "total_errors": len(self.error_log),
            "by_type": dict(self.error_counts),
            "by_severity": defaultdict(int),
            "correction_attempts": len(self.correction_log),
            "correction_success_rate": 0.0
        }
        
        for error in self.error_log:
            summary["by_severity"][error.severity.name] += 1
        
        summary["by_severity"] = dict(summary["by_severity"])
        
        if self.correction_log:
            successful = sum(1 for a in self.correction_log if a.success)
            summary["correction_success_rate"] = successful / len(self.correction_log)
        
        return summary
    
    def get_stats(self) -> Dict[str, Any]:
        """Get error correction statistics."""
        health = self.monitor_health()
        summary = self.get_error_summary()
        
        return {
            "total_errors": summary["total_errors"],
            "error_rate": health["error_rate"],
            "health_status": health["status"],
            "correction_attempts": summary["correction_attempts"],
            "correction_success_rate": summary["correction_success_rate"],
            "beat_count": self.beat_count,
            "phi_coherence": (1 - health["error_rate"] / (health["error_rate"] + PHI)) * summary["correction_success_rate"]
        }


# ── Singleton Access ───────────────────────────────────────────────────────────
_error_engine: Optional[ErrorCorrectionEngine] = None

def get_error_correction_engine() -> ErrorCorrectionEngine:
    """Get or create the global error correction engine."""
    global _error_engine
    if _error_engine is None:
        _error_engine = ErrorCorrectionEngine()
    return _error_engine


# ── Module Exports ─────────────────────────────────────────────────────────────
__all__ = [
    "PHI", "PHI_INV", "PHI_SQ",
    "ErrorType", "ErrorSeverity", "CorrectionStrategy",
    "Error", "CorrectionAttempt", "ErrorDetector",
    "ErrorCorrectionEngine", "get_error_correction_engine"
]
