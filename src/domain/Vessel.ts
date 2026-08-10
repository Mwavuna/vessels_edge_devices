import { VesselSubsystem } from "./VesselSubsystem";
import { Telemetry } from "./Telemetry";
import { VesselIdentity } from "./VesselIdentity";
import { VesselCommand } from "../Commands/VesselCommand";

export class Vessel {
    private autoFaultTimer: NodeJS.Timeout | null = null;
    private readonly FIVE_MINUTES_MS = 5 * 60 * 1000; // 5 minutes

    constructor(
        public readonly identity: VesselIdentity,
        private readonly subsystems: VesselSubsystem[]
    ){
        this.resetAutoFaultTimer();
    }

    private resetAutoFaultTimer(): void {
        if (this.autoFaultTimer) {
            clearTimeout(this.autoFaultTimer);
        }
        this.autoFaultTimer = setTimeout(() => {
            console.log("⏱️ 5 minutes of normal operation completed. Triggering scheduled automatic fault injection.");
            this.handleCommand({
                vesselId: this.identity.deviceId,
                subsystem: "propulsion",
                action: "INJECT_FAULT",
                payload: { type: "HIGH_ENGINE_TEMPERATURE" }
            });
        }, this.FIVE_MINUTES_MS);
    }

    simulate(): void {
        this.subsystems.forEach(subsystem => subsystem.simulate());
    }

    handleCommand(command: VesselCommand): void {
        this.subsystems.forEach(subsystem => {
            if (subsystem.handleCommand) {
                subsystem.handleCommand(command);
            }
        });

        // Reset the 5-minute timer whenever faults are cleared or injected
        this.resetAutoFaultTimer();
    }

    generateTelemetry(): Telemetry {
        const subsystemData: { [key: string]: Record<string, unknown> } = {};

        this.subsystems.forEach(subsystem => {
            subsystemData[subsystem.name] = subsystem.collectTelemetry();
        });

        return {
            deviceId: this.identity.deviceId,
            timestamp: new Date().toISOString(),
            subsystems: subsystemData
        };
    }
}