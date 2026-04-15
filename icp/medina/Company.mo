import Array "mo:base/Array";
import T "./Types";

module {
  public func onboard(tenantId : Text, mode : T.OnboardingMode, policyRefs : [Text]) : T.Tenant {
    {
      id = tenantId;
      mode = mode;
      isolated = true;
      policyRefs = policyRefs;
      replayRefs = [];
      createdAtNs = T.nowNs();
    };
  };

  public func connectRecord(tenant : T.Tenant, connectorRef : Text) : T.Tenant {
    {
      id = tenant.id;
      mode = tenant.mode;
      isolated = tenant.isolated;
      policyRefs = tenant.policyRefs;
      replayRefs = Array.append<Text>(tenant.replayRefs, ["connect:" # connectorRef]);
      createdAtNs = tenant.createdAtNs;
    };
  };

  public func internalizeRecord(tenant : T.Tenant, domainRef : Text) : T.Tenant {
    {
      id = tenant.id;
      mode = tenant.mode;
      isolated = tenant.isolated;
      policyRefs = tenant.policyRefs;
      replayRefs = Array.append<Text>(tenant.replayRefs, ["internalize:" # domainRef]);
      createdAtNs = tenant.createdAtNs;
    };
  };

  public func hybridRecord(tenant : T.Tenant, planRef : Text) : T.Tenant {
    {
      id = tenant.id;
      mode = tenant.mode;
      isolated = tenant.isolated;
      policyRefs = tenant.policyRefs;
      replayRefs = Array.append<Text>(tenant.replayRefs, ["hybrid:" # planRef]);
      createdAtNs = tenant.createdAtNs;
    };
  };
};
