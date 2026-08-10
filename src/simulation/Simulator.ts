import { Vessel } from "../domain/Vessel";

export class Simulator {
    private vessels: Map<string, Vessel> = new Map();

    registerVessel(vessel: Vessel): void {
        this.vessels.set(vessel.identity.deviceId, vessel);
    }

    getVessel(deviceId: string): Vessel | undefined {
        return this.vessels.get(deviceId);
    }

    step(): void {
        this.vessels.forEach(vessel => vessel.simulate());
    }
}
