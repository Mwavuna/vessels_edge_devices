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

mqttClient.on("connect", () => {
    console.log("✅ Connected to MQTT Broker");

    mqttClient.subscribe("vessels/+/commands", (err) => {
        if (err) {
            console.error("Failed to subscribe to commands:", err);
        } else {
            console.log("📡 Subscribed to vessel commands");
        }
    });

    setInterval(() => {
        vessel.simulate();
        const telemetry = vessel.generateTelemetry();
        mqttClient.publish(
            `vessels/${vessel.identity.deviceId}/telemetry`,
            JSON.stringify(telemetry)
        );
    }, 1000);
});

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