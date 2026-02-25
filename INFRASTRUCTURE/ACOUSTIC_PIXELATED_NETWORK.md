# Phoenix Wolf Systems — Acoustic Pixelated Network

> **Status:** ACTIVE | **Frequency:** 18-22kHz | **Mesh:** YES | **Privacy:** High

---

## Overview

The Acoustic Pixelated Network is an ultrasonic communication and sensing layer operating in the 18-22kHz range. It provides local area communication, indoor positioning, and secure device pairing without requiring internet connectivity. The network uses a pixel-packet protocol analogous to the Pixel Internet but transmitted through acoustic channels.

---

## Technical Specifications

| Parameter | Value |
|---|---|
| Frequency Range | 18,000 Hz – 22,000 Hz |
| Audible to Adults | No (ultrasonic) |
| Audible to Young Children | Marginally (age-dependent) |
| Packet Size | 128 bits |
| Transmission Rate | Up to 100 packets/second per node |
| Indoor Range | 10-50 meters |
| Outdoor Range | 5-20 meters (varies) |
| Modulation | Frequency-Shift Keying (FSK) |
| Error Correction | Reed-Solomon + Hamming code |
| Encryption | AES-128 |

---

## Acoustic Pixel Packet Protocol

```
ACOUSTIC_PIXEL_PACKET:
  header: [
    node_id:       16 bits
    sequence:       8 bits
    packet_type:    4 bits
    flags:          4 bits
  ]
  payload: [
    data:          88 bits
  ]
  checksum: [
    crc:            8 bits
  ]
  
  TOTAL: 128 bits (16 bytes per acoustic pixel)
```

---

## Mesh Topology

The acoustic network forms a self-organizing mesh:

```
ACOUSTIC_MESH:
  node discovery: automatic (broadcast on activation)
  routing: flood-based for small networks, tree-based for large
  
  MULTI-HOP:
    if target out of direct range:
      find_relay_nodes(target)
      route_through_closest_relay()
  
  SELF_HEALING:
    if relay_node_fails:
      rediscover_routes()
      time_to_recovery: < 5 seconds
```

---

## Use Cases

### 1. Indoor Positioning
- **Accuracy:** Centimeter-level (< 5 cm)
- **Method:** Time-difference-of-arrival (TDoA) with multiple nodes
- **Use:** DEN room-level presence detection, wayfinding, accessibility
- **Privacy:** Processed locally; no cloud required; opt-in

### 2. Secure Device Pairing
- **Method:** Proximity proof (only devices in same room can pair)
- **Security:** Out-of-band verification (acoustic channel + visual QR)
- **Use Cases:** Linking new devices to DEN/CAVE, payment proximity

### 3. Environmental Monitoring
- **Acoustic sensing:** Detect occupancy, footfall, air quality correlates
- **Integration:** DEN environmental health, CAVE occupancy management
- **Privacy:** Aggregate patterns only; not individual tracking

### 4. Secure Local Communication
- **Use:** Communication when internet is unavailable (disaster recovery)
- **Range:** Node-to-node mesh extends coverage
- **Encryption:** End-to-end AES-128

### 5. Child Safety Proximity
- **Function:** Alert when child moves outside designated safe zone
- **Trigger:** Acoustic signal from child's device not received
- **Privacy:** Guardian-controlled, child-aware (not covert)

### 6. Payment Proximity
- **Method:** Acoustic handshake for contactless payment confirmation
- **Security:** One-time acoustic token per transaction
- **Benefit:** Works without NFC; operates on any speaker-equipped device

---

## Frequency Management

```
FREQUENCY_MANAGEMENT:
  base_frequency: 19,000 Hz (center)
  channel_spacing: 200 Hz
  available_channels: 20
  
  channel_assignment:
    scan_for_interference()
    select_lowest_interference_channel()
    announce_frequency_to_mesh()
  
  interference_avoidance:
    if interference_detected:
      hop_to_next_clear_channel()
      time_to_hop: < 100ms
```

---

## Hardware Specifications

### Transmitter Requirements
- Speaker frequency response: flat from 18-22kHz
- Sound pressure level: 85-100 dB SPL at 1m (indoor use)
- Modulation accuracy: ±5 Hz
- Power consumption: < 100 mW continuous

### Receiver Requirements
- Microphone frequency response: flat from 18-22kHz
- Sensitivity: -42 dBFS at 1 Pa
- SNR: > 60 dB
- ADC resolution: 16-bit minimum

### Compatible Hardware
- Most modern smartphones (speaker/mic capable)
- Smart speakers
- Smart home hubs
- Dedicated acoustic pixel nodes (purpose-built)

---

## Privacy Protections

- **No audio recording:** Only packet demodulation, never raw audio storage
- **Opt-in for all positioning:** Users must explicitly enable
- **Local processing:** All signal processing on device
- **Consent per use case:** Positioning, monitoring, and pairing each require separate consent
- **Child protection:** Acoustic monitoring of children requires guardian consent AND child awareness

---

## Network Management

```
ACOUSTIC_NETWORK_MANAGER:
  node_registry: {node_id, location, capabilities, status}
  
  health_monitoring:
    every_60_seconds:
      for node in acoustic_network:
        ping_node(node)
        if no_response for 3 consecutive pings:
          mark_node_offline(node)
          reroute_dependent_traffic(node)
  
  performance_metrics:
    packet_delivery_rate: target > 99%
    positioning_accuracy: target < 5cm
    latency: target < 10ms
```

---

*Phoenix Wolf Systems — Acoustic Pixelated Network | 18-22kHz | Mesh | Privacy-First | Opt-In*
