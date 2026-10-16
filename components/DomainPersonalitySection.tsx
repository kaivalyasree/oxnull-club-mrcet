'use client';

import React, { useState } from 'react';
import { Domain } from '@/lib/data';
import {
  Shield,
  Terminal,
  Binary,
  Layers,
  Cpu,
  Workflow,
  Search,
  Key,
  Cloud,
  Network,
  Users,
  Eye,
  Radio,
  FileSearch,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Compass
} from 'lucide-react';

interface DomainPersonalitySectionProps {
  domain: Domain;
}

export default function DomainPersonalitySection({ domain }: DomainPersonalitySectionProps) {
  // Domain 1: Red & Blue Team State
  const [tacticalMode, setTacticalMode] = useState<'red' | 'blue'>('red');

  // Domain 2: Forensics Stage State
  const [selectedForensicStage, setSelectedForensicStage] = useState(0);

  // Domain 3: Cryptography Mode State
  const [cryptoTab, setCryptoTab] = useState<'lattice' | 'tls'>('lattice');

  // Domain 4: Cloud Topology Selected Node
  const [selectedCloudNode, setSelectedCloudNode] = useState(0);

  // Domain 5: Security Architecture Layer
  const [activeArchLayer, setActiveArchLayer] = useState(0);

  // Domain 6: Awareness Triage State
  const [analyzedPhish, setAnalyzedPhish] = useState(false);

  // Domain 7: Explore Frontier Track
  const [selectedFrontier, setSelectedFrontier] = useState(0);

  // =========================================================================
  // 1. RED & BLUE TEAM — TACTICAL ENGAGEMENT MATRIX
  // Controlled tactical visual language in Pink/Lilac/Gold/Ivory palette
  // =========================================================================
  if (domain.slug === 'red-blue-team') {
    return (
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
              Dual Tactical Operations
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#151417]">
              Adversary Simulation & Defensive Telemetry
            </h3>
          </div>

          <div className="flex items-center p-1 rounded-2xl bg-[#F5EBDD]/60 border border-[#E8D8C3]">
            <button
              onClick={() => setTacticalMode('red')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                tacticalMode === 'red'
                  ? 'bg-[#151417] text-[#FAF7F2] shadow-sm'
                  : 'text-[#645E6D] hover:text-[#151417]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#C78B96]" />
              <span>Adversarial (Red)</span>
            </button>
            <button
              onClick={() => setTacticalMode('blue')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                tacticalMode === 'blue'
                  ? 'bg-[#151417] text-[#FAF7F2] shadow-sm'
                  : 'text-[#645E6D] hover:text-[#151417]'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#C2A9D4]" />
              <span>Telemetry (Blue)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-card rounded-3xl p-6 sm:p-10 border-[#D4AF37]/30 bg-white/95">
          <div className="lg:col-span-6 space-y-4">
            {tacticalMode === 'red' ? (
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF0F2] text-[#C78B96] border border-[#EDCED3]">
                  <span>Offensive Simulation Guild</span>
                </div>
                <h4 className="text-2xl font-black text-[#151417]">
                  Adversary Emulation & Kerberos Lateral Movement
                </h4>
                <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
                  Working groups systematically recreate real-world APT intrusion paths in dedicated air-gapped virtualization. Students learn memory injection, service principal extraction, and EDR bypass methodology under strict ethical protocols.
                </p>
                <div className="space-y-2 pt-2">
                  {[
                    'Active Directory Golden/Silver Ticket generation & TGS harvesting',
                    'Process hollowing, unhooking ntdll.dll, and syscall evasion',
                    'Automated post-exploitation telemetry scripts in Python & Go'
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-[#FAF0F2]/50 border border-[#EDCED3] text-xs font-medium text-[#151417] flex items-center gap-2"
                    >
                      <span className="text-[#C78B96] font-bold">0{i + 1}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#F4EEF7] text-[#C2A9D4] border border-[#EBE1F0]">
                  <span>Defensive Triage Guild</span>
                </div>
                <h4 className="text-2xl font-black text-[#151417]">
                  Incident Detection, Sigma Rules & SIEM Telemetry
                </h4>
                <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
                  Every offensive technique generates telemetry. Defenders construct high-fidelity Sigma detection rules, correlate Sysmon process creation events, and author automated SOAR containment playbooks to isolate rogue endpoints within milliseconds.
                </p>
                <div className="space-y-2 pt-2">
                  {[
                    'Sysmon Event ID 1 & 7 behavioral correlation in Splunk & Elastic',
                    'Sigma rule deployment for LSASS memory dumping detection',
                    'Automated firewall null-routing and API quarantine triggers'
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-[#F4EEF7]/50 border border-[#EBE1F0] text-xs font-medium text-[#151417] flex items-center gap-2"
                    >
                      <span className="text-[#C2A9D4] font-bold">0{i + 1}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-[#151417] text-[#FAF7F2] p-5 font-mono text-xs border border-[#2F2D36] shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2F2D36]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] text-[#8A8592]">
                  0xnull-session // {tacticalMode === 'red' ? 'adversary-range-01' : 'soc-telemetry-04'}
                </span>
              </div>
              {tacticalMode === 'red' ? (
                <div className="space-y-1.5 text-[11px] text-[#9E9AA6]">
                  <p className="text-[#E5C378]">$ 0xnull-kerberoast --target domain-controller.internal</p>
                  <p className="text-emerald-400">[+] Authenticated Kerberos ticket requested</p>
                  <p className="text-amber-300">[!] SPN extracted: MSSQLSvc/db01:1433</p>
                  <p className="text-[#FAF7F2]">[+] Hash saved: $krb5tgs$23$*user$realm$*hash...</p>
                  <p className="text-[#8A8592]">// Status: Handed to offline hashcat queue</p>
                </div>
              ) : (
                <div className="space-y-1.5 text-[11px] text-[#9E9AA6]">
                  <p className="text-[#E5C378]">$ 0xnull-hunt --rule sigma-win-kerberoast-anomaly</p>
                  <p className="text-emerald-400">[+] Ingesting EventCode=4769 (Kerberos Service Ticket)</p>
                  <p className="text-amber-300">[!] Anomaly detected: EncryptionType 0x17 requested</p>
                  <p className="text-[#FAF7F2]">[&gt;] Host IP quarantined: 10.140.22.45</p>
                  <p className="text-[#8A8592]">// Alert dispatched to On-Call SOC Triage</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // 2. DIGITAL FORENSICS — EVIDENTIARY TIMELINE & ARTIFACT RECONSTRUCTION
  // Investigative motion, evidence stages, hex dumps in 0XNULL palette
  // =========================================================================
  if (domain.slug === 'digital-forensics') {
    const forensicStages = [
      {
        step: '01',
        title: 'RAM & Volatile Triage',
        tool: 'Volatility 3',
        artifact: 'kernel32.dll base injection',
        hash: 'SHA256: 4a2f8b...9c1d'
      },
      {
        step: '02',
        title: 'Master File Table ($MFT)',
        tool: 'MFTECmd',
        artifact: '$STANDARD_INFORMATION timestomping',
        hash: 'SHA256: e8710a...bb54'
      },
      {
        step: '03',
        title: 'Registry Hive Analysis',
        tool: 'RegRipper',
        artifact: 'ShimCache & Amcache execution proof',
        hash: 'SHA256: 12c49d...338e'
      },
      {
        step: '04',
        title: 'Event Log Reconstruction',
        tool: 'Hayabusa',
        artifact: 'EventID 4624 (Logon Type 3 lateral)',
        hash: 'SHA256: 993da7...601b'
      }
    ];

    return (
      <section className="space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
            Evidentiary Timeline
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#151417]">
            Investigative Motion & Artifact Reconstruction
          </h3>
          <p className="text-xs sm:text-sm text-[#55505C] mt-1 max-w-2xl">
            Explore how forensic analysts trace adversary footprints from volatile memory capture to complete chronological timeline synthesis.
          </p>
        </div>

        {/* Interactive Timeline Stepper */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {forensicStages.map((stage, idx) => (
            <button
              key={stage.step}
              onClick={() => setSelectedForensicStage(idx)}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                selectedForensicStage === idx
                  ? 'bg-white border-[#C89D3C] shadow-md ring-1 ring-[#D4AF37]/40'
                  : 'bg-white/70 border-[#E8D8C3] hover:bg-white'
              }`}
            >
              <span className="font-mono text-xs font-bold text-[#967223] block mb-1">
                STAGE {stage.step}
              </span>
              <h5 className="font-bold text-sm text-[#151417] leading-snug">{stage.title}</h5>
            </button>
          ))}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37]/35 bg-white/95">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                CHAIN OF CUSTODY VERIFIED
              </span>
              <h4 className="text-2xl font-black text-[#151417]">
                {forensicStages[selectedForensicStage].title}
              </h4>
              <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
                Utilizing {forensicStages[selectedForensicStage].tool} to isolate evidentiary artifacts without contaminating source disk or RAM hashes.
              </p>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8D8C3] text-xs font-mono space-y-1">
                <p className="text-[#8C6B1B]">Primary Artifact: {forensicStages[selectedForensicStage].artifact}</p>
                <p className="text-[#8A8592]">{forensicStages[selectedForensicStage].hash}</p>
              </div>
            </div>

            <div className="md:col-span-5 rounded-2xl bg-[#151417] text-[#FAF7F2] p-4 font-mono text-[11px] border border-[#2F2D36]">
              <div className="text-[#8A8592] pb-2 mb-2 border-b border-[#2F2D36]">Hex Artifact Offset Inspection</div>
              <p className="text-[#E5C378]">00000040: 4d 5a 90 00 03 00 00 00  40 00 00 00 ff ff 00 00</p>
              <p className="text-emerald-400">00000050: b8 00 00 00 00 00 00 00  40 00 00 00 00 00 00 00</p>
              <p className="text-amber-300">00000060: [!] MZ PE Header Confirmed in Unbacked Memory Region</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // 3. CRYPTOGRAPHY — MATHEMATICAL GEOMETRY & POST-QUANTUM CIPHERS
  // Lattice matrices, TLS 1.3 handshakes, champagne/lilac geometry
  // =========================================================================
  if (domain.slug === 'cryptography') {
    return (
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
              Mathematical Foundations
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#151417]">
              Post-Quantum Lattice Ciphers & Protocol Engineering
            </h3>
          </div>

          <div className="flex items-center p-1 rounded-2xl bg-[#F5EBDD]/60 border border-[#E8D8C3]">
            <button
              onClick={() => setCryptoTab('lattice')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                cryptoTab === 'lattice' ? 'bg-[#151417] text-[#FAF7F2]' : 'text-[#645E6D]'
              }`}
            >
              Post-Quantum Lattice (ML-KEM)
            </button>
            <button
              onClick={() => setCryptoTab('tls')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                cryptoTab === 'tls' ? 'bg-[#151417] text-[#FAF7F2]' : 'text-[#645E6D]'
              }`}
            >
              TLS 1.3 Key Exchange
            </button>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-10 border-[#D4AF37]/35 bg-white/95">
          {cryptoTab === 'lattice' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-mono font-bold text-[#967223]">NIST FIPS 203 / FIPS 204 COMPLIANT</span>
                <h4 className="text-2xl font-black text-[#151417]">
                  Module-Lattice-Based Key-Encapsulation Mechanism
                </h4>
                <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
                  Classical RSA and ECC ciphers fall to Shor’s algorithm on quantum systems. 0XNULL cryptography cohorts implement polynomial lattice rings where hardness derives from the Shortest Vector Problem (SVP).
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#F4EEF7]/50 border border-[#EBE1F0]">
                    <span className="text-[10px] font-bold uppercase text-[#C2A9D4] block">Matrix Ring</span>
                    <span className="text-xs font-bold text-[#151417]">Rq = Zq[X] / (X^256 + 1)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF0F2]/50 border border-[#EDCED3]">
                    <span className="text-[10px] font-bold uppercase text-[#C78B96] block">Quantum Security</span>
                    <span className="text-xs font-bold text-[#151417]">NIST Category 3 (192-bit)</span>
                  </div>
                </div>
              </div>

              {/* Visual Lattice Pattern Grid */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] flex flex-col items-center justify-center">
                <div className="grid grid-cols-5 gap-3 p-4">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                        i % 4 === 0
                          ? 'bg-[#E5C378]/30 border-[#C89D3C] text-[#8C6B1B]'
                          : 'bg-white border-[#E8D8C3] text-[#8A8592]'
                      }`}
                    >
                      {i % 4 === 0 ? 'λ' : '0'}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-[#8A8592] mt-2 font-mono">256-Dimensional Lattice Vector Slice</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-2xl font-black text-[#151417]">TLS 1.3 Ephemeral Key Agreement</h4>
              <p className="text-xs sm:text-sm text-[#55505C] max-w-2xl leading-relaxed">
                Single round-trip handshakes with forward secrecy, utilizing X25519 elliptic curves paired with HKDF key derivation functions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3]">
                  <span className="text-xs font-mono font-bold text-[#967223] block mb-1">STEP 1</span>
                  <h6 className="font-bold text-sm text-[#151417]">ClientHello + KeyShare</h6>
                  <p className="text-xs text-[#645E6D] mt-1">Client generates ephemeral keypair and offers ciphersuite.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3]">
                  <span className="text-xs font-mono font-bold text-[#967223] block mb-1">STEP 2</span>
                  <h6 className="font-bold text-sm text-[#151417]">ServerHello + EncryptedExtensions</h6>
                  <p className="text-xs text-[#645E6D] mt-1">Server completes Diffie-Hellman calculation and derives master secret.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3]">
                  <span className="text-xs font-mono font-bold text-[#967223] block mb-1">STEP 3</span>
                  <h6 className="font-bold text-sm text-[#151417]">Authenticated Session</h6>
                  <p className="text-xs text-[#645E6D] mt-1">ChaCha20-Poly1305 symmetric AEAD encryption active.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // =========================================================================
  // 4. CLOUD SECURITY — FLOATING INFRASTRUCTURE & IAM TOPOLOGY NODES
  // Floating node topology, least privilege verification, container security
  // =========================================================================
  if (domain.slug === 'cloud-security') {
    const cloudNodes = [
      { name: 'Identity Provider (IAM)', role: 'AWS IAM / Okta OIDC Federation', status: 'Enforcing MFA & Least Privilege' },
      { name: 'Kubernetes Control Plane', role: 'API Server Admission Webhooks', status: 'mTLS Enabled & Audit Logging' },
      { name: 'eBPF Runtime Defense', role: 'Tetragon / Falco Kernel Probes', status: 'Active Syscall Interception' },
      { name: 'Encrypted S3 Enclave', role: 'AWS KMS CMK Customer Keys', status: 'Server-Side AES-256 GCM' }
    ];

    return (
      <section className="space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
            Infrastructure Topology
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#151417]">
            Connected Cloud Nodes & IAM Trust Perimeters
          </h3>
          <p className="text-xs sm:text-sm text-[#55505C] mt-1 max-w-2xl">
            Audit cloud configuration posture, container runtime telemetry, and zero-trust IAM roles across multi-cloud infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cloudNodes.map((node, idx) => (
            <div
              key={node.name}
              onClick={() => setSelectedCloudNode(idx)}
              className={`glass-card rounded-2xl p-5 border transition-all cursor-pointer ${
                selectedCloudNode === idx
                  ? 'border-[#C89D3C] shadow-lg ring-1 ring-[#D4AF37]/50 bg-white'
                  : 'border-[#E8D8C3] hover:border-[#C89D3C]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Cloud className="w-5 h-5 text-[#C89D3C]" />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Node 0{idx + 1}
                </span>
              </div>
              <h5 className="font-bold text-sm text-[#151417] mb-1">{node.name}</h5>
              <p className="text-xs text-[#8C6B1B] font-medium mb-2">{node.role}</p>
              <p className="text-[11px] text-[#645E6D]">{node.status}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // =========================================================================
  // 5. SECURITY ARCHITECTURE — LAYERED DEFENSE-IN-DEPTH STACK
  // Isometric defense layers, threat modeling matrices in 0XNULL palette
  // =========================================================================
  if (domain.slug === 'security-architecture') {
    const archLayers = [
      { layer: 'L5', name: 'Cryptographic Data Enclave', focus: 'FIPS 140-3 Hardware Security Modules & Key Splitting' },
      { layer: 'L4', name: 'Application Runtime Mesh', focus: 'Mutual TLS (mTLS) with SPIFFE/SPIRE Identity Attestation' },
      { layer: 'L3', name: 'Zero-Trust Identity Engine', focus: 'Continuous Risk-Based Evaluation with Policy Decision Points (PDP)' },
      { layer: 'L2', name: 'Microsegmented Network', focus: 'Software-Defined Perimeters with Calico eBPF Enforcement' },
      { layer: 'L1', name: 'Edge Ingress & DDoS Defense', focus: 'Anycast Scrubbing Perimeters & Intelligent WAF Rulesets' }
    ];

    return (
      <section className="space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
            Systemic Engineering
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#151417]">
            Defense-in-Depth Layered Architecture
          </h3>
          <p className="text-xs sm:text-sm text-[#55505C] mt-1 max-w-2xl">
            Security is engineered into system topology, not retrofitted. Inspect each architectural layer from edge ingress to cryptographic data enclaves.
          </p>
        </div>

        <div className="space-y-2.5">
          {archLayers.map((l, idx) => (
            <div
              key={l.layer}
              onClick={() => setActiveArchLayer(idx)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                activeArchLayer === idx
                  ? 'bg-white border-[#C89D3C] shadow-md ring-1 ring-[#D4AF37]/40'
                  : 'bg-white/80 border-[#E8D8C3] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#151417] text-[#FAF7F2] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {l.layer}
                </span>
                <div>
                  <h5 className="font-bold text-sm text-[#151417]">{l.name}</h5>
                  <p className="text-xs text-[#55505C]">{l.focus}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3] self-start sm:self-auto">
                ISO 27001 / SABSA Aligned
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // =========================================================================
  // 6. AWARENESS — HUMAN-CENTERED COGNITIVE DEFENSE
  // Social engineering detection, communication briefs in pearl/blush glass
  // =========================================================================
  if (domain.slug === 'awareness') {
    return (
      <section className="space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
            Cognitive Security
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#151417]">
            Human-Centered Defense & Threat Communication
          </h3>
          <p className="text-xs sm:text-sm text-[#55505C] mt-1 max-w-2xl">
            Social engineering bypasses hardware firewalls. Learn to detect cognitive manipulation, spoofed headers, and executive impersonation vectors.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37]/35 bg-white/95">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs font-mono font-bold text-[#C78B96] px-2.5 py-0.5 rounded-full bg-[#FAF0F2] border border-[#EDCED3]">
                SIMULATED INGESTION TRIAGE
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-[#151417]">
                Cognitive Urgent Manipulation Vector
              </h4>
              <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
                Click below to simulate forensic header inspection on an inbound executive spoofing attempt.
              </p>
              <button
                onClick={() => setAnalyzedPhish(!analyzedPhish)}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#151417] text-white hover:bg-[#2A2830] transition-colors cursor-pointer"
              >
                {analyzedPhish ? 'Reset Email Analysis' : 'Inspect Spoofed Payload Indicators'}
              </button>
            </div>

            <div className="md:col-span-5 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-2 text-xs font-mono">
              <div className="text-[10px] text-[#8A8592] pb-1 border-b border-[#E8D8C3]">RFC 5322 Inbound Header Audit</div>
              <p className="text-[#151417]">From: &quot;Dean Office&quot; &lt;dean@unıversity.edu&gt;</p>
              {analyzedPhish ? (
                <div className="space-y-1.5 pt-2 text-[11px] animate-in fade-in duration-200">
                  <p className="text-rose-700 font-bold">[!] Punycode attack: &apos;ı&apos; (Turkish dotless i) used</p>
                  <p className="text-rose-700 font-bold">[!] SPF Result: SoftFail (IP not authorized)</p>
                  <p className="text-emerald-700 font-bold">[+] Triage: Automatically quarantined from student inbox</p>
                </div>
              ) : (
                <p className="text-[#8A8592] pt-2 italic">Awaiting header triage inspection...</p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // 7. EXPLORE TRACK — DISCOVERY PATHWAYS & EMERGENT FRONTIERS
  // Research radar, emergent sandbox in 0XNULL palette
  // =========================================================================
  if (domain.slug === 'explore') {
    const frontiers = [
      { name: 'Adversarial Machine Learning', topic: 'Prompt Injection & Model Weight Poisoning', tag: 'AI/ML' },
      { name: 'Hardware & RF Telemetry', topic: 'UART Glitching & Software Defined Radio (SDR)', tag: 'Hardware' },
      { name: 'Space & Satellite Systems', topic: 'CCSDS Telemetry Protocol Verification', tag: 'Aerospace' },
      { name: 'Zero-Knowledge Cryptography', topic: 'zk-SNARKs & Privacy-Preserving Proofs', tag: 'Math' }
    ];

    return (
      <section className="space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
            Uncharted Territory
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#151417]">
            Emergent Technology Radar & Research Sandbox
          </h3>
          <p className="text-xs sm:text-sm text-[#55505C] mt-1 max-w-2xl">
            For members pursuing novel research beyond conventional syllabi. Explore cutting-edge intersections of artificial intelligence, hardware, and space systems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {frontiers.map((f, idx) => (
            <div
              key={f.name}
              onClick={() => setSelectedFrontier(idx)}
              className={`glass-card rounded-2xl p-5 border transition-all cursor-pointer ${
                selectedFrontier === idx
                  ? 'border-[#C89D3C] shadow-md ring-1 ring-[#D4AF37]/50 bg-white'
                  : 'border-[#E8D8C3] hover:border-[#C89D3C]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Compass className="w-5 h-5 text-[#C89D3C]" />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                  {f.tag}
                </span>
              </div>
              <h5 className="font-bold text-sm text-[#151417] mb-1">{f.name}</h5>
              <p className="text-xs text-[#55505C] leading-relaxed">{f.topic}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return null;
}
