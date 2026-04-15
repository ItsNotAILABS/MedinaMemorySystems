import Float "mo:base/Float";
import Nat "mo:base/Nat";

module {
  // Mathematical + physics + chemistry style state equations for MEDINA runtime framing.
  public type FieldState = {
    attention : Float;
    coherence : Float;
    risk : Float;
    memoryEntropy : Float;
    chemistryPotential : Float;
  };

  // RECITAL_PLUS_ONE algebraic form.
  public func recitalPlusOne(stateN : Float, lawfulExpansion : Float) : Float {
    stateN + lawfulExpansion;
  };

  // Macro field absorbs all micro domains every beat.
  public func macroAbsorption(macroField : Float, microDomains : [Float]) : Float {
    var acc = macroField;
    for (v in microDomains.vals()) {
      acc += v;
    };
    acc;
  };

  // Dual read fusion energy.
  public func dualReadEnergy(semantic : Float, resonance : Float) : Float {
    (semantic * 0.5) + (resonance * 0.5);
  };

  // Physics-inspired stability: kinetic pressure vs binding coherence.
  public func physicsStability(bindingCoherence : Float, kineticPressure : Float) : Float {
    bindingCoherence - kineticPressure;
  };

  // Chemistry-inspired potential: synthesis minus decay.
  public func chemistryPotential(synthesisRate : Float, decayRate : Float) : Float {
    synthesisRate - decayRate;
  };

  // Memory potential from geometry.
  public func memoryPotential(depth : Nat, ring : Nat, salience : Nat) : Float {
    let d = Float.fromInt(Nat.toInt(depth));
    let r = Float.fromInt(Nat.toInt(ring));
    let s = Float.fromInt(Nat.toInt(salience));
    (s + 1.0) / ((d + 1.0) * (r + 1.0));
  };
};
