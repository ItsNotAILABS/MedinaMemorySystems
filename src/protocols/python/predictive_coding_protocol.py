"""
PROTO-312 — Predictive Coding Protocol (Python)
Predictive processing with φ-coherent error minimization.

Charter: PROTO-312
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas TX | May 2026
"""

from __future__ import annotations
import math
import random
import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Callable
from collections import deque

PHI = (1 + math.sqrt(5)) / 2
PHI_INV = 1 / PHI


@dataclass
class Prediction:
    """A prediction about future state."""
    id: str
    target: str
    predicted_value: Any
    confidence: float
    timestamp: float = field(default_factory=time.time)
    horizon: float = 1.0  # Prediction horizon in time units
    actual_value: Optional[Any] = None
    error: Optional[float] = None
    resolved: bool = False
    
    def resolve(self, actual: Any) -> float:
        """Resolve prediction with actual value."""
        self.actual_value = actual
        self.resolved = True
        
        # Compute error
        if isinstance(self.predicted_value, (int, float)) and isinstance(actual, (int, float)):
            self.error = abs(self.predicted_value - actual)
        else:
            self.error = 0.0 if self.predicted_value == actual else 1.0
        
        return self.error


@dataclass
class PredictiveModel:
    """A model that generates predictions."""
    id: str
    name: str
    target: str
    accuracy: float = 0.5
    prediction_count: int = 0
    total_error: float = 0.0
    learning_rate: float = field(default_factory=lambda: PHI_INV * 0.1)
    
    def predict(self, context: Dict[str, Any]) -> Tuple[Any, float]:
        """Generate a prediction. Override in subclasses."""
        raise NotImplementedError
    
    def update(self, prediction: Prediction) -> None:
        """Update model based on resolved prediction."""
        if prediction.error is not None:
            self.prediction_count += 1
            self.total_error += prediction.error
            
            # Update accuracy with exponential moving average
            error_rate = prediction.error if prediction.error <= 1 else 1.0
            self.accuracy = self.accuracy * (1 - self.learning_rate) + \
                           (1 - error_rate) * self.learning_rate


class LinearPredictor(PredictiveModel):
    """Simple linear predictor."""
    
    def __init__(self, id: str, name: str, target: str):
        super().__init__(id=id, name=name, target=target)
        self.weights: Dict[str, float] = {}
        self.bias = 0.0
        self.history: deque = deque(maxlen=100)
    
    def predict(self, context: Dict[str, Any]) -> Tuple[Any, float]:
        """Generate linear prediction."""
        value = self.bias
        
        for key, weight in self.weights.items():
            if key in context and isinstance(context[key], (int, float)):
                value += weight * context[key]
        
        # Confidence based on accuracy
        confidence = self.accuracy * PHI_INV
        
        return value, confidence
    
    def update(self, prediction: Prediction) -> None:
        """Update with gradient descent."""
        super().update(prediction)
        
        if prediction.error is not None and prediction.error > 0:
            # Simple gradient update
            direction = 1 if prediction.actual_value > prediction.predicted_value else -1
            self.bias += direction * self.learning_rate * PHI_INV


class SequencePredictor(PredictiveModel):
    """Predicts based on sequence patterns."""
    
    def __init__(self, id: str, name: str, target: str, context_length: int = 5):
        super().__init__(id=id, name=name, target=target)
        self.context_length = context_length
        self.history: deque = deque(maxlen=100)
        self.patterns: Dict[tuple, Dict[Any, int]] = {}
    
    def observe(self, value: Any) -> None:
        """Observe a new value."""
        self.history.append(value)
        
        if len(self.history) > self.context_length:
            context = tuple(list(self.history)[-self.context_length-1:-1])
            if context not in self.patterns:
                self.patterns[context] = {}
            
            if value not in self.patterns[context]:
                self.patterns[context][value] = 0
            self.patterns[context][value] += 1
    
    def predict(self, context: Dict[str, Any]) -> Tuple[Any, float]:
        """Predict next value based on history."""
        if len(self.history) < self.context_length:
            return None, 0.0
        
        recent = tuple(list(self.history)[-self.context_length:])
        
        if recent not in self.patterns:
            return None, 0.0
        
        counts = self.patterns[recent]
        total = sum(counts.values())
        best_value = max(counts.keys(), key=lambda k: counts[k])
        confidence = counts[best_value] / total * PHI_INV
        
        return best_value, confidence


class PredictionBuffer:
    """Buffer for managing active predictions."""
    
    def __init__(self, max_size: int = 100):
        self.max_size = max_size
        self.predictions: Dict[str, Prediction] = {}
        self.resolved: List[Prediction] = []
    
    def add(self, prediction: Prediction) -> None:
        """Add a prediction."""
        if len(self.predictions) >= self.max_size:
            self._remove_oldest()
        self.predictions[prediction.id] = prediction
    
    def resolve(self, prediction_id: str, actual: Any) -> Optional[float]:
        """Resolve a prediction."""
        if prediction_id not in self.predictions:
            return None
        
        pred = self.predictions.pop(prediction_id)
        error = pred.resolve(actual)
        self.resolved.append(pred)
        
        # Trim resolved history
        if len(self.resolved) > self.max_size * 2:
            self.resolved = self.resolved[-self.max_size:]
        
        return error
    
    def _remove_oldest(self) -> None:
        """Remove oldest prediction."""
        if self.predictions:
            oldest_id = min(self.predictions.keys(), 
                          key=lambda k: self.predictions[k].timestamp)
            del self.predictions[oldest_id]
    
    def get_pending(self) -> List[Prediction]:
        """Get pending predictions."""
        return list(self.predictions.values())


