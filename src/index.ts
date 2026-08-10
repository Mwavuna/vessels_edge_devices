import { Vessel } from "./domain/Vessel";
import { CoolingSystem } from "./subsystems/cooling/CoolingSystem";
import { ElectricalSystem } from "./subsystems/electrical/ElectricalSubsystem";
import { FuelSystem } from "./subsystems/fuel/FuelSystem";
import { LubricationSystem } from "./subsystems/lubrication/LubricationSystem";
import { PropulsionSystem } from "./subsystems/propulsion/PropulsionSystem";
import mqtt from "mqtt";

const mqttClient = mqtt.connect("mqtt://localhost:1883");

const vessel = new Vessel(
    {
        deviceId: "MV001",
        serialNumber: "SN001",
        firmwareVersion: "1.0.0"
    },
    [
        new PropulsionSystem(),
        new FuelSystem(),
        new CoolingSystem(),
        new ElectricalSystem(),
        new LubricationSystem(),
    ]
);

let presenceInterval: NodeJS.Timeout | null = null;

mqttClient.on("connect", () => {
    console.log("✅ Connected to MQTT Broker");

    // publish retained presence so server knows this edge simulator is online
    mqttClient.publish(`vessels/${vessel.identity.deviceId}/presence`, JSON.stringify({ status: 'online' }), { retain: true });

    mqttClient.subscribe("vessels/+/commands", (err) => {
        if (err) {
            console.error("Failed to subscribe to commands:", err);
        } else {
            console.log("📡 Subscribed to vessel commands");
        }
    });

    // periodically publish retained presence heartbeats so server knows this edge is live
    presenceInterval = setInterval(() => {
        try {
            mqttClient.publish(`vessels/${vessel.identity.deviceId}/presence`, JSON.stringify({ status: 'online' }), { retain: true });
        } catch (e) {
            // ignore
        }
    }, 2000);

    setInterval(() => {
        vessel.simulate();
        const telemetry = vessel.generateTelemetry();
        mqttClient.publish(
            `vessels/${vessel.identity.deviceId}/telemetry`,
            JSON.stringify(telemetry)
        );
    }, 1000);
});

// attempt to mark presence offline on close/exit
function markOffline() {
    try {
        mqttClient.publish(`vessels/${vessel.identity.deviceId}/presence`, JSON.stringify({ status: 'offline' }), { retain: true });
        mqttClient.end(true);
    } catch (e) {
        // ignore
    }
}

process.on('SIGINT', () => { markOffline(); process.exit(0); });
process.on('SIGTERM', () => { markOffline(); process.exit(0); });
mqttClient.on('close', () => { markOffline(); });
process.on('exit', () => { markOffline(); });

// clear presence interval when exiting
process.on('SIGINT', () => { try { if (presenceInterval) clearInterval(presenceInterval); } catch {} });
process.on('SIGTERM', () => { try { if (presenceInterval) clearInterval(presenceInterval); } catch {} });

mqttClient.on("message", (topic, message) => {
    if (topic.includes("/commands")) {
        try {
            const command = JSON.parse(message.toString());
            console.log("📥 Received command:", command);
            vessel.handleCommand(command);
        } catch (err) {
            console.error("Failed to parse command:", err);
        }
    }
});

mqttClient.on("error", (err) => {
    console.error("MQTT Error:", err.message);
});
