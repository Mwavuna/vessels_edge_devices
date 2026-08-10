import { VesselCommand } from "../Commands/VesselCommand";
export interface VesselSubsystem {

    /**
     * Unique subsystem name
     * Example: propulsion, fuel, navigation
     */
    name: string;


    /**
     * Update internal state
     * Called during simulation cycles
     */
    simulate(): void;


    /**
     * Produce current subsystem data
     */
    collectTelemetry(): Record<string, unknown>;

    handleCommand?(command: VesselCommand): void;
}