class PredictiveCodingEngine:
    """
    Main predictive coding engine with φ-coherent error minimization.
    """
    
    def __init__(self):
        self.models: Dict[str, PredictiveModel] = {}
        self.buffer = PredictionBuffer()
        self.context: Dict[str, Any] = {}
        self.beat_count = 0
        self.total_predictions = 0
        self.prediction_counter = 0
    
    def add_model(self, model: PredictiveModel) -> None:
        """Add a predictive model."""
        self.models[model.id] = model
    
    def create_linear_predictor(self, name: str, target: str) -> LinearPredictor:
        """Create and add a linear predictor."""
        model = LinearPredictor(
            id=f"linear-{len(self.models)}",
            name=name,
            target=target
        )
        self.add_model(model)
        return model
    
    def create_sequence_predictor(self, name: str, target: str, 
                                  context_length: int = 5) -> SequencePredictor:
        """Create and add a sequence predictor."""
        model = SequencePredictor(
            id=f"seq-{len(self.models)}",
            name=name,
            target=target,
            context_length=context_length
        )
        self.add_model(model)
        return model
    
    def update_context(self, **kwargs) -> None:
        """Update prediction context."""
        self.context.update(kwargs)
    
    def generate_predictions(self, horizon: float = 1.0) -> List[Prediction]:
        """Generate predictions from all models."""
        predictions = []
        
        for model in self.models.values():
            try:
                predicted, confidence = model.predict(self.context)
                if predicted is not None and confidence > 0:
                    self.prediction_counter += 1
                    pred = Prediction(
                        id=f"pred-{self.prediction_counter}",
                        target=model.target,
                        predicted_value=predicted,
                        confidence=confidence,
                        horizon=horizon
                    )
                    predictions.append(pred)
                    self.buffer.add(pred)
            except Exception:
                pass
        
        self.total_predictions += len(predictions)
        return predictions
    
    def observe(self, target: str, actual_value: Any) -> Dict[str, Any]:
        """Observe actual value and resolve predictions."""
        errors = []
        
        # Find and resolve matching predictions
        to_resolve = [
            pid for pid, p in self.buffer.predictions.items()
            if p.target == target and not p.resolved
        ]
        
        for pid in to_resolve:
            error = self.buffer.resolve(pid, actual_value)
            if error is not None:
                errors.append(error)
                
                # Update corresponding model
                pred = next((p for p in self.buffer.resolved if p.id == pid), None)
                if pred:
                    for model in self.models.values():
                        if model.target == target:
                            model.update(pred)
        
        # Update sequence predictors
        for model in self.models.values():
            if isinstance(model, SequencePredictor) and model.target == target:
                model.observe(actual_value)
        
        avg_error = sum(errors) / len(errors) if errors else 0.0
        
        return {
            "target": target,
            "actual": actual_value,
            "resolved_count": len(errors),
            "avg_error": avg_error,
            "surprise": avg_error * PHI  # High error = high surprise
        }
    
    def prediction_error(self) -> float:
        """Calculate overall prediction error."""
        if not self.buffer.resolved:
            return 0.0
        
        recent = self.buffer.resolved[-50:]
        errors = [p.error for p in recent if p.error is not None]
        return sum(errors) / len(errors) if errors else 0.0
    
    def free_energy(self) -> float:
        """Calculate variational free energy (prediction error bound)."""
        error = self.prediction_error()
        pending = len(self.buffer.get_pending())
        
        return error + pending * PHI_INV * 0.01
    
    def tick(self, elapsed: float = 1.0) -> Dict[str, Any]:
        """Process one time step."""
        self.beat_count += 1
        
        # Generate predictions
        predictions = self.generate_predictions()
        
        return {
            "beat": self.beat_count,
            "models": len(self.models),
            "new_predictions": len(predictions),
            "pending_predictions": len(self.buffer.get_pending()),
            "resolved_total": len(self.buffer.resolved),
            "prediction_error": self.prediction_error(),
            "free_energy": self.free_energy(),
            "phi_coherence": 1 - self.prediction_error() * PHI_INV,
            "timestamp": time.time()
        }
    
    def coherence_report(self) -> Dict[str, Any]:
        """Generate predictive coding report."""
        model_stats = {
            m.id: {"accuracy": m.accuracy, "predictions": m.prediction_count}
            for m in self.models.values()
        }
        
        return {
            "total_models": len(self.models),
            "total_predictions": self.total_predictions,
            "pending_predictions": len(self.buffer.get_pending()),
            "prediction_error": self.prediction_error(),
            "free_energy": self.free_energy(),
            "model_stats": model_stats,
            "phi_metric": 1 - self.free_energy() * PHI_INV,
            "beat": self.beat_count
        }


# ── Singleton accessor ─────────────────────────────────────────────────────────
_engine_instance: Optional[PredictiveCodingEngine] = None

def get_predictive_coding_engine() -> PredictiveCodingEngine:
    """Get or create the singleton PredictiveCodingEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = PredictiveCodingEngine()
    return _engine_instance


# ── Demo ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== PROTO-312 Predictive Coding Protocol (Python) ===")
    
    engine = get_predictive_coding_engine()
    
    # Create predictors
    seq_pred = engine.create_sequence_predictor("temperature_seq", "temperature")
    
    # Simulate temperature sequence
    temps = [20, 21, 22, 23, 24, 25, 24, 23, 22, 21]
    
    for t in temps:
        seq_pred.observe(t)
        engine.update_context(temperature=t)
        predictions = engine.generate_predictions()
        
        if predictions:
            print(f"Predicted: {predictions[0].predicted_value}, Actual: {t}")
        
        result = engine.observe("temperature", t)
    
    print(f"\nPrediction error: {engine.prediction_error():.3f}")
    print(f"Free energy: {engine.free_energy():.3f}")
    print(f"Report: {engine.coherence_report()}")
