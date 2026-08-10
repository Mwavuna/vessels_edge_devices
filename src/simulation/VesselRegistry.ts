import { Vessel } from "../domain/Vessel";

export class VesselRegistry {
    private static instance: VesselRegistry;
    private registry: Map<string, Vessel> = new Map();

    private constructor() {}

    static getInstance(): VesselRegistry {
        if (!VesselRegistry.instance) {
            VesselRegistry.instance = new VesselRegistry();
        }
        return VesselRegistry.instance;
    }

    register(vessel: Vessel): void {
        this.registry.set(vessel.identity.deviceId, vessel);
    }

    get(deviceId: string): Vessel | undefined {
        return this.registry.get(deviceId);
    }

    getAll(): Vessel[] {
        return Array.from(this.registry.values());
    }
}
