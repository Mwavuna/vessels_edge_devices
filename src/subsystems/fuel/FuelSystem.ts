import { VesselSubsystem } from "../../domain/VesselSubsystem";
import { FuelTank } from "./FuelTank";
import { VesselCommand } from "../../Commands/VesselCommand";

export class FuelSystem implements VesselSubsystem {

    name = "fuel";

    private tank = new FuelTank();

    simulate(): void {

        this.tank.simulate();

    }

    handleCommand(command: VesselCommand): void {
        if (command.action === "INJECT_FAULT" && command.payload?.type) {
            this.tank.setFault(command.payload.type as string, true);
        } else if (command.action === "CLEAR_FAULT" && command.payload?.type) {
            this.tank.setFault(command.payload.type as string, false);
        } else if (command.action === "CLEAR_FAULTS") {
            this.tank.clearAllFaults();
        }
    }


    collectTelemetry() {


        return {

            tank: this.tank.getTelemetry()

        };

    }

}