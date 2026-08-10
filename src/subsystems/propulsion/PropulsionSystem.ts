import { VesselSubsystem } from "../../domain/VesselSubsystem";
import { Engine } from "./Engine";
import { VesselCommand } from "../../Commands/VesselCommand";


export class PropulsionSystem 
implements VesselSubsystem {


    name = "propulsion";


    private engine:Engine;



    constructor(){

        this.engine = new Engine();

    }



    simulate():void {

        this.engine.simulate();

    }

    handleCommand(command: VesselCommand): void {
        if (command.action === "INJECT_FAULT" && command.payload?.type) {
            this.engine.setFault(command.payload.type as string, true);
        } else if (command.action === "CLEAR_FAULT" && command.payload?.type) {
            this.engine.setFault(command.payload.type as string, false);
        } else if (command.action === "CLEAR_FAULTS") {
            this.engine.clearAllFaults();
        }
    }




    collectTelemetry(){

        return {

            engine:
                this.engine.getStatus()

        };

    }

}