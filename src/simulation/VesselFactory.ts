import { Vessel } from "../domain/Vessel";
import { VesselIdentity } from "../domain/VesselIdentity";
import { PropulsionSystem } from "../subsystems/propulsion/PropulsionSystem";
import { FuelSystem } from "../subsystems/fuel/FuelSystem";
import { CoolingSystem } from "../subsystems/cooling/CoolingSystem";
import { ElectricalSystem } from "../subsystems/electrical/ElectricalSubsystem";
import { LubricationSystem } from "../subsystems/lubrication/LubricationSystem";

export class VesselFactory {
    static createStandardVessel(identity: VesselIdentity): Vessel {
        return new Vessel(identity, [
            new PropulsionSystem(),
            new FuelSystem(),
            new CoolingSystem(),
            new ElectricalSystem(),
            new LubricationSystem()
        ]);
    }
}
