import { VesselSubsystem } from "../../domain/VesselSubsystem";
import { VesselCommand } from "../../Commands/VesselCommand";


export class CoolingSystem implements VesselSubsystem {


    name = "cooling";


    private coolantTemperature = 70;

    private coolantLevel = 100;

    private pumpSpeed = 1400;

    private activeFaults: Set<string> = new Set();

    simulate(): void {

        if (this.activeFaults.has("COOLING_FAILURE")) {
            // Continuously output erroneous cooling failure telemetry while flag is set
            this.coolantTemperature = 96.5 + (Math.random() - 0.5) * 2;
            this.pumpSpeed = 0;
            this.coolantLevel = 5.0;
        } else {
            this.coolantTemperature += (Math.random() - 0.5) * 2;
            this.coolantTemperature = Math.max(60, Math.min(80, this.coolantTemperature));

            this.coolantLevel -= Math.random() * 0.005;
            this.coolantLevel = Math.max(80, this.coolantLevel);

            this.pumpSpeed += (Math.random() - 0.5) * 20;
            this.pumpSpeed = Math.max(1300, Math.min(1500, this.pumpSpeed));
        }

    }

    handleCommand(command: VesselCommand): void {
        if (command.action === "INJECT_FAULT" && command.payload?.type) {
            this.activeFaults.add(command.payload.type as string);
        } else if (command.action === "CLEAR_FAULT") {
            const targetType = command.payload?.type as string | undefined;
            if (!targetType) {
                this.activeFaults.clear();
                this.coolantTemperature = 70;
                this.coolantLevel = 100;
                this.pumpSpeed = 1400;
            } else {
                for (const f of Array.from(this.activeFaults)) {
                    if (f === targetType || f.includes(targetType) || targetType.includes(f)) {
                        this.activeFaults.delete(f);
                    }
                }
                if (this.activeFaults.size === 0) {
                    this.coolantTemperature = 70;
                    this.coolantLevel = 100;
                    this.pumpSpeed = 1400;
                }
            }
        } else if (command.action === "CLEAR_FAULTS") {
            this.activeFaults.clear();
            this.coolantTemperature = 70;
            this.coolantLevel = 100;
            this.pumpSpeed = 1400;
        }
    }






    collectTelemetry() {



        return {


            temperature:
                Number(
                    this.coolantTemperature.toFixed(1)
                ),


            coolantLevel:
                Number(
                    this.coolantLevel.toFixed(1)
                ),


            pumpSpeed:
                Math.round(
                    this.pumpSpeed
                )


        };

    }


}